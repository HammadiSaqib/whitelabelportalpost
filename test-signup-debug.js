import FormData from 'form-data';
import fetch from 'node-fetch';

async function testSignupWithDebug() {
  try {
    console.log('🔍 Testing signup with whiteLabelId=2...');
    
    const formData = new FormData();
    formData.append('firstName', 'Test');
    formData.append('lastName', 'User');
    formData.append('username', 'testuser123456');
    formData.append('email', 'testuser123456@example.com');
    formData.append('password', 'TestPassword123!');
    formData.append('role', 'end-user');
    formData.append('verificationCode', '123456'); // This will fail, but we want to see the logs
    formData.append('whiteLabelId', '2');
    
    console.log('📤 Sending request to /api/auth/signup-affiliate...');
    console.log('FormData contents:');
    console.log('- firstName: Test');
    console.log('- lastName: User');
    console.log('- username: testuser123456');
    console.log('- email: testuser123456@example.com');
    console.log('- role: end-user');
    console.log('- whiteLabelId: 2');
    console.log('- verificationCode: 123456 (dummy)');
    
    const response = await fetch('http://localhost:3000/api/auth/signup-affiliate', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
    
    const result = await response.text();
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response body:', result);
    
    if (response.status === 400 && result.includes('verification code')) {
      console.log('✅ Request reached server and whiteLabelId was processed');
      console.log('💡 Check server logs to see if whiteLabelId=2 was logged correctly');
    } else {
      console.log('❌ Unexpected response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSignupWithDebug();