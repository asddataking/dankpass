import { NextRequest, NextResponse } from 'next/server'
import { getPendingReceipts, updateReceipt, addPoints, createAgentEvent } from '@/lib/neon-db'
import { extractTextFromImage } from '@/lib/ocr'
import { classifyReceipt } from '@/lib/classify'
import { getPointValues } from '@/lib/edge-config'

// DANKPASS: Get point values from Edge Config
async function getPointValue(kind: 'dispensary' | 'restaurant'): Promise<number> {
  try {
    const pointValues = await getPointValues()
    return kind === 'dispensary' ? pointValues.dispensary : pointValues.restaurant
  } catch (error) {
    console.error('Error getting point values from Edge Config:', error)
    // Fallback values
    return kind === 'dispensary' ? 10 : 5
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron job or admin request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pending receipts (limit to 10 per run)
    const pendingReceipts = await getPendingReceipts(10)

    if (pendingReceipts.length === 0) {
      return NextResponse.json({ message: 'No pending receipts to process' })
    }

    const results = []

    for (const receipt of pendingReceipts) {
      try {
        // Download image from blob URL
        const response = await fetch(receipt.blobUrl)
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.statusText}`)
        }
        
        const imageBuffer = Buffer.from(await response.arrayBuffer())

        // Extract text from image
        const ocrResult = await extractTextFromImage(imageBuffer)
        
        // Classify receipt
        const classification = await classifyReceipt(ocrResult.vendor)

        // Update receipt with extracted data
        await updateReceipt(receipt.id, {
          vendor: ocrResult.vendor,
          totalAmountCents: Math.round(ocrResult.total * 100),
          receiptDate: ocrResult.date,
          kind: classification.kind,
          matchedPartnerId: classification.matchedPartnerId,
          status: 'approved',
          approvedAt: new Date()
        })

        // Award points
        const basePoints = classification.kind === 'dispensary'
          ? await getPointValue('dispensary')
          : await getPointValue('restaurant')
        
        await addPoints(receipt.userId, basePoints, 'receipt', receipt.id)

        // Log agent event
        await createAgentEvent(receipt.id, 'processed', {
          vendor: ocrResult.vendor,
          total: ocrResult.total,
          kind: classification.kind,
          points_awarded: basePoints,
          confidence: classification.confidence
        })

        results.push({
          receiptId: receipt.id,
          status: 'success',
          vendor: ocrResult.vendor,
          kind: classification.kind,
          pointsAwarded: basePoints
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
  await updateReceipt(receiptId, {
    status: 'denied',
    denyReason: reason
  })

  // Log agent event
  await createAgentEvent(receiptId, 'error', {
    error: reason
  })
}
