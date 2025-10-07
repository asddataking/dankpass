import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as dotenv from 'dotenv';
import * as schema from './db/schema';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const { 
  users, 
  profiles, 
  memberships, 
  partners, 
  locations, 
  offers, 
  perks, 
  appConfig 
} = schema;

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Seed app config
    await db.insert(appConfig).values([
      { key: 'POINTS_BASE', value: '1' },
      { key: 'POINTS_PREMIUM', value: '1.5' },
      { key: 'POINTS_INNETWORK', value: '2' },
      { key: 'DAILY_CAP', value: '2000' },
    ]).onConflictDoNothing();

    // Seed perks
    await db.insert(perks).values([
      {
        title: '20% Off Edibles',
        description: 'Get 20% off any edible product',
        pointsCost: 500,
        isPremiumOnly: false,
        imageUrl: '/placeholder-perk.jpg'
      },
      {
        title: 'Free Coffee',
        description: 'Complimentary coffee with any purchase',
        pointsCost: 300,
        isPremiumOnly: false,
        imageUrl: '/placeholder-perk.jpg'
      },
      {
        title: 'Free Delivery',
        description: 'Free delivery on orders over $50',
        pointsCost: 200,
        isPremiumOnly: false,
        imageUrl: '/placeholder-perk.jpg'
      },
      {
        title: 'VIP Lounge Access',
        description: 'Exclusive access to premium lounge area',
        pointsCost: 1000,
        isPremiumOnly: true,
        imageUrl: '/placeholder-perk.jpg'
      },
      {
        title: 'Free Appetizer',
        description: 'Complimentary appetizer with main course',
        pointsCost: 400,
        isPremiumOnly: false,
        imageUrl: '/placeholder-perk.jpg'
      },
      {
        title: 'Travel Voucher',
        description: '$50 travel voucher for any destination',
        pointsCost: 2000,
        isPremiumOnly: true,
        imageUrl: '/placeholder-perk.jpg'
      }
    ]).onConflictDoNothing();

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
