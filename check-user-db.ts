import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

// Use the same database connection as the server (Neon PostgreSQL)
const connectionString = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const client = postgres(connectionString);
const db = drizzle(client);

async function checkUser() {
    try {
        console.log('🔍 Checking user in database...');
        
        // Check by username since signup response showed username was created
        const userByUsername = await db.select().from(users).where(eq(users.username, 'testcomplete456')).limit(1);
        
        if (userByUsername.length > 0) {
            const user = userByUsername[0];
            console.log('✅ User found by username:', user.username);
            console.log('📧 Email:', user.email);
            console.log('🏷️  whiteLabelId:', user.whiteLabelId);
            console.log('🔗 affiliateOfWhiteLabelId:', user.affiliateOfWhiteLabelId);
            console.log('👤 Role:', user.role);
        } else {
            console.log('❌ User not found by username');
        }
        
        // Also check by email
        const userByEmail = await db.select().from(users).where(eq(users.email, 'testcomplete456@example.com')).limit(1);
        
        if (userByEmail.length > 0) {
            const user = userByEmail[0];
            console.log('✅ User found by email:', user.email);
            console.log('🏷️  whiteLabelId:', user.whiteLabelId);
        } else {
            console.log('❌ User not found by email');
        }
    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        await client.end();
    }
}

checkUser();