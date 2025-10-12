import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user stats
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id as any),
      columns: {
        total_referrals: true,
        referral_points_earned: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get recent referrals
    const recentReferrals = await db.query.referrals.findMany({
      where: eq(referrals.referrerId, user.id as any),
      orderBy: [desc(referrals.createdAt)],
      limit: 10,
      with: {
        referredUser: {
          columns: {
            display_name: true,
            name: true,
          },
        },
      },
    });

    const formattedReferrals = recentReferrals.map((ref: any) => ({
      id: ref.id,
      referredUserName: ref.referredUser?.display_name || ref.referredUser?.name || 'Anonymous',
      status: ref.status,
      points: ref.rewardPoints,
      createdAt: ref.createdAt,
    }));

    return NextResponse.json({
      totalReferrals: dbUser.total_referrals || 0,
      pointsEarned: dbUser.referral_points_earned || 0,
      recentReferrals: formattedReferrals,
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to get referral stats' },
      { status: 500 }
    );
  }
}

