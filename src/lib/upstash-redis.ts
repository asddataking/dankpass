import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiting
export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; count: number; limit: number }> {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const key = `rate:${userId}:${today}`
  const limit = 3 // Max 3 uploads per day

  try {
    const count = await redis.incr(key)
    
    // Set expiration at end of day (24 hours)
    if (count === 1) {
      await redis.expire(key, 86400) // 24 hours in seconds
    }

    return {
      allowed: count <= limit,
      count,
      limit
    }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return { allowed: false, count: 0, limit }
  }
}

// Points caching
export async function getUserPointsFromCache(userId: string): Promise<number | null> {
  try {
    const points = await redis.get(`pts:${userId}`)
    return points ? parseInt(points as string) : null
  } catch (error) {
    console.error('Error getting points from cache:', error)
    return null
  }
}

export async function setUserPointsCache(userId: string, points: number): Promise<boolean> {
  try {
    await redis.set(`pts:${userId}`, points.toString())
    return true
  } catch (error) {
    console.error('Error setting points cache:', error)
    return false
  }
}

export async function incrementUserPoints(userId: string, delta: number): Promise<number> {
  try {
    const newTotal = await redis.incrby(`pts:${userId}`, delta)
    return newTotal
  } catch (error) {
    console.error('Error incrementing user points:', error)
    return 0
  }
}

export async function decrementUserPoints(userId: string, delta: number): Promise<number> {
  try {
    const newTotal = await redis.decrby(`pts:${userId}`, delta)
    return newTotal
  } catch (error) {
    console.error('Error decrementing user points:', error)
    return 0
  }
}

// Leaderboard
export async function updateLeaderboard(userId: string, points: number): Promise<boolean> {
  try {
    await redis.zadd('lb:points', { score: points, member: userId })
    return true
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return false
  }
}

export async function getLeaderboard(limit: number = 10): Promise<Array<{ userId: string; points: number }>> {
  try {
    const results = await redis.zrevrange('lb:points', 0, limit - 1, { withScores: true })
    
    return results.map((result) => ({
      userId: result.member as string,
      points: result.score as number
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

export async function getUserLeaderboardPosition(userId: string): Promise<number | null> {
  try {
    const rank = await redis.zrevrank('lb:points', userId)
    return rank !== null ? rank + 1 : null // Convert 0-based to 1-based
  } catch (error) {
    console.error('Error getting user leaderboard position:', error)
    return null
  }
}

export async function getLeaderboardAroundUser(userId: string, range: number = 5): Promise<Array<{ userId: string; points: number; rank: number }>> {
  try {
    const userRank = await redis.zrevrank('lb:points', userId)
    if (userRank === null) return []

    const start = Math.max(0, userRank - range)
    const end = userRank + range
    
    const results = await redis.zrevrange('lb:points', start, end, { withScores: true })
    
    return results.map((result, index) => ({
      userId: result.member as string,
      points: result.score as number,
      rank: start + index + 1
    }))
  } catch (error) {
    console.error('Error getting leaderboard around user:', error)
    return []
  }
}

// Cache invalidation
export async function invalidateUserCache(userId: string): Promise<boolean> {
  try {
    await Promise.all([
      redis.del(`pts:${userId}`),
      redis.zrem('lb:points', userId)
    ])
    return true
  } catch (error) {
    console.error('Error invalidating user cache:', error)
    return false
  }
}

// Feature flags and configuration
export async function getFeatureFlag(flag: string): Promise<boolean> {
  try {
    const value = await redis.get(`flag:${flag}`)
    return value === 'true'
  } catch (error) {
    console.error('Error getting feature flag:', error)
    return false
  }
}

export async function setFeatureFlag(flag: string, value: boolean): Promise<boolean> {
  try {
    await redis.set(`flag:${flag}`, value.toString())
    return true
  } catch (error) {
    console.error('Error setting feature flag:', error)
    return false
  }
}

// Session management (optional)
export async function setUserSession(userId: string, sessionData: Record<string, unknown>): Promise<boolean> {
  try {
    await redis.setex(`session:${userId}`, 3600, JSON.stringify(sessionData)) // 1 hour
    return true
  } catch (error) {
    console.error('Error setting user session:', error)
    return false
  }
}

export async function getUserSession(userId: string): Promise<Record<string, unknown> | null> {
  try {
    const session = await redis.get(`session:${userId}`)
    return session ? JSON.parse(session as string) : null
  } catch (error) {
    console.error('Error getting user session:', error)
    return null
  }
}

export async function deleteUserSession(userId: string): Promise<boolean> {
  try {
    await redis.del(`session:${userId}`)
    return true
  } catch (error) {
    console.error('Error deleting user session:', error)
    return false
  }
}

// Receipt processing queue
export async function addToProcessingQueue(receiptId: string, priority: number = 1): Promise<boolean> {
  try {
    await redis.zadd('queue:processing', { score: priority, member: receiptId })
    return true
  } catch (error) {
    console.error('Error adding to processing queue:', error)
    return false
  }
}

export async function getNextFromProcessingQueue(): Promise<string | null> {
  try {
    const result = await redis.zpopmax('queue:processing')
    return result?.member as string || null
  } catch (error) {
    console.error('Error getting next from processing queue:', error)
    return null
  }
}

export async function getProcessingQueueSize(): Promise<number> {
  try {
    return await redis.zcard('queue:processing')
  } catch (error) {
    console.error('Error getting processing queue size:', error)
    return 0
  }
}

// Analytics and metrics
export async function incrementMetric(metric: string, value: number = 1): Promise<boolean> {
  try {
    await redis.incrby(`metric:${metric}`, value)
    return true
  } catch (error) {
    console.error('Error incrementing metric:', error)
    return false
  }
}

export async function getMetric(metric: string): Promise<number> {
  try {
    const value = await redis.get(`metric:${metric}`)
    return value ? parseInt(value as string) : 0
  } catch (error) {
    console.error('Error getting metric:', error)
    return 0
  }
}

export async function setMetric(metric: string, value: number): Promise<boolean> {
  try {
    await redis.set(`metric:${metric}`, value.toString())
    return true
  } catch (error) {
    console.error('Error setting metric:', error)
    return false
  }
}

// Cache warming
export async function warmCache(): Promise<boolean> {
  try {
    // Warm up frequently accessed data
    const featuredPartners = await redis.get('cache:featured_partners')
    if (!featuredPartners) {
      // This would typically fetch from database and cache
      await redis.setex('cache:featured_partners', 3600, JSON.stringify([]))
    }
    
    return true
  } catch (error) {
    console.error('Error warming cache:', error)
    return false
  }
}

// Health check
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis health check failed:', error)
    return false
  }
}

// Export Redis instance for direct use if needed
export { redis }
