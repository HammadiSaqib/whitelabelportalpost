import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function checkUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    const query = 'SELECT id, username, "userOfWhiteLabelId", "firstName", "lastName", email, role, "isActive" FROM users WHERE username = $1';
    const result = await client.query(query, ['testingwhuser']);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('\n✅ User found!');
      console.log('==================');
      console.log('ID:', user.id);
      console.log('Username:', user.username);
      console.log('userOfWhiteLabelId:', user.userOfWhiteLabelId);
      console.log('First Name:', user.firstName);
      console.log('Last Name:', user.lastName);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Is Active:', user.isActive);
      console.log('==================');
    } else {
      console.log('\n❌ No user found with username "testingwhuser"');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUser();