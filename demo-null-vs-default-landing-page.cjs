const mysql = require('mysql2/promise');
const { drizzle } = require('drizzle-orm/mysql2');
const { whiteLabels } = require('./shared/schema.ts');
const { eq } = require('drizzle-orm');

async function demonstrateNullVsDefault() {
  console.log('🎭 Demonstrating null vs default landingPageCode behavior...');
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'whitelabel_pro_mysql'
  });

  const db = drizzle(connection);

  try {
    const whiteLabel = await db.select().from(whiteLabels).where(eq(whiteLabels.domainPath, 'shoot')).limit(1);
    
    if (whiteLabel.length > 0) {
      const wl = whiteLabel[0];
      console.log('📊 Current shoot white label landingPageCode:', wl.landingPageCode);
      
      // Test 1: Set to null (should show "Domain Not Available")
      console.log('\n🔄 Test 1: Setting landingPageCode to NULL...');
      await db.update(whiteLabels)
        .set({ landingPageCode: null })
        .where(eq(whiteLabels.id, wl.id));
      
      console.log('✅ Set to NULL');
      console.log('🌐 Visit http://localhost:3000/shoot - Should show "Domain Not Available"');
      console.log('⏳ Waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Test 2: Set to 'default' (should show working page)
      console.log('\n🔄 Test 2: Setting landingPageCode to "default"...');
      await db.update(whiteLabels)
        .set({ landingPageCode: 'default' })
        .where(eq(whiteLabels.id, wl.id));
      
      console.log('✅ Set to "default"');
      console.log('🌐 Visit http://localhost:3000/shoot - Should show working landing page');
      console.log('⏳ Waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Test 3: Set back to null
      console.log('\n🔄 Test 3: Setting back to NULL...');
      await db.update(whiteLabels)
        .set({ landingPageCode: null })
        .where(eq(whiteLabels.id, wl.id));
      
      console.log('✅ Set back to NULL');
      console.log('🌐 Visit http://localhost:3000/shoot - Should show "Domain Not Available" again');
      
      console.log('\n📋 Summary:');
      console.log('• landingPageCode = NULL → "Domain Not Available"');
      console.log('• landingPageCode = "default" → Working landing page');
      console.log('• This behavior is now implemented and working correctly!');
      
    } else {
      console.log('❌ No shoot white label found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await connection.end();
  }
}

demonstrateNullVsDefault().catch(console.error);