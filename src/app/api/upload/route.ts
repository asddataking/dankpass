import { NextRequest, NextResponse } from 'next/server'
import { uploadBlob, validateFile, generateReceiptFilename } from '@/lib/blob'
import { createReceipt, updateReceipt, createAgentEvent, checkDuplicateReceipt } from '@/lib/neon-db'
import { checkRateLimit } from '@/lib/upstash-redis'
import { extractTextFromImage } from '@/lib/ocr'
import { classifyReceipt } from '@/lib/classify'
import { generatePerceptualHash } from '@/lib/pHash'
import { getCurrentUser } from '@/lib/neon-auth'
import { enqueueJob } from '@/lib/jobs'

export async function POST(request: NextRequest) {
  try {
    const stackUser = await getCurrentUser()
    if (!stackUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = stackUser.id
    
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

    // Check rate limit
    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: `Daily upload limit reached (${rateLimit.count}/${rateLimit.limit})` 
      }, { status: 429 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate perceptual hash for duplicate detection
    const imageHash = await generatePerceptualHash(buffer)
    
    // Check for duplicates
    const isDuplicate = await checkDuplicateReceipt(imageHash)
    if (isDuplicate) {
      return NextResponse.json({ error: 'Duplicate receipt detected' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const filename = generateReceiptFilename(userId, file.name)
    const blobResult = await uploadBlob(filename, buffer, { access: 'private' })
    
    if (!blobResult) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Create receipt record
    const receipt = await createReceipt(userId, blobResult.url, imageHash)
    if (!receipt) {
      return NextResponse.json({ error: 'Failed to create receipt record' }, { status: 500 })
    }

    // Process receipt with AI agent (async via background job)
    await enqueueJob('receipt.process', { receiptId: receipt.id }, { retries: 3 })

    return NextResponse.json({
      receiptId: receipt.id,
      status: 'pending',
      message: 'Receipt uploaded successfully. Processing in background...'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
