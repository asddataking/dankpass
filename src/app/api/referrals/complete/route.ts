import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { db } from '@/lib/db';
import { users, referrals, pointsLedger } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referralCode, source } = await request.json();

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Find the referrer by referral code
    const referrer = await db.query.users.findFirst({
      where: eq(users.ref_code, referralCode),
    });

    if (!referrer) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      );
    }

    // Prevent self-referral
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot use your own referral code' },
        { status: 400 }
      );
    }

    // Check if user already used a referral code
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, user.id as any),
    });

    if (existingUser?.referred_by_code) {
      return NextResponse.json(
        { error: 'You have already used a referral code' },
        { status: 400 }
      );
    }

    // Check if this referral already exists
    const existingReferral = await db.query.referrals.findFirst({
      where: and(
        eq(referrals.referrerId, referrer.id),
        eq(referrals.referredUserId, user.id as any)
      ),
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Referral already processed' },
        { status: 400 }
      );
    }

    // Create referral record
    const [newReferral] = await db.insert(referrals).values({
      referrerId: referrer.id,
      referredUserId: user.id as any,
      referralCode,
      status: 'completed',
      rewardPoints: 250,
      bonusPoints: 250,
      source: source || null,
    }).returning();

    // Award 250 points to REFERRER
    await db.insert(pointsLedger).values({
      userId: referrer.id,
      points: 250,
      type: 'bonus',
      description: `Referral reward for inviting ${user.displayName || 'a friend'}`,
    });

    // Award 250 bonus points to REFEREE (new user)
    await db.insert(pointsLedger).values({
      userId: user.id as any,
      points: 250,
      type: 'bonus',
      description: `Welcome bonus for being referred by ${referrer.display_name || 'a friend'}!`,
    });

    // Update referrer's stats
    await db.update(users)
      .set({
        total_referrals: sql`${users.total_referrals} + 1`,
        referral_points_earned: sql`${users.referral_points_earned} + 250`,
        points_cached: sql`${users.points_cached} + 250`,
      })
      .where(eq(users.id, referrer.id));

    // Update referee's record
    await db.update(users)
      .set({
        referred_by_code: referralCode,
        points_cached: sql`${users.points_cached} + 250`,
      })
      .where(eq(users.id, user.id as any));

    return NextResponse.json({
      success: true,
      bonusPoints: 250,
      referrerName: referrer.display_name || referrer.name || 'A friend',
      message: `Welcome! You earned 250 bonus points from ${referrer.display_name || 'your friend'}'s referral!`,
    });
  } catch (error) {
    console.error('Error completing referral:', error);
    return NextResponse.json(
      { error: 'Failed to process referral' },
      { status: 500 }
    );
  }
}

