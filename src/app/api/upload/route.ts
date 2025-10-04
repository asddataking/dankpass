import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { generatePerceptualHash, checkDuplicateHash, checkDailyUploadLimit } from '@/lib/pHash'
import { extractTextFromImage } from '@/lib/ocr'
import { classifyReceipt } from '@/lib/classify'
import { awardPoints, checkComboEligibility, awardComboBonus } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Check daily upload limit
    const limitCheck = await checkDailyUploadLimit(user.id)
    if (!limitCheck.canUpload) {
      return NextResponse.json({ 
        error: `Daily upload limit reached (${limitCheck.count}/${limitCheck.limit})` 
      }, { status: 429 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate perceptual hash for duplicate detection
    const imageHash = await generatePerceptualHash(buffer)
    
    // Check for duplicates
    const isDuplicate = await checkDuplicateHash(user.id, imageHash)
    if (isDuplicate) {
      return NextResponse.json({ error: 'Duplicate receipt detected' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('receipts')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Create receipt record
    const { data: receipt, error: receiptError } = await supabaseAdmin
      .from('receipts')
      .insert({
        user_id: user.id,
        storage_path: uploadData.path,
        image_hash: imageHash,
        status: 'pending'
      })
      .select()
      .single()

    if (receiptError) {
      console.error('Receipt creation error:', receiptError)
      return NextResponse.json({ error: 'Failed to create receipt record' }, { status: 500 })
    }

    // Process receipt with AI agent (async)
    processReceiptAsync(receipt.id, buffer)

    return NextResponse.json({
      receiptId: receipt.id,
      status: 'pending',
      message: 'Receipt uploaded successfully. Processing...'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processReceiptAsync(receiptId: string, imageBuffer: Buffer) {
  try {
    // Extract text from image
    const ocrResult = await extractTextFromImage(imageBuffer)
    
    // Classify receipt
    const classification = await classifyReceipt(ocrResult.vendor)
    
    // Get user ID from receipt
    const { data: receipt } = await supabaseAdmin
      .from('receipts')
      .select('user_id')
      .eq('id', receiptId)
      .single()

    if (!receipt) {
      throw new Error('Receipt not found')
    }

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
      .eq('id', receiptId)

    // Award points
    const basePoints = classification.kind === 'dispensary' ? 10 : 8
    await awardPoints({
      userId: receipt.user_id,
      delta: basePoints,
      reason: 'receipt',
      refId: receiptId
    })

    // Check for combo bonus
    if (classification.kind !== 'unknown') {
      const isComboEligible = await checkComboEligibility(receipt.user_id, classification.kind)
      if (isComboEligible) {
        await awardComboBonus(receipt.user_id, receiptId)
      }
    }

    // Log agent event
    await supabaseAdmin
      .from('agent_events')
      .insert({
        receipt_id: receiptId,
        event_type: 'processed',
        details: {
          vendor: ocrResult.vendor,
          total: ocrResult.total,
          kind: classification.kind,
          points_awarded: basePoints,
          combo_eligible: classification.kind !== 'unknown' ? await checkComboEligibility(receipt.user_id, classification.kind) : false
        }
      })

  } catch (error) {
    console.error('Receipt processing error:', error)
    
    // Mark receipt as denied
    await supabaseAdmin
      .from('receipts')
      .update({
        status: 'denied',
        deny_reason: 'Processing failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      })
      .eq('id', receiptId)

    // Log agent event
    await supabaseAdmin
      .from('agent_events')
      .insert({
        receipt_id: receiptId,
        event_type: 'error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
  }
}
