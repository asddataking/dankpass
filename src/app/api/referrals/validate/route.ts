import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invalid referral code format' },
        { status: 400 }
      );
    }

    // Find user with this referral code
    const referrer = await db.query.users.findFirst({
      where: eq(users.ref_code, code),
      columns: {
        id: true,
        display_name: true,
        name: true,
      },
    });

    if (!referrer) {
      return NextResponse.json({
        valid: false,
        error: 'Referral code not found',
      });
    }

    return NextResponse.json({
      valid: true,
      referrerName: referrer.display_name || referrer.name || 'A friend',
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate referral code' },
      { status: 500 }
    );
  }
}

