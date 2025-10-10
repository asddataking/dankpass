import { db } from './db/read-replica';
import { receipts, partners, pointsLedger, users, profiles } from './db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { calculatePoints, awardPoints } from './points';

export interface ReceiptData {
  userId: string;
  imageUrl: string;
  total?: number;
  subtotal?: number;
  partnerId?: string;
}

export interface ProcessedReceipt {
  id: string;
  userId: string;
  partnerId?: string;
  imageUrl: string;
  total?: number;
  subtotal?: number;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  createdAt: Date;
  partner?: {
    businessName: string;
    businessType: string;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

/**
 * Create a new receipt
 */
export async function createReceipt(data: ReceiptData): Promise<ProcessedReceipt> {
  const receipt = await db.insert(receipts).values({
    userId: data.userId,
    imageUrl: data.imageUrl,
    total: data.total?.toString(),
    subtotal: data.subtotal?.toString(),
    partnerId: data.partnerId,
    status: 'pending',
    pointsAwarded: 0
  }).returning();

  const receiptWithDetails = await getReceiptWithDetails(receipt[0].id);
  if (!receiptWithDetails) {
    throw new Error('Failed to retrieve created receipt');
  }
  return receiptWithDetails;
}

/**
 * Get receipt with user and partner details
 */
export async function getReceiptWithDetails(receiptId: string): Promise<ProcessedReceipt | null> {
  const receipt = await db
    .select({
      id: receipts.id,
      userId: receipts.userId,
      partnerId: receipts.partnerId,
      imageUrl: receipts.imageUrl,
      total: receipts.total,
      subtotal: receipts.subtotal,
      status: receipts.status,
      pointsAwarded: receipts.pointsAwarded,
      createdAt: receipts.createdAt,
      businessName: partners.businessName,
      businessType: partners.businessType,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      email: users.email
    })
    .from(receipts)
    .leftJoin(partners, eq(receipts.partnerId, partners.id))
    .leftJoin(users, eq(receipts.userId, users.id))
    .leftJoin(profiles, eq(receipts.userId, profiles.userId))
    .where(eq(receipts.id, receiptId))
    .limit(1);

  if (!receipt[0]) return null;

  const r = receipt[0];
  return {
    id: r.id,
    userId: r.userId,
    partnerId: r.partnerId ?? undefined,
    imageUrl: r.imageUrl,
    total: r.total ? parseFloat(r.total) : undefined,
    subtotal: r.subtotal ? parseFloat(r.subtotal) : undefined,
    status: r.status,
    pointsAwarded: r.pointsAwarded ?? 0,
    createdAt: r.createdAt,
    partner: (r.businessName && r.businessType) ? {
      businessName: r.businessName,
      businessType: r.businessType
    } : undefined,
    user: r.email ? {
      firstName: r.firstName ?? undefined,
      lastName: r.lastName ?? undefined,
      email: r.email
    } : undefined
  };
}

/**
 * Get all receipts for a user
 */
export async function getUserReceipts(userId: string, limit: number = 50): Promise<ProcessedReceipt[]> {
  const receiptsList = await db
    .select({
      id: receipts.id,
      userId: receipts.userId,
      partnerId: receipts.partnerId,
      imageUrl: receipts.imageUrl,
      total: receipts.total,
      subtotal: receipts.subtotal,
      status: receipts.status,
      pointsAwarded: receipts.pointsAwarded,
      createdAt: receipts.createdAt,
      businessName: partners.businessName,
      businessType: partners.businessType
    })
    .from(receipts)
    .leftJoin(partners, eq(receipts.partnerId, partners.id))
    .where(eq(receipts.userId, userId))
    .orderBy(desc(receipts.createdAt))
    .limit(limit);

  return receiptsList.map(r => ({
    id: r.id,
    userId: r.userId,
    partnerId: r.partnerId ?? undefined,
    imageUrl: r.imageUrl,
    total: r.total ? parseFloat(r.total) : undefined,
    subtotal: r.subtotal ? parseFloat(r.subtotal) : undefined,
    status: r.status,
    pointsAwarded: r.pointsAwarded ?? 0,
    createdAt: r.createdAt,
    partner: (r.businessName && r.businessType) ? {
      businessName: r.businessName,
      businessType: r.businessType
    } : undefined
  }));
}

/**
 * Get all pending receipts (for admin review)
 */
export async function getPendingReceipts(limit: number = 50): Promise<ProcessedReceipt[]> {
  const receiptsList = await db
    .select({
      id: receipts.id,
      userId: receipts.userId,
      partnerId: receipts.partnerId,
      imageUrl: receipts.imageUrl,
      total: receipts.total,
      subtotal: receipts.subtotal,
      status: receipts.status,
      pointsAwarded: receipts.pointsAwarded,
      createdAt: receipts.createdAt,
      businessName: partners.businessName,
      businessType: partners.businessType,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      email: users.email
    })
    .from(receipts)
    .leftJoin(partners, eq(receipts.partnerId, partners.id))
    .leftJoin(users, eq(receipts.userId, users.id))
    .leftJoin(profiles, eq(receipts.userId, profiles.userId))
    .where(eq(receipts.status, 'pending'))
    .orderBy(desc(receipts.createdAt))
    .limit(limit);

  return receiptsList.map(r => ({
    id: r.id,
    userId: r.userId,
    partnerId: r.partnerId ?? undefined,
    imageUrl: r.imageUrl,
    total: r.total ? parseFloat(r.total) : undefined,
    subtotal: r.subtotal ? parseFloat(r.subtotal) : undefined,
    status: r.status,
    pointsAwarded: r.pointsAwarded ?? 0,
    createdAt: r.createdAt,
    partner: (r.businessName && r.businessType) ? {
      businessName: r.businessName,
      businessType: r.businessType
    } : undefined,
    user: r.email ? {
      firstName: r.firstName ?? undefined,
      lastName: r.lastName ?? undefined,
      email: r.email
    } : undefined
  }));
}

/**
 * Approve a receipt and award points
 */
export async function approveReceipt(receiptId: string, adminNotes?: string): Promise<ProcessedReceipt | null> {
  // Get the receipt
  const receipt = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, receiptId))
    .limit(1);

