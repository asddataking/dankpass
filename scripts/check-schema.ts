import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check users table structure
    const usersColumns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('\n📋 Users table structure:');
    usersColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(nullable)'}`);
    });

    // Check if we have any existing data
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`\n👥 Existing users: ${userCount[0].count}`);

    const partnerCount = await sql`SELECT COUNT(*) as count FROM partners`;
    console.log(`🏪 Existing partners: ${partnerCount[0].count}`);

    const perkCount = await sql`SELECT COUNT(*) as count FROM perks`;
    console.log(`🎁 Existing perks: ${perkCount[0].count}`);

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkSchema();
