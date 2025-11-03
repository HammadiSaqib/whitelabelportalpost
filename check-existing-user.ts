import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

// Use the same database connection as the server (Neon PostgreSQL)
const connectionString = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
console.log('🔗 Using Neon PostgreSQL database connection');

const client = postgres(connectionString);
const db = drizzle(client);

async function checkExistingUser() {
  try {
    console.log('🔍 Checking tutorialsworld8475@gmail.com...');
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'tutorialsworld8475@gmail.com'));
    
    if (user) {
      console.log(`✅ Found user: ${user.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Username: ${user.username}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - userOfWhiteLabelId: ${user.userOfWhiteLabelId}`);
      console.log(`   - affiliateOfWhiteLabelId: ${user.affiliateOfWhiteLabelId}`);
      console.log(`   - Created: ${user.createdAt}`);
      
      if (user.userOfWhiteLabelId === null) {
        console.log('❌ userOfWhiteLabelId is NULL - this should be 2 if signed up from whitelabel_id=2');
      } else {
        console.log(`✅ userOfWhiteLabelId is set to: ${user.userOfWhiteLabelId}`);
      }
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

checkExistingUser();