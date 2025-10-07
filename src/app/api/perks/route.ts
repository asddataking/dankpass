import { NextRequest, NextResponse } from 'next/server';
import { getPerksWithEligibility, createPerk } from '@/lib/perks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const perks = await getPerksWithEligibility(userId || undefined);
    return NextResponse.json({ perks });
  } catch (error) {
    console.error('Error fetching perks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch perks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const perk = await createPerk({
      title: data.title,
      description: data.description,
      pointsCost: data.pointsCost,
      isPremiumOnly: data.isPremiumOnly,
      imageUrl: data.imageUrl
    });

    return NextResponse.json({ perk: perk[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating perk:', error);
    return NextResponse.json(
      { error: 'Failed to create perk' },
      { status: 500 }
    );
  }
}
