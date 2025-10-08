import { db } from './db';
import { users, profiles, memberships, pointsLedger, receipts, redemptions } from './db/schema';
import { eq, desc, sum, or } from 'drizzle-orm';
import { getUserTotalPoints, getUserPointsHistory } from './points';
import { getUserReceipts } from './receipt';
import { getUserRedemptions } from './perks';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  profile?: {
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    city: string | null;
    state: string | null;
    phone: string | null;
  };
  membership?: {
    tier: 'free' | 'premium';
    premiumExpiresAt: Date | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  };
  stats?: {
    totalPoints: number;
    totalReceipts: number;
    totalRedemptions: number;
    totalSaved: number;
  };
}

export interface CreateUserData {
  email: string;
  role?: 'user' | 'partner_dispensary' | 'partner_restaurant' | 'admin';
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  phone?: string;
}

/**
 * Create a new user with profile
 */
export async function createUser(data: CreateUserData) {
  // Create user
  const user = await db.insert(users).values({
    email: data.email,
    role: data.role || 'user'
  }).returning();

  // Create profile if provided
  if (data.firstName || data.lastName || data.city || data.state || data.phone) {
    await db.insert(profiles).values({
      userId: user[0].id,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      city: data.city || null,
      state: data.state || null,
      phone: data.phone || null
    });
  }

  // Create default membership
  await db.insert(memberships).values({
    userId: user[0].id,
    tier: 'free'
  });

  return user[0];
}

/**
 * Get user with full profile and stats
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userData = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatar: profiles.avatar,
      city: profiles.city,
      state: profiles.state,
      phone: profiles.phone,
      tier: memberships.tier,
      premiumExpiresAt: memberships.premiumExpiresAt,
      stripeCustomerId: memberships.stripeCustomerId,
      stripeSubscriptionId: memberships.stripeSubscriptionId
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(memberships, eq(users.id, memberships.userId))
    .where(eq(users.id, userId))
    .limit(1);

  if (!userData[0]) return null;

  const user = userData[0];

  // Get user stats
  const [totalPoints, receiptsData, redemptionsData] = await Promise.all([
    getUserTotalPoints(userId),
    db.select({ count: receipts.id }).from(receipts).where(eq(receipts.userId, userId)),
    db.select({ count: redemptions.id }).from(redemptions).where(eq(redemptions.userId, userId))
  ]);

  // Calculate total saved (simplified - in real app you'd track actual savings)
  const totalSaved = totalPoints * 0.01; // Assume 1 point = $0.01

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    profile: user.firstName ? {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      city: user.city,
      state: user.state,
      phone: user.phone
    } : undefined,
    membership: user.tier ? {
      tier: user.tier,
      premiumExpiresAt: user.premiumExpiresAt,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId
    } : undefined,
    stats: {
      totalPoints,
      totalReceipts: receiptsData.length,
      totalRedemptions: redemptionsData.length,
      totalSaved
    }
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: {
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  phone?: string;
  avatar?: string;
}) {
  // Check if profile exists
  const existingProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (existingProfile[0]) {
    // Update existing profile
    return await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(profiles.userId, userId))
      .returning();
  } else {
    // Create new profile
    return await db.insert(profiles).values({
      userId,
      ...data
    }).returning();
  }
}

/**
 * Get user's activity summary
 */
export async function getUserActivity(userId: string, limit: number = 20) {
  const [receipts, pointsHistory, redemptions] = await Promise.all([
    getUserReceipts(userId, limit),
    getUserPointsHistory(userId, limit),
    getUserRedemptions(userId, limit)
  ]);

  // Combine and sort by date
  const activities = [
    ...receipts.map(r => ({
      type: 'receipt' as const,
      id: r.id,
      date: r.createdAt,
      title: `Receipt uploaded`,
      description: r.partner?.businessName || 'Unknown partner',
      points: r.pointsAwarded,
      status: r.status
    })),
    ...pointsHistory.map(p => ({
      type: 'points' as const,
      id: p.id,
      date: p.createdAt,
      title: p.description,
      description: `${p.points > 0 ? '+' : ''}${p.points} points`,
      points: p.points,
      status: 'completed' as const
    })),
    ...redemptions.map(r => ({
      type: 'redemption' as const,
      id: r.id,
      date: r.createdAt,
      title: `Perk redeemed: ${r.perkTitle}`,
      description: r.perkDescription || '',
      points: -r.pointsUsed,
      status: r.status
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);

  return activities;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user[0] || null;
}

/**
 * Update user membership
 */
export async function updateUserMembership(userId: string, data: {
  tier?: 'free' | 'premium';
  premiumExpiresAt?: Date | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  return await db
    .update(memberships)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(memberships.userId, userId))
    .returning();
}

/**
 * Get all users (admin function)
 */
export async function getAllUsers(limit: number = 50) {
  return await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      tier: memberships.tier
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(memberships, eq(users.id, memberships.userId))
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  const [totalUsers, premiumUsers, totalPartners, totalReceipts] = await Promise.all([
    db.select({ count: users.id }).from(users),
    db.select({ count: memberships.id }).from(memberships).where(eq(memberships.tier, 'premium')),
    db.select({ count: users.id }).from(users).where(or(eq(users.role, 'partner_dispensary'), eq(users.role, 'partner_restaurant'))),
    db.select({ count: receipts.id }).from(receipts)
  ]);

  return {
    totalUsers: totalUsers.length,
    premiumUsers: premiumUsers.length,
    totalPartners: totalPartners.length,
    totalReceipts: totalReceipts.length
  };
}
