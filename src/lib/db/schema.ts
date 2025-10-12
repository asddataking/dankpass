import { pgTable, text, timestamp, uuid, boolean, integer, decimal, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  display_name: text('display_name'),
  avatar_url: text('avatar_url'),
  tier: text('tier').default('bronze'),
  points_cached: integer('points_cached').default(0),
  streak: integer('streak').default(0),
  ref_code: text('ref_code'),
  referred_by_code: text('referred_by_code'),
  total_referrals: integer('total_referrals').default(0),
  referral_points_earned: integer('referral_points_earned').default(0),
  preferred_role: text('preferred_role'),
  role: text('role', { enum: ['user', 'partner_dispensary', 'partner_restaurant', 'admin'] }).default('user'),
  is_premium: boolean('is_premium').notNull().default(false),
  premium_since: timestamp('premium_since'),
  premium_provider: text('premium_provider'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Profiles table
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatar: text('avatar'),
  city: text('city'),
  state: text('state'),
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth'),
  notificationPreferences: json('notification_preferences').$type<{
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Memberships table
export const memberships = pgTable('memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tier: text('tier', { enum: ['free', 'premium'] }).notNull().default('free'),
  premiumExpiresAt: timestamp('premium_expires_at'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Partners table
export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  businessName: text('business_name').notNull(),
  businessType: text('business_type', { enum: ['dispensary', 'restaurant'] }).notNull(),
  description: text('description'),
  logo: text('logo'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Locations table
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  partnerId: uuid('partner_id').references(() => partners.id).notNull(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  phone: text('phone'),
  hours: json('hours'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Offers table
export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  partnerId: uuid('partner_id').references(() => partners.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  discountType: text('discount_type', { enum: ['percentage', 'fixed', 'points'] }).notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minSpend: decimal('min_spend', { precision: 10, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Receipts table
export const receipts = pgTable('receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  partnerId: uuid('partner_id').references(() => partners.id),
  imageUrl: text('image_url').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  pointsAwarded: integer('points_awarded').default(0),
  adminNotes: text('admin_notes'),
  source: text('source').default('web'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Points ledger table
export const pointsLedger = pgTable('points_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  receiptId: uuid('receipt_id').references(() => receipts.id),
  points: integer('points').notNull(),
  type: text('type', { enum: ['earned', 'redeemed', 'bonus', 'adjustment'] }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Perks table
export const perks = pgTable('perks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  isPremiumOnly: boolean('is_premium_only').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Redemptions table
export const redemptions = pgTable('redemptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  perkId: uuid('perk_id').references(() => perks.id).notNull(),
  pointsUsed: integer('points_used').notNull(),
  status: text('status', { enum: ['pending', 'completed', 'cancelled'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Referrals table
export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  referrerId: uuid('referrer_id').references(() => users.id).notNull(),
  referredUserId: uuid('referred_user_id').references(() => users.id).notNull(),
  referralCode: text('referral_code').notNull(),
  status: text('status', { enum: ['completed', 'cancelled'] }).notNull().default('completed'),
  rewardPoints: integer('reward_points').default(250),
  bonusPoints: integer('bonus_points').default(250),
  rewardedAt: timestamp('rewarded_at').defaultNow().notNull(),
  source: text('source'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Webhooks table
export const webhooks = pgTable('webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  event: text('event').notNull(),
  payload: json('payload').notNull(),
  processed: boolean('processed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// App config table
export const appConfig = pgTable('app_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertMembershipSchema = createInsertSchema(memberships);
export const selectMembershipSchema = createSelectSchema(memberships);

export const insertPartnerSchema = createInsertSchema(partners);
export const selectPartnerSchema = createSelectSchema(partners);

export const insertLocationSchema = createInsertSchema(locations);
export const selectLocationSchema = createSelectSchema(locations);

export const insertOfferSchema = createInsertSchema(offers);
export const selectOfferSchema = createSelectSchema(offers);

export const insertReceiptSchema = createInsertSchema(receipts);
export const selectReceiptSchema = createSelectSchema(receipts);

export const insertPointsLedgerSchema = createInsertSchema(pointsLedger);
export const selectPointsLedgerSchema = createSelectSchema(pointsLedger);

export const insertPerkSchema = createInsertSchema(perks);
export const selectPerkSchema = createSelectSchema(perks);

export const insertRedemptionSchema = createInsertSchema(redemptions);
export const selectRedemptionSchema = createSelectSchema(redemptions);

export const insertReferralSchema = createInsertSchema(referrals);
export const selectReferralSchema = createSelectSchema(referrals);

export const insertWebhookSchema = createInsertSchema(webhooks);
export const selectWebhookSchema = createSelectSchema(webhooks);

export const insertAppConfigSchema = createInsertSchema(appConfig);
export const selectAppConfigSchema = createSelectSchema(appConfig);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Receipt = typeof receipts.$inferSelect;
export type NewReceipt = typeof receipts.$inferInsert;
export type PointsLedger = typeof pointsLedger.$inferSelect;
export type NewPointsLedger = typeof pointsLedger.$inferInsert;
export type Perk = typeof perks.$inferSelect;
export type NewPerk = typeof perks.$inferInsert;
export type Redemption = typeof redemptions.$inferSelect;
export type NewRedemption = typeof redemptions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
export type Webhook = typeof webhooks.$inferSelect;
export type NewWebhook = typeof webhooks.$inferInsert;
export type AppConfig = typeof appConfig.$inferSelect;
export type NewAppConfig = typeof appConfig.$inferInsert;

// Relations
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: 'referrer',
  }),
  referredUser: one(users, {
    fields: [referrals.referredUserId],
    references: [users.id],
    relationName: 'referredUser',
  }),
}));
