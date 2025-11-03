import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function checkPassword() {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, 'admin@whitelabelpro.com')).limit(1);
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('\n📋 User Details:');
    console.log('  Email:', user.email);
    console.log('  Username:', user.username);
    console.log('  Role:', user.role);
    console.log('  Password hash:', user.password?.substring(0, 30) + '...');
    console.log('  Hash length:', user.password?.length);
    console.log('  Hash is bcrypt format:', user.password?.startsWith('$2'));
    
    console.log('\n🔐 Testing password verification:');
    const testPassword = 'Admin@123';
    
    if (!user.password) {
      console.log('❌ User has no password set!');
      process.exit(1);
    }
    
    try {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`  Password "${testPassword}" is ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isValid) {
        console.log('\n💡 Let me try hashing the test password to see what it should be:');
        const testHash = await bcrypt.hash(testPassword, 12);
        console.log('  New hash:', testHash.substring(0, 30) + '...');
      }
    } catch (error) {
      console.log('❌ Error comparing passwords:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

checkPassword();
