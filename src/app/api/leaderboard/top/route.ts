import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard, getUserLeaderboardPosition, getLeaderboardAroundUser, updateLeaderboard, incrementMetric } from '@/lib/upstash-redis'
import { getUserById } from '@/lib/neon-db'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const userId = url.searchParams.get('userId')

    // Get leaderboard using adapter
    const leaderboard = await getLeaderboard(limit)

    // If userId provided, get their position and surrounding users
    let userPosition = null
    let surroundingUsers: { userId: string; points: number; rank: number }[] = []
    
    if (userId) {
      const [position, surrounding] = await Promise.all([
        getUserLeaderboardPosition(userId),
        getLeaderboardAroundUser(userId, 5)
      ])
      
      userPosition = position
      surroundingUsers = surrounding
    }

    // Get user details for leaderboard entries
    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await getUserById(entry.userId)
        return {
          userId: entry.userId,
          points: entry.points,
          displayName: user?.displayName || user?.email || 'Anonymous',
          avatarUrl: user?.avatarUrl,
          city: user?.city
        }
      })
    )

    // Increment metrics
    await incrementMetric('leaderboard_views', 1)

    return NextResponse.json({
      leaderboard: leaderboardWithUsers,
      userPosition,
      surroundingUsers: surroundingUsers.map(entry => ({
        userId: entry.userId,
        points: entry.points,
        rank: entry.rank
      })),
      totalUsers: leaderboard.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, points } = await request.json()

    if (!userId || typeof points !== 'number') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    // Update leaderboard using adapter
    const success = await updateLeaderboard(userId, points)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 })
    }

    // Increment metrics
    await incrementMetric('leaderboard_updates', 1)

    return NextResponse.json({
      success: true,
      message: 'Leaderboard updated successfully'
    })

  } catch (error) {
    console.error('Leaderboard update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
