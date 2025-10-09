import { stackServerApp } from '@/stack';
import { db } from './db';
import { users, memberships } from './db/schema';
import { eq } from 'drizzle-orm';

// Admin user email
const ADMIN_EMAIL = 'daniel.richmond.ebert@gmail.com';

/**
 * Check if a user is an admin based on their email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}

/**
 * Get the current user from Stack Auth
 */
export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return isAdminEmail(user.primaryEmail);
}

/**
 * Get or create user in database from Stack Auth user
 */
export async function getOrCreateDbUser(stackUserId: string, email: string) {
  // Check if user exists in database
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser[0]) {
    return existingUser[0];
  }

  // Create new user
  const role = isAdminEmail(email) ? 'admin' : 'user';
  const newUser = await db
    .insert(users)
    .values({
      email,
      role,
    })
    .returning();

  // Create membership
  const tier = isAdminEmail(email) ? 'premium' : 'free';
  await db.insert(memberships).values({
    userId: newUser[0].id,
    tier,
    // For admin, set premium to never expire
    premiumExpiresAt: isAdminEmail(email) ? new Date('2099-12-31') : null,
  });

  return newUser[0];
}

/**
 * Check if user has premium access (including admin)
 */
export async function userHasPremiumAccess(email: string): Promise<boolean> {
  // Admins always have premium
  if (isAdminEmail(email)) {
    return true;
  }

  // Check database membership
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user[0]) return false;

  const membership = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, user[0].id))
    .limit(1);

  if (!membership[0]) return false;

  // Check if premium and not expired
  if (membership[0].tier === 'premium') {
    if (!membership[0].premiumExpiresAt) return true;
    return new Date(membership[0].premiumExpiresAt) > new Date();
  }

  return false;
}
