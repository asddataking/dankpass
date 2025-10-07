import { db } from './db';
import { perks, redemptions, pointsLedger, memberships } from './db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getUserTotalPoints, redeemPoints } from './points';

export interface PerkWithEligibility {
  id: string;
  title: string;
  description: string | null;
  pointsCost: number;
  isPremiumOnly: boolean;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  canRedeem: boolean;
  userHasEnoughPoints: boolean;
  userIsPremium: boolean;
}

export interface RedemptionResult {
  success: boolean;
  message: string;
  redemptionId?: string;
}

/**
 * Get all active perks with user eligibility
 */
export async function getPerksWithEligibility(userId?: string): Promise<PerkWithEligibility[]> {
  const perksList = await db
    .select()
    .from(perks)
    .where(eq(perks.isActive, true))
    .orderBy(desc(perks.createdAt));

  if (!userId) {
    return perksList.map(perk => ({
      ...perk,
      canRedeem: false,
      userHasEnoughPoints: false,
      userIsPremium: false
    }));
  }

  // Get user's membership status and points
  const [membership, userPoints] = await Promise.all([
    db.select().from(memberships).where(eq(memberships.userId, userId)).limit(1),
    getUserTotalPoints(userId)
  ]);

  const isPremium = membership[0]?.tier === 'premium';

  return perksList.map(perk => {
    const hasEnoughPoints = userPoints >= perk.pointsCost;
    const isEligibleForPremium = !perk.isPremiumOnly || isPremium;
    const canRedeem = hasEnoughPoints && isEligibleForPremium;

    return {
      ...perk,
      canRedeem,
      userHasEnoughPoints: hasEnoughPoints,
      userIsPremium: isPremium
    };
  });
}

/**
 * Redeem a perk
 */
export async function redeemPerk(userId: string, perkId: string): Promise<RedemptionResult> {
  try {
    // Get perk details
    const perk = await db
      .select()
      .from(perks)
      .where(and(eq(perks.id, perkId), eq(perks.isActive, true)))
      .limit(1);

    if (!perk[0]) {
      return {
        success: false,
        message: 'Perk not found or no longer available'
      };
    }

    const perkData = perk[0];

    // Check if user has enough points
    const userPoints = await getUserTotalPoints(userId);
    if (userPoints < perkData.pointsCost) {
      return {
        success: false,
        message: `You need ${perkData.pointsCost - userPoints} more points to redeem this perk`
      };
    }

    // Check premium requirement
    const membership = await db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, userId))
      .limit(1);

    const isPremium = membership[0]?.tier === 'premium';
    if (perkData.isPremiumOnly && !isPremium) {
      return {
        success: false,
        message: 'This perk is only available for premium members'
      };
    }

    // Redeem points
    const pointsRedeemed = await redeemPoints(
      userId,
      perkData.pointsCost,
      `Perk redemption: ${perkData.title}`
    );

    if (!pointsRedeemed) {
      return {
        success: false,
        message: 'Failed to redeem points'
      };
    }

    // Create redemption record
    const redemption = await db.insert(redemptions).values({
      userId,
      perkId,
      pointsUsed: perkData.pointsCost,
      status: 'completed'
    }).returning();

    return {
      success: true,
      message: `Successfully redeemed ${perkData.title}!`,
      redemptionId: redemption[0].id
    };

  } catch (error) {
    console.error('Error redeeming perk:', error);
    return {
      success: false,
      message: 'An error occurred while redeeming the perk'
    };
  }
}

/**
 * Get user's redemption history
 */
export async function getUserRedemptions(userId: string, limit: number = 50) {
  return await db
    .select({
      id: redemptions.id,
      pointsUsed: redemptions.pointsUsed,
      status: redemptions.status,
      createdAt: redemptions.createdAt,
      perkTitle: perks.title,
      perkDescription: perks.description,
      perkImageUrl: perks.imageUrl
    })
    .from(redemptions)
    .innerJoin(perks, eq(redemptions.perkId, perks.id))
    .where(eq(redemptions.userId, userId))
    .orderBy(desc(redemptions.createdAt))
    .limit(limit);
}

/**
 * Get perk by ID
 */
export async function getPerkById(perkId: string) {
  const perk = await db
    .select()
    .from(perks)
    .where(eq(perks.id, perkId))
    .limit(1);

  return perk[0] || null;
}

/**
 * Create a new perk (admin function)
 */
export async function createPerk(data: {
  title: string;
  description?: string;
  pointsCost: number;
  isPremiumOnly?: boolean;
  imageUrl?: string;
}) {
  return await db.insert(perks).values({
    title: data.title,
    description: data.description || null,
    pointsCost: data.pointsCost,
    isPremiumOnly: data.isPremiumOnly || false,
    imageUrl: data.imageUrl || null,
    isActive: true
  }).returning();
}

/**
 * Update perk (admin function)
 */
export async function updatePerk(perkId: string, data: {
  title?: string;
  description?: string;
  pointsCost?: number;
  isPremiumOnly?: boolean;
  isActive?: boolean;
  imageUrl?: string;
}) {
  return await db
    .update(perks)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(perks.id, perkId))
    .returning();
}

/**
 * Get redemption statistics
 */
export async function getRedemptionStats() {
  const [totalRedemptions, completedRedemptions, pendingRedemptions] = await Promise.all([
    db.select({ count: redemptions.id }).from(redemptions),
    db.select({ count: redemptions.id }).from(redemptions).where(eq(redemptions.status, 'completed')),
    db.select({ count: redemptions.id }).from(redemptions).where(eq(redemptions.status, 'pending'))
  ]);

  return {
    total: totalRedemptions.length,
    completed: completedRedemptions.length,
    pending: pendingRedemptions.length
  };
}
