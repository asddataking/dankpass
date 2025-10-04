import { NextRequest, NextResponse } from 'next/server'
import { createReceipt, checkDuplicateReceipt } from '@/lib/neon-db'
import { checkRateLimit } from '@/lib/upstash-redis'
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

    // Validate file (basic validation)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
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

    // For now, we'll create a placeholder URL since we don't have blob storage configured
    // In a production setup, you would upload to your preferred storage service
    const blobUrl = `placeholder://receipts/${userId}/${Date.now()}-${file.name}`

    // Create receipt record
    const receipt = await createReceipt(userId, blobUrl, imageHash)
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
