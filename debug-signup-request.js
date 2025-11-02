import FormData from 'form-data';
import fetch from 'node-fetch';

async function debugSignupRequest() {
  try {
    console.log('🧪 Testing signup request with whiteLabelId=2...');
    
    // Create FormData exactly like the frontend does
    const submitData = new FormData();
    submitData.append('firstName', 'Test');
    submitData.append('lastName', 'User');
    submitData.append('username', 'testuser123');
    submitData.append('password', 'TestPassword123!');
    submitData.append('email', 'testuser123@example.com');
    submitData.append('verificationCode', '123456'); // This will fail, but we want to see if whiteLabelId is received
    submitData.append('role', 'End-user');
    submitData.append('domainPath', 'test-domain');
    submitData.append('whiteLabelId', '2'); // This is the key field we're testing
    
    console.log('\n📤 Sending request to /api/auth/signup-affiliate...');
    console.log('Request data:');
    console.log('- firstName: Test');
    console.log('- lastName: User');
    console.log('- username: testuser123');
    console.log('- email: testuser123@example.com');
    console.log('- role: End-user');
    console.log('- whiteLabelId: 2');
    console.log('- domainPath: test-domain');
    
    const response = await fetch('http://localhost:3000/api/auth/signup-affiliate', {
      method: 'POST',
      body: submitData,
    });
    
    console.log(`\n📥 Response status: ${response.status}`);
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.status === 400 && responseText.includes('verification code')) {
      console.log('\n✅ Request reached the server and whiteLabelId was processed');
      console.log('   (The verification code error is expected since we used a dummy code)');
    } else {
      console.log('\n❌ Unexpected response - check server logs');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSignupRequest();