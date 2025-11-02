import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { desc } from 'drizzle-orm';

// Use the same database connection as the server (Neon PostgreSQL)
const connectionString = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
console.log('🔗 Using Neon PostgreSQL database connection');

const client = postgres(connectionString);
const db = drizzle(client);

async function debugUserCreation() {
  try {
    console.log('🔍 Checking recent users to understand whiteLabelId assignment patterns...');
    
    // Get the 10 most recent users
    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10);
    
    console.log(`\n📊 Found ${recentUsers.length} recent users:\n`);
    
    recentUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Username: ${user.username}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - userOfWhiteLabelId: ${user.userOfWhiteLabelId}`);
      console.log(`   - affiliateOfWhiteLabelId: ${user.affiliateOfWhiteLabelId}`);
      console.log(`   - Created: ${user.createdAt}`);
      console.log(`   - Auth Provider: ${user.authProvider}`);
      console.log('');
    });
    
    // Check specifically for end_user role
    const endUsers = recentUsers.filter(user => user.role === 'end_user');
    console.log(`🎯 End users found: ${endUsers.length}`);
    
    const endUsersWithWhiteLabel = endUsers.filter(user => user.userOfWhiteLabelId !== null);
    console.log(`✅ End users with userOfWhiteLabelId set: ${endUsersWithWhiteLabel.length}`);
    
    const endUsersWithoutWhiteLabel = endUsers.filter(user => user.userOfWhiteLabelId === null);
    console.log(`❌ End users with userOfWhiteLabelId NULL: ${endUsersWithoutWhiteLabel.length}`);
    
    if (endUsersWithoutWhiteLabel.length > 0) {
      console.log('\n🔍 End users missing userOfWhiteLabelId:');
      endUsersWithoutWhiteLabel.forEach(user => {
        console.log(`   - ${user.email} (created: ${user.createdAt})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

debugUserCreation();