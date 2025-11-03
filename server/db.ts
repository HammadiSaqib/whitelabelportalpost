// Load environment variables FIRST
import './env';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// Build DATABASE_URL from PG credentials if needed
const databaseUrl = process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://')
  ? process.env.DATABASE_URL
  : (process.env.PGHOST && process.env.PGUSER
      ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`
      : process.env.DATABASE_URL);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create Neon HTTP connection
export const connection = neon(databaseUrl);

// Test database connection on startup
async function testConnection() {
  try {
    await connection`SELECT 1 as test`;
    console.log('✅ Database connection test successful');
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    // Don't throw here to allow server to start even if DB is temporarily unavailable
  }
}

// Test connection on startup
testConnection();

export const db = drizzle(connection, { schema });

// Helper function to execute queries with retry logic
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      // Don't retry on certain errors
      if (error instanceof Error && (
        error.message.includes('duplicate key') ||
        error.message.includes('violates') ||
        error.message.includes('invalid')
      )) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}
