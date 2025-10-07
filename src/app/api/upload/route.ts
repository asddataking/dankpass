import { NextRequest, NextResponse } from 'next/server';
import { uploadReceiptFromBuffer } from '@/lib/blob';
import { createReceipt } from '@/lib/receipt';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const total = formData.get('total') as string;
    const subtotal = formData.get('subtotal') as string;
    const partnerId = formData.get('partnerId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Vercel Blob
    const url = await uploadReceiptFromBuffer(
      buffer,
      file.name,
      file.type
    );

    // Create receipt record in database
    const receipt = await createReceipt({
      userId,
      imageUrl: url,
      total: total ? parseFloat(total) : undefined,
      subtotal: subtotal ? parseFloat(subtotal) : undefined,
      partnerId: partnerId || undefined
    });

    return NextResponse.json({ 
      url,
      receiptId: receipt.id,
      status: receipt.status,
      message: 'Receipt uploaded successfully and is pending review'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
