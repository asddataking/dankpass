import { NextRequest, NextResponse } from 'next/server';
import { getPartnerWithDetails, approvePartner, rejectPartner } from '@/lib/partner';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partner = await getPartnerWithDetails(params.id);
    
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ partner });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    let result;
    if (action === 'approve') {
      result = await approvePartner(params.id);
    } else {
      result = await rejectPartner(params.id);
    }

    if (!result) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Partner ${action}d successfully`
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}
