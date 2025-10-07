import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { perks } from '@/lib/db/schema';

export async function GET() {
  try {
    const allPerks = await db.select().from(perks);
    return NextResponse.json(allPerks);
  } catch (error) {
    console.error('Error fetching perks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch perks' },
      { status: 500 }
    );
  }
}
