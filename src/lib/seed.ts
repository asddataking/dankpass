import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as dotenv from 'dotenv';
import * as schema from './db/schema';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const { 
  users, 
  profiles, 
  memberships, 
  partners, 
  locations, 
  offers, 
  perks, 
  appConfig,
  receipts,
  pointsLedger
} = schema;

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data (optional - comment out if you want to preserve data)
    // await db.delete(receipts);
    // await db.delete(pointsLedger);
    // await db.delete(offers);
    // await db.delete(locations);
    // await db.delete(partners);
    // await db.delete(memberships);
    // await db.delete(profiles);
    // await db.delete(users);
    // await db.delete(perks);
    // await db.delete(appConfig);

    // Seed app config
    await db.insert(appConfig).values([
      { key: 'POINTS_BASE', value: '1' },
      { key: 'POINTS_PREMIUM', value: '1.5' },
      { key: 'POINTS_INNETWORK', value: '2' },
      { key: 'DAILY_CAP', value: '2000' },
    ]).onConflictDoNothing();

    // Seed sample users
    const sampleUsers = await db.insert(users).values([
      {
        email: 'john.doe@example.com',
        role: 'user'
      },
      {
        email: 'jane.smith@example.com',
        role: 'user'
      },
      {
        email: 'admin@dankpass.com',
        role: 'admin'
      },
      {
        email: 'dispensary@greenvalley.com',
        role: 'partner_dispensary'
      },
      {
        email: 'restaurant@pizzapalace.com',
        role: 'partner_restaurant'
      }
    ]).returning();

    // Seed user profiles
    await db.insert(profiles).values([
      {
        userId: sampleUsers[0].id,
        firstName: 'John',
        lastName: 'Doe',
        city: 'San Francisco',
        state: 'CA',
        phone: '+1 (555) 123-4567'
      },
      {
        userId: sampleUsers[1].id,
        firstName: 'Jane',
        lastName: 'Smith',
        city: 'Los Angeles',
        state: 'CA',
        phone: '+1 (555) 987-6543'
      },
      {
        userId: sampleUsers[2].id,
        firstName: 'Admin',
        lastName: 'User',
        city: 'San Francisco',
        state: 'CA'
      },
      {
        userId: sampleUsers[3].id,
        firstName: 'Mike',
        lastName: 'Johnson',
        city: 'San Francisco',
        state: 'CA',
        phone: '+1 (555) 456-7890'
      },
      {
        userId: sampleUsers[4].id,
        firstName: 'Sarah',
        lastName: 'Williams',
        city: 'Los Angeles',
        state: 'CA',
        phone: '+1 (555) 321-0987'
      }
    ]).onConflictDoNothing();

    // Seed memberships
    await db.insert(memberships).values([
      {
        userId: sampleUsers[0].id,
        tier: 'premium'
      },
      {
        userId: sampleUsers[1].id,
        tier: 'free'
      },
      {
        userId: sampleUsers[2].id,
        tier: 'premium'
      }
    ]).onConflictDoNothing();

    // Seed partners
    const samplePartners = await db.insert(partners).values([
      {
        userId: sampleUsers[3].id,
        businessName: 'Green Valley Dispensary',
        businessType: 'dispensary',
        description: 'Premium cannabis dispensary serving the Bay Area',
        phone: '+1 (555) 456-7890',
        email: 'info@greenvalley.com',
        website: 'https://greenvalley.com',
        status: 'approved'
      },
      {
        userId: sampleUsers[4].id,
        businessName: 'Pizza Palace',
        businessType: 'restaurant',
        description: 'Authentic Italian pizza and pasta',
        phone: '+1 (555) 321-0987',
        email: 'orders@pizzapalace.com',
        website: 'https://pizzapalace.com',
        status: 'approved'
      },
      {
        userId: sampleUsers[3].id,
        businessName: 'Cannabis Corner',
        businessType: 'dispensary',
        description: 'Family-owned dispensary with premium products',
        phone: '+1 (555) 654-3210',
        email: 'hello@cannabiscorner.com',
        status: 'pending'
      }
    ]).returning();

    // Seed locations
    await db.insert(locations).values([
      {
        partnerId: samplePartners[0].id,
        name: 'Green Valley - Mission District',
        address: '1234 Mission St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        latitude: '37.7749',
        longitude: '-122.4194',
        phone: '+1 (555) 456-7890',
        hours: {
          monday: '9:00 AM - 10:00 PM',
          tuesday: '9:00 AM - 10:00 PM',
          wednesday: '9:00 AM - 10:00 PM',
          thursday: '9:00 AM - 10:00 PM',
          friday: '9:00 AM - 11:00 PM',
          saturday: '9:00 AM - 11:00 PM',
          sunday: '10:00 AM - 9:00 PM'
        }
      },
      {
        partnerId: samplePartners[1].id,
        name: 'Pizza Palace - Downtown',
        address: '5678 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90013',
        latitude: '34.0522',
        longitude: '-118.2437',
        phone: '+1 (555) 321-0987',
        hours: {
          monday: '11:00 AM - 11:00 PM',
          tuesday: '11:00 AM - 11:00 PM',
          wednesday: '11:00 AM - 11:00 PM',
          thursday: '11:00 AM - 11:00 PM',
          friday: '11:00 AM - 12:00 AM',
          saturday: '11:00 AM - 12:00 AM',
          sunday: '12:00 PM - 10:00 PM'
        }
      }
    ]).onConflictDoNothing();

    // Seed offers
    await db.insert(offers).values([
      {
        partnerId: samplePartners[0].id,
        title: '20% Off Edibles',
        description: 'Get 20% off any edible product',
        discountType: 'percentage',
        discountValue: '20.00',
        minSpend: '25.00',
        maxDiscount: '50.00'
      },
      {
        partnerId: samplePartners[0].id,
        title: 'Free Pre-Roll',
        description: 'Free pre-roll with purchase over $50',
        discountType: 'fixed',
        discountValue: '10.00',
        minSpend: '50.00'
      },
      {
        partnerId: samplePartners[1].id,
        title: 'Free Appetizer',
        description: 'Free appetizer with main course',
        discountType: 'fixed',
        discountValue: '15.00',
        minSpend: '30.00'
      },
      {
        partnerId: samplePartners[1].id,
        title: 'Free Delivery',
        description: 'Free delivery on orders over $50',
        discountType: 'fixed',
        discountValue: '8.00',
        minSpend: '50.00'
      }
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

    // Seed sample receipts
    const sampleReceipts = await db.insert(receipts).values([
      {
        userId: sampleUsers[0].id,
        partnerId: samplePartners[0].id,
        imageUrl: '/placeholder-receipt.jpg',
        subtotal: '42.50',
        total: '45.00',
        status: 'approved',
        pointsAwarded: 90
      },
      {
        userId: sampleUsers[1].id,
        partnerId: samplePartners[1].id,
        imageUrl: '/placeholder-receipt.jpg',
        subtotal: '25.00',
        total: '28.50',
        status: 'pending',
        pointsAwarded: 0
      },
      {
        userId: sampleUsers[0].id,
        partnerId: samplePartners[0].id,
        imageUrl: '/placeholder-receipt.jpg',
        subtotal: '65.00',
        total: '67.25',
        status: 'approved',
        pointsAwarded: 134
      }
    ]).returning();

    // Seed points ledger
    await db.insert(pointsLedger).values([
      {
        userId: sampleUsers[0].id,
        receiptId: sampleReceipts[0].id,
        points: 90,
        type: 'earned',
        description: 'Receipt upload - Green Valley Dispensary'
      },
      {
        userId: sampleUsers[0].id,
        receiptId: sampleReceipts[2].id,
        points: 134,
        type: 'earned',
        description: 'Receipt upload - Green Valley Dispensary'
      },
      {
        userId: sampleUsers[0].id,
        points: 500,
        type: 'bonus',
        description: 'Welcome bonus'
      },
      {
        userId: sampleUsers[1].id,
        points: 500,
        type: 'bonus',
        description: 'Welcome bonus'
      }
    ]).onConflictDoNothing();

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Seeded ${sampleUsers.length} users, ${samplePartners.length} partners, and sample data`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
