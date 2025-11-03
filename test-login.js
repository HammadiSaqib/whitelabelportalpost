import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('🧪 Testing login with admin@whitelabelpro.com...\n');
    
    const loginData = {
      username: 'admin@whitelabelpro.com',
      password: 'Admin@123'
    };
    
    console.log('📤 Sending POST request to /api/auth/login');
    console.log('Request body:', JSON.stringify(loginData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    console.log('\n📥 Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('\n📋 Response Body:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('User:', data.user?.email, 'Role:', data.user?.role);
    } else {
      console.log('\n❌ LOGIN FAILED!');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

testLogin();
