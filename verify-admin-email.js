import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function verifyAdminEmail() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Connecting to database for verification...');
    
    // Check if the old email still exists
    const oldEmailCheck = await pool.query(
      'SELECT id, username, email, role FROM users WHERE email = $1',
      ['rick@5starprocessing.com']
    );

    // Check if the new email exists
    const newEmailCheck = await pool.query(
      'SELECT id, username, email, role, updated_at FROM users WHERE email = $1',
      ['rick@whitelabelportal.com']
    );

    console.log('\n📊 Verification Results:');
    console.log('========================');
    
    if (oldEmailCheck.rows.length === 0) {
      console.log('✅ Old email (rick@5starprocessing.com) no longer exists in database');
    } else {
      console.log('❌ Old email (rick@5starprocessing.com) still exists:', oldEmailCheck.rows[0]);
    }

    if (newEmailCheck.rows.length > 0) {
      console.log('✅ New email (rick@whitelabelportal.com) found in database:');
      console.log('   User ID:', newEmailCheck.rows[0].id);
      console.log('   Username:', newEmailCheck.rows[0].username);
      console.log('   Email:', newEmailCheck.rows[0].email);
      console.log('   Role:', newEmailCheck.rows[0].role);
      console.log('   Last Updated:', newEmailCheck.rows[0].updated_at);
    } else {
      console.log('❌ New email (rick@whitelabelportal.com) not found in database');
    }

    // Additional check: verify it's the same user ID
    if (newEmailCheck.rows.length > 0 && newEmailCheck.rows[0].id === 'admin_1761023031290') {
      console.log('✅ Confirmed: Email update successful for the correct Super-Admin user');
    } else if (newEmailCheck.rows.length > 0) {
      console.log('⚠️  Warning: Email exists but for a different user ID');
    }

    console.log('\n🎉 Email update verification completed!');

  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the verification
verifyAdminEmail();