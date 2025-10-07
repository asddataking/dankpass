import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed with SQL...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Seed app config
    console.log('📝 Seeding app config...');
    await sql`
      INSERT INTO app_config (key, value) VALUES 
      ('POINTS_BASE', '1'),
      ('POINTS_PREMIUM', '1.5'),
      ('POINTS_INNETWORK', '2'),
      ('DAILY_CAP', '2000')
      ON CONFLICT (key) DO NOTHING
    `;
    
    // Seed perks
    console.log('🎁 Seeding perks...');
    await sql`
      INSERT INTO perks (title, description, points_cost, is_premium_only, image_url) VALUES 
      ('20% Off Edibles', 'Get 20% off any edible product', 500, false, '/placeholder-perk.jpg'),
      ('Free Coffee', 'Complimentary coffee with any purchase', 300, false, '/placeholder-perk.jpg'),
      ('Free Delivery', 'Free delivery on orders over $50', 200, false, '/placeholder-perk.jpg'),
      ('VIP Lounge Access', 'Exclusive access to premium lounge area', 1000, true, '/placeholder-perk.jpg'),
      ('Free Appetizer', 'Complimentary appetizer with main course', 400, false, '/placeholder-perk.jpg'),
      ('Travel Voucher', '$50 travel voucher for any destination', 2000, true, '/placeholder-perk.jpg')
      ON CONFLICT DO NOTHING
    `;
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
