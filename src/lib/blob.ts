import { put, del, head } from '@vercel/blob'

export interface BlobUploadResult {
  url: string
  downloadUrl: string
  pathname: string
  contentType: string
  contentDisposition: string
  size: number
}

export interface BlobUploadOptions {
  access?: 'public' | 'private'
  addRandomSuffix?: boolean
  cacheControlMaxAge?: number
}

// Upload a file to Vercel Blob
export async function uploadBlob(
  filename: string, 
  file: File | Buffer, 
  options: BlobUploadOptions = {}
): Promise<BlobUploadResult | null> {
  try {
    const blob = await put(filename, file, {
      access: options.access || 'private',
      addRandomSuffix: options.addRandomSuffix !== false,
      cacheControlMaxAge: options.cacheControlMaxAge || 3600
    })

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      contentDisposition: blob.contentDisposition,
      size: blob.size
    }
  } catch (error) {
    console.error('Error uploading blob:', error)
    return null
  }
}

// Delete a blob from Vercel Blob
export async function deleteBlob(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error('Error deleting blob:', error)
    return false
  }
}

// Get blob metadata
export async function getBlobMetadata(url: string): Promise<BlobUploadResult | null> {
  try {
    const blob = await head(url)
    
    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      contentDisposition: blob.contentDisposition,
      size: blob.size
    }
  } catch (error) {
    console.error('Error getting blob metadata:', error)
    return null
  }
}

// Generate a signed upload URL for client-side uploads
export async function generateUploadUrl(filename: string): Promise<string | null> {
  try {
    // For client-side uploads, we'll use the put method with a temporary file
    // This is a simplified approach - in production you might want to use
    // Vercel's signed URL generation if available
    const tempBlob = await put(`temp/${filename}`, new Uint8Array(0), {
      access: 'private',
      addRandomSuffix: true
    })
    
    return tempBlob.url
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return null
  }
}

// Validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 10MB)' }
  }

  // Check file type (images only)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be an image (JPEG, PNG, WebP)' }
  }

  return { valid: true }
}

// Generate filename for receipt uploads
export function generateReceiptFilename(userId: string, originalFilename: string): string {
  const timestamp = Date.now()
  const extension = originalFilename.split('.').pop() || 'jpg'
  return `receipts/${userId}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
}
