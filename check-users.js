import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function checkUsers() {
  try {
    // First check for the specific user "testingwhuser"
    console.log('🔍 Checking for user with username: testingwhuser');
    
    const specificUser = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        userOfWhiteLabelId: users.userOfWhiteLabelId,
        isActive: users.isActive,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.username, 'testingwhuser'))
      .limit(1);

    if (specificUser.length > 0) {
      console.log('\n✅ User "testingwhuser" found!');
      console.log('User Details:');
      console.log('- ID:', specificUser[0].id);
      console.log('- Username:', specificUser[0].username);
      console.log('- Email:', specificUser[0].email);
      console.log('- Name:', specificUser[0].firstName, specificUser[0].lastName);
      console.log('- Role:', specificUser[0].role);
      console.log('- userOfWhiteLabelId:', specificUser[0].userOfWhiteLabelId);
      console.log('- Is Active:', specificUser[0].isActive);
      console.log('- Created At:', specificUser[0].createdAt);
    } else {
      console.log('\n❌ No user found with username: testingwhuser');
    }

    // Also show all users for reference
    const allUsers = await db.select().from(users).limit(10);
    console.log(`\n📊 Total users in database: ${allUsers.length}\n`);
    
    if (allUsers.length > 0) {
      console.log('All Users:');
      allUsers.forEach(u => {
        console.log(`  • ${u.email} (${u.username}) - Role: ${u.role} - WhiteLabelId: ${u.userOfWhiteLabelId}`);
      });
    } else {
      console.log('⚠️  Database is empty - no users found!');
      console.log('You need to import your MySQL data.');
    }
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  }
  process.exit(0);
}

checkUsers();
