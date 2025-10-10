/**
 * Neon Read Replica Configuration
 * Separates read and write operations for better performance
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Primary database for writes
const sqlWrite = neon(process.env.DATABASE_URL!);
export const dbWrite = drizzle(sqlWrite, { schema });

// Read replica for read operations (if configured)
// Falls back to primary if no read replica is configured
const sqlRead = neon(process.env.DATABASE_READ_URL || process.env.DATABASE_URL!);
export const dbRead = drizzle(sqlRead, { schema });

/**
 * Use this for all write operations (INSERT, UPDATE, DELETE)
 */
export const write = dbWrite;

/**
 * Use this for all read operations (SELECT)
 * Automatically uses read replica if available, otherwise primary
 */
export const read = dbRead;

/**
 * Check if read replica is configured
 */
export const hasReadReplica = (): boolean => {
  return !!process.env.DATABASE_READ_URL && 
         process.env.DATABASE_READ_URL !== process.env.DATABASE_URL;
};

/**
 * Export both for backwards compatibility
 */
export const db = dbWrite;

