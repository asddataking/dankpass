import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { isAdminEmail } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'
import { awardPoints } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdminEmail(user.email || '')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { receiptId, action, reason } = await request.json()

    if (!receiptId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'approve') {
      // Get receipt details
      const { data: receipt, error: receiptError } = await supabaseAdmin
        .from('receipts')
        .select('user_id, kind')
        .eq('id', receiptId)
        .single()

      if (receiptError || !receipt) {
        return NextResponse.json({ error: 'Receipt not found' }, { status: 404 })
      }

      // Update receipt status
      const { error: updateError } = await supabaseAdmin
        .from('receipts')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', receiptId)

      if (updateError) {
        console.error('Error updating receipt:', updateError)
        return NextResponse.json({ error: 'Failed to update receipt' }, { status: 500 })
      }

      // Award points
      const basePoints = receipt.kind === 'dispensary' ? 10 : 8
      await awardPoints({
        userId: receipt.user_id,
        delta: basePoints,
        reason: 'receipt',
        refId: receiptId
      })

      return NextResponse.json({ success: true, pointsAwarded: basePoints })

    } else if (action === 'deny') {
      const { error: updateError } = await supabaseAdmin
        .from('receipts')
        .update({
          status: 'denied',
          deny_reason: reason || 'Manually denied by admin'
        })
        .eq('id', receiptId)

      if (updateError) {
        console.error('Error updating receipt:', updateError)
        return NextResponse.json({ error: 'Failed to update receipt' }, { status: 500 })
      }

      return NextResponse.json({ success: true })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin receipt action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
