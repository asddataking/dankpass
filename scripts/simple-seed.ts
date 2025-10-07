import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function simpleSeed() {
  try {
    console.log('🌱 Starting simple database seed...');

    // First, let's check what's already in the database
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
    const existingPartners = await sql`SELECT COUNT(*) as count FROM partners`;
    const existingPerks = await sql`SELECT COUNT(*) as count FROM perks`;

    console.log(`📊 Current data:`);
    console.log(`   - Users: ${existingUsers[0].count}`);
    console.log(`   - Partners: ${existingPartners[0].count}`);
    console.log(`   - Perks: ${existingPerks[0].count}`);

    // Only seed if database is empty
    if (existingUsers[0].count > 0) {
      console.log('✅ Database already has data, skipping seed');
      return;
    }

    // Seed basic perks
    await sql`
      INSERT INTO perks (title, description, points_cost, is_premium_only, image_url)
      VALUES 
        ('20% Off Edibles', 'Get 20% off any edible product', 500, false, '/placeholder-perk.jpg'),
        ('Free Coffee', 'Complimentary coffee with any purchase', 300, false, '/placeholder-perk.jpg'),
        ('Free Delivery', 'Free delivery on orders over $50', 200, false, '/placeholder-perk.jpg'),
        ('VIP Lounge Access', 'Exclusive access to premium lounge area', 1000, true, '/placeholder-perk.jpg'),
        ('Free Appetizer', 'Complimentary appetizer with main course', 400, false, '/placeholder-perk.jpg'),
        ('Travel Voucher', '$50 travel voucher for any destination', 2000, true, '/placeholder-perk.jpg')
    `;

    console.log('✅ Basic perks seeded successfully!');
    console.log('🎉 Database is ready for use!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Full error:', error);
  }
}

simpleSeed();
