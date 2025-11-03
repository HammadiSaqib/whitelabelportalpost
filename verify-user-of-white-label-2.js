import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function verifyUserOfWhiteLabel2() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Double-checking users with user_of_white_label_id = 2...\n');
    
    // Query specifically for users with user_of_white_label_id = 2
    const result = await pool.query(
      'SELECT id, username, email, role, white_label_id, user_of_white_label_id FROM users WHERE user_of_white_label_id = $1 ORDER BY username',
      [2]
    );
    
    console.log(`📊 USERS WITH user_of_white_label_id = 2: ${result.rows.length}`);
    console.log('=' .repeat(80));
    
    if (result.rows.length === 0) {
      console.log('❌ NO users found with user_of_white_label_id = 2');
    } else {
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   white_label_id: ${user.white_label_id || 'NULL'}`);
        console.log(`   user_of_white_label_id: ${user.user_of_white_label_id}`);
        console.log('   ' + '-'.repeat(50));
      });
    }
    
    // Also check for any NULL values that might be interpreted differently
    console.log('\n🔍 Also checking for any potential NULL/empty values...');
    const nullCheck = await pool.query(
      'SELECT id, username, user_of_white_label_id FROM users WHERE user_of_white_label_id IS NULL OR user_of_white_label_id = \'\' ORDER BY username'
    );
    console.log(`Users with NULL/empty user_of_white_label_id: ${nullCheck.rows.length}`);
    
    // Double-check by getting ALL users and their user_of_white_label_id values
    console.log('\n📋 ALL USERS and their user_of_white_label_id values:');
    console.log('=' .repeat(80));
    const allUsers = await pool.query(
      'SELECT username, user_of_white_label_id FROM users ORDER BY username'
    );
    
    const grouped = {};
    allUsers.rows.forEach(user => {
      const value = user.user_of_white_label_id === null ? 'NULL' : user.user_of_white_label_id;
      if (!grouped[value]) {
        grouped[value] = [];
      }
      grouped[value].push(user.username);
    });
    
    Object.entries(grouped).forEach(([value, usernames]) => {
      console.log(`user_of_white_label_id = ${value}: ${usernames.length} users`);
      if (value === '2') {
        console.log(`   Users: ${usernames.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyUserOfWhiteLabel2();