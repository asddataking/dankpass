import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, and, gte, desc, sql } from 'drizzle-orm'
import * as schema from './schema'

// Initialize Neon client - prioritize DATABASE_URL for standard compatibility
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
if (!databaseUrl) {
  throw new Error('No database connection string provided. Please set DATABASE_URL or NEON_DATABASE_URL environment variable.')
}

const sqlClient = neon(databaseUrl)
export const db = drizzle(sqlClient, { schema })

// Re-export schema types for convenience
export type {
  User,
  NewUser,
  Partner,
  NewPartner,
  Campaign,
  NewCampaign,
  Receipt,
  NewReceipt,
  PointsLedgerEntry,
  NewPointsLedgerEntry,
  Redemption,
  NewRedemption,
  AgentEvent,
  NewAgentEvent,
} from './schema'

// --- User Operations ---

export async function getUserByEmail(email: string): Promise<schema.User | null> {
  try {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export async function createUser(email: string, displayName?: string): Promise<schema.User | null> {
  try {
    const newUser: schema.NewUser = {
      email,
      displayName,
    }
    const result = await db.insert(schema.users).values(newUser).returning()
    return result[0] || null
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function getUserOrCreateByEmail(email: string, displayName?: string): Promise<schema.User | null> {
  let user = await getUserByEmail(email)
  if (!user) {
    user = await createUser(email, displayName)
  }
  return user
}

export async function getUserById(userId: string): Promise<schema.User | null> {
  try {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return null
  }
}

// --- Receipt Operations ---

export async function createReceipt(userId: string, blobUrl: string, imageHash?: string): Promise<schema.Receipt | null> {
  try {
    const newReceipt: schema.NewReceipt = {
      userId,
      blobUrl,
      imageHash,
      status: 'pending',
    }
    const result = await db.insert(schema.receipts).values(newReceipt).returning()
    return result[0] || null
  } catch (error) {
    console.error('Error creating receipt:', error)
    return null
  }
}

export async function getPendingReceipts(limit: number = 10): Promise<schema.Receipt[]> {
  try {
    const result = await db.select()
      .from(schema.receipts)
      .where(eq(schema.receipts.status, 'pending'))
      .orderBy(schema.receipts.createdAt)
      .limit(limit)
    return result
  } catch (error) {
    console.error('Error fetching pending receipts:', error)
    return []
  }
}

export async function updateReceipt(
  receiptId: string,
  updates: Partial<Pick<schema.Receipt, 'status' | 'kind' | 'vendor' | 'totalAmountCents' | 'receiptDate' | 'matchedPartnerId' | 'denyReason' | 'approvedAt'>>
): Promise<boolean> {
  try {
    await db.update(schema.receipts)
      .set(updates)
      .where(eq(schema.receipts.id, receiptId))
    return true
  } catch (error) {
    console.error('Error updating receipt:', error)
    return false
  }
}

export async function getUserReceipts(userId: string, limit: number = 10): Promise<schema.Receipt[]> {
  try {
    const result = await db.select()
      .from(schema.receipts)
      .where(eq(schema.receipts.userId, userId))
      .orderBy(desc(schema.receipts.createdAt))
      .limit(limit)
    return result
  } catch (error) {
    console.error('Error fetching user receipts:', error)
    return []
  }
}

export async function getReceiptById(receiptId: string): Promise<schema.Receipt | null> {
  try {
    const result = await db.select().from(schema.receipts).where(eq(schema.receipts.id, receiptId)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching receipt by ID:', error)
    return null
  }
}

// --- Points Operations ---

export async function addPoints(userId: string, delta: number, reason: schema.NewPointsLedgerEntry['reason'], refId?: string): Promise<boolean> {
  try {
    const newEntry: schema.NewPointsLedgerEntry = {
      userId,
      delta,
      reason,
      refId,
    }
    await db.insert(schema.pointsLedger).values(newEntry)
    return true
  } catch (error) {
    console.error('Error adding points:', error)
    return false
  }
}

export async function getUserPointsTotal(userId: string): Promise<number> {
  try {
    const result = await db.select({
      total: sql<number>`sum(${schema.pointsLedger.delta})`,
    })
      .from(schema.pointsLedger)
      .where(eq(schema.pointsLedger.userId, userId))
    
    return result[0]?.total || 0
  } catch (error) {
    console.error('Error fetching user points total:', error)
    return 0
  }
}

export async function getUserPointsBreakdown(userId: string): Promise<schema.PointsLedgerEntry[]> {
  try {
    const result = await db.select()
      .from(schema.pointsLedger)
      .where(eq(schema.pointsLedger.userId, userId))
      .orderBy(desc(schema.pointsLedger.createdAt))
    return result
  } catch (error) {
    console.error('Error fetching points breakdown:', error)
    return []
  }
}

export async function getUserPointsByReason(userId: string): Promise<{ kind: string; points: number }[]> {
  try {
    const result = await db.select({
      kind: schema.receipts.kind,
      points: sql<number>`sum(${schema.pointsLedger.delta})`,
    })
      .from(schema.pointsLedger)
      .leftJoin(schema.receipts, eq(schema.pointsLedger.refId, schema.receipts.id))
      .where(and(eq(schema.pointsLedger.userId, userId), eq(schema.pointsLedger.reason, 'receipt')))
      .groupBy(schema.receipts.kind)

    return result.map(row => ({
      kind: row.kind || 'unknown',
      points: row.points || 0,
    }))
  } catch (error) {
    console.error('Error fetching user points by reason:', error)
    return []
  }
}

// --- Partner Operations ---

export async function getFeaturedPartners(): Promise<schema.Partner[]> {
  try {
    const result = await db.select()
      .from(schema.partners)
      .where(eq(schema.partners.isFeatured, true))
      .orderBy(desc(schema.partners.createdAt))
    return result
  } catch (error) {
    console.error('Error fetching featured partners:', error)
    return []
  }
}

export async function getAllPartners(): Promise<schema.Partner[]> {
  try {
    const result = await db.select()
      .from(schema.partners)
      .orderBy(desc(schema.partners.createdAt))
    return result
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export async function getPartnerById(partnerId: string): Promise<schema.Partner | null> {
  try {
    const result = await db.select().from(schema.partners).where(eq(schema.partners.id, partnerId)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching partner by ID:', error)
    return null
  }
}

export async function getPartnerByKeyword(keyword: string): Promise<schema.Partner | null> {
  try {
    const result = await db.select()
      .from(schema.partners)
      .where(sql`${keyword} = ANY(${schema.partners.matchKeywords})`)
      .limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching partner by keyword:', error)
    return null
  }
}

// --- Redemption Operations ---

export async function createRedemption(userId: string, rewardCode: schema.NewRedemption['rewardCode'], pointsCost: number): Promise<schema.Redemption | null> {
  try {
    const newRedemption: schema.NewRedemption = {
      userId,
      rewardCode,
      pointsCost,
      status: 'pending',
    }
    const result = await db.insert(schema.redemptions).values(newRedemption).returning()
    return result[0] || null
  } catch (error) {
    console.error('Error creating redemption:', error)
    return null
  }
}

export async function getUserRedemptions(userId: string, limit: number = 10): Promise<schema.Redemption[]> {
  try {
    const result = await db.select()
      .from(schema.redemptions)
      .where(eq(schema.redemptions.userId, userId))
      .orderBy(desc(schema.redemptions.createdAt))
      .limit(limit)
    return result
  } catch (error) {
    console.error('Error fetching user redemptions:', error)
    return []
  }
}

export async function getPendingRedemptions(): Promise<schema.Redemption[]> {
  try {
    const result = await db.select()
      .from(schema.redemptions)
      .where(eq(schema.redemptions.status, 'pending'))
      .orderBy(desc(schema.redemptions.createdAt))
    return result
  } catch (error) {
    console.error('Error fetching pending redemptions:', error)
    return []
  }
}

export async function updateRedemptionStatus(redemptionId: string, status: schema.Redemption['status']): Promise<boolean> {
  try {
    await db.update(schema.redemptions)
      .set({
        status,
        fulfilledAt: status === 'fulfilled' ? new Date() : null,
      })
      .where(eq(schema.redemptions.id, redemptionId))
    return true
  } catch (error) {
    console.error('Error updating redemption status:', error)
    return false
  }
}

// --- Agent Events ---

export async function createAgentEvent(receiptId: string, eventType: string, details: Record<string, unknown>): Promise<boolean> {
  try {
    const newEvent: schema.NewAgentEvent = {
      receiptId,
      eventType,
      details,
    }
    await db.insert(schema.agentEvents).values(newEvent)
    return true
  } catch (error) {
    console.error('Error creating agent event:', error)
    return false
  }
}

export async function getAgentEvents(receiptId?: string, limit: number = 50): Promise<schema.AgentEvent[]> {
  try {
    let result;
    
    if (receiptId) {
      result = await db.select().from(schema.agentEvents)
        .where(eq(schema.agentEvents.receiptId, receiptId))
        .orderBy(desc(schema.agentEvents.createdAt))
        .limit(limit);
    } else {
      result = await db.select().from(schema.agentEvents)
        .orderBy(desc(schema.agentEvents.createdAt))
        .limit(limit);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching agent events:', error);
    return [];
  }
}

// --- Campaign Operations ---

export async function getActiveCampaigns(): Promise<schema.Campaign[]> {
  try {
    const now = new Date()
    const result = await db.select()
      .from(schema.campaigns)
      .where(and(
        eq(schema.campaigns.isActive, true),
        sql`${schema.campaigns.startsAt} <= ${now}`,
        sql`${schema.campaigns.endsAt} >= ${now}`
      ))
    return result
  } catch (error) {
    console.error('Error fetching active campaigns:', error)
    return []
  }
}

export async function getCampaignByPartner(partnerId: string): Promise<schema.Campaign | null> {
  try {
    const result = await db.select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.partnerId, partnerId))
      .limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching campaign by partner:', error)
    return null
  }
}

// --- Utility Functions ---

export async function checkDuplicateReceipt(imageHash: string): Promise<boolean> {
  try {
    const result = await db.select()
      .from(schema.receipts)
      .where(eq(schema.receipts.imageHash, imageHash))
      .limit(1)
    return result.length > 0
  } catch (error) {
    console.error('Error checking duplicate receipt:', error)
    return false
  }
}

export async function getComboEligibleReceipts(userId: string, hours: number = 48): Promise<schema.Receipt[]> {
  try {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000)
    const result = await db.select()
      .from(schema.receipts)
      .where(and(
        eq(schema.receipts.userId, userId),
        eq(schema.receipts.status, 'approved'),
        gte(schema.receipts.createdAt, cutoffTime)
      ))
      .orderBy(desc(schema.receipts.createdAt))
    return result
  } catch (error) {
    console.error('Error fetching combo eligible receipts:', error)
    return []
  }
}
