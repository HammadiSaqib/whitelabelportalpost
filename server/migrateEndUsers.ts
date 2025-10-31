// One-time migration script to create white-label records for existing end_users
import { db } from "./db";
import { users, whiteLabels } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";

export async function migrateExistingEndUsers(): Promise<void> {
  console.log('Starting migration: Creating white-label records for existing end_users');
  
  try {
    // Find all end_users who don't have their own white-label record
    const endUsersWithoutWhiteLabel = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      })
      .from(users)
      .leftJoin(whiteLabels, eq(whiteLabels.userId, users.id))
      .where(
        eq(users.role, 'end_user')
        // Only users without their own white-label record (whiteLabels.id will be null)
      )
      .having(eq(whiteLabels.id, null));

    console.log(`Found ${endUsersWithoutWhiteLabel.length} end_users without white-label records`);
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const user of endUsersWithoutWhiteLabel) {
      try {
        // Check if they already have a white-label record (double-check)
        const [existingRecord] = await db
          .select()
          .from(whiteLabels)
          .where(eq(whiteLabels.userId, user.id));
        
        if (existingRecord) {
          console.log(`Skipping ${user.username} - already has white-label record`);
          skippedCount++;
          continue;
        }
        
        // Generate business name from user data
        const businessName = `${user.firstName} ${user.lastName}`.trim() || user.username;
        const cleanBusinessName = businessName.charAt(0).toUpperCase() + businessName.slice(1) + ' Business';
        
        // Generate domain path from username, ensuring it's unique
        let baseDomainPath = user.username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        let domainPath = `${baseDomainPath}-affiliate`;
        let counter = 1;
        
        // Check for domain path uniqueness
        while (true) {
          const [existing] = await db
            .select()
            .from(whiteLabels)
            .where(eq(whiteLabels.domainPath, domainPath));
          
          if (!existing) break;
          domainPath = `${baseDomainPath}-affiliate-${counter}`;
          counter++;
        }
        
        // Create white-label record using storage method (includes automatic default landing page)
        const whiteLabelRecord = await storage.createWhiteLabel({
          userId: user.id,
          businessName: cleanBusinessName,
          domainPath,
          isActive: true,
        });
        
        console.log(`✓ Created white-label record for ${user.username}: domain "${domainPath}", ID ${whiteLabelRecord.id}`);
        createdCount++;
        
      } catch (error) {
        console.error(`Error creating white-label record for ${user.username}:`, error);
        skippedCount++;
      }
    }
    
    console.log(`Migration completed: ${createdCount} records created, ${skippedCount} skipped`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Export for potential direct execution
if (require.main === module) {
  migrateExistingEndUsers()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}