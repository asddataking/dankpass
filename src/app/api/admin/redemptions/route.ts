import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/neon-auth'
import { updateRedemptionStatus } from '@/lib/neon-db'

export async function POST(request: NextRequest) {
  try {
    // Require admin access using adapter
    await requireAdmin()

    const { redemptionId, action } = await request.json()

    if (!redemptionId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'fulfill') {
      const updateSuccess = await updateRedemptionStatus(redemptionId, 'fulfilled')

      if (!updateSuccess) {
        return NextResponse.json({ error: 'Failed to update redemption' }, { status: 500 })
      }

      return NextResponse.json({ success: true })

    } else if (action === 'cancel') {
      const updateSuccess = await updateRedemptionStatus(redemptionId, 'cancelled')

      if (!updateSuccess) {
        return NextResponse.json({ error: 'Failed to update redemption' }, { status: 500 })
      }

      return NextResponse.json({ success: true })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    console.error('Admin redemption action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
