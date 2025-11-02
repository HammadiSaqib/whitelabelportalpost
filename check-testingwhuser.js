import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function checkUser() {
  try {
    console.log('Checking for user with username: testingwhuser');
    
    const user = await db
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

    if (user.length > 0) {
      console.log('✅ User found!');
      console.log('User Details:');
      console.log('- ID:', user[0].id);
      console.log('- Username:', user[0].username);
      console.log('- Email:', user[0].email);
      console.log('- Name:', user[0].firstName, user[0].lastName);
      console.log('- Role:', user[0].role);
      console.log('- userOfWhiteLabelId:', user[0].userOfWhiteLabelId);
      console.log('- Is Active:', user[0].isActive);
      console.log('- Created At:', user[0].createdAt);
    } else {
      console.log('❌ No user found with username: testingwhuser');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking user:', error);
    process.exit(1);
  }
}

checkUser();