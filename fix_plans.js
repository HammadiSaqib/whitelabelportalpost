// Fix all plans to have correct isMainSitePlan value based on creator's role
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { plans } from './shared/schema.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

async function fixPlans() {
  console.log('Starting plan fix...');
  
  // Get all plans
  const allPlans = await db.select().from(plans);
  console.log(`Found ${allPlans.length} total plans`);
  
  for (const plan of allPlans) {
    // Get the user who created this plan
    const [creator] = await db.select().from(users).where(eq(users.id, plan.createdBy));
    
    if (!creator) {
      console.log(`⚠️  Plan ${plan.id} (${plan.name}): Creator not found (${plan.createdBy})`);
      continue;
    }
    
    // Determine correct isMainSitePlan value
    const correctValue = creator.role === 'super_admin';
    
    if (plan.isMainSitePlan !== correctValue) {
      console.log(`🔧 Fixing Plan ${plan.id} (${plan.name}):`);
      console.log(`   Creator: ${creator.username} (${creator.role})`);
      console.log(`   Current: isMainSitePlan = ${plan.isMainSitePlan}`);
      console.log(`   Correct: isMainSitePlan = ${correctValue}`);
      
      // Update the plan
      await db.update(plans)
        .set({ isMainSitePlan: correctValue })
        .where(eq(plans.id, plan.id));
      
      console.log(`   ✅ Updated!`);
    } else {
      console.log(`✓ Plan ${plan.id} (${plan.name}) is already correct (creator: ${creator.role}, isMainSitePlan: ${plan.isMainSitePlan})`);
    }
  }
  
  console.log('\n✅ Plan fix complete!');
  await client.end();
}

fixPlans().catch(console.error);
