import { NextRequest, NextResponse } from 'next/server'
import { getUserPointsTotal, addPoints, createRedemption } from '@/lib/neon-db'
import { getUserPointsFromCache, setUserPointsCache } from '@/lib/upstash-redis'
import { getCurrentUser } from '@/lib/neon-auth'

// Reward costs - moved from edgeConfig
const REWARD_COSTS = {
  SHOUTOUT: 50,
  BONUS_CLIP: 75,
  STICKERS: 150
} as const

function isValidRewardCode(code: string): code is keyof typeof REWARD_COSTS {
  return code in REWARD_COSTS
}

async function getRewardCost(rewardCode: keyof typeof REWARD_COSTS): Promise<number> {
  return REWARD_COSTS[rewardCode]
}

export async function POST(request: NextRequest) {
  try {
    const stackUser = await getCurrentUser()
    if (!stackUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = stackUser.id
    const { reward_code } = await request.json()
    
    if (!reward_code || !isValidRewardCode(reward_code)) {
      return NextResponse.json({ error: 'Invalid reward code' }, { status: 400 })
    }

    const pointsCost = await getRewardCost(reward_code)
    
    // Check user's current points
    let userPoints = await getUserPointsFromCache(userId)
    if (userPoints === null) {
      userPoints = await getUserPointsTotal(userId)
      await setUserPointsCache(userId, userPoints)
    }

    if (userPoints < pointsCost) {
      return NextResponse.json({ 
        error: `Not enough points. Required: ${pointsCost}, Available: ${userPoints}` 
      }, { status: 400 })
    }

    // Create redemption record
    const redemption = await createRedemption(userId, reward_code, pointsCost)
    if (!redemption) {
      return NextResponse.json({ error: 'Failed to create redemption record' }, { status: 500 })
    }

    // Deduct points
    await addPoints(userId, -pointsCost, 'redeem', redemption.id)

    // Update cache
    await setUserPointsCache(userId, userPoints - pointsCost)

    // Get user email for Discord notification
    const email = 'user@example.com' // TODO: Get email from Stack Auth when available

    // Notify Discord webhook if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `🎉 New redemption: ${reward_code} (${pointsCost} points) by user ${email}`,
            embeds: [{
              title: 'DankPass Redemption',
              fields: [
                { name: 'User', value: email || 'Unknown', inline: true },
                { name: 'Reward', value: reward_code, inline: true },
                { name: 'Points', value: pointsCost.toString(), inline: true }
              ],
              color: 0x00ff00
            }]
          })
        })
      } catch (discordError) {
        console.error('Discord notification error:', discordError)
        // Don't fail the request if Discord notification fails
      }
    }

    return NextResponse.json({
      success: true,
      redemptionId: redemption.id,
      pointsRemaining: userPoints - pointsCost
    })

  } catch (error) {
    console.error('Redemption error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
