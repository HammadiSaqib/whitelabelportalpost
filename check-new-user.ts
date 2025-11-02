import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

// Use the same database connection as the server (Neon PostgreSQL)
const connectionString = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const client = postgres(connectionString);
const db = drizzle(client);

async function checkNewUser() {
  try {
    const userEmail = 'hammadisaqib@gmail.com';
    
    console.log(`🔍 Checking user: ${userEmail}`);
    
    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));
    
    if (!user) {
      console.log(`❌ User ${userEmail} not found in database`);
      return;
    }
    
    console.log('\n📊 User Details:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - userOfWhiteLabelId: ${user.userOfWhiteLabelId}`);
    console.log(`   - affiliateOfWhiteLabelId: ${user.affiliateOfWhiteLabelId}`);
    console.log(`   - Created: ${user.createdAt}`);
    console.log(`   - Auth Provider: ${user.authProvider}`);
    
    if (user.userOfWhiteLabelId === null) {
      console.log('\n❌ CONFIRMED: userOfWhiteLabelId is NULL (should be 2)');
    } else if (user.userOfWhiteLabelId === 2) {
      console.log('\n✅ userOfWhiteLabelId is correctly set to 2');
    } else {
      console.log(`\n⚠️ userOfWhiteLabelId is ${user.userOfWhiteLabelId} (should be 2)`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

checkNewUser();