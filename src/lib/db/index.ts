import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Load environment variables
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required. Please check your .env.local file.');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
export { sql };
