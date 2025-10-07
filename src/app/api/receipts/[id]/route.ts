import { NextRequest, NextResponse } from 'next/server';
import { getReceiptWithDetails, approveReceipt, rejectReceipt } from '@/lib/receipt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const receipt = await getReceiptWithDetails(id);
    
    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    return NextResponse.json({ receipt });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipt' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, adminNotes } = await request.json();
    
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    let result;
    if (action === 'approve') {
      result = await approveReceipt(id, adminNotes);
    } else {
      result = await rejectReceipt(id, adminNotes);
    }

    if (!result) {
      return NextResponse.json({ error: 'Receipt not found or already processed' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Receipt ${action}d successfully`,
      receipt: result 
    });
  } catch (error) {
    console.error('Error updating receipt:', error);
    return NextResponse.json(
      { error: 'Failed to update receipt' },
      { status: 500 }
    );
  }
}
