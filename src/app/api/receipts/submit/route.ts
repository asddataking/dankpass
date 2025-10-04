import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/neon-auth'
import { checkRateLimit, incrementMetric } from '@/lib/upstash-redis'
import { createReceipt, getUserReceipts, addPoints, updateReceipt, createAgentEvent } from '@/lib/neon-db'
import { uploadBlob, validateFile, generateReceiptFilename } from '@/lib/blob'
import { extractTextFromImage } from '@/lib/ocr'
import { classifyReceipt } from '@/lib/classify'

export async function POST(request: NextRequest) {
  try {
    // Require authentication using adapter
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check rate limit using adapter
    const rateLimit = await checkRateLimit(user.id)
    if (!rateLimit.allowed) {
      return NextResponse.json({
        error: `Rate limit exceeded. You have uploaded ${rateLimit.count}/${rateLimit.limit} receipts today.`
      }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Generate filename and upload to blob storage
    const filename = generateReceiptFilename(user.id, file.name)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const blob = await uploadBlob(filename, buffer)
    
    if (!blob) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
    
    // Create receipt record using adapter
    const receipt = await createReceipt(user.id, blob.url)
    if (!receipt) {
      return NextResponse.json({ error: 'Failed to create receipt record' }, { status: 500 })
    }

    // Process receipt asynchronously
    processReceiptAsync(receipt.id, blob.url, buffer)

    // Increment metrics
    await incrementMetric('receipts_uploaded', 1)

    return NextResponse.json({
      success: true,
      receiptId: receipt.id,
      status: 'pending',
      message: 'Receipt uploaded successfully and is being processed'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processReceiptAsync(receiptId: string, blobUrl: string, imageBuffer: Buffer) {
  try {
    // Extract text from image
    const extractedText = await extractTextFromImage(imageBuffer)
    
    // Classify receipt
    const classification = await classifyReceipt(extractedText)
    
    // Update receipt with classification results
    await updateReceipt(receiptId, {
      kind: classification.kind,
      vendor: classification.vendor,
      totalAmountCents: classification.totalAmountCents,
      receiptDate: classification.receiptDate,
      status: 'approved' // Auto-approve for now
    })

    // Award points based on classification
    let points = 0
    if (classification.kind === 'dispensary') {
      points = 10
    } else if (classification.kind === 'restaurant') {
      points = 8
    }

    if (points > 0) {
      await addPoints(receiptId, points, 'receipt', receiptId)
    }

    // Log agent event
    await createAgentEvent(receiptId, 'processed', {
      classification,
      pointsAwarded: points,
      processingTime: Date.now()
    })

    console.log(`Receipt ${receiptId} processed successfully`)

  } catch (error) {
    console.error(`Error processing receipt ${receiptId}:`, error)
    
    // Update receipt status to denied
    await updateReceipt(receiptId, {
      status: 'denied',
      denyReason: 'Processing failed'
    })

    // Log error event
    await createAgentEvent(receiptId, 'error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now()
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication using adapter
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Get user receipts using adapter
    const receipts = await getUserReceipts(user.id, limit)

    return NextResponse.json({
      receipts: receipts.map(receipt => ({
        id: receipt.id,
        blobUrl: receipt.blobUrl,
        kind: receipt.kind,
        vendor: receipt.vendor,
        status: receipt.status,
        totalAmountCents: receipt.totalAmountCents,
        receiptDate: receipt.receiptDate,
        createdAt: receipt.createdAt,
        approvedAt: receipt.approvedAt
      }))
    })

  } catch (error) {
    console.error('Get receipts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
