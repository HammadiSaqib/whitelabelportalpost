import { storage } from "./storage";

export async function seedDemoUsers() {
  try {
    // Create demo users for each role
    const demoUsers = [
      {
        id: "super_admin_demo",
        email: "admin@whitelabelpro.com",
        firstName: "Super",
        lastName: "Admin",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "super_admin_affiliate_demo", 
        email: "affiliate@whitelabelpro.com",
        firstName: "Super Admin",
        lastName: "Affiliate",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b332c777?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "white_label_client_demo",
        email: "client@whitelabelpro.com", 
        firstName: "White-Label",
        lastName: "Client",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "white_label_affiliate_demo",
        email: "wlaffiliate@whitelabelpro.com", 
        firstName: "WL",
        lastName: "Affiliate",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "end_user_demo",
        email: "user@whitelabelpro.com",
        firstName: "End",
        lastName: "User", 
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    ];

    // Create users
    for (const userData of demoUsers) {
      await storage.upsertUser(userData);
    }

    // Create demo plans for Super Admin
    const demoPlans = [
      {
        name: "Starter Plan",
        description: "Perfect for small businesses starting their affiliate journey",
        monthlyPrice: "29.99",
        affiliateCommissionPercentage: "10.0",
        createdBy: "super_admin_demo",
        maxUsers: 10,
        features: ["Up to 10 affiliates", "Basic analytics", "Email support", "Standard templates"],
        isActive: true
      },
      {
        name: "Professional Plan", 
        description: "Ideal for growing businesses with advanced needs",
        monthlyPrice: "79.99",
        affiliateCommissionPercentage: "15.0",
        createdBy: "super_admin_demo",
        maxUsers: 100,
        features: ["Up to 100 affiliates", "Advanced analytics", "Priority support", "Custom branding", "API access"],
        isActive: true
      },
      {
        name: "Enterprise Plan",
        description: "Complete solution for large organizations", 
        monthlyPrice: "199.99",
        affiliateCommissionPercentage: "20.0",
        createdBy: "super_admin_demo",
        maxUsers: null,
        features: ["Unlimited affiliates", "White-label solution", "24/7 support", "Custom integrations", "Dedicated account manager"],
        isActive: true
      }
    ];

    // Create plans  
    for (const planData of demoPlans) {
      await storage.createPlan(planData);
    }

    // Create demo white label for client
    await storage.createWhiteLabel({
      userId: "white_label_client_demo",
      businessName: "TechSolutions Pro",
      domain: "techsolutions.example.com",
      logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      isActive: true
    });

    // Create demo affiliates
    await storage.createAffiliate({
      userId: "super_admin_affiliate_demo",
      affiliateType: "super_admin_affiliate",
      commissionRate: "15.0",
      isActive: true
    });

    await storage.createAffiliate({
      userId: "white_label_affiliate_demo", 
      affiliateType: "white_label_affiliate",
      commissionRate: "10.0",
      isActive: true
    });

    // Create some demo activities
    const activities = [
      {
        userId: "super_admin_demo",
        type: "user_registered",
        description: "New user registered",
        metadata: {}
      },
      {
        userId: "white_label_client_demo", 
        type: "plan_subscribed",
        description: "Subscribed to Professional Plan",
        metadata: { planName: "Professional Plan" }
      },
      {
        userId: "super_admin_affiliate_demo",
        type: "referral_earned", 
        description: "Earned commission from referral",
        metadata: { amount: 50.00 }
      }
    ];

    for (const activity of activities) {
      await storage.createActivity(activity);
    }

    console.log("Demo data seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}