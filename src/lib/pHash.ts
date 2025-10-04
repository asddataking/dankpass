import { createHash } from 'crypto'

export async function generatePerceptualHash(imageBuffer: Buffer): Promise<string> {
  try {
    // Simple perceptual hash using MD5 of image data
    // This is a fallback implementation - for production, consider using a proper perceptual hash library
    return createHash('md5').update(imageBuffer).digest('hex')
  } catch (error) {
    console.error('Error generating perceptual hash:', error)
    // Fallback to simple hash
    return createHash('md5').update(imageBuffer).digest('hex')
  }
}

export async function checkDuplicateHash(userId: string, imageHash: string): Promise<boolean> {
  const { supabaseAdmin } = await import('./supabase')
  
  const { data, error } = await supabaseAdmin
    .from('receipts')
    .select('id')
    .eq('user_id', userId)
    .eq('image_hash', imageHash)
    .limit(1)

  if (error) {
    console.error('Error checking duplicate hash:', error)
    return false
  }

  return data.length > 0
}

export async function checkDailyUploadLimit(userId: string): Promise<{ canUpload: boolean; count: number; limit: number }> {
  const { supabaseAdmin } = await import('./supabase')
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data, error } = await supabaseAdmin
    .from('receipts')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())

  if (error) {
    console.error('Error checking daily upload limit:', error)
    return { canUpload: false, count: 0, limit: 3 }
  }

  const count = data.length
  const limit = 3
  
  return {
    canUpload: count < limit,
    count,
    limit
  }
}
