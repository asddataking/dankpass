import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    console.log('📡 DATABASE_URL found:', process.env.DATABASE_URL.substring(0, 50) + '...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test a simple query
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!', result);
    
    // Test if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📊 Tables found:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();