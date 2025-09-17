import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// Passport schemas
export const passportSchema = z.object({
  title: z.string().default('DankPass'),
});

// Entry schemas
export const entryTypeSchema = z.enum(['STRAIN', 'ACTIVITY', 'LODGING']);

export const passportEntrySchema = z.object({
  entryType: entryTypeSchema,
  strainId: z.string().optional(),
  activityId: z.string().optional(),
  lodgingId: z.string().optional(),
});

// Strain schemas
export const strainSchema = z.object({
  name: z.string().min(1),
  lineage: z.string().optional(),
  terpenes: z.string().optional(),
  notes: z.string().optional(),
});

// Activity schemas
export const activitySchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  details: z.string().optional(),
});

// Lodging schemas
export const lodgingSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  details: z.string().optional(),
});

// Note schemas
export const noteSchema = z.object({
  content: z.string().min(1),
  strainId: z.string().optional(),
  activityId: z.string().optional(),
  lodgingId: z.string().optional(),
});

// Scan schemas
export const scanSchema = z.object({
  qrCode: z.string().min(1),
});

// Membership schemas
export const membershipSchema = z.object({
  tier: z.enum(['Free', 'Premium', 'Connoisseur']),
  expiresAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Passport = z.infer<typeof passportSchema>;
export type PassportEntry = z.infer<typeof passportEntrySchema>;
export type EntryType = z.infer<typeof entryTypeSchema>;
export type Strain = z.infer<typeof strainSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Lodging = z.infer<typeof lodgingSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Scan = z.infer<typeof scanSchema>;
export type Membership = z.infer<typeof membershipSchema>;
