import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function exportAllUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Connecting to database...');
    
    // Get all users with all columns
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    
    console.log(`\n📊 TOTAL USERS FOUND: ${result.rows.length}\n`);
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in the database');
      return;
    }

    // Save to JSON file
    const jsonData = {
      total_users: result.rows.length,
      export_date: new Date().toISOString(),
      users: result.rows
    };
    
    fs.writeFileSync('all-users-export.json', JSON.stringify(jsonData, null, 2));
    console.log('💾 All users data saved to: all-users-export.json');
    
    // Display summary in console
    console.log('\n📋 USER SUMMARY:');
    console.log('=' .repeat(80));
    
    result.rows.forEach((user, index) => {
      console.log(`${(index + 1).toString().padStart(2)}: ${user.username.padEnd(20)} | ${user.role.padEnd(20)} | ${user.email}`);
    });
    
    // Group by role
    const roleGroups = {};
    result.rows.forEach(user => {
      if (!roleGroups[user.role]) {
        roleGroups[user.role] = 0;
      }
      roleGroups[user.role]++;
    });
    
    console.log('\n📊 USERS BY ROLE:');
    console.log('=' .repeat(40));
    Object.entries(roleGroups).forEach(([role, count]) => {
      console.log(`${role.padEnd(25)}: ${count}`);
    });
    
    // Group by white_label_id
    const whiteLabelGroups = {};
    result.rows.forEach(user => {
      const wlId = user.white_label_id || 'NULL';
      if (!whiteLabelGroups[wlId]) {
        whiteLabelGroups[wlId] = 0;
      }
      whiteLabelGroups[wlId]++;
    });
    
    console.log('\n🏷️  USERS BY WHITE_LABEL_ID:');
    console.log('=' .repeat(40));
    Object.entries(whiteLabelGroups).forEach(([wlId, count]) => {
      console.log(`${wlId.padEnd(25)}: ${count}`);
    });
    
    // Group by user_of_white_label_id
    const userOfWhiteLabelGroups = {};
    result.rows.forEach(user => {
      const userOfWlId = user.user_of_white_label_id || 'NULL';
      if (!userOfWhiteLabelGroups[userOfWlId]) {
        userOfWhiteLabelGroups[userOfWlId] = 0;
      }
      userOfWhiteLabelGroups[userOfWlId]++;
    });
    
    console.log('\n👥 USERS BY USER_OF_WHITE_LABEL_ID:');
    console.log('=' .repeat(40));
    Object.entries(userOfWhiteLabelGroups).forEach(([userOfWlId, count]) => {
      console.log(`${userOfWlId.padEnd(25)}: ${count}`);
    });
    
    console.log('\n✅ Export completed successfully!');
    console.log('📄 Full details available in: all-users-export.json');
    
  } catch (error) {
    console.error('❌ Error retrieving users:', error.message);
  } finally {
    await pool.end();
  }
}

exportAllUsers();