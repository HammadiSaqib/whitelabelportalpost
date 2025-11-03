import FormData from 'form-data';
import fetch from 'node-fetch';

async function testCompleteSignupFlow() {
  try {
    const testEmail = 'testcomplete456@example.com';
    const testUsername = 'testcomplete456';
    
    console.log('🔍 Testing complete signup flow with whiteLabelId=2...');
    
    // Step 1: Request verification code
    console.log('📧 Step 1: Requesting verification code...');
    
    const verifyResponse = await fetch('http://localhost:3000/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail
      })
    });
    
    const verifyResult = await verifyResponse.text();
    console.log('📧 Verification request status:', verifyResponse.status);
    console.log('📧 Verification request result:', verifyResult);
    
    if (verifyResponse.status !== 200) {
      console.log('❌ Failed to send verification code');
      return;
    }
    
    // Step 2: Wait a moment and then complete signup
    console.log('⏳ Waiting 2 seconds before signup...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For testing, we'll use a dummy code since we can't easily get the real one
    // But let's see what happens
    console.log('📝 Step 2: Attempting signup...');
    
    // Use the regular signup endpoint for end users, not the affiliate endpoint
    const signupData = {
      firstName: 'Test',
      lastName: 'Complete',
      username: testUsername,
      email: testEmail,
      password: 'TestPassword123!',
      role: 'end_user',
      whitelabel_id: '2', // Use whitelabel_id (not whiteLabelId) for regular signup
      context: 'client_2' // This should trigger end_user role assignment
    };
    
    console.log('📤 Sending signup request to /api/auth/signup...');
    console.log('📤 Signup data:', signupData);
    
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signupData)
    });
    
    const signupResult = await signupResponse.text();
    console.log('📥 Signup response status:', signupResponse.status);
    console.log('📥 Signup response body:', signupResult);
    
    console.log('💡 Check server logs to see if whiteLabelId processing worked correctly');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCompleteSignupFlow();