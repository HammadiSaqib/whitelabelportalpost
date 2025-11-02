import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

// Use the same database connection as the server (Neon PostgreSQL)
const connectionString = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const client = postgres(connectionString);
const db = drizzle(client);

async function fixExistingUser() {
  try {
    const userEmail = 'tutorialsworld8475@gmail.com';
    
    console.log(`🔧 Fixing userOfWhiteLabelId for ${userEmail}...`);
    
    // First, check current state
    console.log('\n1️⃣ Current state:');
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));
    
    if (!currentUser) {
      console.log(`❌ User ${userEmail} not found`);
      return;
    }
    
    console.log(`   - userOfWhiteLabelId: ${currentUser.userOfWhiteLabelId}`);
    console.log(`   - role: ${currentUser.role}`);
    console.log(`   - created: ${currentUser.createdAt}`);
    
    // Update the user
    console.log('\n2️⃣ Updating userOfWhiteLabelId to 2...');
    const result = await db
      .update(users)
      .set({ userOfWhiteLabelId: 2 })
      .where(eq(users.email, userEmail))
      .returning();
    
    if (result.length > 0) {
      console.log('✅ User updated successfully!');
      
      // Verify the update
      console.log('\n3️⃣ Verification:');
      const [updatedUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail));
      
      console.log(`   - userOfWhiteLabelId: ${updatedUser.userOfWhiteLabelId}`);
      console.log(`   - role: ${updatedUser.role}`);
      
      if (updatedUser.userOfWhiteLabelId === 2) {
        console.log('✅ Fix confirmed! userOfWhiteLabelId is now correctly set to 2');
      } else {
        console.log('❌ Fix failed - userOfWhiteLabelId is still not correct');
      }
    } else {
      console.log('❌ Update failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixExistingUser();