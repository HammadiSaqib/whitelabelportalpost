import { db } from './server/db.js';
import { users } from './shared/schema.js';

async function checkUsers() {
  try {
    const allUsers = await db.select().from(users).limit(10);
    console.log(`\n✅ Found ${allUsers.length} users in database\n`);
    
    if (allUsers.length > 0) {
      console.log('Users:');
      allUsers.forEach(u => {
        console.log(`  • ${u.email} (${u.username}) - Role: ${u.role}`);
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
