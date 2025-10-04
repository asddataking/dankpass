import { NextResponse } from 'next/server'
import { getUserPointsTotal, getUserPointsBreakdown, getUserReceipts, getUserRedemptions } from '@/lib/neon-db'
import { getUserPointsFromCache, setUserPointsCache } from '@/lib/upstash-redis'
import { getCurrentUser } from '@/lib/neon-auth'

export async function GET() {
  try {
    const stackUser = await getCurrentUser()
    if (!stackUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = stackUser.id
    
    // Try to get points from cache first
    let points = await getUserPointsFromCache(userId)
    
    // If not in cache, get from database and cache it
    if (points === null) {
      points = await getUserPointsTotal(userId)
      await setUserPointsCache(userId, points)
    }

    // Get user data
    const [pointsBreakdown, recentReceipts, recentRedemptions] = await Promise.all([
      getUserPointsBreakdown(userId),
      getUserReceipts(userId, 10),
      getUserRedemptions(userId, 10)
    ])

    // Get user info from Neon Auth
    const userProfile = {
      id: stackUser.id,
      email: 'user@example.com', // TODO: Get email from Stack Auth when available
      display_name: 'User', // TODO: Get name from Stack Auth when available
      avatar_url: null,
      is_plus: false // TODO: Implement Plus subscription
    }

    // Calculate stats
    const approvedReceipts = recentReceipts.filter(r => r.status === 'approved')
    const dispensaryCount = approvedReceipts.filter(r => r.kind === 'dispensary').length
    const restaurantCount = approvedReceipts.filter(r => r.kind === 'restaurant').length

    return NextResponse.json({
      profile: userProfile,
      points,
      pointsBreakdown,
      recentReceipts: recentReceipts.map(receipt => ({
        id: receipt.id,
        vendor: receipt.vendor,
        kind: receipt.kind,
        status: receipt.status,
        created_at: receipt.createdAt
      })),
      recentRedemptions: recentRedemptions.map(redemption => ({
        reward_code: redemption.rewardCode,
        points_cost: redemption.pointsCost,
        status: redemption.status,
        created_at: redemption.createdAt
      })),
      stats: {
        totalReceipts: recentReceipts.length,
        approvedReceipts: approvedReceipts.length,
        dispensaryCount,
        restaurantCount
      }
    })

  } catch (error) {
    console.error('Me API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
