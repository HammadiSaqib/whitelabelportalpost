import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function testLogin() {
  const testEmail = "admin@whitelabelpro.com";
  const testPassword = "Admin@123";

  console.log("\n🔍 Testing Login Process\n");
  console.log("Looking for user with email:", testEmail);

  // Find user by email
  const [user] = await db.select().from(users).where(eq(users.email, testEmail));

  if (!user) {
    console.error("❌ User not found!");
    return;
  }

  console.log("✅ User found!");
  console.log("  ID:", user.id);
  console.log("  Email:", user.email);
  console.log("  Role:", user.role);
  console.log("  First Name:", user.firstName);
  console.log("  Last Name:", user.lastName);
  console.log("  Password Hash (first 30 chars):", user.password?.substring(0, 30));
  console.log("  Password exists:", !!user.password);

  if (!user.password) {
    console.error("❌ User has no password!");
    return;
  }

  // Test password comparison
  console.log("\n🔐 Testing Password:");
  console.log("  Input Password:", testPassword);
  console.log("  Stored Hash:", user.password.substring(0, 50) + "...");

  const isValid = await bcrypt.compare(testPassword, user.password);
  console.log("  Password Valid:", isValid);

  if (isValid) {
    console.log("\n✅ LOGIN WOULD SUCCEED!");
  } else {
    console.log("\n❌ LOGIN WOULD FAIL - Password mismatch!");
    
    // Test if we need to rehash
    console.log("\n🔧 Testing hash generation:");
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log("  New hash:", newHash.substring(0, 50) + "...");
    const testNew = await bcrypt.compare(testPassword, newHash);
    console.log("  New hash works:", testNew);
  }
}

testLogin()
  .then(() => {
    console.log("\n✅ Test complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  });
