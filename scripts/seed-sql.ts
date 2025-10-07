import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed with SQL...');

    // Clear existing data (optional - uncomment if you want to reset)
    // await sql`DELETE FROM points_ledger`;
    // await sql`DELETE FROM receipts`;
    // await sql`DELETE FROM redemptions`;
    // await sql`DELETE FROM offers`;
    // await sql`DELETE FROM locations`;
    // await sql`DELETE FROM partners`;
    // await sql`DELETE FROM memberships`;
    // await sql`DELETE FROM profiles`;
    // await sql`DELETE FROM users`;
    // await sql`DELETE FROM perks`;
    // await sql`DELETE FROM app_config`;

    // Seed app config
    await sql`
      INSERT INTO app_config (key, value) 
      VALUES 
        ('POINTS_BASE', '1'),
        ('POINTS_PREMIUM', '1.5'),
        ('POINTS_INNETWORK', '2'),
        ('DAILY_CAP', '2000')
      ON CONFLICT (key) DO NOTHING
    `;

    // Seed sample users
    const users = await sql`
      INSERT INTO users (email, role) 
      VALUES 
        ('john.doe@example.com', 'user'),
        ('jane.smith@example.com', 'user'),
        ('admin@dankpass.com', 'admin'),
        ('dispensary@greenvalley.com', 'partner_dispensary'),
        ('restaurant@pizzapalace.com', 'partner_restaurant')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `;

    console.log(`📊 Inserted ${users.length} users`);

    // Seed user profiles
    await sql`
      INSERT INTO profiles (user_id, first_name, last_name, city, state, phone)
      SELECT 
        u.id,
        CASE 
          WHEN u.email = 'john.doe@example.com' THEN 'John'
          WHEN u.email = 'jane.smith@example.com' THEN 'Jane'
          WHEN u.email = 'admin@dankpass.com' THEN 'Admin'
          WHEN u.email = 'dispensary@greenvalley.com' THEN 'Mike'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN 'Sarah'
        END as first_name,
        CASE 
          WHEN u.email = 'john.doe@example.com' THEN 'Doe'
          WHEN u.email = 'jane.smith@example.com' THEN 'Smith'
          WHEN u.email = 'admin@dankpass.com' THEN 'User'
          WHEN u.email = 'dispensary@greenvalley.com' THEN 'Johnson'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN 'Williams'
        END as last_name,
        CASE 
          WHEN u.email IN ('john.doe@example.com', 'admin@dankpass.com', 'dispensary@greenvalley.com') THEN 'San Francisco'
          ELSE 'Los Angeles'
        END as city,
        'CA' as state,
        CASE 
          WHEN u.email = 'john.doe@example.com' THEN '+1 (555) 123-4567'
          WHEN u.email = 'jane.smith@example.com' THEN '+1 (555) 987-6543'
          WHEN u.email = 'dispensary@greenvalley.com' THEN '+1 (555) 456-7890'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN '+1 (555) 321-0987'
        END as phone
      FROM users u
      ON CONFLICT (user_id) DO NOTHING
    `;

    // Seed memberships
    await sql`
      INSERT INTO memberships (user_id, tier)
      SELECT id, 
        CASE 
          WHEN email IN ('john.doe@example.com', 'admin@dankpass.com') THEN 'premium'
          ELSE 'free'
        END as tier
      FROM users
      ON CONFLICT (user_id) DO NOTHING
    `;

    // Seed partners
    const partners = await sql`
      INSERT INTO partners (user_id, business_name, business_type, description, phone, email, website, status)
      SELECT 
        u.id,
        CASE 
          WHEN u.email = 'dispensary@greenvalley.com' THEN 'Green Valley Dispensary'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN 'Pizza Palace'
        END as business_name,
        CASE 
          WHEN u.email = 'dispensary@greenvalley.com' THEN 'dispensary'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN 'restaurant'
        END as business_type,
        CASE 
          WHEN u.email = 'dispensary@greenvalley.com' THEN 'Premium cannabis dispensary serving the Bay Area'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN 'Authentic Italian pizza and pasta'
        END as description,
        CASE 
          WHEN u.email = 'dispensary@greenvalley.com' THEN '+1 (555) 456-7890'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN '+1 (555) 321-0987'
        END as phone,
        u.email,
        CASE 
          WHEN u.email = 'dispensary@greenvalley.com' THEN 'https://greenvalley.com'
          WHEN u.email = 'restaurant@pizzapalace.com' THEN 'https://pizzapalace.com'
        END as website,
        'approved' as status
      FROM users u
      WHERE u.email IN ('dispensary@greenvalley.com', 'restaurant@pizzapalace.com')
      ON CONFLICT (user_id) DO NOTHING
      RETURNING id, business_name
    `;

    console.log(`🏪 Inserted ${partners.length} partners`);

    // Seed locations
    await sql`
      INSERT INTO locations (partner_id, name, address, city, state, zip_code, latitude, longitude, phone, hours)
      SELECT 
        p.id,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN 'Green Valley - Mission District'
          WHEN p.business_name = 'Pizza Palace' THEN 'Pizza Palace - Downtown'
        END as name,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN '1234 Mission St'
          WHEN p.business_name = 'Pizza Palace' THEN '5678 Main St'
        END as address,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN 'San Francisco'
          WHEN p.business_name = 'Pizza Palace' THEN 'Los Angeles'
        END as city,
        'CA' as state,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN '94103'
          WHEN p.business_name = 'Pizza Palace' THEN '90013'
        END as zip_code,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN '37.7749'
          WHEN p.business_name = 'Pizza Palace' THEN '34.0522'
        END as latitude,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN '-122.4194'
          WHEN p.business_name = 'Pizza Palace' THEN '-118.2437'
        END as longitude,
        p.phone,
        '{"monday": "9:00 AM - 10:00 PM", "tuesday": "9:00 AM - 10:00 PM", "wednesday": "9:00 AM - 10:00 PM", "thursday": "9:00 AM - 10:00 PM", "friday": "9:00 AM - 11:00 PM", "saturday": "9:00 AM - 11:00 PM", "sunday": "10:00 AM - 9:00 PM"}'::json
      FROM partners p
      ON CONFLICT (partner_id) DO NOTHING
    `;

    // Seed offers
    await sql`
      INSERT INTO offers (partner_id, title, description, discount_type, discount_value, min_spend, max_discount)
      SELECT 
        p.id,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN '20% Off Edibles'
          WHEN p.business_name = 'Pizza Palace' THEN 'Free Appetizer'
        END as title,
        CASE 
          WHEN p.business_name = 'Green Valley Dispensary' THEN 'Get 20% off any edible product'
          WHEN p.business_name = 'Pizza Palace' THEN 'Free appetizer with main course'
        END as description,
        'percentage' as discount_type,
        '20.00' as discount_value,
        '25.00' as min_spend,
        '50.00' as max_discount
      FROM partners p
      WHERE p.business_name = 'Green Valley Dispensary'
      ON CONFLICT DO NOTHING
    `;

    // Seed perks
    await sql`
      INSERT INTO perks (title, description, points_cost, is_premium_only, image_url)
      VALUES 
        ('20% Off Edibles', 'Get 20% off any edible product', 500, false, '/placeholder-perk.jpg'),
        ('Free Coffee', 'Complimentary coffee with any purchase', 300, false, '/placeholder-perk.jpg'),
        ('Free Delivery', 'Free delivery on orders over $50', 200, false, '/placeholder-perk.jpg'),
        ('VIP Lounge Access', 'Exclusive access to premium lounge area', 1000, true, '/placeholder-perk.jpg'),
        ('Free Appetizer', 'Complimentary appetizer with main course', 400, false, '/placeholder-perk.jpg'),
        ('Travel Voucher', '$50 travel voucher for any destination', 2000, true, '/placeholder-perk.jpg')
      ON CONFLICT DO NOTHING
    `;

    // Seed sample receipts and points
    const johnUser = await sql`SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1`;
    const janeUser = await sql`SELECT id FROM users WHERE email = 'jane.smith@example.com' LIMIT 1`;
    const greenValleyPartner = await sql`SELECT id FROM partners WHERE business_name = 'Green Valley Dispensary' LIMIT 1`;
    const pizzaPartner = await sql`SELECT id FROM partners WHERE business_name = 'Pizza Palace' LIMIT 1`;

    if (johnUser[0] && greenValleyPartner[0]) {
      // Insert sample receipts
      await sql`
        INSERT INTO receipts (user_id, partner_id, image_url, subtotal, total, status, points_awarded)
        VALUES 
          (${johnUser[0].id}, ${greenValleyPartner[0].id}, '/placeholder-receipt.jpg', '42.50', '45.00', 'approved', 90),
          (${johnUser[0].id}, ${greenValleyPartner[0].id}, '/placeholder-receipt.jpg', '65.00', '67.25', 'approved', 134)
        ON CONFLICT DO NOTHING
      `;

      // Insert points ledger
      await sql`
        INSERT INTO points_ledger (user_id, points, type, description)
        VALUES 
          (${johnUser[0].id}, 500, 'bonus', 'Welcome bonus'),
          (${johnUser[0].id}, 90, 'earned', 'Receipt upload - Green Valley Dispensary'),
          (${johnUser[0].id}, 134, 'earned', 'Receipt upload - Green Valley Dispensary')
        ON CONFLICT DO NOTHING
      `;
    }

    if (janeUser[0] && pizzaPartner[0]) {
      await sql`
        INSERT INTO receipts (user_id, partner_id, image_url, subtotal, total, status, points_awarded)
        VALUES (${janeUser[0].id}, ${pizzaPartner[0].id}, '/placeholder-receipt.jpg', '25.00', '28.50', 'pending', 0)
        ON CONFLICT DO NOTHING
      `;

      await sql`
        INSERT INTO points_ledger (user_id, points, type, description)
        VALUES (${janeUser[0].id}, 500, 'bonus', 'Welcome bonus')
        ON CONFLICT DO NOTHING
      `;
    }

    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data includes:');
    console.log('   - 5 users (2 regular, 1 admin, 2 partners)');
    console.log('   - 2 approved partners with locations and offers');
    console.log('   - 6 perks (mix of free and premium)');
    console.log('   - Sample receipts and points transactions');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedDatabase();