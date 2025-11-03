import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { whiteLabels } from './shared/schema.ts';
import { eq, or, isNull } from 'drizzle-orm';

async function fixLandingPageCodes() {
  console.log('🔧 Fixing landing page codes - replacing "NULL" text with "default"...\n');
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Find all white labels with "NULL" as text or actual null
    const whiteLabelRecords = await db
      .select()
      .from(whiteLabels)
      .where(
        or(
          eq(whiteLabels.landingPageCode, 'NULL'),
          eq(whiteLabels.landingPageCode, 'null'),
          isNull(whiteLabels.landingPageCode)
        )
      );

    console.log(`📊 Found ${whiteLabelRecords.length} white label(s) with NULL or null landing page code\n`);

    if (whiteLabelRecords.length === 0) {
      console.log('✅ No records to update - all landing page codes are already properly set!\n');
      await client.end();
      return;
    }

    // Display records before update
    console.log('📋 Records to be updated:');
    whiteLabelRecords.forEach(wl => {
      console.log(`  - ID: ${wl.id}, Business: ${wl.businessName}, Domain: ${wl.domainPath}, Current Code: ${wl.landingPageCode || 'null'}`);
    });
    console.log('');

    // Update all records to use "default"
    for (const wl of whiteLabelRecords) {
      await db
        .update(whiteLabels)
        .set({ landingPageCode: 'default' })
        .where(eq(whiteLabels.id, wl.id));
      
      console.log(`✅ Updated: ${wl.businessName} (${wl.domainPath}) - landingPageCode set to "default"`);
    }

    console.log(`\n🎉 Successfully updated ${whiteLabelRecords.length} record(s)!`);
    console.log('\n📝 Summary:');
    console.log('  • All "NULL" text values → "default"');
    console.log('  • All null values → "default"');
    console.log('  • Landing pages will now display correctly!\n');

  } catch (error) {
    console.error('❌ Error fixing landing page codes:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the fix
fixLandingPageCodes()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
