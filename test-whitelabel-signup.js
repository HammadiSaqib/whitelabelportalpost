const fetch = require('node-fetch');

async function testWhiteLabelSignup() {
  console.log('🧪 Testing WhiteLabel User Signup Flow...');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'WhiteLabelUser',
    username: `testwhuser${Date.now()}`,
    password: 'testpass123',
    role: 'end-user',
    whitelabel_id: '2'
  };

  try {
    console.log('📝 Attempting to create user with data:', {
      ...testUser,
      password: '[HIDDEN]'
    });

    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Signup successful!');
      console.log('📊 Response:', result);
      
      // Now check if the user was created with correct userOfWhiteLabelId
      const { db } = require('./server/db');
      const { users } = require('./shared/schema');
      const { eq } = require('drizzle-orm');
      
      const [createdUser] = await db.select().from(users).where(eq(users.username, testUser.username));
      
      if (createdUser) {
        console.log('🔍 User found in database:');
        console.log('- ID:', createdUser.id);
        console.log('- Username:', createdUser.username);
        console.log('- Role:', createdUser.role);
        console.log('- userOfWhiteLabelId:', createdUser.userOfWhiteLabelId);
        console.log('- affiliateOfWhiteLabelId:', createdUser.affiliateOfWhiteLabelId);
        console.log('- whiteLabelId:', createdUser.whiteLabelId);
        
        if (createdUser.userOfWhiteLabelId === 2) {
          console.log('🎉 SUCCESS: whitelabel_id was correctly saved to userOfWhiteLabelId!');
        } else {
          console.log('❌ FAILURE: whitelabel_id was not saved correctly');
          console.log('Expected userOfWhiteLabelId: 2');
          console.log('Actual userOfWhiteLabelId:', createdUser.userOfWhiteLabelId);
        }
      } else {
        console.log('❌ User not found in database');
      }
      
    } else {
      console.log('❌ Signup failed:', result);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

testWhiteLabelSignup();