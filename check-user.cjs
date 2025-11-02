const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

try {
    const user = db.prepare(`
        SELECT id, username, email, role, white_label_id 
        FROM users 
        WHERE email = ?
    `).get('testcomplete123@example.com');
    
    if (user) {
        console.log('✅ User found:');
        console.log('ID:', user.id);
        console.log('Username:', user.username);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('white_label_id:', user.white_label_id);
        
        if (user.white_label_id === 2) {
            console.log('🎉 SUCCESS: white_label_id is correctly set to 2!');
        } else if (user.white_label_id === null) {
            console.log('❌ ISSUE: white_label_id is NULL');
        } else {
            console.log('❓ UNEXPECTED: white_label_id is', user.white_label_id);
        }
    } else {
        console.log('❌ User not found');
    }
} catch (error) {
    console.error('Error querying database:', error);
} finally {
    db.close();
}