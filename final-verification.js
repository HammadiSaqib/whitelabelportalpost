import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function finalVerification() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 FINAL VERIFICATION: Users with user_of_white_label_id = 2\n');
    
    // Query specifically for users with user_of_white_label_id = 2
    const result = await pool.query(
      'SELECT id, username, email, role, white_label_id, user_of_white_label_id FROM users WHERE user_of_white_label_id = 2 ORDER BY username'
    );
    
    console.log(`📊 TOTAL USERS WITH user_of_white_label_id = 2: ${result.rows.length}`);
    console.log('=' .repeat(80));
    
    if (result.rows.length === 0) {
      console.log('❌ NO users found with user_of_white_label_id = 2');
    } else {
      result.rows.forEach((user, index) => {
        console.log(`\n👤 USER #${index + 1}:`);
        console.log(`   Username: ${user.username}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   white_label_id: ${user.white_label_id || 'NULL'}`);
        console.log(`   user_of_white_label_id: ${user.user_of_white_label_id}`);
      });
    }
    
    // Get count breakdown of all user_of_white_label_id values
    console.log('\n📊 BREAKDOWN OF ALL user_of_white_label_id VALUES:');
    console.log('=' .repeat(60));
    
    const breakdown = await pool.query(`
      SELECT 
        user_of_white_label_id,
        COUNT(*) as count,
        STRING_AGG(username, ', ') as usernames
      FROM users 
      GROUP BY user_of_white_label_id 
      ORDER BY user_of_white_label_id
    `);
    
    breakdown.rows.forEach(row => {
      const value = row.user_of_white_label_id === null ? 'NULL' : row.user_of_white_label_id;
      console.log(`user_of_white_label_id = ${value}: ${row.count} users`);
      if (row.user_of_white_label_id === 2) {
        console.log(`   → Users: ${row.usernames}`);
      }
    });
    
    console.log('\n✅ VERIFICATION COMPLETE');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

finalVerification();