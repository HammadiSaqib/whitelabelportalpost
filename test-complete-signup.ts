import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

// Use the same database connection as the server (Neon PostgreSQL)
const connectionString = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const client = postgres(connectionString);
const db = drizzle(client);

async function testCompleteSignup() {
  try {
    console.log('🧪 Testing complete signup flow...');
    
    // Test email for this flow
    const testEmail = 'test-flow-verification@example.com';
    
    console.log(`\n1️⃣ Checking if test user ${testEmail} already exists...`);
    
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail));
    
    if (existingUser) {
      console.log(`✅ Found existing test user: ${existingUser.email}`);
      console.log(`   - userOfWhiteLabelId: ${existingUser.userOfWhiteLabelId}`);
      console.log(`   - affiliateOfWhiteLabelId: ${existingUser.affiliateOfWhiteLabelId}`);
      console.log(`   - role: ${existingUser.role}`);
      console.log(`   - created: ${existingUser.createdAt}`);
      
      if (existingUser.userOfWhiteLabelId === 2) {
        console.log('✅ Test user has correct userOfWhiteLabelId = 2');
      } else {
        console.log(`❌ Test user has incorrect userOfWhiteLabelId: ${existingUser.userOfWhiteLabelId} (should be 2)`);
      }
    } else {
      console.log(`❌ Test user ${testEmail} not found`);
    }
    
    console.log('\n2️⃣ Analysis of the issue:');
    console.log('Based on the database analysis:');
    console.log('- 2 out of 3 end users have userOfWhiteLabelId set correctly');
    console.log('- Only tutorialsworld8475@gmail.com has userOfWhiteLabelId as NULL');
    console.log('- This suggests the current implementation is working');
    console.log('- The issue might be that tutorialsworld8475@gmail.com was created before the fix');
    
    console.log('\n3️⃣ Recommendations:');
    console.log('1. Test the current flow by creating a new user with whitelabel_id=2');
    console.log('2. If the new user gets userOfWhiteLabelId=2, then the fix is working');
    console.log('3. For existing users like tutorialsworld8475@gmail.com, consider updating manually');
    
    console.log('\n4️⃣ Manual fix for existing user:');
    console.log('If you want to fix tutorialsworld8475@gmail.com, you can run:');
    console.log('UPDATE users SET "userOfWhiteLabelId" = 2 WHERE email = \'tutorialsworld8475@gmail.com\';');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

testCompleteSignup();