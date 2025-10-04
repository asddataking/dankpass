import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { extractTextFromImage } from '@/lib/ocr'
import { classifyReceipt } from '@/lib/classify'
import { awardPoints, checkComboEligibility, awardComboBonus } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron job or admin request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pending receipts (limit to 10 per run)
    const { data: pendingReceipts, error } = await supabaseAdmin
      .from('receipts')
      .select('id, user_id, storage_path')
      .eq('status', 'pending')
      .limit(10)

    if (error) {
      console.error('Error fetching pending receipts:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!pendingReceipts || pendingReceipts.length === 0) {
      return NextResponse.json({ message: 'No pending receipts to process' })
    }

    const results = []

    for (const receipt of pendingReceipts) {
      try {
        // Download image from storage
        const { data: imageData, error: downloadError } = await supabaseAdmin.storage
          .from('receipts')
          .download(receipt.storage_path)

        if (downloadError) {
          console.error('Download error:', downloadError)
          await markReceiptAsDenied(receipt.id, 'Failed to download image')
          results.push({ receiptId: receipt.id, status: 'error', error: 'Download failed' })
          continue
        }

        // Convert to buffer
        const arrayBuffer = await imageData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Extract text from image
        const ocrResult = await extractTextFromImage(buffer)
        
        // Classify receipt
        const classification = await classifyReceipt(ocrResult.vendor)

        // Update receipt with extracted data
        await supabaseAdmin
          .from('receipts')
          .update({
            vendor: ocrResult.vendor,
            total_amount_cents: Math.round(ocrResult.total * 100),
            receipt_date: ocrResult.date,
            kind: classification.kind,
            matched_partner_id: classification.matchedPartnerId,
            status: 'approved',
            approved_at: new Date().toISOString()
          })
          .eq('id', receipt.id)

        // Award points
        const basePoints = classification.kind === 'dispensary' ? 10 : 8
        await awardPoints({
          userId: receipt.user_id,
          delta: basePoints,
          reason: 'receipt',
          refId: receipt.id
        })

        // Check for combo bonus
        let comboAwarded = false
        if (classification.kind !== 'unknown') {
          const isComboEligible = await checkComboEligibility(receipt.user_id, classification.kind)
          if (isComboEligible) {
            await awardComboBonus(receipt.user_id, receipt.id)
            comboAwarded = true
          }
        }

        // Log agent event
        await supabaseAdmin
          .from('agent_events')
          .insert({
            receipt_id: receipt.id,
            event_type: 'processed',
            details: {
              vendor: ocrResult.vendor,
              total: ocrResult.total,
              kind: classification.kind,
              points_awarded: basePoints,
              combo_awarded: comboAwarded,
              confidence: classification.confidence
            }
          })

        results.push({
          receiptId: receipt.id,
          status: 'success',
          vendor: ocrResult.vendor,
          kind: classification.kind,
          pointsAwarded: basePoints,
          comboAwarded
        })

      } catch (error) {
        console.error(`Error processing receipt ${receipt.id}:`, error)
        
        await markReceiptAsDenied(receipt.id, 'Processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
        
        results.push({
          receiptId: receipt.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: `Processed ${pendingReceipts.length} receipts`,
      results
    })

  } catch (error) {
    console.error('Agent tick error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function markReceiptAsDenied(receiptId: string, reason: string) {
  await supabaseAdmin
    .from('receipts')
    .update({
      status: 'denied',
      deny_reason: reason
    })
    .eq('id', receiptId)

  // Log agent event
  await supabaseAdmin
    .from('agent_events')
    .insert({
      receipt_id: receiptId,
      event_type: 'error',
      details: {
        error: reason
      }
    })
}
