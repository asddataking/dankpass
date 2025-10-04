import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { isAdminEmail } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdminEmail(user.email || '')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { redemptionId, action } = await request.json()

    if (!redemptionId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'fulfill') {
      const { error: updateError } = await supabaseAdmin
        .from('redemptions')
        .update({
          status: 'fulfilled',
          fulfilled_at: new Date().toISOString()
        })
        .eq('id', redemptionId)

      if (updateError) {
        console.error('Error updating redemption:', updateError)
        return NextResponse.json({ error: 'Failed to update redemption' }, { status: 500 })
      }

      return NextResponse.json({ success: true })

    } else if (action === 'cancel') {
      const { error: updateError } = await supabaseAdmin
        .from('redemptions')
        .update({
          status: 'cancelled'
        })
        .eq('id', redemptionId)

      if (updateError) {
        console.error('Error updating redemption:', updateError)
        return NextResponse.json({ error: 'Failed to update redemption' }, { status: 500 })
      }

      return NextResponse.json({ success: true })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin redemption action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
