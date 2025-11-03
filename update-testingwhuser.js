const { Pool } = require('pg');
require('dotenv').config();

async function updateTestingWhUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    
    // First, check current status
    const currentResult = await pool.query(
      'SELECT username, role, "whiteLabelId", "userOfWhiteLabelId" FROM users WHERE username = $1',
      ['testingwhuser']
    );
    
    console.log('BEFORE UPDATE:');
    console.log(currentResult.rows[0]);
    
    // Update userOfWhiteLabelId to 2
    const updateResult = await pool.query(
      'UPDATE users SET "userOfWhiteLabelId" = $1 WHERE username = $2 RETURNING username, role, "whiteLabelId", "userOfWhiteLabelId"',
      [2, 'testingwhuser']
    );
    
    console.log('AFTER UPDATE:');
    console.log(updateResult.rows[0]);
    
    console.log('✅ Successfully updated testingwhuser userOfWhiteLabelId to 2');
    
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    await pool.end();
  }
}

updateTestingWhUser();