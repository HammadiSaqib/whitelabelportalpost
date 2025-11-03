import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/whitelabel_portal';
const client = postgres(connectionString);
const db = drizzle(client);

async function testSignupFlow() {
  try {
    console.log('🔍 Testing signup flow with whitelabel_id=2...');
    
    // Test email for this flow
    const testEmail = 'test-whitelabel-2@example.com';
    
    console.log(`📧 Checking if user ${testEmail} exists...`);
    
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail));
    
    if (existingUser) {
      console.log(`✅ Found existing user: ${existingUser.email}`);
      console.log(`   - userOfWhiteLabelId: ${existingUser.userOfWhiteLabelId}`);
      console.log(`   - affiliateOfWhiteLabelId: ${existingUser.affiliateOfWhiteLabelId}`);
      console.log(`   - role: ${existingUser.role}`);
      console.log(`   - created: ${existingUser.createdAt}`);
    } else {
      console.log(`❌ User ${testEmail} not found in database`);
      console.log('💡 To test the flow:');
      console.log('   1. Go to http://localhost:3000/login?whitelabel_id=2');
      console.log('   2. Click "Sign Up" to create an end-user account');
      console.log(`   3. Use email: ${testEmail}`);
      console.log('   4. Complete the signup process');
      console.log('   5. Run this script again to verify userOfWhiteLabelId is set to 2');
    }
    
  } catch (error) {
    console.error('❌ Error testing signup flow:', error);
  } finally {
    await client.end();
  }
}

testSignupFlow();