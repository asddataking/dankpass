import { createHash } from 'crypto'
import { hash } from 'imghash'
import { db } from './neon-db'
import { receipts } from './schema'
import { eq, and } from 'drizzle-orm'

export async function generatePerceptualHash(imageBuffer: Buffer): Promise<string> {
  try {
    // Use imghash for perceptual hashing
    const perceptualHash = await hash(imageBuffer)
    return perceptualHash
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
