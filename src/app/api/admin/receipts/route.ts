import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/neon-auth'
import { updateReceipt, getReceiptById, addPoints } from '@/lib/neon-db'
import { calculatePointsFromReceipt } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    // Require admin access using adapter
    await requireAdmin()

    const { receiptId, action, reason } = await request.json()

    if (!receiptId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'approve') {
      // Get receipt details using adapter
      const receipt = await getReceiptById(receiptId)
      if (!receipt) {
        return NextResponse.json({ error: 'Receipt not found' }, { status: 404 })
      }

      // Update receipt status using adapter
      const updateSuccess = await updateReceipt(receiptId, {
        status: 'approved',
        approvedAt: new Date()
      })

      if (!updateSuccess) {
        return NextResponse.json({ error: 'Failed to update receipt' }, { status: 500 })
      }

      // Award points using adapter
      const basePoints = calculatePointsFromReceipt(receipt.kind as 'dispensary' | 'restaurant' | 'unknown')
      await addPoints(receipt.userId, basePoints, 'receipt', receiptId)

      return NextResponse.json({ success: true, pointsAwarded: basePoints })

    } else if (action === 'deny') {
      const updateSuccess = await updateReceipt(receiptId, {
        status: 'denied',
        denyReason: reason || 'Manually denied by admin'
      })

      if (!updateSuccess) {
        return NextResponse.json({ error: 'Failed to update receipt' }, { status: 500 })
      }

      return NextResponse.json({ success: true })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    console.error('Admin receipt action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
