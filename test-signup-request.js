// Test script to simulate the signup request
import FormData from 'form-data';
import fetch from 'node-fetch';

async function testSignupRequest() {
  try {
    console.log('🧪 Testing signup request to /api/auth/signup-affiliate...');
    
    // Create FormData just like the frontend does
    const submitData = new FormData();
    submitData.append('firstName', 'Test');
    submitData.append('lastName', 'User');
    submitData.append('username', 'testuser123');
    submitData.append('password', 'TestPassword123!');
    submitData.append('email', 'test-signup-debug@example.com');
    submitData.append('verificationCode', '123456'); // This will fail, but we want to see the debug logs
    submitData.append('role', 'End-user');
    submitData.append('domainPath', '');
    submitData.append('whiteLabelId', '2'); // This is the key field we're testing
    
    console.log('📤 Sending request with whiteLabelId=2...');
    
    const response = await fetch('http://localhost:3000/api/auth/signup-affiliate', {
      method: 'POST',
      body: submitData,
    });
    
    const result = await response.text();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response body:', result);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSignupRequest();