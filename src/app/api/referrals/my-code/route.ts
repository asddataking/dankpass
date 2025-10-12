import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Generate a unique referral code
function generateReferralCode(displayName: string): string {
  const firstName = displayName?.split(' ')[0] || 'USER';
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DANK-${firstName.toUpperCase()}-${randomChars}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id as any),
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate referral code if not exists
    let refCode = dbUser.ref_code;
    if (!refCode) {
      refCode = generateReferralCode(user.displayName || '');
      
      // Update user with new referral code
      await db.update(users)
        .set({ ref_code: refCode })
        .where(eq(users.id, user.id as any));
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${appUrl}/welcome?ref=${refCode}`;

    return NextResponse.json({
      code: refCode,
      shareUrl,
      totalReferrals: dbUser.total_referrals || 0,
      pointsEarned: dbUser.referral_points_earned || 0,
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    return NextResponse.json(
      { error: 'Failed to get referral code' },
      { status: 500 }
    );
  }
}

