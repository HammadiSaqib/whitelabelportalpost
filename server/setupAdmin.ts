import { storage } from "./storage";
import bcrypt from "bcryptjs";

async function setupSuperAdminAndPlans() {
  try {
    console.log("🔧 Setting up Super Admin and Plans...");

    // Create Super Admin user
    const superAdminData = {
      id: "admin_" + Date.now(),
      username: "superadmin",
      email: "admin@whitelabelpro.com",
      firstName: "Super",
      lastName: "Admin",
      password: await bcrypt.hash("Admin@123", 10),
      role: "super_admin",
      authProvider: "local",
      isActive: true,
      profileImageUrl: "/uploads/logo.png"
    };

    console.log("✅ Creating Super Admin user...");
    await storage.upsertUser(superAdminData);
    console.log("✅ Super Admin created!");
    console.log("   Email: admin@whitelabelpro.com");
    console.log("   Password: Admin@123");

    // Create White Label Plans
    const whitelabelPlans = [
      {
        name: "Basic White Label",
        description: "Perfect for small businesses starting their white-label journey with essential features",
        monthlyPrice: "49.99",
        affiliateCommissionPercentage: "10.0",
        createdBy: superAdminData.id,
        maxUsers: 25,
        features: [
          "Up to 25 end users",
          "Custom branding (logo & colors)",
          "Basic analytics dashboard",
          "Email support",
          "Standard templates",
          "Domain path routing"
        ],
        accesses: ["categories"],
        isActive: true,
        isPublic: true,
        isMainSitePlan: true,
        allowAffiliatePromotion: true,
        status: "published"
      },
      {
        name: "Professional White Label",
        description: "Ideal for growing businesses with advanced customization and affiliate management",
        monthlyPrice: "149.99",
        affiliateCommissionPercentage: "15.0",
        createdBy: superAdminData.id,
        maxUsers: 100,
        features: [
          "Up to 100 end users",
          "Full white-label branding",
          "Advanced analytics & reporting",
          "Affiliate management system",
          "Priority support",
          "Custom landing pages",
          "API access",
          "Custom domain support"
        ],
        accesses: ["categories", "affiliates"],
        isActive: true,
        isPublic: true,
        isMainSitePlan: true,
        allowAffiliatePromotion: true,
        status: "published"
      },
      {
        name: "Enterprise White Label",
        description: "Complete white-label solution for large organizations with unlimited scalability",
        monthlyPrice: "399.99",
        affiliateCommissionPercentage: "20.0",
        createdBy: superAdminData.id,
        maxUsers: null,
        features: [
          "Unlimited end users",
          "Complete white-label solution",
          "Multi-tier affiliate network",
          "AI Content Studio access",
          "24/7 premium support",
          "Custom integrations",
          "Dedicated account manager",
          "Advanced revenue sharing",
          "Custom development hours included"
        ],
        accesses: ["categories", "affiliates", "ai_content_studio"],
        isActive: true,
        isPublic: true,
        isMainSitePlan: true,
        allowAffiliatePromotion: true,
        status: "published"
      },
      {
        name: "Startup Special",
        description: "Limited-time offer for startups - Get started with white-label at a special price",
        monthlyPrice: "29.99",
        affiliateCommissionPercentage: "12.0",
        createdBy: superAdminData.id,
        maxUsers: 10,
        features: [
          "Up to 10 end users",
          "Basic branding",
          "Standard analytics",
          "Community support",
          "Email templates"
        ],
        accesses: ["categories"],
        isActive: true,
        isPublic: true,
        isMainSitePlan: true,
        allowAffiliatePromotion: true,
        status: "published"
      }
    ];

    console.log("\n📦 Creating White Label Plans...");
    for (const planData of whitelabelPlans) {
      await storage.createPlan(planData);
      console.log(`✅ Created: ${planData.name} - $${planData.monthlyPrice}/month`);
    }

    console.log("\n🎉 Setup Complete!");
    console.log("\n📝 Summary:");
    console.log("   - Super Admin account created");
    console.log(`   - ${whitelabelPlans.length} white-label plans created`);
    console.log("\n🔐 Login credentials:");
    console.log("   Email: admin@whitelabelpro.com");
    console.log("   Password: Admin@123");
    console.log("\n⚠️  Please change the password after first login!");

  } catch (error) {
    console.error("❌ Error during setup:", error);
    throw error;
  }
}

setupSuperAdminAndPlans()
  .then(() => {
    console.log("✅ Setup script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Setup script failed:", error);
    process.exit(1);
  });
