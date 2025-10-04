import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserPoints } from '@/lib/points'
import { supabaseAdmin } from '@/lib/supabase'

const REWARD_COSTS = {
  SHOUTOUT: 50,
  BONUS_CLIP: 75,
  STICKERS: 150
} as const

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { reward_code } = await request.json()
    
    if (!reward_code || !(reward_code in REWARD_COSTS)) {
      return NextResponse.json({ error: 'Invalid reward code' }, { status: 400 })
    }

    const pointsCost = REWARD_COSTS[reward_code as keyof typeof REWARD_COSTS]
    const userPoints = await getUserPoints(user.id)

    if (userPoints < pointsCost) {
      return NextResponse.json({ 
        error: `Not enough points. Required: ${pointsCost}, Available: ${userPoints}` 
      }, { status: 400 })
    }

    // Deduct points
    const { error: pointsError } = await supabaseAdmin
      .from('points_ledger')
      .insert({
        user_id: user.id,
        delta: -pointsCost,
        reason: 'redeem'
      })

    if (pointsError) {
      console.error('Points deduction error:', pointsError)
      return NextResponse.json({ error: 'Failed to deduct points' }, { status: 500 })
    }

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabaseAdmin
      .from('redemptions')
      .insert({
        user_id: user.id,
        reward_code,
        points_cost: pointsCost,
        status: 'pending'
      })
      .select()
      .single()

    if (redemptionError) {
      console.error('Redemption creation error:', redemptionError)
      return NextResponse.json({ error: 'Failed to create redemption record' }, { status: 500 })
    }

    // Notify Discord webhook if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `🎉 New redemption: ${reward_code} (${pointsCost} points) by user ${user.email}`,
            embeds: [{
              title: 'DankPass Redemption',
              fields: [
                { name: 'User', value: user.email, inline: true },
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
