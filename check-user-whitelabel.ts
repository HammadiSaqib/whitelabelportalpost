import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkUserWhiteLabelId() {
  try {
    // Create database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    const sql = postgres(connectionString);
    const db = drizzle(sql);

    // Query for the specific user
    const email = 'tutorialsworld8475@gmail.com';
    console.log(`Searching for user: ${email}`);
    
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) {
      console.log('❌ User not found in database');
      return;
    }

    const userData = user[0];
    console.log('\n✅ User found:');
    console.log('📧 Email:', userData.email);
    console.log('👤 Username:', userData.username);
    console.log('🏷️  User ID:', userData.id);
    console.log('🔗 userOfWhiteLabelId:', userData.userOfWhiteLabelId || 'NULL');
    console.log('🔗 affiliateOfWhiteLabelId:', userData.affiliateOfWhiteLabelId || 'NULL');
    console.log('👥 Role:', userData.role);
    console.log('📅 Created At:', userData.createdAt);
    
    // Close connection
    await sql.end();
    
  } catch (error) {
    console.error('❌ Error checking user:', error.message);
  }
}

checkUserWhiteLabelId();