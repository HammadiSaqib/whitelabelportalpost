import {
  pgTable,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire", { mode: "string" }).notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Domain-specific user sessions for multi-tenant isolation
export const domainUserSessions = pgTable("domain_user_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  domainPath: varchar("domain_path", { length: 255 }).notNull(),
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  lastActivity: timestamp("last_activity", { mode: "string" }).defaultNow(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Referral tracking table for affiliate commissions
export const referralTracking = pgTable("referral_tracking", {
  id: serial("id").primaryKey(),
  affiliateId: varchar("affiliate_id", { length: 255 }).notNull().references(() => users.id), // The affiliate who referred the user
  referredUserId: varchar("referred_user_id", { length: 255 }).notNull().references(() => users.id), // The end-user who was referred
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id), // The white-label client associated with the affiliate
  domainPath: varchar("domain_path", { length: 255 }).notNull(), // The domain where the referral occurred
  referralSource: varchar("referral_source", { length: 50 }).default("landing_page"), // Source of referral (landing_page, direct_link, etc.)
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, paid
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Individual affiliate plan visibility settings
export const affiliatePlanVisibility = pgTable("affiliate_plan_visibility", {
  id: serial("id").primaryKey(),
  affiliateId: varchar("affiliate_id", { length: 255 }).notNull().references(() => users.id), // The affiliate who controls visibility
  planId: integer("plan_id").notNull().references(() => plans.id), // The plan being controlled
  isVisible: boolean("is_visible").default(false), // Whether this affiliate shows this plan on their landing page
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// User storage table with username-based authentication
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }), // Hashed password for username/password auth
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  logoImageUrl: varchar("logo_image_url", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("white_label_client"),
  isActive: boolean("is_active").default(true),
  whiteLabelId: integer("white_label_id").references(() => whiteLabels.id), // For end-users to associate with specific white-label clients
  googleId: varchar("google_id", { length: 255 }), // For Google OAuth users
  authProvider: varchar("auth_provider", { length: 50 }).notNull().default("local"),
  // Additional fields for affiliate authentication
  name: varchar("name", { length: 255 }), // Full name for affiliates
  phone: varchar("phone", { length: 255 }), // Phone number for affiliates
  company: varchar("company", { length: 255 }), // Company for affiliates
  referralCode: varchar("referral_code", { length: 255 }), // Unique referral code for Super Admin Affiliates
  affiliateOfWhiteLabelId: integer("affiliate_of_white_label_id").references(() => whiteLabels.id), // Tracks which white label the affiliate signed up through
  userOfWhiteLabelId: integer("user_of_white_label_id").references(() => whiteLabels.id), // Tracks which white label the user belongs to

  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Password reset tokens table for password recovery
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  hashedToken: varchar("hashed_token", { length: 255 }).notNull().unique(), // Store SHA-256 hash instead of plaintext
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Plans table for dashboard plans created by Super Admin
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  monthlyPrice: varchar("monthly_price", { length: 255 }),
  affiliateCommissionPercentage: varchar("affiliate_commission_percentage", { length: 255 }),
  maxUsers: integer("max_users"),
  features: jsonb("features").$type<string[]>(),
  accesses: jsonb("accesses").$type<string[]>().default([]), // Available features: categories, affiliates, ai_content_studio
  selectedCategories: jsonb("selected_categories").$type<number[]>().default([]),
  selectedProducts: jsonb("selected_products").$type<number[]>().default([]),
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(false), // Visibility for affiliates on landing pages
  isMainSitePlan: boolean("is_main_site_plan").default(false), // Display on main landing page
  allowAffiliatePromotion: boolean("allow_affiliate_promotion").default(false), // Whether affiliates can promote this plan
  status: varchar("status", { length: 50 }).default("published"),
  scheduledAt: timestamp("scheduled_at", { mode: "string" }),
  publishedAt: timestamp("published_at", { mode: "string" }),
  createdBy: varchar("created_by", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// User preferences table for personalization
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  theme: varchar("theme", { length: 50 }).default("light"),
  primaryColor: varchar("primary_color", { length: 255 }).default("#2563EB"), // Dashboard primary color
  secondaryColor: varchar("secondary_color", { length: 255 }).default("#64748B"), // Dashboard secondary color
  logoUrl: varchar("logo_url", { length: 255 }), // User's custom logo for dashboard/website
  language: varchar("language", { length: 255 }).default("en"),
  timezone: varchar("timezone", { length: 255 }).default("UTC"),
  currency: varchar("currency", { length: 255 }).default("USD"),
  emailNotifications: boolean("email_notifications").default(true),
  marketingEmails: boolean("marketing_emails").default(false),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// White Label Clients table  
export const whiteLabels = pgTable("white_labels", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  planId: integer("plan_id").references(() => plans.id),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  domainPath: varchar("domain_path", { length: 255 }), // Short path for domain routing (e.g., "hammad")
  logoUrl: varchar("logo_url", { length: 255 }),
  primaryColor: varchar("primary_color", { length: 255 }).default("#2563EB"),
  secondaryColor: varchar("secondary_color", { length: 255 }).default("#64748B"),
  defaultLandingPageId: integer("default_landing_page_id").references(() => landingPages.id), // Default landing page for domain
  landingPageCode: varchar("landing_page_code", { length: 50 }), // Controls which landing page template to use (e.g., "default")
  emailSettings: jsonb("email_settings").$type<{
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPass?: string;
    fromEmail?: string;
    fromName?: string;
    useCustomSmtp?: boolean;
  }>().default({}), // Custom email configuration for white-label clients
  isActive: boolean("is_active").default(true),
  invitedBy: varchar("invited_by", { length: 255 }).references(() => users.id), // Super Admin Affiliate who invited them
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Affiliates table for both Super Admin Affiliates and White-Label Affiliates
export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  referralCode: varchar("referral_code", { length: 255 }),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("10.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  totalReferrals: integer("total_referrals").default(0),
  isActive: boolean("is_active").default(true),
  bankName: varchar("bank_name", { length: 255 }),
  accountNumber: varchar("account_number", { length: 255 }),
  accountOwnerName: varchar("account_owner_name", { length: 255 }),
  accountType: varchar("account_type", { length: 255 }),
  affiliateType: varchar("affiliate_type", { length: 50 }),
  parentId: varchar("parent_id", { length: 255 }), // Can reference users.id or whiteLabels.id
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Subscriptions table for tracking active subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  selectedCategories: jsonb("selected_categories").$type<number[]>().default([]), // User-specific category selections
  selectedProducts: jsonb("selected_products").$type<number[]>().default([]), // User-specific product selections
  status: varchar("status", { length: 50 }).notNull().default("active"),
  billingCycle: varchar("billing_cycle", { length: 50 }).notNull().default("monthly"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  referralCode: varchar("referral_code", { length: 255 }), // Super Admin Affiliate referral code used in purchase
  currentPeriodStart: timestamp("current_period_start", { mode: "string" }),
  currentPeriodEnd: timestamp("current_period_end", { mode: "string" }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  nextBillingDate: timestamp("next_billing_date", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Commission tracking table
export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").notNull().references(() => affiliates.id),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commissionType: varchar("commission_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  paidAt: timestamp("paid_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Referral commissions table for Super Admin Affiliate referral tracking
export const referralCommissions = pgTable("referral_commissions", {
  id: serial("id").primaryKey(),
  affiliateId: varchar("affiliate_id", { length: 255 }).notNull().references(() => users.id), // Super Admin Affiliate who owns the referral code
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id), // The subscription that generated the commission
  planId: integer("plan_id").notNull().references(() => plans.id), // The plan that was purchased
  referralCode: varchar("referral_code", { length: 255 }).notNull(), // The referral code that was used
  purchaserUserId: varchar("purchaser_user_id", { length: 255 }).notNull().references(() => users.id), // White-label client who made the purchase
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  commissionPercentage: decimal("commission_percentage", { precision: 5, scale: 2 }).notNull(),
  planAmount: decimal("plan_amount", { precision: 10, scale: 2 }).notNull(), // Original plan price
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  paidAt: timestamp("paid_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Payment account information for affiliates
export const paymentAccounts = pgTable("payment_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id), // One account per user
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  accountOwnerName: varchar("account_owner_name", { length: 255 }).notNull(),
  accountNumber: varchar("account_number", { length: 255 }).notNull(),
  accountType: varchar("account_type", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Affiliate payments tracking table - tracks individual payments made to Super Admin Affiliates
export const affiliatePayments = pgTable("affiliate_payments", {
  id: serial("id").primaryKey(),
  affiliateId: varchar("affiliate_id", { length: 255 }).notNull().references(() => users.id), // Super Admin Affiliate receiving payment
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Amount paid
  currency: varchar("currency", { length: 3 }).default("USD"), // Currency code
  paymentMethod: varchar("payment_method", { length: 255 }).default("bank_transfer"), // Payment method used
  transactionId: varchar("transaction_id", { length: 255 }), // Transaction ID from payment provider
  notes: varchar("notes", { length: 1000 }), // Legacy notes
  status: varchar("status", { length: 50 }).default("completed"),
  metadata: jsonb("metadata"), // Additional payment metadata
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  paidByUserId: varchar("paid_by_user_id", { length: 255 }).references(() => users.id), // Duplicate column
  paidBy: varchar("paid_by", { length: 255 }).references(() => users.id), // Super Admin making payment (main column)
  transactionProofUrl: varchar("transaction_proof_url", { length: 255 }), // Optional proof of payment image
  description: varchar("description", { length: 1000 }), // Optional payment description/notes
  receiptImageUrl: varchar("receipt_image_url", { length: 255 }), // Legacy receipt image
  // Historical bank details - preserved at time of payment to prevent changes from affecting history
  historicalBankName: varchar("historical_bank_name", { length: 255 }), // Bank name at payment time
  historicalAccountNumber: varchar("historical_account_number", { length: 255 }), // Account number at payment time
  historicalAccountOwnerName: varchar("historical_account_owner_name", { length: 255 }), // Account owner at payment time
  historicalAccountType: varchar("historical_account_type", { length: 255 }), // Account type at payment time
});

// Note: purchases table removed - all purchase tracking now consolidated in purchase_history table

// Categories table for White-Label product organization with hierarchical support
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  parentCategoryId: integer("parent_category_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Products/Services table for White-Label Clients
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id),
  categoryId: integer("category_id").references(() => categories.id),
  createdBy: varchar("created_by", { length: 255 }).notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  type: varchar("type", { length: 50 }).notNull(),
  contentUrl: varchar("content_url", { length: 255 }), // URL or file path for digital content
  accessDuration: integer("access_duration"), // access duration in days, null = lifetime
  imageUrl: varchar("image_url", { length: 255 }),
  attachments: jsonb("attachments").$type<{url: string, type: string, name: string}[]>().default([]),
  metadata: jsonb("metadata").$type<{
    // For LMS courses
    lessons?: Array<{
      id: string;
      title: string;
      description?: string;
      contentUrl?: string;
      duration?: number;
      order: number;
    }>;
    // For ecommerce products
    sku?: string;
    inventory?: number;
    shipping?: {
      weight: number;
      dimensions: { length: number; width: number; height: number; };
    };
    // For digital products
    downloadUrl?: string;
    fileSize?: number;
    fileFormat?: string;
    // For articles
    content?: string;
    readingTime?: number;
    // For videos/audio
    duration?: number;
    format?: string;
    quality?: string;
    // AI generated content
    aiGenerated?: boolean;
    aiPrompt?: string;
  }>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Activity log table for tracking important events
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  type: varchar("type", { length: 255 }).notNull(), // e.g., "client_joined", "commission_paid", "plan_created"
  description: varchar("description", { length: 1000 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Purchase history table for tracking completed purchases
export const purchaseHistory = pgTable("purchase_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id), // The end-user who made the purchase
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id), // Which white-label client they purchased from
  planId: integer("plan_id").notNull().references(() => plans.id), // Which plan was purchased
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Purchase amount
  transactionId: varchar("transaction_id", { length: 255 }), // Payment gateway transaction ID
  paymentMethod: varchar("payment_method", { length: 255 }), // Payment method used
  status: varchar("status", { length: 50 }).default("pending"),
  metadata: jsonb("metadata").$type<{
    gateway?: string;
    gatewayResponse?: any;
    customerDetails?: any;
    billingAddress?: any;
  }>(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// End-user activity tracking table for white-label clients
export const endUserActivities = pgTable("end_user_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id), // The end-user
  whiteLabelId: integer("white_label_id").notNull().references(() => whiteLabels.id), // Which white-label client they belong to
  activityType: varchar("activity_type", { length: 50 }).notNull(),
  description: varchar("description", { length: 1000 }),
  metadata: jsonb("metadata").$type<{
    planId?: number;
    planName?: string;
    amount?: string;
    transactionId?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
    location?: string;
  }>(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// User sessions tracking for login status
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  whiteLabelId: integer("white_label_id").references(() => whiteLabels.id),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 1000 }),
  lastActiveAt: timestamp("last_active_at", { mode: "string" }).defaultNow(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  expiresAt: timestamp("expires_at", { mode: "string" }),
});



// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  whiteLabels: many(whiteLabels),
  affiliates: many(affiliates),
  activities: many(activities),
  createdPlans: many(plans),
  endUserActivities: many(endUserActivities),
  userSessions: many(userSessions),
  referralsMade: many(referralTracking, { relationName: "affiliateReferrals" }),
  referralsReceived: many(referralTracking, { relationName: "referredUsers" }),
  domainSessions: many(domainUserSessions),
  preferences: one(userPreferences),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  creator: one(users, {
    fields: [plans.createdBy],
    references: [users.id],
  }),
  whiteLabels: many(whiteLabels),
  subscriptions: many(subscriptions),
  planProducts: many(planProducts),
  planCategories: many(planCategories),
}));

export const whiteLabelsRelations = relations(whiteLabels, ({ one, many }) => ({
  user: one(users, {
    fields: [whiteLabels.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [whiteLabels.planId],
    references: [plans.id],
  }),
  invitedByUser: one(users, {
    fields: [whiteLabels.invitedBy],
    references: [users.id],
  }),
  subscriptions: many(subscriptions),
  products: many(products),
  affiliates: many(affiliates),
  endUserActivities: many(endUserActivities),
  userSessions: many(userSessions),
  referralTracking: many(referralTracking),
}));

export const referralTrackingRelations = relations(referralTracking, ({ one }) => ({
  affiliate: one(users, {
    fields: [referralTracking.affiliateId],
    references: [users.id],
    relationName: "affiliateReferrals",
  }),
  referredUser: one(users, {
    fields: [referralTracking.referredUserId],
    references: [users.id],
    relationName: "referredUsers",
  }),
  whiteLabel: one(whiteLabels, {
    fields: [referralTracking.whiteLabelId],
    references: [whiteLabels.id],
  }),
}));

export const domainUserSessionsRelations = relations(domainUserSessions, ({ one }) => ({
  user: one(users, {
    fields: [domainUserSessions.userId],
    references: [users.id],
  }),
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliates.userId],
    references: [users.id],
  }),
  parent: one(whiteLabels, {
    fields: [affiliates.parentId],
    references: [whiteLabels.id],
  }),
  commissions: many(commissions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  whiteLabel: one(whiteLabels, {
    fields: [subscriptions.whiteLabelId],
    references: [whiteLabels.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  commissions: many(commissions),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [commissions.affiliateId],
    references: [affiliates.id],
  }),
  subscription: one(subscriptions, {
    fields: [commissions.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// Note: purchasesRelations removed - purchase tracking now handled by purchaseHistoryRelations

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  whiteLabel: one(whiteLabels, {
    fields: [categories.whiteLabelId],
    references: [whiteLabels.id],
  }),
  products: many(products),
  planCategories: many(planCategories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  whiteLabel: one(whiteLabels, {
    fields: [products.whiteLabelId],
    references: [whiteLabels.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  planProducts: many(planProducts),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const endUserActivitiesRelations = relations(endUserActivities, ({ one }) => ({
  user: one(users, {
    fields: [endUserActivities.userId],
    references: [users.id],
  }),
  whiteLabel: one(whiteLabels, {
    fields: [endUserActivities.whiteLabelId],
    references: [whiteLabels.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
  whiteLabel: one(whiteLabels, {
    fields: [userSessions.whiteLabelId],
    references: [whiteLabels.id],
  }),
}));

// Integrations table for managing third-party service connections
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  category: varchar("category", { length: 255 }).notNull(), // payment, analytics, marketing, etc.
  isActive: boolean("is_active").default(false),
  isConnected: boolean("is_connected").default(false),
  apiKeyEncrypted: varchar("api_key_encrypted", { length: 1000 }),
  webhookUrl: varchar("webhook_url", { length: 255 }),
  settings: jsonb("settings").$type<Record<string, any>>(),
  lastSyncAt: timestamp("last_sync_at", { mode: "string" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  whiteLabelId: integer("white_label_id").references(() => whiteLabels.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Integration logs for tracking sync history and errors
export const integrationLogs = pgTable("integration_logs", {
  id: serial("id").primaryKey(),
  integrationId: integer("integration_id").notNull().references(() => integrations.id),
  action: varchar("action", { length: 255 }).notNull(), // connect, disconnect, sync, error
  status: varchar("status", { length: 255 }).notNull(), // success, failed, pending
  message: varchar("message", { length: 1000 }),
  errorDetails: jsonb("error_details").$type<Record<string, any>>(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// AI Content Generation and Recommendations
export const aiGeneratedContent = pgTable("ai_generated_content", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'product_description', 'marketing_copy', 'email_template', etc.
  prompt: varchar("prompt", { length: 1000 }).notNull(),
  generatedContent: varchar("generated_content", { length: 1000 }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(), // tone, audience, keywords, etc.
  isApproved: boolean("is_approved").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'plan', 'product', 'integration', 'action'
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  reason: varchar("reason", { length: 1000 }),
  priority: integer("priority").default(1), // 1-5 scale
  isViewed: boolean("is_viewed").default(false),
  isActioned: boolean("is_actioned").default(false),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  expiresAt: timestamp("expires_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const aiContentOptimizations = pgTable("ai_content_optimizations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  originalContent: varchar("original_content", { length: 1000 }).notNull(),
  optimizedContent: varchar("optimized_content", { length: 1000 }).notNull(),
  optimizationType: varchar("optimization_type", { length: 50 }).notNull(), // 'seo', 'readability', 'engagement'
  improvements: jsonb("improvements").$type<string[]>(), // array of improvement descriptions
  qualityScore: integer("quality_score"), // 1-100
  isApplied: boolean("is_applied").default(false),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Referral links for Super Admin Affiliates
export const referralLinks = pgTable("referral_links", {
  id: serial("id").primaryKey(),
  affiliateId: varchar("affiliate_id", { length: 255 }).references(() => users.id).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).unique().notNull(),
  isActive: boolean("is_active").default(true),
  totalClicks: integer("total_clicks").default(0),
  totalSignups: integer("total_signups").default(0),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Track referral signups
export const referralSignups = pgTable("referral_signups", {
  id: serial("id").primaryKey(),
  referralLinkId: integer("referral_link_id").references(() => referralLinks.id).notNull(),
  affiliateId: varchar("affiliate_id", { length: 255 }).references(() => users.id).notNull(),
  signupUserId: varchar("signup_user_id", { length: 255 }).references(() => users.id).notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 1000 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Track referral link clicks
export const referralClicks = pgTable("referral_clicks", {
  id: serial("id").primaryKey(),
  referralLinkId: integer("referral_link_id").references(() => referralLinks.id).notNull(),
  affiliateId: varchar("affiliate_id", { length: 255 }).references(() => users.id).notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 1000 }),
  convertedToSignup: boolean("converted_to_signup").default(false),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Plan Products - Links plans to specific products
export const planProducts = pgTable("plan_products", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => plans.id),
  productId: integer("product_id").notNull().references(() => products.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Plan Categories - Links plans to specific categories
export const planCategories = pgTable("plan_categories", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => plans.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Link Meta Images - For pre-generated meta images of website links
export const linkMetaImages = pgTable("link_meta_images", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  description: varchar("description", { length: 1000 }),
  imageUrl: varchar("image_url", { length: 255 }),
  siteName: varchar("site_name", { length: 255 }),
  faviconUrl: varchar("favicon_url", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Template management
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  type: varchar("type", { length: 50 }).notNull(), // dashboard, email, landing, etc
  category: varchar("category", { length: 100 }).notNull(),
  previewUrl: varchar("preview_url", { length: 255 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
  configSchema: jsonb("config_schema").$type<Record<string, any>>(),
  defaultConfig: jsonb("default_config").$type<Record<string, any>>(),
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Color themes for dashboard customization
export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  colors: jsonb("colors").$type<{
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  }>().notNull(),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// User theme preferences
export const userThemePreferences = pgTable("user_theme_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  themeId: integer("theme_id").references(() => themes.id).notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Client template customizations
export const clientTemplateCustomizations = pgTable("client_template_customizations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => whiteLabels.id).notNull(),
  templateId: integer("template_id").references(() => templates.id).notNull(),
  customConfig: jsonb("custom_config").$type<Record<string, any>>().notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Platform settings
export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: jsonb("value").$type<any>().notNull(),
  type: varchar("type", { length: 50 }).notNull(), // string, number, boolean, object, array
  category: varchar("category", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }),
  isPublic: boolean("is_public").default(false),
  updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Analytics data
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventData: jsonb("event_data").$type<Record<string, any>>(),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  timestamp: timestamp("timestamp", { mode: "string" }).defaultNow(),
});

export const analyticsMetrics = pgTable("analytics_metrics", {
  id: serial("id").primaryKey(),
  metricName: varchar("metric_name", { length: 255 }).notNull(),
  metricValue: varchar("metric_value", { length: 255 }).notNull(),
  dimensions: jsonb("dimensions").$type<Record<string, any>>(),
  period: varchar("period", { length: 20 }).notNull(), // day, week, month, year
  date: timestamp("date", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Announcements system
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  whiteLabelId: integer("white_label_id").references(() => whiteLabels.id),
  title: varchar("title", { length: 255 }),
  content: varchar("content", { length: 1000 }).notNull(),
  attachments: jsonb("attachments").$type<{url: string, type: string, name: string}[]>().default([]),
  visibility: varchar("visibility", { length: 50 }).default("public"),
  status: varchar("status", { length: 50 }).default("draft"),
  scheduledAt: timestamp("scheduled_at", { mode: "string" }),
  publishedAt: timestamp("published_at", { mode: "string" }),
  targetingType: varchar("targeting_type", { length: 50 }).default("everyone"),
  targetedPlanIds: jsonb("targeted_plan_ids").$type<number[]>().default([]),
  isPinned: boolean("is_pinned").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const announcementLikes = pgTable("announcement_likes", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id").references(() => announcements.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const announcementComments = pgTable("announcement_comments", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id").references(() => announcements.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  content: varchar("content", { length: 1000 }).notNull(),
  parentCommentId: integer("parent_comment_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const announcementShares = pgTable("announcement_shares", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id").references(() => announcements.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  sharedWith: varchar("shared_with", { length: 50 }).default("public"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Analytics table for tracking announcement interactions
export const announcementAnalytics = pgTable("announcement_analytics", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id").references(() => announcements.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  eventData: jsonb("event_data").$type<{
    elementClicked?: string; // For clicks: 'comment', 'like', 'image', 'link', 'card'
    conversionType?: string; // For conversions: 'image_open', 'file_download', 'link_click'
    targetUrl?: string; // For link conversions
    fileName?: string; // For file conversions
    ipAddress?: string;
    userAgent?: string;
  }>(),
  sessionId: varchar("session_id", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Insert schemas
export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const insertWhiteLabelSchema = createInsertSchema(whiteLabels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAffiliateSchema = createInsertSchema(affiliates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseHistorySchema = createInsertSchema(purchaseHistory).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertEndUserActivitySchema = createInsertSchema(endUserActivities).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationLogSchema = createInsertSchema(integrationLogs).omit({
  id: true,
  createdAt: true,
});

export const insertReferralLinkSchema = createInsertSchema(referralLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReferralSignupSchema = createInsertSchema(referralSignups).omit({
  id: true,
  createdAt: true,
});

export const insertReferralClickSchema = createInsertSchema(referralClicks).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementLikeSchema = createInsertSchema(announcementLikes).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementCommentSchema = createInsertSchema(announcementComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentAccountSchema = createInsertSchema(paymentAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Payment account types
export type InsertPaymentAccount = z.infer<typeof insertPaymentAccountSchema>;
export type PaymentAccount = typeof paymentAccounts.$inferSelect;

// Affiliate payment insert schema and types
export const insertAffiliatePaymentSchema = createInsertSchema(affiliatePayments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAffiliatePayment = z.infer<typeof insertAffiliatePaymentSchema>;
export type AffiliatePayment = typeof affiliatePayments.$inferSelect;



export const insertAnnouncementShareSchema = createInsertSchema(announcementShares).omit({
  id: true,
  createdAt: true,
});

export const insertAiGeneratedContentSchema = createInsertSchema(aiGeneratedContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertAiContentOptimizationSchema = createInsertSchema(aiContentOptimizations).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Plan Products relations
export const planProductsRelations = relations(planProducts, ({ one }) => ({
  plan: one(plans, {
    fields: [planProducts.planId],
    references: [plans.id],
  }),
  product: one(products, {
    fields: [planProducts.productId],
    references: [products.id],
  }),
}));

// Plan Categories relations
export const planCategoriesRelations = relations(planCategories, ({ one }) => ({
  plan: one(plans, {
    fields: [planCategories.planId],
    references: [plans.id],
  }),
  category: one(categories, {
    fields: [planCategories.categoryId],
    references: [categories.id],
  }),
}));

// Link Meta Images relations
export const linkMetaImagesRelations = relations(linkMetaImages, ({ many }) => ({
  // Can be connected to products with website_link type
}));

// Insert schemas for new tables
export const insertPlanProductSchema = createInsertSchema(planProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlanCategorySchema = createInsertSchema(planCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLinkMetaImageSchema = createInsertSchema(linkMetaImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertThemeSchema = createInsertSchema(themes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserThemePreferenceSchema = createInsertSchema(userThemePreferences).omit({
  id: true,
  updatedAt: true,
});

export const insertClientTemplateCustomizationSchema = createInsertSchema(clientTemplateCustomizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  timestamp: true,
});

export const insertAnalyticsMetricSchema = createInsertSchema(analyticsMetrics).omit({
  id: true,
  createdAt: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  whiteLabelId: true,
  affiliateOfWhiteLabelId: true,
}).extend({
  role: z.enum(["super_admin", "super_admin_affiliate", "white_label_client", "white_label_affiliate", "end_user"]).optional(),
});

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["super_admin", "super_admin_affiliate", "white_label_client", "white_label_affiliate", "end_user"]).default("white_label_client"),
});

export const checkUsernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

// Password reset schemas for security
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be less than 255 characters")
    .transform(val => val.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  token: z.string()
    .min(64, "Invalid reset token format")
    .max(64, "Invalid reset token format")
    .regex(/^[a-f0-9]{64}$/, "Invalid reset token format"),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

// Authentication types
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type CheckUsernameData = z.infer<typeof checkUsernameSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type WhiteLabel = typeof whiteLabels.$inferSelect;
export type InsertWhiteLabel = z.infer<typeof insertWhiteLabelSchema>;
export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = z.infer<typeof insertAffiliateSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type Commission = typeof commissions.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type PurchaseHistory = typeof purchaseHistory.$inferSelect;
export type InsertPurchaseHistory = z.infer<typeof insertPurchaseHistorySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type EndUserActivity = typeof endUserActivities.$inferSelect;
export type InsertEndUserActivity = z.infer<typeof insertEndUserActivitySchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type IntegrationLog = typeof integrationLogs.$inferSelect;
export type InsertIntegrationLog = z.infer<typeof insertIntegrationLogSchema>;
export type AiGeneratedContent = typeof aiGeneratedContent.$inferSelect;
export type InsertAiGeneratedContent = z.infer<typeof insertAiGeneratedContentSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type AiContentOptimization = typeof aiContentOptimizations.$inferSelect;
export type InsertAiContentOptimization = z.infer<typeof insertAiContentOptimizationSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Theme = typeof themes.$inferSelect;
export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type UserThemePreference = typeof userThemePreferences.$inferSelect;
export type InsertUserThemePreference = z.infer<typeof insertUserThemePreferenceSchema>;
export type ClientTemplateCustomization = typeof clientTemplateCustomizations.$inferSelect;
export type InsertClientTemplateCustomization = z.infer<typeof insertClientTemplateCustomizationSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsMetric = typeof analyticsMetrics.$inferSelect;
export type InsertAnalyticsMetric = z.infer<typeof insertAnalyticsMetricSchema>;
export type ReferralLink = typeof referralLinks.$inferSelect;
export type InsertReferralLink = z.infer<typeof insertReferralLinkSchema>;
export type ReferralSignup = typeof referralSignups.$inferSelect;
export type InsertReferralSignup = z.infer<typeof insertReferralSignupSchema>;
export type ReferralClick = typeof referralClicks.$inferSelect;
export type InsertReferralClick = z.infer<typeof insertReferralClickSchema>;

// Add analytics types and schemas
export const insertAnnouncementAnalyticsSchema = createInsertSchema(announcementAnalytics).omit({
  id: true,
  createdAt: true,
});
export type AnnouncementAnalytics = typeof announcementAnalytics.$inferSelect;
export type InsertAnnouncementAnalytics = z.infer<typeof insertAnnouncementAnalyticsSchema>;

// Landing Pages Table
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  domainPath: varchar("domain_path", { length: 100 }).unique(),
  elements: jsonb("elements").notNull(),
  settings: jsonb("settings").notNull(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const insertLandingPageSchema = createInsertSchema(landingPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = z.infer<typeof insertLandingPageSchema>;

// Custom Domains Table
export const customDomains = pgTable("custom_domains", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  isVerified: boolean("is_verified").default(false),
  verificationToken: varchar("verification_token", { length: 255 }),
  sslEnabled: boolean("ssl_enabled").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const insertCustomDomainSchema = createInsertSchema(customDomains).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CustomDomain = typeof customDomains.$inferSelect;
export type InsertCustomDomain = z.infer<typeof insertCustomDomainSchema>;

// NMI Payment Gateway Credentials Table
export const nmiCredentials = pgTable("nmi_credentials", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(), // Encrypted
  securityKey: varchar("security_key", { length: 255 }).notNull(), // Encrypted
  processorId: varchar("processor_id", { length: 255 }), // Optional
  gatewayUrl: varchar("gateway_url", { length: 500 }).default("https://secure.networkmerchants.com/api/transact.php"),
  isTestMode: boolean("is_test_mode").default(false),
  isActive: boolean("is_active").default(true),
  lastTestedAt: timestamp("last_tested_at", { mode: "string" }),
  testStatus: varchar("test_status", { length: 50 }), // success, failed, pending
  testErrorMessage: varchar("test_error_message", { length: 1000 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const insertNmiCredentialsSchema = createInsertSchema(nmiCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NmiCredentials = typeof nmiCredentials.$inferSelect;
export type InsertNmiCredentials = z.infer<typeof insertNmiCredentialsSchema>;
