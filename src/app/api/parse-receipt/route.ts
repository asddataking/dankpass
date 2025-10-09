// app/api/parse-receipt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ReceiptJsonSchema, ReceiptZ } from "@/lib/receipt.schema";
import { computePoints } from "@/lib/points";
import { hashBuffer } from "@/lib/dedup";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const runtime = "nodejs"; // ensure Buffer available

type Parsed = {
  merchant?: string | null;
  purchase_date?: string | null;
  subtotal?: number | null;
  tax?: number | null;
  total: number | null;
  items: Array<{
    name: string;
    category?: string | null;
    quantity?: number | null;
    unit_price?: number | null;
    line_total?: number | null;
  }>;
};

export async function POST(req: NextRequest) {
  try {
    const { blobUrl, userId } = await req.json();
    if (!blobUrl || !userId) {
      return NextResponse.json({ error: "blobUrl and userId required" }, { status: 400 });
    }

    // 1) Fetch image server-side
    const imgRes = await fetch(blobUrl, { 
      headers: process.env.BLOB_READ_TOKEN 
        ? { Authorization: `Bearer ${process.env.BLOB_READ_TOKEN}` } 
        : undefined 
    });
    if (!imgRes.ok) {
      return NextResponse.json({ error: `Failed to fetch blob: ${imgRes.status}` }, { status: 400 });
    }
    const imgBuf = Buffer.from(await imgRes.arrayBuffer());

    // 2) Dedup by image hash per user
    const imageHash = hashBuffer(imgBuf);
    const dupCheck = await sql/* sql */`
      SELECT id FROM receipts WHERE user_id = ${userId} AND image_hash = ${imageHash} LIMIT 1;
    `;
    if (dupCheck.length) {
      return NextResponse.json({ duplicate: true, receiptId: dupCheck[0].id, pointsAwarded: 0 });
    }

    // 3) OpenAI Responses API: vision + structured outputs
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Extract receipt fields exactly to the provided schema. If uncertain, leave fields null. Do not infer."
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Parse this receipt into structured fields. Extract merchant name, purchase date, subtotal, tax, total, and all line items with their details." 
              },
              { 
                type: "image_url", 
                image_url: { url: blobUrl } 
              }
            ]
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { 
            name: "receipt", 
            schema: ReceiptJsonSchema,
            strict: true 
          }
        }
      })
    });

    if (!openaiRes.ok) {
      const errTxt = await openaiRes.text();
      return NextResponse.json({ error: `OpenAI error: ${errTxt}` }, { status: 502 });
    }

    const payload = await openaiRes.json();

    // Parse the response - try multiple possible locations
    let parsed: Parsed;
    try {
      // Standard chat completions format
      const content = payload.choices?.[0]?.message?.content;
      if (typeof content === 'string') {
        parsed = JSON.parse(content);
      } else {
        // Fallback patterns
        parsed = 
          payload.output_parsed ??
          payload.output?.[0]?.content?.[0]?.parsed ??
          payload.output?.[0]?.content?.[0]?.text ??
          JSON.parse(payload.choices?.[0]?.message?.content ?? '{}');
      }
    } catch (e) {
      return NextResponse.json({ error: "Failed to parse OpenAI response" }, { status: 502 });
    }

    // Validate with zod
    const z = ReceiptZ.safeParse(parsed);
    if (!z.success) {
      return NextResponse.json({ error: "Schema validation failed", issues: z.error.format() }, { status: 422 });
    }

    const data = z.data;

    // 4) sanity math
    const items = data.items || [];
    const itemsSum = Number(
      items.reduce((s, i) => s + (Number(i.line_total ?? 0) || 0), 0).toFixed(2)
    );
    const subtotal = data.subtotal ?? (items.length ? itemsSum : null);
    const tax = data.tax ?? 0;
    const total = data.total ?? (subtotal != null ? Number((subtotal + tax).toFixed(2)) : null);
    if (total == null) {
      return NextResponse.json({ error: "Could not determine total" }, { status: 422 });
    }

    const offBy = subtotal != null ? Math.abs((subtotal + tax) - total) : 0;
    const confidence = offBy <= 0.05 ? 0.95 : 0.75;

    // 5) points
    const points = computePoints(total);

    // 6) write to Neon
    const recRows = await sql/* sql */`
      INSERT INTO receipts (user_id, image_url, image_hash, ocr_text, merchant, purchase_date, subtotal, tax_amount, total, points_awarded, parsed_confidence, status)
      VALUES (${userId}, ${blobUrl}, ${imageHash}, ${null}, ${data.merchant ?? null},
              ${data.purchase_date ?? null}, ${subtotal}, ${tax}, ${total}, ${points}, ${confidence}, 'pending')
      RETURNING id;
    `;
    const receiptId = recRows[0].id;

    if (items.length) {
      // Insert items one by one (Neon serverless doesn't support bulk inserts easily)
      for (const item of items) {
        await sql/* sql */`
          INSERT INTO receipt_items (receipt_id, line_text, product_name, category, unit_price, quantity, line_total)
          VALUES (${receiptId}, ${item.name}, ${item.name}, ${item.category ?? null}, ${item.unit_price ?? null}, ${item.quantity ?? 1}, ${item.line_total ?? null});
        `;
      }
    }

    // Use existing points_ledger table instead of points_log
    await sql/* sql */`
      INSERT INTO points_ledger (user_id, receipt_id, points, type, description)
      VALUES (${userId}, ${receiptId}, ${points}, 'earned', 'receipt_total');
    `;

    return NextResponse.json({
      receiptId,
      pointsAwarded: points,
      parsed: {
        merchant: data.merchant ?? null,
        purchase_date: data.purchase_date ?? null,
        subtotal,
        tax,
        total,
        itemsSum,
        offBy
      }
    });
  } catch (e: any) {
    console.error('Receipt parsing error:', e);
    return NextResponse.json({ error: e?.message || "unknown error" }, { status: 500 });
  }
}

