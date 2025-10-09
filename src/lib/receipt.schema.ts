// lib/receipt.schema.ts
import { z } from "zod";

export const ReceiptItemZ = z.object({
  name: z.string().min(1),
  category: z.string().optional().nullable(),
  quantity: z.number().optional().nullable(),
  unit_price: z.number().optional().nullable(),
  line_total: z.number().optional().nullable()
});

export const ReceiptZ = z.object({
  merchant: z.string().optional().nullable(),
  purchase_date: z.string().optional().nullable(), // ISO date preferred
  subtotal: z.number().optional().nullable(),
  tax: z.number().optional().nullable(),
  total: z.number().nullable(),   // required by our logic (we'll default if missing)
  items: z.array(ReceiptItemZ).default([])
});

export type ReceiptParsed = z.infer<typeof ReceiptZ>;
export type ReceiptItemParsed = z.infer<typeof ReceiptItemZ>;

// JSON Schema for OpenAI Structured Outputs
export const ReceiptJsonSchema = {
  type: "object",
  properties: {
    merchant: { type: "string" },
    purchase_date: { type: "string" },
    subtotal: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string" },
          quantity: { type: "number" },
          unit_price: { type: "number" },
          line_total: { type: "number" }
        },
        required: ["name"]
      }
    }
  },
  required: ["total", "items"],
  additionalProperties: false
} as const;

