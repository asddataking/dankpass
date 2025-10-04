import { createHash } from 'crypto'
// import { hash } from 'imghash' // DANKPASS: Temporarily disabled for build
import { db } from './neon-db'
import { receipts } from './schema'
import { eq, and } from 'drizzle-orm'

export async function generatePerceptualHash(imageBuffer: Buffer): Promise<string> {
  try {
    // DANKPASS: Temporarily use simple hash instead of perceptual hash for build compatibility
    // const perceptualHash = await hash(imageBuffer)
    // return perceptualHash
    return createHash('md5').update(imageBuffer).digest('hex')
  } catch (error) {
    console.error('Error generating perceptual hash:', error)
    // Fallback to simple hash
    return createHash('md5').update(imageBuffer).digest('hex')
  }
}

export async function checkDuplicateHash(userId: string, imageHash: string): Promise<boolean> {
  try {
    const result = await db.select({ id: receipts.id })
      .from(receipts)
      .where(and(
        eq(receipts.userId, userId),
        eq(receipts.imageHash, imageHash)
      ))
      .limit(1)
    
    return result.length > 0
  } catch (error) {
    console.error('Error checking duplicate hash:', error)
    return false
  }
}
