import { NextRequest, NextResponse } from 'next/server';
import { getUserReceipts, getPendingReceipts } from '@/lib/receipt';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'user' or 'pending'
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'pending') {
      // Admin endpoint - get all pending receipts
      const receipts = await getPendingReceipts(limit);
      return NextResponse.json({ receipts });
    } else if (userId) {
      // User endpoint - get user's receipts
      const receipts = await getUserReceipts(userId, limit);
      return NextResponse.json({ receipts });
    } else {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}
