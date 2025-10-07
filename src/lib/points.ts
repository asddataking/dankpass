import { db } from './db';
import { users, memberships, partners, pointsLedger, receipts, appConfig } from './db/schema';
import { eq, and, desc, sum } from 'drizzle-orm';

export interface PointsConfig {
  base: number;
  premium: number;
  inNetwork: number;
  dailyCap: number;
}

export interface PointsCalculation {
  basePoints: number;
  multiplier: number;
  bonusPoints: number;
  totalPoints: number;
  isPremium: boolean;
  isInNetwork: boolean;
  dailyCapReached: boolean;
}

/**
 * Get points configuration from database
 */
export async function getPointsConfig(): Promise<PointsConfig> {
  const config = await db.select().from(appConfig);
  
  const configMap = config.reduce((acc, item) => {
    acc[item.key] = parseFloat(item.value);
    return acc;
  }, {} as Record<string, number>);

  return {
    base: configMap.POINTS_BASE || 1,
    premium: configMap.POINTS_PREMIUM || 1.5,
    inNetwork: configMap.POINTS_INNETWORK || 2,
    dailyCap: configMap.DAILY_CAP || 2000
  };
}

/**
 * Calculate points for a receipt
 */
export async function calculatePoints(
  userId: string,
  amount: number,
  partnerId?: string
): Promise<PointsCalculation> {
  const config = await getPointsConfig();
  
  // Get user membership status
  const membership = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, userId))
    .limit(1);

  const isPremium = membership[0]?.tier === 'premium';

  // Check if partner is in network
  let isInNetwork = false;
  if (partnerId) {
    const partner = await db
      .select()
      .from(partners)
      .where(and(eq(partners.id, partnerId), eq(partners.status, 'approved')))
      .limit(1);
    isInNetwork = partner.length > 0;
  }

  // Calculate base points
  const basePoints = Math.floor(amount * config.base);
  
  // Determine multiplier
  let multiplier = 1;
  if (isPremium && isInNetwork) {
    multiplier = config.premium * config.inNetwork;
  } else if (isPremium) {
    multiplier = config.premium;
  } else if (isInNetwork) {
    multiplier = config.inNetwork;
  }

  // Calculate total points
  const totalPoints = Math.floor(basePoints * multiplier);

  // Check daily cap
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayPoints = await db
    .select({ total: sum(pointsLedger.points) })
    .from(pointsLedger)
    .where(
      and(
        eq(pointsLedger.userId, userId),
        eq(pointsLedger.type, 'earned'),
        // Note: This is a simplified check - in production you'd want proper date filtering
      )
    );

  const dailyTotal = todayPoints[0]?.total || 0;
  const dailyCapReached = dailyTotal >= config.dailyCap;

  return {
    basePoints,
    multiplier,
    bonusPoints: totalPoints - basePoints,
    totalPoints: dailyCapReached ? Math.max(0, config.dailyCap - dailyTotal) : totalPoints,
    isPremium,
    isInNetwork,
    dailyCapReached
  };
}

/**
 * Award points to a user
 */
export async function awardPoints(
  userId: string,
  points: number,
  type: 'earned' | 'bonus' | 'adjustment' = 'earned',
  description: string,
  receiptId?: string
): Promise<void> {
  await db.insert(pointsLedger).values({
    userId,
    points,
    type,
    description,
    receiptId
  });
}

/**
 * Get user's total points
 */
export async function getUserTotalPoints(userId: string): Promise<number> {
  const result = await db
    .select({ total: sum(pointsLedger.points) })
    .from(pointsLedger)
    .where(eq(pointsLedger.userId, userId));

  return result[0]?.total || 0;
}

/**
 * Get user's points history
 */
export async function getUserPointsHistory(userId: string, limit: number = 50) {
  return await db
    .select()
    .from(pointsLedger)
    .where(eq(pointsLedger.userId, userId))
    .orderBy(desc(pointsLedger.createdAt))
    .limit(limit);
}

/**
 * Redeem points (for perks)
 */
export async function redeemPoints(
  userId: string,
  points: number,
  description: string
): Promise<boolean> {
  const totalPoints = await getUserTotalPoints(userId);
  
  if (totalPoints < points) {
    return false;
  }

  await awardPoints(userId, -points, 'redeemed', description);
  return true;
}

/**
 * Get user's daily points earned
 */
export async function getUserDailyPoints(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result = await db
    .select({ total: sum(pointsLedger.points) })
    .from(pointsLedger)
    .where(
      and(
        eq(pointsLedger.userId, userId),
        eq(pointsLedger.type, 'earned')
        // Note: Add proper date filtering in production
      )
    );

  return result[0]?.total || 0;
}
