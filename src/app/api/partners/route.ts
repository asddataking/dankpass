import { NextRequest, NextResponse } from 'next/server';
import { createPartner, getPendingPartners, getApprovedPartners } from '@/lib/partner';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'pending' or 'approved'
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'pending') {
      const partners = await getPendingPartners(limit);
      return NextResponse.json({ partners });
    } else {
      const partners = await getApprovedPartners(limit);
      return NextResponse.json({ partners });
    }
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const partner = await createPartner({
      userId: data.userId,
      businessName: data.businessName,
      businessType: data.businessType,
      description: data.description,
      phone: data.phone,
      email: data.email,
      website: data.website,
      logo: data.logo
    });

    return NextResponse.json({ 
      message: 'Partner application submitted successfully',
      partner: partner[0] 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Failed to create partner application' },
      { status: 500 }
    );
  }
}