  if (!receipt[0] || receipt[0].status !== 'pending') {
    return null;
  }

  const r = receipt[0];
  
  // Calculate points if we have total amount
  let pointsToAward = 0;
  if (r.total) {
    const totalAmount = parseFloat(r.total);
    const calculation = await calculatePoints(r.userId, totalAmount, r.partnerId || undefined);
    pointsToAward = calculation.totalPoints;
  }

  // Update receipt status and points
  await db
    .update(receipts)
    .set({
      status: 'approved',
      pointsAwarded: pointsToAward,
      adminNotes: adminNotes || null,
      updatedAt: new Date()
    })
    .where(eq(receipts.id, receiptId));

  // Award points to user
  if (pointsToAward > 0) {
    await awardPoints(
      r.userId,
      pointsToAward,
      'earned',
      `Receipt approved - ${pointsToAward} points awarded`,
      receiptId
    );
  }

  return await getReceiptWithDetails(receiptId);
}

/**
 * Reject a receipt
 */
export async function rejectReceipt(receiptId: string, adminNotes?: string): Promise<boolean> {
  const result = await db
    .update(receipts)
    .set({
      status: 'rejected',
      adminNotes: adminNotes || null,
      updatedAt: new Date()
    })
    .where(eq(receipts.id, receiptId));

  return result.rowCount > 0;
}

/**
 * Get receipt statistics
 */
export async function getReceiptStats() {
  const [totalReceipts, pendingReceipts, approvedReceipts, rejectedReceipts] = await Promise.all([
    db.select({ count: receipts.id }).from(receipts),
    db.select({ count: receipts.id }).from(receipts).where(eq(receipts.status, 'pending')),
    db.select({ count: receipts.id }).from(receipts).where(eq(receipts.status, 'approved')),
    db.select({ count: receipts.id }).from(receipts).where(eq(receipts.status, 'rejected'))
  ]);

  return {
    total: totalReceipts.length,
    pending: pendingReceipts.length,
    approved: approvedReceipts.length,
    rejected: rejectedReceipts.length
  };
}
