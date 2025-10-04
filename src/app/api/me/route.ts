import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserPoints, getUserPointsBreakdown } from '@/lib/points'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get user points
    const points = await getUserPoints(user.id)
    const pointsBreakdown = await getUserPointsBreakdown(user.id)

    // Get recent receipts
    const { data: recentReceipts } = await supabase
      .from('receipts')
      .select('id, vendor, kind, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get recent redemptions
    const { data: recentRedemptions } = await supabase
      .from('redemptions')
      .select('reward_code, points_cost, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Calculate stats
    const approvedReceipts = recentReceipts?.filter(r => r.status === 'approved') || []
    const dispensaryCount = approvedReceipts.filter(r => r.kind === 'dispensary').length
    const restaurantCount = approvedReceipts.filter(r => r.kind === 'restaurant').length

    return NextResponse.json({
      profile,
      points,
      pointsBreakdown,
      recentReceipts,
      recentRedemptions,
      stats: {
        totalReceipts: recentReceipts?.length || 0,
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
