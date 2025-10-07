import { NextRequest, NextResponse } from 'next/server';
import { redeemPerk } from '@/lib/perks';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: perkId } = await params;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await redeemPerk(userId, perkId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ 
      message: result.message,
      redemptionId: result.redemptionId 
    });
  } catch (error) {
    console.error('Error redeeming perk:', error);
    return NextResponse.json(
      { error: 'Failed to redeem perk' },
      { status: 500 }
    );
  }
}
