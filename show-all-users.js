import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function showAllUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Connecting to database...');
    
    // Get all users with all columns
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    
    console.log(`\n📊 TOTAL USERS FOUND: ${result.rows.length}\n`);
    console.log('=' .repeat(120));
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in the database');
      return;
    }

    // Display column headers
    const columns = Object.keys(result.rows[0]);
    console.log('COLUMNS:', columns.join(' | '));
    console.log('=' .repeat(120));
    
    // Display each user
    result.rows.forEach((user, index) => {
      console.log(`\n👤 USER #${index + 1}:`);
      console.log('-' .repeat(80));
      
      columns.forEach(column => {
        const value = user[column];
        const displayValue = value === null ? 'NULL' : 
                           value === undefined ? 'UNDEFINED' : 
                           typeof value === 'object' ? JSON.stringify(value) : 
                           String(value);
        console.log(`${column.padEnd(20)}: ${displayValue}`);
      });
    });
    
    console.log('\n' + '=' .repeat(120));
    console.log(`✅ Displayed all ${result.rows.length} users successfully`);
    
  } catch (error) {
    console.error('❌ Error retrieving users:', error.message);
  } finally {
    await pool.end();
  }
}

showAllUsers();