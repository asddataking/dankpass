import { pgTable, uuid, text, timestamp, integer, boolean, numeric, pgEnum, date, jsonb, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const receiptStatusEnum = pgEnum('receipt_status', ['pending', 'approved', 'denied'])
export const receiptKindEnum = pgEnum('receipt_kind', ['dispensary', 'restaurant', 'unknown'])
export const redeemStatusEnum = pgEnum('redeem_status', ['pending', 'fulfilled', 'cancelled'])
export const pointsReasonEnum = pgEnum('points_reason', ['receipt', 'combo', 'bonus', 'redeem', 'admin'])
export const rewardCodeEnum = pgEnum('reward_code', ['SHOUTOUT', 'BONUS_CLIP', 'STICKERS'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  city: text('city'),
  isPlus: boolean('is_plus').default(false),
  refCode: text('ref_code').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}))

// Partners table
export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  kind: text('kind').notNull(), // 'dispensary' | 'restaurant'
  url: text('url'),
  logoUrl: text('logo_url'),
  matchKeywords: text('match_keywords').array().default([]),
  isFeatured: boolean('is_featured').default(false),
  city: text('city'),
  state: text('state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  featuredIdx: index('idx_partners_featured').on(table.isFeatured),
}))

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  partnerId: uuid('partner_id').references(() => partners.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  bonusPoints: integer('bonus_points').default(0),
  multiplier: numeric('multiplier').default('1.0'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Receipts table
export const receipts = pgTable('receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  blobUrl: text('blob_url').notNull(),
  kind: receiptKindEnum('kind').default('unknown'),
  matchedPartnerId: uuid('matched_partner_id').references(() => partners.id),
  status: receiptStatusEnum('status').default('pending'),
  vendor: text('vendor'),
  totalAmountCents: integer('total_amount_cents'),
  receiptDate: date('receipt_date'),
  imageHash: text('image_hash'),
  denyReason: text('deny_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
}, (table) => ({
  userCreatedIdx: index('idx_receipts_user_created').on(table.userId, table.createdAt),
  statusIdx: index('idx_receipts_status').on(table.status),
  hashIdx: index('idx_receipts_hash').on(table.imageHash),
}))

// Points ledger table
export const pointsLedger = pgTable('points_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  delta: integer('delta').notNull(),
  reason: pointsReasonEnum('reason').notNull(),
  refId: uuid('ref_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userCreatedIdx: index('idx_points_user_created').on(table.userId, table.createdAt),
}))

// Redemptions table
export const redemptions = pgTable('redemptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardCode: rewardCodeEnum('reward_code').notNull(),
  pointsCost: integer('points_cost').notNull(),
  status: redeemStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  fulfilledAt: timestamp('fulfilled_at'),
}, (table) => ({
  userCreatedIdx: index('idx_redemptions_user_created').on(table.userId, table.createdAt),
}))

// Agent events table
export const agentEvents = pgTable('agent_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id').references(() => receipts.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(),
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  receipts: many(receipts),
  pointsLedger: many(pointsLedger),
  redemptions: many(redemptions),
}))

export const partnersRelations = relations(partners, ({ many }) => ({
  campaigns: many(campaigns),
  receipts: many(receipts),
}))

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  partner: one(partners, {
    fields: [campaigns.partnerId],
    references: [partners.id],
  }),
}))

export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  user: one(users, {
    fields: [receipts.userId],
    references: [users.id],
  }),
  partner: one(partners, {
    fields: [receipts.matchedPartnerId],
    references: [partners.id],
  }),
  agentEvents: many(agentEvents),
}))

export const pointsLedgerRelations = relations(pointsLedger, ({ one }) => ({
  user: one(users, {
    fields: [pointsLedger.userId],
    references: [users.id],
  }),
}))

export const redemptionsRelations = relations(redemptions, ({ one }) => ({
  user: one(users, {
    fields: [redemptions.userId],
    references: [users.id],
  }),
}))

export const agentEventsRelations = relations(agentEvents, ({ one }) => ({
  receipt: one(receipts, {
    fields: [agentEvents.receiptId],
    references: [receipts.id],
  }),
}))

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Partner = typeof partners.$inferSelect
export type NewPartner = typeof partners.$inferInsert
export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
export type Receipt = typeof receipts.$inferSelect
export type NewReceipt = typeof receipts.$inferInsert
export type PointsLedgerEntry = typeof pointsLedger.$inferSelect
export type NewPointsLedgerEntry = typeof pointsLedger.$inferInsert
export type Redemption = typeof redemptions.$inferSelect
export type NewRedemption = typeof redemptions.$inferInsert
export type AgentEvent = typeof agentEvents.$inferSelect
export type NewAgentEvent = typeof agentEvents.$inferInsert
