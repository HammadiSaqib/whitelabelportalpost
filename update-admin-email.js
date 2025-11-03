import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdminEmail() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Connecting to database...');
    
    // First, let's verify the current user exists
    const currentUser = await pool.query(
      'SELECT id, username, email, role FROM users WHERE email = $1',
      ['rick@5starprocessing.com']
    );

    if (currentUser.rows.length === 0) {
      console.log('❌ User with email rick@5starprocessing.com not found');
      return;
    }

    console.log('✅ Found user:', currentUser.rows[0]);
    
    // Check if the new email already exists
    const existingUser = await pool.query(
      'SELECT id, username, email FROM users WHERE email = $1',
      ['rick@whitelabelportal.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  Warning: Email rick@whitelabelportal.com already exists for user:', existingUser.rows[0]);
      console.log('Please choose a different email or remove the existing user first.');
      return;
    }

    // Update the email
    console.log('🔄 Updating email from rick@5starprocessing.com to rick@whitelabelportal.com...');
    
    const updateResult = await pool.query(
      'UPDATE users SET email = $1, updated_at = NOW() WHERE email = $2 RETURNING id, username, email, role',
      ['rick@whitelabelportal.com', 'rick@5starprocessing.com']
    );

    if (updateResult.rows.length > 0) {
      console.log('✅ Successfully updated user email:');
      console.log('User ID:', updateResult.rows[0].id);
      console.log('Username:', updateResult.rows[0].username);
      console.log('New Email:', updateResult.rows[0].email);
      console.log('Role:', updateResult.rows[0].role);
    } else {
      console.log('❌ No rows were updated. Something went wrong.');
    }

  } catch (error) {
    console.error('❌ Error updating email:', error.message);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the update
updateAdminEmail();