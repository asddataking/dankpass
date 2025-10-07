import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test the connection by running a simple query
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test result:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('Make sure your DATABASE_URL is set in .env.local');
    process.exit(1);
  }
}

testDatabase();
