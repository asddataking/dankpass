import { db } from './db';
import { partners, locations, offers, users, profiles } from './db/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface PartnerWithDetails {
  id: string;
  userId: string;
  businessName: string;
  businessType: 'dispensary' | 'restaurant';
  description: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  locations: Array<{
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: string | null;
    longitude: string | null;
    phone: string | null;
    hours: any;
    isActive: boolean;
  }>;
  offers: Array<{
    id: string;
    title: string;
    description: string | null;
    discountType: string;
    discountValue: string;
    minSpend: string | null;
    maxDiscount: string | null;
    isActive: boolean;
    expiresAt: Date | null;
  }>;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export interface CreatePartnerData {
  userId: string;
  businessName: string;
  businessType: 'dispensary' | 'restaurant';
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface CreateLocationData {
  partnerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  hours?: any;
}

export interface CreateOfferData {
  partnerId: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'points';
  discountValue: string;
  minSpend?: string;
  maxDiscount?: string;
  expiresAt?: Date;
}

/**
 * Create a new partner application
 */
export async function createPartner(data: CreatePartnerData) {
  return await db.insert(partners).values({
    userId: data.userId,
    businessName: data.businessName,
    businessType: data.businessType,
    description: data.description || null,
    phone: data.phone || null,
    email: data.email || null,
    website: data.website || null,
    logo: data.logo || null,
    status: 'pending'
  }).returning();
}

/**
 * Get partner with full details
 */
export async function getPartnerWithDetails(partnerId: string): Promise<PartnerWithDetails | null> {
  const partner = await db
    .select({
      id: partners.id,
      userId: partners.userId,
      businessName: partners.businessName,
      businessType: partners.businessType,
      description: partners.description,
      logo: partners.logo,
      phone: partners.phone,
      email: partners.email,
      website: partners.website,
      status: partners.status,
      createdAt: partners.createdAt,
      updatedAt: partners.updatedAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      userEmail: users.email
    })
    .from(partners)
    .innerJoin(users, eq(partners.userId, users.id))
    .leftJoin(profiles, eq(partners.userId, profiles.userId))
    .where(eq(partners.id, partnerId))
    .limit(1);

  if (!partner[0]) return null;

  const p = partner[0];

  // Get locations
  const partnerLocations = await db
    .select()
    .from(locations)
    .where(eq(locations.partnerId, partnerId));

  // Get offers
  const partnerOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.partnerId, partnerId));

  return {
    id: p.id,
    userId: p.userId,
    businessName: p.businessName,
    businessType: p.businessType,
    description: p.description,
    logo: p.logo,
    phone: p.phone,
    email: p.email,
    website: p.website,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    locations: partnerLocations.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      zipCode: loc.zipCode,
      latitude: loc.latitude,
      longitude: loc.longitude,
      phone: loc.phone,
      hours: loc.hours,
      isActive: loc.isActive
    })),
    offers: partnerOffers.map(offer => ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minSpend: offer.minSpend,
      maxDiscount: offer.maxDiscount,
      isActive: offer.isActive,
      expiresAt: offer.expiresAt
    })),
    user: {
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.userEmail
    }
  };
}

/**
 * Get all pending partners (for admin review)
 */
export async function getPendingPartners(limit: number = 50) {
  const partnersList = await db
    .select({
      id: partners.id,
      userId: partners.userId,
      businessName: partners.businessName,
      businessType: partners.businessType,
      description: partners.description,
      logo: partners.logo,
      phone: partners.phone,
      email: partners.email,
      website: partners.website,
      status: partners.status,
      createdAt: partners.createdAt,
      updatedAt: partners.updatedAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      userEmail: users.email
    })
    .from(partners)
    .innerJoin(users, eq(partners.userId, users.id))
    .leftJoin(profiles, eq(partners.userId, profiles.userId))
    .where(eq(partners.status, 'pending'))
    .orderBy(desc(partners.createdAt))
    .limit(limit);

  return partnersList.map(p => ({
    id: p.id,
    userId: p.userId,
    businessName: p.businessName,
    businessType: p.businessType,
    description: p.description,
    logo: p.logo,
    phone: p.phone,
    email: p.email,
    website: p.website,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    user: {
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.userEmail
    }
  }));
}

/**
 * Get all approved partners
 */
export async function getApprovedPartners(limit: number = 50) {
  const partnersList = await db
    .select({
      id: partners.id,
      userId: partners.userId,
      businessName: partners.businessName,
      businessType: partners.businessType,
      description: partners.description,
      logo: partners.logo,
      phone: partners.phone,
      email: partners.email,
      website: partners.website,
      status: partners.status,
      createdAt: partners.createdAt,
      updatedAt: partners.updatedAt
    })
    .from(partners)
    .where(eq(partners.status, 'approved'))
    .orderBy(desc(partners.createdAt))
    .limit(limit);

  return partnersList;
}

/**
 * Approve a partner
 */
export async function approvePartner(partnerId: string): Promise<boolean> {
  const result = await db
    .update(partners)
    .set({
      status: 'approved',
      updatedAt: new Date()
    })
    .where(eq(partners.id, partnerId));

  return result.rowCount > 0;
}

/**
 * Reject a partner
 */
export async function rejectPartner(partnerId: string): Promise<boolean> {
  const result = await db
    .update(partners)
    .set({
      status: 'rejected',
      updatedAt: new Date()
    })
    .where(eq(partners.id, partnerId));

  return result.rowCount > 0;
}

/**
 * Add location to partner
 */
export async function addLocation(data: CreateLocationData) {
  return await db.insert(locations).values({
    partnerId: data.partnerId,
    name: data.name,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    phone: data.phone || null,
    hours: data.hours || null,
    isActive: true
  }).returning();
}

/**
 * Add offer to partner
 */
export async function addOffer(data: CreateOfferData) {
  return await db.insert(offers).values({
    partnerId: data.partnerId,
    title: data.title,
    description: data.description || null,
    discountType: data.discountType,
    discountValue: data.discountValue,
    minSpend: data.minSpend || null,
    maxDiscount: data.maxDiscount || null,
    expiresAt: data.expiresAt || null,
    isActive: true
  }).returning();
}

/**
 * Get partner statistics
 */
export async function getPartnerStats() {
  const [totalPartners, pendingPartners, approvedPartners, rejectedPartners] = await Promise.all([
    db.select({ count: partners.id }).from(partners),
    db.select({ count: partners.id }).from(partners).where(eq(partners.status, 'pending')),
    db.select({ count: partners.id }).from(partners).where(eq(partners.status, 'approved')),
    db.select({ count: partners.id }).from(partners).where(eq(partners.status, 'rejected'))
  ]);

  return {
    total: totalPartners.length,
    pending: pendingPartners.length,
    approved: approvedPartners.length,
    rejected: rejectedPartners.length
  };
}
