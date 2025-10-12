import { NextResponse } from 'next/server';
import { getUserStats } from '@/lib/user';
import { getPartnerStats } from '@/lib/partner';
import { getReceiptStats } from '@/lib/receipt';
import { getRedemptionStats } from '@/lib/perks';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

async function getWaitlistStats() {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const neonSql = neon(process.env.DATABASE_URL!);

    const waitlist = await neonSql`
      SELECT id, name, email, referrer, created_at 
      FROM waitlist 
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const totalCount = await neonSql`SELECT COUNT(*) as count FROM waitlist`;

    return {
      total: Number(totalCount[0]?.count || 0),
      recent: waitlist.map((entry: any) => ({
        id: entry.id,
        name: entry.name || 'N/A',
        email: entry.email,
        referrer: entry.referrer || 'Direct',
        created_at: entry.created_at
      }))
    };
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    return { total: 0, recent: [] };
  }
}

async function getReferralStats() {
  try {
    // Get total referrals and points awarded
    const totalStats = await db
      .select({
        count: sql<number>`count(*)`,
        totalPoints: sql<number>`sum(${referrals.rewardPoints} + ${referrals.bonusPoints})`
      })
      .from(referrals)
      .where(eq(referrals.status, 'completed'));

    // Get top referrers
    const topReferrers = await db
      .select({
        userId: referrals.referrerId,
        referralCount: sql<number>`count(*)`,
        pointsEarned: users.referral_points_earned,
        name: users.display_name,
        email: users.email,
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.referrerId, users.id))
      .where(eq(referrals.status, 'completed'))
      .groupBy(referrals.referrerId, users.referral_points_earned, users.display_name, users.email)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    return {
      total: Number(totalStats[0]?.count || 0),
      pointsAwarded: Number(totalStats[0]?.totalPoints || 0),
      topReferrers: topReferrers.map(r => ({
        name: r.name || r.email,
        email: r.email,
        referralCount: Number(r.referralCount),
        pointsEarned: r.pointsEarned || 0,
      }))
    };
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return { total: 0, pointsAwarded: 0, topReferrers: [] };
  }
}

export async function GET() {
  try {
    const [userStats, partnerStats, receiptStats, redemptionStats, waitlistStats, referralStats] = await Promise.all([
      getUserStats(),
      getPartnerStats(),
      getReceiptStats(),
      getRedemptionStats(),
      getWaitlistStats(),
      getReferralStats()
    ]);

    return NextResponse.json({
      users: userStats,
      partners: partnerStats,
      receipts: receiptStats,
      redemptions: redemptionStats,
      waitlist: waitlistStats,
      referrals: referralStats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
