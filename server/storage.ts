import {
  users,
  plans,
  whiteLabels,
  affiliates,
  subscriptions,
  commissions,
  purchaseHistory,
  categories,
  products,
  activities,
  endUserActivities,
  userSessions,
  domainUserSessions,
  referralTracking,
  integrations,
  integrationLogs,
  aiGeneratedContent,
  aiRecommendations,
  aiContentOptimizations,
  templates,
  themes,
  userThemePreferences,
  clientTemplateCustomizations,
  platformSettings,
  analyticsEvents,
  analyticsMetrics,
  landingPages,
  customDomains,
  announcements,
  announcementLikes,
  announcementComments,
  announcementShares,
  announcementAnalytics,
  referralLinks,
  referralSignups,
  referralClicks,
  affiliatePlanVisibility,
  referralCommissions,
  userPreferences,
  paymentAccounts,
  affiliatePayments,
  nmiCredentials,
  type User,
  type UpsertUser,
  type Plan,
  type InsertPlan,
  type WhiteLabel,
  type InsertWhiteLabel,
  type Affiliate,
  type InsertAffiliate,
  type Subscription,
  type InsertSubscription,
  type Commission,
  type PurchaseHistory,
  type InsertPurchaseHistory,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Activity,
  type InsertActivity,
  type EndUserActivity,
  type InsertEndUserActivity,
  type UserSession,
  type InsertUserSession,
  type Integration,
  type InsertIntegration,
  type IntegrationLog,
  type InsertIntegrationLog,
  type AiGeneratedContent,
  type InsertAiGeneratedContent,
  type ReferralLink,
  type InsertReferralLink,
  type ReferralSignup,
  type InsertReferralSignup,
  type ReferralClick,
  type InsertReferralClick,
  type AiRecommendation,
  type InsertAiRecommendation,
  type AiContentOptimization,
  type InsertAiContentOptimization,
  type UserPreferences,
  type InsertUserPreferences,
  insertAnnouncementSchema,
  insertAnnouncementCommentSchema,
  insertAnnouncementLikeSchema,
  insertAnnouncementShareSchema,
  insertAnnouncementAnalyticsSchema,
  planProducts,
  planCategories,
  linkMetaImages,
  insertPlanProductSchema,
  insertPlanCategorySchema,
  insertLinkMetaImageSchema,
  type Template,
  type InsertTemplate,
  type Theme,
  type InsertTheme,
  type UserThemePreference,
  type InsertUserThemePreference,
  type ClientTemplateCustomization,
  type InsertClientTemplateCustomization,
  type PlatformSetting,
  type InsertPlatformSetting,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type AnalyticsMetric,
  type InsertAnalyticsMetric,
  type LandingPage,
  type InsertLandingPage,
  type CustomDomain,
  type InsertCustomDomain,
  type AffiliatePlanVisibility,
  type InsertAffiliatePlanVisibility,
  type PaymentAccount,
  type InsertPaymentAccount,
  type AffiliatePayment,
  type InsertAffiliatePayment,
  type NmiCredentials,
  type InsertNmiCredentials,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, asc, not, inArray, gte, lte, isNotNull, sum } from "drizzle-orm";
import { z } from "zod";
import { defaultLandingPageElements, defaultLandingPageSettings } from "./defaultLandingPage";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<UpsertUser>): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
  
  // Referral code operations for Super Admin Affiliates and White Label Affiliates
  updateUserReferralCode(userId: string, referralCode: string): Promise<User>;
  checkReferralCodeAvailability(referralCode: string, excludeUserId?: string): Promise<boolean>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  getUsersByReferralCode(referralCode: string): Promise<User[]>;
  generateUniqueReferralCode(baseName: string): Promise<string>;
  

  
  // Plan operations
  getPlans(): Promise<Plan[]>;
  getPlansByUser(userId: string): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan>;
  getUserCurrentPlan(userId: string): Promise<Plan | null>;
  deletePlan(id: number): Promise<void>;
  togglePlanVisibility(id: number): Promise<Plan>;
  
  // White Label operations
  getWhiteLabels(): Promise<WhiteLabel[]>;
  getAllWhiteLabels(): Promise<WhiteLabel[]>;
  getWhiteLabel(id: number): Promise<WhiteLabel | undefined>;
  getWhiteLabelById(id: number): Promise<WhiteLabel | undefined>;
  getWhiteLabelByUserId(userId: string): Promise<WhiteLabel | undefined>;
  getWhiteLabelsByPlan(planId: number): Promise<WhiteLabel[]>;
  createWhiteLabel(whiteLabel: InsertWhiteLabel): Promise<WhiteLabel>;
  updateWhiteLabel(id: number, whiteLabel: Partial<InsertWhiteLabel>): Promise<WhiteLabel>;
  
  // Affiliate operations
  getAffiliates(): Promise<Affiliate[]>;
  getAffiliate(id: number): Promise<Affiliate | undefined>;
  getAffiliateByUserId(userId: string): Promise<Affiliate | undefined>;
  createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate>;
  
  // Subscription operations
  getSubscriptions(): Promise<Subscription[]>;
  getActiveSubscriptionsCount(): Promise<number>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Commission operations
  getCommissions(): Promise<Commission[]>;
  getTotalCommissionsPaid(): Promise<number>;
  
  // Referral commission operations for Super Admin Affiliates
  createReferralCommission(data: {
    affiliateId: string;
    subscriptionId: number;
    planId: number;
    referralCode: string;
    purchaserUserId: string;
    commissionAmount: string;
    commissionPercentage: string;
    planAmount: string;
  }): Promise<void>;
  getReferralCommissionsByAffiliate(affiliateId: string): Promise<any[]>;
  getTotalReferralCommissions(affiliateId: string): Promise<{ totalCommissions: string; totalReferrals: number }>;

  // Purchase operations
  getPurchases(): Promise<Purchase[]>;
  getPurchasesByUser(userId: string): Promise<Purchase[]>;
  getPurchasesByPlan(planId: number): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseStatus(id: number, status: string): Promise<Purchase>;
  
  // Purchase history operations for plan analytics
  createPurchaseHistory(purchase: InsertPurchaseHistory): Promise<PurchaseHistory>;
  
  // Category operations
  getCategoriesByWhiteLabel(whiteLabelId: number): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByUser(userId: string): Promise<Product[]>;
  getProductsByWhiteLabel(whiteLabelId: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Activity operations
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // End-user activity tracking
  createEndUserActivity(activity: InsertEndUserActivity): Promise<EndUserActivity>;
  getEndUserActivitiesByWhiteLabel(whiteLabelId: number, limit?: number): Promise<EndUserActivity[]>;
  getEndUserActivityStats(whiteLabelId: number): Promise<{
    totalSignups: number;
    totalLogins: number;
    totalPurchases: number;
    recentSignups: number;
    activeUsers: number;
  }>;
  
  // Referral tracking operations
  createReferralTracking(referralData: {
    affiliateId: string;
    referredUserId: string;
    whiteLabelId: number;
    domainPath: string;
    referralSource?: string;
  }): Promise<void>;
  getReferralsByAffiliate(affiliateId: string): Promise<any[]>;
  getReferralsByWhiteLabel(whiteLabelId: number): Promise<any[]>;
  
  // Affiliate plan visibility operations
  getAffiliatePlanVisibility(affiliateId: string): Promise<AffiliatePlanVisibility[]>;
  setAffiliatePlanVisibility(affiliateId: string, planId: number, isVisible: boolean): Promise<AffiliatePlanVisibility>;
  updateAffiliatePlanVisibility(planId: number, affiliateId: string, isVisible: boolean): Promise<void>;
  getVisiblePlansForAffiliate(affiliateId: string): Promise<Plan[]>;
  getPromotablePlansForAffiliate(affiliateId: string): Promise<Plan[]>;
  updateReferralStatus(id: number, status: string): Promise<void>;
  getReferralsByUser(userId: string): Promise<any[]>;
  
  // Super Admin specific methods
  getAllAffiliatesForSuperAdmin(): Promise<any[]>;
  getGlobalCommissionData(): Promise<any[]>;
  
  // User session tracking
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  updateUserSession(sessionToken: string, data: Partial<InsertUserSession>): Promise<void>;
  invalidateAllUserSessions(userId: string): Promise<void>;
  getActiveUsersByWhiteLabel(whiteLabelId: number): Promise<User[]>;
  getUserLoginStatus(userId: string): Promise<{ isOnline: boolean; lastActiveAt?: Date }>;
  
  // End-user management for white-label clients
  getEndUsersByWhiteLabel(whiteLabelId: number): Promise<{
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    lastLoginAt?: Date;
    isOnline: boolean;
    totalPurchases: number;
    totalSpent: string;
  }[]>;
  getEndUserPurchaseHistory(userId: string, whiteLabelId: number): Promise<Purchase[]>;
  
  // Analytics
  getTotalRevenue(): Promise<number>;
  getTotalRevenueForWhiteLabel(whiteLabelId: number): Promise<number>;
  
  // Integration operations
  getIntegrations(userId: string): Promise<Integration[]>;
  getIntegration(id: number): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, integration: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: number): Promise<void>;
  
  // Integration log operations
  getIntegrationLogs(integrationId: number): Promise<IntegrationLog[]>;
  createIntegrationLog(log: InsertIntegrationLog): Promise<IntegrationLog>;
  
  // AI Content Generation operations
  getAiGeneratedContent(userId: string): Promise<AiGeneratedContent[]>;
  createAiGeneratedContent(content: InsertAiGeneratedContent): Promise<AiGeneratedContent>;
  updateAiGeneratedContent(id: number, content: Partial<InsertAiGeneratedContent>): Promise<AiGeneratedContent>;
  
  // AI Recommendations operations
  getAiRecommendations(userId: string): Promise<AiRecommendation[]>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  markRecommendationViewed(id: number): Promise<void>;
  markRecommendationActioned(id: number): Promise<void>;
  
  // AI Content Optimization operations
  getAiContentOptimizations(userId: string): Promise<AiContentOptimization[]>;
  createAiContentOptimization(optimization: InsertAiContentOptimization): Promise<AiContentOptimization>;
  markOptimizationApplied(id: number): Promise<void>;
  
  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: number): Promise<void>;
  
  // Theme operations
  getThemes(): Promise<Theme[]>;
  getTheme(id: number): Promise<Theme | undefined>;
  createTheme(theme: InsertTheme): Promise<Theme>;
  updateTheme(id: number, theme: Partial<InsertTheme>): Promise<Theme>;
  deleteTheme(id: number): Promise<void>;
  
  // User theme preference operations
  getUserThemePreference(userId: string): Promise<UserThemePreference | undefined>;
  setUserThemePreference(userId: string, themeId: number): Promise<UserThemePreference>;
  clearUserThemePreference(userId: string): Promise<void>;
  
  // Client template customization operations
  getClientTemplateCustomizations(clientId: number): Promise<ClientTemplateCustomization[]>;
  getClientTemplateCustomization(id: number): Promise<ClientTemplateCustomization | undefined>;
  createClientTemplateCustomization(customization: InsertClientTemplateCustomization): Promise<ClientTemplateCustomization>;
  updateClientTemplateCustomization(id: number, customization: Partial<InsertClientTemplateCustomization>): Promise<ClientTemplateCustomization>;
  deleteClientTemplateCustomization(id: number): Promise<void>;
  
  // Platform settings operations
  getPlatformSettings(): Promise<PlatformSetting[]>;
  getPlatformSetting(key: string): Promise<PlatformSetting | undefined>;
  createPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting>;
  updatePlatformSetting(key: string, setting: Partial<InsertPlatformSetting>): Promise<PlatformSetting>;
  deletePlatformSetting(key: string): Promise<void>;
  
  // Analytics operations
  getAnalyticsEvents(filters?: { userId?: string; eventType?: string; startDate?: Date; endDate?: Date }): Promise<AnalyticsEvent[]>;
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsMetrics(filters?: { metricName?: string; period?: string; startDate?: Date; endDate?: Date }): Promise<AnalyticsMetric[]>;
  createAnalyticsMetric(metric: InsertAnalyticsMetric): Promise<AnalyticsMetric>;
  getAnalyticsOverview(): Promise<{
    totalUsers: number;
    totalEvents: number;
    topEvents: { eventType: string; count: number }[];
    recentActivity: AnalyticsEvent[];
  }>;
  
  // Products operations removed - use getProductsByUser() for user-specific data
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Landing page operations
  getLandingPages(userId: string): Promise<LandingPage[]>;
  getLandingPage(id: number): Promise<LandingPage | undefined>;
  getLandingPageByDomainPath(domainPath: string): Promise<LandingPage | undefined>;
  createLandingPage(landingPage: InsertLandingPage): Promise<LandingPage>;
  updateLandingPage(id: number, landingPage: Partial<InsertLandingPage>): Promise<LandingPage>;
  deleteLandingPage(id: number): Promise<void>;
  publishLandingPage(id: number): Promise<LandingPage>;
  clearAllUserDomainPaths(userId: string): Promise<void>;
  validateDomainPath(domainPath: string, excludeId?: number, currentUserId?: string): Promise<{ available: boolean; message: string; ownedBySameUser?: boolean }>;
  
  // Custom domain operations
  getCustomDomains(userId: string): Promise<CustomDomain[]>;
  getCustomDomain(id: number): Promise<CustomDomain | undefined>;
  getCustomDomainByDomain(domain: string): Promise<CustomDomain | undefined>;
  createCustomDomain(customDomain: InsertCustomDomain): Promise<CustomDomain>;
  updateCustomDomain(id: number, customDomain: Partial<InsertCustomDomain>): Promise<CustomDomain>;
  deleteCustomDomain(id: number): Promise<void>;
  verifyCustomDomain(id: number): Promise<CustomDomain>;
  generateVerificationToken(): string;

  // Referral tracking operations
  getReferralLink(userId: string): Promise<ReferralLink | undefined>;
  createReferralLink(userId: string): Promise<ReferralLink>;
  getReferralStats(userId: string): Promise<{ totalClicks: number; totalSignups: number; whitelabelClients: number; conversionRate: number }>;
  getReferralClients(userId: string): Promise<{ id: string; email: string; firstName: string; lastName: string; createdAt: string; businessName?: string }[]>;
  trackReferralClick(referralCode: string, ipAddress?: string, userAgent?: string): Promise<ReferralClick>;
  trackReferralSignup(referralCode: string, signupUserId: string, ipAddress?: string, userAgent?: string): Promise<ReferralSignup>;
  
  // Plan-Product Management operations
  linkPlanToProduct(planId: number, productId: number): Promise<void>;
  unlinkPlanFromProduct(planId: number, productId: number): Promise<void>;
  getPlanProducts(planId: number): Promise<Product[]>;
  getProductsByPlan(planId: number): Promise<Product[]>;
  
  // Plan-Category Management operations  
  linkPlanToCategory(planId: number, categoryId: number): Promise<void>;
  unlinkPlanFromCategory(planId: number, categoryId: number): Promise<void>;
  getPlanCategories(planId: number): Promise<Category[]>;
  getCategoriesByPlan(planId: number): Promise<Category[]>;
  
  // End-User Plan Access operations
  getUserPurchasedPlans(userId: string): Promise<{
    id: number;
    name: string;
    description: string | null;
    monthlyPrice: string | null;
    purchaseDate: Date;
    categories: Category[];
    products: Product[];
  }[]>;
  
  // Link Meta Images operations
  createLinkMetaImage(data: z.infer<typeof insertLinkMetaImageSchema>): Promise<typeof linkMetaImages.$inferSelect>;
  getLinkMetaImage(url: string): Promise<typeof linkMetaImages.$inferSelect | undefined>;
  updateLinkMetaImage(id: number, updates: Partial<z.infer<typeof insertLinkMetaImageSchema>>): Promise<typeof linkMetaImages.$inferSelect>;
  
  // Announcements operations
  getAnnouncements(userId: string, limit?: number, offset?: number): Promise<any[]>;
  getPublicAnnouncements(limit?: number, offset?: number): Promise<any[]>;
  getSuperAdminAnnouncements(userId?: string, limit?: number, offset?: number): Promise<any[]>;
  createAnnouncement(announcementData: z.infer<typeof insertAnnouncementSchema>): Promise<any>;
  likeAnnouncement(announcementId: number, userId: string): Promise<void>;
  createAnnouncementComment(data: z.infer<typeof insertAnnouncementCommentSchema>): Promise<any>;
  
  // Announcement analytics operations
  createAnnouncementAnalytics(data: z.infer<typeof insertAnnouncementAnalyticsSchema>): Promise<any>;
  getAnnouncementAnalytics(announcementId: number): Promise<{
    views: number;
    clicks: number;
    conversions: number;
    viewsData: any[];
    clicksData: any[];
    conversionsData: any[];
  }>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  getScheduledPlansReadyToPublish(currentTime: string): Promise<Plan[]>;
  
  // Payment account operations
  getPaymentAccount(userId: string): Promise<PaymentAccount | undefined>;
  createPaymentAccount(account: InsertPaymentAccount): Promise<PaymentAccount>;
  updatePaymentAccount(userId: string, account: Partial<InsertPaymentAccount>): Promise<PaymentAccount>;
  
  // Organization creation operations
  createOrganization(organizationData: {
    businessName: string;
    organizationFirstName: string;
    organizationLastName: string;
    username: string;
    password: string;
    domainPath: string;
    industry?: string;
    website?: string;
  }): Promise<{ user: User; whiteLabel: WhiteLabel }>;
  
  // NMI Credentials operations
  getNmiCredentials(userId: string): Promise<NmiCredentials | undefined>;
  createNmiCredentials(credentials: InsertNmiCredentials): Promise<NmiCredentials>;
  updateNmiCredentials(userId: string, credentials: Partial<InsertNmiCredentials>): Promise<NmiCredentials>;
  deleteNmiCredentials(userId: string): Promise<void>;
  testNmiCredentials(userId: string): Promise<{ success: boolean; error?: string }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      console.log('🔍 getUserById result for', id, ':', JSON.stringify(user, null, 2));
      console.log('📞 Phone field in getUserById:', user?.phone);
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // Domain-specific user lookup
  async getDomainSpecificUserByEmail(email: string, domainPath: string): Promise<User | undefined> {
    const whiteLabel = await this.getWhiteLabelByDomainPath(domainPath);
    if (!whiteLabel) {
      return undefined;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.whiteLabelId, whiteLabel.id)
        )
      );
    return user;
  }

  // Domain-specific session management
  async createDomainUserSession(userId: string, domainPath: string, sessionId: string): Promise<void> {
    const whiteLabel = await this.getWhiteLabelByDomainPath(domainPath);
    if (!whiteLabel) {
      throw new Error(`No white-label client found for domain: ${domainPath}`);
    }

    // CRITICAL: For domain isolation, deactivate ALL existing sessions for this user on ALL domains
    // This ensures end-users can only be logged into one domain at a time
    await db
      .update(domainUserSessions)
      .set({ isActive: false })
      .where(eq(domainUserSessions.userId, userId));

    // Create new active session ONLY for this specific domain
    await db.insert(domainUserSessions).values({
      userId,
      domainPath,
      whiteLabelId: whiteLabel.id,
      sessionId,
      isActive: true,
      lastActivity: new Date(),
    });
    
    console.log(`Created EXCLUSIVE domain session for user ${userId} on domain ${domainPath} - all other domain sessions deactivated`);
  }

  async getDomainUserSession(userId: string, domainPath: string): Promise<any> {
    const [session] = await db
      .select()
      .from(domainUserSessions)
      .where(
        and(
          eq(domainUserSessions.userId, userId),
          eq(domainUserSessions.domainPath, domainPath),
          eq(domainUserSessions.isActive, true)
        )
      );
    return session;
  }

  async removeDomainUserSession(userId: string, domainPath: string): Promise<void> {
    await db
      .update(domainUserSessions)
      .set({ isActive: false })
      .where(
        and(
          eq(domainUserSessions.userId, userId),
          eq(domainUserSessions.domainPath, domainPath)
        )
      );
  }

  async getDomainUserSessionsBySessionId(sessionId: string, domainPath: string): Promise<any[]> {
    const sessions = await db
      .select()
      .from(domainUserSessions)
      .where(
        and(
          eq(domainUserSessions.sessionId, sessionId),
          eq(domainUserSessions.domainPath, domainPath),
          eq(domainUserSessions.isActive, true)
        )
      );
    return sessions;
  }

  // Get end-users specific to a white-label client
  async getEndUsersByWhiteLabel(whiteLabelId: number): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(
        and(
          eq(users.role, 'end_user'),
          eq(users.whiteLabelId, whiteLabelId)
        )
      )
      .orderBy(desc(users.createdAt));
  }

  // Get purchase history specific to a white-label client
  async getPurchasesByWhiteLabel(whiteLabelId: number): Promise<PurchaseHistory[]> {
    return db
      .select({
        id: purchaseHistory.id,
        userId: purchaseHistory.userId,
        whiteLabelId: purchaseHistory.whiteLabelId,
        planId: purchaseHistory.planId,
        amount: purchaseHistory.amount,
        transactionId: purchaseHistory.transactionId,
        paymentMethod: purchaseHistory.paymentMethod,
        status: purchaseHistory.status,
        metadata: purchaseHistory.metadata,
        createdAt: purchaseHistory.createdAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username
        }
      })
      .from(purchaseHistory)
      .leftJoin(users, eq(purchaseHistory.userId, users.id))
      .where(eq(purchaseHistory.whiteLabelId, whiteLabelId))
      .orderBy(desc(purchaseHistory.createdAt));
  }

  async createUser(userData: UpsertUser): Promise<User> {
    // Auto-generate referral code for Super Admin Affiliates
    if (userData.role === 'super_admin_affiliate' && !userData.referralCode) {
      const baseName = userData.firstName || userData.email?.split('@')[0] || 'affiliate';
      userData.referralCode = await this.generateUniqueReferralCode(baseName);
    }

    await db
      .insert(users)
      .values(userData);
    
    // Fetch the created user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userData.id))
      .limit(1);
    return user;
  }

  // Domain-specific user creation
  async createDomainSpecificUser(userData: UpsertUser, domainPath: string): Promise<User> {
    // Find the white-label client for this domain
    const whiteLabel = await this.getWhiteLabelByDomainPath(domainPath);
    if (!whiteLabel) {
      throw new Error(`No white-label client found for domain: ${domainPath}`);
    }

    // Create user with white-label association
    const userWithDomain = {
      ...userData,
      whiteLabelId: whiteLabel.id,
      role: 'end_user' as const
    };

    // PostgreSQL supports .returning(), use it to get the created record
    const [user] = await db
      .insert(users)
      .values(userWithDomain)
      .returning();
    
    return user;
  }

  // Get domain-specific user
  async getDomainSpecificUser(userId: string, domainPath: string): Promise<User | undefined> {
    const whiteLabel = await this.getWhiteLabelByDomainPath(domainPath);
    if (!whiteLabel) {
      return undefined;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, userId),
          eq(users.whiteLabelId, whiteLabel.id)
        )
      );
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Auto-generate referral code for Super Admin Affiliates on creation
    if (userData.role === 'super_admin_affiliate' && !userData.referralCode) {
      // Check if user already exists
      const existingUser = await this.getUserById(userData.id);
      if (!existingUser || !existingUser.referralCode) {
        const baseName = userData.firstName || userData.email?.split('@')[0] || 'affiliate';
        userData.referralCode = await this.generateUniqueReferralCode(baseName);
      }
    }

    // PostgreSQL supports native upsert with onConflictDoUpdate
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        }
      })
      .returning();
    
    return user;
  }

  async updateUser(userId: string, updates: Partial<UpsertUser>): Promise<User> {
    // PostgreSQL supports .returning(), use it to get the updated record
    const [user] = await db
      .update(users)
      .set({ 
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    // PostgreSQL supports .returning(), use it to get the updated record
    const [user] = await db
      .update(users)
      .set({ 
        role: role as any,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  // Referral code operations for Super Admin Affiliates and White Label Affiliates
  async updateUserReferralCode(userId: string, referralCode: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        referralCode,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning(); // PostgreSQL supports .returning()
    return user;
  }

  async checkReferralCodeAvailability(referralCode: string, excludeUserId?: string): Promise<boolean> {
    if (excludeUserId) {
      // Check if referral code exists for other users (excluding current user)
      const [existingUser] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.referralCode, referralCode),
            not(eq(users.id, excludeUserId))
          )
        );
      return !existingUser;
    } else {
      // Check if referral code exists for any user
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.referralCode, referralCode));
      return !existingUser;
    }
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.referralCode, referralCode));
    return user;
  }

  async getUsersByReferralCode(referralCode: string): Promise<User[]> {
    // First, get the affiliate user by their referral code
    const affiliate = await this.getUserByReferralCode(referralCode);
    if (!affiliate) {
      return [];
    }

    // Get all referral tracking records for this affiliate
    const referralRecords = await db
      .select()
      .from(referralTracking)
      .where(eq(referralTracking.affiliateId, affiliate.id));

    if (referralRecords.length === 0) {
      return [];
    }

    // Get all referred user IDs
    const referredUserIds = referralRecords.map(r => r.referredUserId);

    // Fetch all referred users
    const referredUsers = await db
      .select()
      .from(users)
      .where(inArray(users.id, referredUserIds));

    return referredUsers;
  }

  async generateUniqueReferralCode(baseName: string): Promise<string> {
    let referralCode = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let counter = 0;
    
    while (true) {
      const testCode = counter === 0 ? referralCode : `${referralCode}${counter}`;
      const isAvailable = await this.checkReferralCodeAvailability(testCode);
      if (isAvailable) {
        return testCode;
      }
      counter++;
    }
  }



  async getPlans(): Promise<Plan[]> {
    const rawPlans = await db.select().from(plans).orderBy(desc(plans.createdAt));
    return rawPlans.map(plan => this.parsePlanJsonFields(plan));
  }

  // Helper function to parse JSON fields in Plan objects
  private parsePlanJsonFields(plan: any): Plan {
    let selectedCategories = [];
    let selectedProducts = [];

    // Parse selectedCategories
    try {
      if (typeof plan.selectedCategories === 'string') {
        selectedCategories = JSON.parse(plan.selectedCategories);
      } else if (Array.isArray(plan.selectedCategories)) {
        selectedCategories = plan.selectedCategories;
      }
    } catch (error) {
      console.error('Error parsing selectedCategories:', error, 'Raw value:', plan.selectedCategories);
      selectedCategories = [];
    }

    // Parse selectedProducts
    try {
      if (typeof plan.selectedProducts === 'string') {
        selectedProducts = JSON.parse(plan.selectedProducts);
      } else if (Array.isArray(plan.selectedProducts)) {
        selectedProducts = plan.selectedProducts;
      }
    } catch (error) {
      console.error('Error parsing selectedProducts:', error, 'Raw value:', plan.selectedProducts);
      selectedProducts = [];
    }

    console.log(`🔍 BACKEND DEBUG - Plan ${plan.id} (${plan.name}):`);
    console.log(`  Raw selectedCategories: ${plan.selectedCategories} (type: ${typeof plan.selectedCategories})`);
    console.log(`  Parsed selectedCategories:`, selectedCategories);
    console.log(`  Raw selectedProducts: ${plan.selectedProducts} (type: ${typeof plan.selectedProducts})`);
    console.log(`  Parsed selectedProducts:`, selectedProducts);

    return {
      ...plan,
      selectedCategories,
      selectedProducts
    };
  }

  async getPlansByUser(userId: string): Promise<Plan[]> {
    const user = await this.getUser(userId);
    if (!user) {
      return [];
    }

    let rawPlans: any[] = [];

    // If user is Super Admin, return plans they created
    if (user.role === 'super_admin') {
      rawPlans = await db
        .select()
        .from(plans)
        .where(eq(plans.createdBy, userId))
        .orderBy(desc(plans.createdAt));
    }
    
    // If user is White-Label Client, return plans they created
    else if (user.role === 'white_label_client') {
      rawPlans = await db
        .select()
        .from(plans)
        .where(eq(plans.createdBy, userId))
        .orderBy(desc(plans.createdAt));
    }
    
    // If user is White-Label Affiliate, return their parent's plans
    else if (user.role === 'white_label_affiliate') {
      const affiliate = await this.getAffiliateByUserId(userId);
      if (affiliate && affiliate.parentId) {
        const parentWhiteLabel = await this.getWhiteLabel(affiliate.parentId);
        if (parentWhiteLabel) {
          rawPlans = await db
            .select()
            .from(plans)
            .where(eq(plans.createdBy, parentWhiteLabel.userId))
            .orderBy(desc(plans.createdAt));
        }
      }
    }
    
    // Parse JSON fields for all plans
    return rawPlans.map(plan => this.parsePlanJsonFields(plan));
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan ? this.parsePlanJsonFields(plan) : undefined;
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    console.log('storage.createPlan received plan data:', {
      selectedCategories: plan.selectedCategories,
      selectedProducts: plan.selectedProducts,
      name: plan.name
    });
    
    // PostgreSQL supports .returning(), use it to get the created record
    const [newPlan] = await db.insert(plans).values(plan).returning();
    
    console.log('Plan created:', {
      id: newPlan.id,
      name: newPlan.name,
      selectedCategories: newPlan.selectedCategories,
      selectedProducts: newPlan.selectedProducts
    });
    
    return this.parsePlanJsonFields(newPlan);
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id));
    return plan ? this.parsePlanJsonFields(plan) : undefined;
  }

  async updatePlan(id: number, planData: Partial<InsertPlan>): Promise<Plan> {
    const updateData = { ...planData };
    delete (updateData as any).updatedAt;
    
    // MySQL doesn't support .returning(), so we update first then query the updated record
    await db
      .update(plans)
      .set(updateData)
      .where(eq(plans.id, id));
    
    const [updatedPlan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id));
    
    return this.parsePlanJsonFields(updatedPlan);
  }

  async togglePlanVisibility(id: number): Promise<Plan> {
    // Get current plan state
    const plan = await this.getPlan(id);
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    // Toggle visibility
    const [updatedPlan] = await db
      .update(plans)
      .set({ isPublic: !plan.isPublic, updatedAt: new Date() })
      .where(eq(plans.id, id))
      ; // .returning() removed for MySQL compatibility
    return this.parsePlanJsonFields(updatedPlan);
  }

  async deletePlan(id: number): Promise<void> {
    await db.delete(plans).where(eq(plans.id, id));
  }

  async getUserCurrentPlan(userId: string): Promise<Plan | null> {
    try {
      // First get the white-label ID for this user
      const whiteLabel = await this.getWhiteLabelByUserId(userId);
      if (!whiteLabel) {
        return null;
      }

      // Get the user's active subscription to find their current plan
      const [subscription] = await db
        .select({
          plan: plans,
        })
        .from(subscriptions)
        .innerJoin(plans, eq(subscriptions.planId, plans.id))
        .where(
          and(
            eq(subscriptions.whiteLabelId, whiteLabel.id),
            eq(subscriptions.status, 'active')
          )
        )
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      return subscription?.plan ? this.parsePlanJsonFields(subscription.plan) : null;
    } catch (error) {
      console.error('Error getting user current plan:', error);
      return null;
    }
  }

  async getWhiteLabels(): Promise<WhiteLabel[]> {
    return db.select().from(whiteLabels).orderBy(desc(whiteLabels.createdAt));
  }

  async getWhiteLabel(id: number): Promise<WhiteLabel | undefined> {
    const [whiteLabel] = await db.select().from(whiteLabels).where(eq(whiteLabels.id, id));
    return whiteLabel;
  }

  async getWhiteLabelById(id: number): Promise<WhiteLabel | undefined> {
    const [whiteLabel] = await db.select().from(whiteLabels).where(eq(whiteLabels.id, id));
    return whiteLabel;
  }

  async getWhiteLabelByUserId(userId: string): Promise<WhiteLabel | undefined> {
    const [whiteLabel] = await db.select().from(whiteLabels).where(eq(whiteLabels.userId, userId));
    return whiteLabel;
  }

  async getWhiteLabelsByUserId(userId: string): Promise<WhiteLabel[]> {
    const whiteLabelsList = await db.select().from(whiteLabels).where(eq(whiteLabels.userId, userId)).orderBy(desc(whiteLabels.createdAt));
    return whiteLabelsList;
  }

  async getAllWhiteLabels(): Promise<WhiteLabel[]> {
    return db.select().from(whiteLabels).orderBy(desc(whiteLabels.createdAt));
  }

  async getWhiteLabelsByPlan(planId: number): Promise<WhiteLabel[]> {
    return await db.select().from(whiteLabels).where(eq(whiteLabels.planId, planId));
  }

  async getWhiteLabelByDomainPath(domainPath: string): Promise<WhiteLabel | undefined> {
    const [whiteLabel] = await db.select().from(whiteLabels).where(eq(whiteLabels.domainPath, domainPath));
    return whiteLabel;
  }

  async setDefaultLandingPage(whiteLabelId: number, landingPageId: number): Promise<void> {
    await db.update(whiteLabels)
      .set({ 
        defaultLandingPageId: landingPageId,
        landingPageCode: 'default'
      })
      .where(eq(whiteLabels.id, whiteLabelId));
  }

  async setLandingPageAsDomainPage(landingPageId: number, domainPath: string): Promise<void> {
    // Update the white label's default landing page based on domain path
    await db.update(whiteLabels)
      .set({ 
        defaultLandingPageId: landingPageId,
        landingPageCode: 'default'
      })
      .where(eq(whiteLabels.domainPath, domainPath));
  }

  async createWhiteLabel(whiteLabel: InsertWhiteLabel): Promise<WhiteLabel> {
    // PostgreSQL supports .returning(), use it to get the created record
    const [newWhiteLabel] = await db
      .insert(whiteLabels)
      .values(whiteLabel)
      .returning();
    
    // FIXED: Automatically create a default landing page for new white-label clients
    // This prevents "Domain Not Available" errors for new domains
    if (!newWhiteLabel.defaultLandingPageId) {
      try {
        console.log('Creating default landing page for new white-label:', newWhiteLabel.businessName);
        
        // Import default settings
        const { defaultLandingPageSettings } = await import('./defaultLandingPage');
        
        const defaultLandingPage = await this.createLandingPage({
          userId: newWhiteLabel.userId,
          name: `${newWhiteLabel.businessName} - Default Landing Page`,
          elements: [
            {
              id: 'hero-section',
              type: 'hero',
              content: {
                title: `Welcome to ${newWhiteLabel.businessName}`,
                subtitle: 'Professional Solutions for Your Business',
                primaryButtonText: 'Get Started',
                primaryButtonUrl: '/pricing',
                backgroundImage: '',
                layout: 'center'
              },
              position: { x: 0, y: 0 },
              size: { width: 100, height: 60 }
            },
            {
              id: 'features-section',
              type: 'features',
              content: {
                title: 'Our Services',
                features: [
                  {
                    title: 'Expert Solutions',
                    description: 'Professional services tailored to your needs.',
                    icon: 'star'
                  },
                  {
                    title: '24/7 Support',
                    description: 'Round-the-clock assistance when you need it.',
                    icon: 'support'
                  },
                  {
                    title: 'Proven Results',
                    description: 'Track record of successful implementations.',
                    icon: 'trophy'
                  }
                ]
              },
              position: { x: 0, y: 60 },
              size: { width: 100, height: 40 }
            }
          ],
          settings: defaultLandingPageSettings,
          isPublished: true,
          domainPath: newWhiteLabel.domainPath
        });
        
        // Set this landing page as the default for the white-label
        await this.setDefaultLandingPage(newWhiteLabel.id, defaultLandingPage.id);
        
        // Update the returned white-label object to include the default landing page ID
        newWhiteLabel.defaultLandingPageId = defaultLandingPage.id;
        
        console.log('Default landing page created and set for white-label:', newWhiteLabel.id, 'landing page ID:', defaultLandingPage.id);
      } catch (error) {
        console.error('Error creating default landing page for white-label:', error);
        // Don't fail the white-label creation if landing page creation fails
      }
    }
    
    return newWhiteLabel;
  }

  async updateWhiteLabel(id: number, whiteLabel: Partial<InsertWhiteLabel>): Promise<WhiteLabel> {
    const [updatedWhiteLabel] = await db
      .update(whiteLabels)
      .set({ ...whiteLabel, updatedAt: new Date() })
      .where(eq(whiteLabels.id, id))
      .returning();
    return updatedWhiteLabel;
  }

  async getAffiliates(): Promise<Affiliate[]> {
    return db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
  }

  async getAffiliate(id: number): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, id));
    return affiliate;
  }

  async getAffiliateByUserId(userId: string): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.userId, userId));
    return affiliate;
  }

  // Get affiliates associated with a white-label client
  async getAffiliatesByWhiteLabel(whiteLabelId: number): Promise<any[]> {
    // For now, get end-users with the white-label ID who act as affiliates
    // This is a temporary solution - in the future we might have a dedicated affiliates table
    const affiliateUsers = await db
      .select({
        userId: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        whiteLabelId: users.whiteLabelId
      })
      .from(users)
      .where(and(
        eq(users.whiteLabelId, whiteLabelId),
        eq(users.role, 'end_user')
      ));
    
    return affiliateUsers;
  }

  // Get active domain sessions for affiliate tracking
  async getActiveDomainSessions(domainPath: string, whiteLabelId: number): Promise<any[]> {
    const sessions = await db
      .select({
        userId: domainUserSessions.userId,
        userEmail: users.email,
        userRole: users.role
      })
      .from(domainUserSessions)
      .leftJoin(users, eq(domainUserSessions.userId, users.id))
      .where(and(
        eq(domainUserSessions.domainPath, domainPath),
        eq(domainUserSessions.isActive, true),
        eq(domainUserSessions.whiteLabelId, whiteLabelId)
      ));
    
    return sessions;
  }

  // Get detailed referrals for an affiliate with end-user purchase information
  async getDetailedReferralsByAffiliate(affiliateId: string, domainPath: string): Promise<any[]> {
    const referrals = await db
      .select({
        // End-user info (group by user to avoid duplicates)
        endUserId: users.id,
        endUserEmail: users.email,
        endUserFirstName: users.firstName,
        endUserLastName: users.lastName,
        endUserSignupDate: users.createdAt,
        // Get the earliest referral date for this user
        referralDate: sql<string>`MIN(${referralTracking.createdAt})`,
        referralSource: sql<string>`MIN(${referralTracking.referralSource})`,
        status: sql<string>`MIN(${referralTracking.status})`,
        // Purchase info aggregated per user
        totalPurchases: sql<number>`COUNT(DISTINCT ${purchaseHistory.id})`,
        totalSpent: sql<number>`COALESCE(SUM(${purchaseHistory.amount}), 0)`,
        // Commission info - cast percentage to numeric first, handle empty strings as 0
        totalCommissionEarned: sql<number>`COALESCE(SUM(${purchaseHistory.amount} * CASE WHEN ${plans.affiliateCommissionPercentage} = '' OR ${plans.affiliateCommissionPercentage} IS NULL THEN 0 ELSE CAST(${plans.affiliateCommissionPercentage} AS NUMERIC) END / 100), 0)`
      })
      .from(referralTracking)
      .leftJoin(users, eq(referralTracking.referredUserId, users.id))
      .leftJoin(purchaseHistory, and(
        eq(purchaseHistory.userId, referralTracking.referredUserId),
        eq(purchaseHistory.status, 'completed')
      ))
      .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
      .where(
        eq(referralTracking.affiliateId, affiliateId)
        // Remove domain restriction to show all affiliate referrals across domains
      )
      .groupBy(
        // Group by user only to prevent duplicates
        users.id,
        users.email,
        users.firstName,
        users.lastName,
        users.createdAt
      )
      .orderBy(sql`MIN(${referralTracking.createdAt}) DESC`);

    return referrals;
  }

  async createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate> {
    // PostgreSQL supports .returning(), use it to get the created record
    const [newAffiliate] = await db
      .insert(affiliates)
      .values(affiliate)
      .returning();
    
    return newAffiliate;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }

  async getActiveSubscriptionsCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));
    return result.count;
  }

  async getCommissions(): Promise<Commission[]> {
    return db.select().from(commissions).orderBy(desc(commissions.createdAt));
  }

  async getTotalCommissionsPaid(): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`coalesce(sum(${commissions.amount}), 0)` })
      .from(commissions)
      .where(eq(commissions.status, "paid"));
    return result.total;
  }

  // Referral commission operations for Super Admin Affiliates
  async createReferralCommission(data: {
    affiliateId: string;
    subscriptionId: number;
    planId: number;
    referralCode: string;
    purchaserUserId: string;
    commissionAmount: string;
    commissionPercentage: string;
    planAmount: string;
  }): Promise<void> {
    await db.insert(referralCommissions).values({
      affiliateId: data.affiliateId,
      subscriptionId: data.subscriptionId,
      planId: data.planId,
      referralCode: data.referralCode,
      purchaserUserId: data.purchaserUserId,
      commissionAmount: data.commissionAmount,
      commissionPercentage: data.commissionPercentage,
      planAmount: data.planAmount,
    });
  }

  async getReferralCommissionsByAffiliate(affiliateId: string): Promise<any[]> {
    // Fetch raw commission rows
    const rows = await db
      .select({
        id: referralCommissions.id,
        subscriptionId: referralCommissions.subscriptionId,
        planId: referralCommissions.planId,
        planName: plans.name,
        commissionAmount: referralCommissions.commissionAmount,
        commissionPercentage: referralCommissions.commissionPercentage,
        planAmount: referralCommissions.planAmount,
        referralCode: referralCommissions.referralCode,
        purchaserEmail: users.email,
        purchaserName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        status: referralCommissions.status,
        createdAt: referralCommissions.createdAt,
      })
      .from(referralCommissions)
      .leftJoin(plans, eq(referralCommissions.planId, plans.id))
      .leftJoin(users, eq(referralCommissions.purchaserUserId, users.id))
      .where(eq(referralCommissions.affiliateId, affiliateId))
      .orderBy(desc(referralCommissions.createdAt));

    // Deduplicate by subscriptionId when available (unique purchase)
    const seenSubs = new Set<number | string>();
    const deduped = rows.filter((r) => {
      if (r.subscriptionId == null) return true; // no subscription id, keep
      if (seenSubs.has(r.subscriptionId)) return false;
      seenSubs.add(r.subscriptionId);
      return true;
    });

    return deduped;
  }

  async getTotalReferralCommissions(affiliateId: string): Promise<{ totalCommissions: string; totalReferrals: number }> {
    // Pull commission rows and deduplicate by subscriptionId
    const rows = await db
      .select({
        subscriptionId: referralCommissions.subscriptionId,
        commissionAmount: referralCommissions.commissionAmount,
      })
      .from(referralCommissions)
      .where(eq(referralCommissions.affiliateId, affiliateId));

    const seenSubs = new Set<number | string>();
    let totalCommissionNum = 0;
    let totalReferralsNum = 0;

    for (const r of rows) {
      const key = r.subscriptionId ?? Symbol('no-sub');
      if (r.subscriptionId == null || !seenSubs.has(key)) {
        if (r.subscriptionId != null) seenSubs.add(key);
        totalCommissionNum += parseFloat(r.commissionAmount || '0');
        totalReferralsNum += 1;
      }
    }

    return {
      totalCommissions: totalCommissionNum.toFixed(2),
      totalReferrals: totalReferralsNum,
    };
  }

  // Methods for new affiliate commission system
  async getAffiliateCommissions(affiliateId: string): Promise<any[]> {
    return this.getReferralCommissionsByAffiliate(affiliateId);
  }

  async getAffiliateStats(affiliateId: string): Promise<any> {
    const commissions = await this.getTotalReferralCommissions(affiliateId);
    
    // Get total clicks from referral clicks table
    const [clicksResult] = await db
      .select({
        totalClicks: sql<number>`count(*)`,
      })
      .from(referralClicks)
      .leftJoin(users, eq(referralClicks.referralCode, users.referralCode))
      .where(eq(users.id, affiliateId));

    const conversionRate = clicksResult.totalClicks > 0 
      ? ((Number(commissions.totalReferrals) / clicksResult.totalClicks) * 100).toFixed(1) + '%'
      : '0%';

    return {
      totalCommissions: commissions.totalCommissions,
      totalReferrals: commissions.totalReferrals,
      totalClicks: clicksResult.totalClicks || 0,
      conversionRate,
    };
  }

  async getReferralPerformance(affiliateId: string): Promise<any[]> {
    // Get the user's referral code
    const user = await this.getUserById(affiliateId);
    if (!user?.referralCode) return [];

    // Get performance data for this referral code
    const [clickData] = await db
      .select({
        referralCode: users.referralCode,
        totalClicks: sql<number>`count(${referralClicks.id})`,
      })
      .from(users)
      .leftJoin(referralClicks, eq(users.referralCode, referralClicks.referralCode))
      .where(eq(users.id, affiliateId))
      .groupBy(users.referralCode);

    const [commissionData] = await db
      .select({
        totalPurchases: sql<number>`count(*)`,
        totalSignups: sql<number>`count(distinct ${referralCommissions.purchaserUserId})`,
      })
      .from(referralCommissions)
      .where(eq(referralCommissions.affiliateId, affiliateId));

    return [{
      referralCode: user.referralCode,
      totalClicks: clickData?.totalClicks || 0,
      totalSignups: commissionData?.totalSignups || 0,
      totalPurchases: commissionData?.totalPurchases || 0,
    }];
  }

  async trackReferralClick(data: { affiliateId: string; referralCode: string; ipAddress?: string; userAgent?: string }): Promise<ReferralClick> {
    const [click] = await db
      .insert(referralClicks)
      .values({
        referralCode: data.referralCode,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      })
      .returning();

    return click;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    // PostgreSQL supports .returning(), use it to get the created record
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    
    if (!newSubscription) {
      throw new Error('Failed to create subscription');
    }
    
    return newSubscription;
  }

  async cancelExistingSubscriptions(whiteLabelId: number): Promise<void> {
    await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(subscriptions.whiteLabelId, whiteLabelId),
          eq(subscriptions.status, 'active')
        )
      );
  }

  async cancelExistingSubscriptionsByUserId(userId: string): Promise<void> {
    // First get the user's white label ID
    const userWhiteLabel = await db
      .select({ id: whiteLabels.id })
      .from(whiteLabels)
      .where(eq(whiteLabels.userId, userId))
      .limit(1);
    
    if (userWhiteLabel.length === 0) {
      console.log('No white label found for user:', userId);
      return;
    }
    
    await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(subscriptions.whiteLabelId, userWhiteLabel[0].id),
          eq(subscriptions.status, 'active')
        )
      );
  }

  // Category operations
  async getCategoriesByWhiteLabel(whiteLabelId: number): Promise<Category[]> {
    return db
      .select()
      .from(categories)
      .where(eq(categories.whiteLabelId, whiteLabelId))
      .orderBy(categories.parentCategoryId, categories.name);
  }

  async getCategories(userId: string): Promise<Category[]> {
    // Get user to check role
    const user = await this.getUser(userId);
    if (!user) {
      return [];
    }

    // Super admin can see all categories (platform owner privilege)
    if (user.role === 'super_admin') {
      return await db
        .select()
        .from(categories)
        .orderBy(categories.name);
    }

    // Regular users need a white label
    const whiteLabel = await this.getWhiteLabelByUserId(userId);
    if (!whiteLabel) {
      return [];
    }
    
    return await db
      .select()
      .from(categories)
      .where(eq(categories.whiteLabelId, whiteLabel.id))
      .orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    // PostgreSQL supports .returning(), use it to get the created record
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    // PostgreSQL supports .returning(), use it to get the updated record
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...categoryData, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getProductsByWhiteLabel(whiteLabelId: number): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.whiteLabelId, whiteLabelId))
      .orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .orderBy(desc(products.createdAt));
  }



  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    console.log('🔍 [Storage] getRecentActivities called with limit:', limit);
    
    try {
      const activities = await db
        .select()
        .from(activities)
        .orderBy(desc(activities.createdAt))
        .limit(limit);
      
      console.log('✅ [Storage] getRecentActivities retrieved activities:', {
        count: activities.length,
        limit,
        activities: activities.map(a => ({
          id: a.id,
          type: a.type,
          description: a.description,
          createdAt: a.createdAt
        }))
      });
      
      return activities;
    } catch (error) {
      console.error('❌ [Storage] getRecentActivities error:', {
        limit,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Additional analytics methods for dashboard statistics
  async getUserCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'end_user'));
    return result?.count || 0;
  }

  async getTotalPurchases(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(purchaseHistory)
      .where(eq(purchaseHistory.status, 'completed'));
    return result?.count || 0;
  }

  async getActiveUserCount(): Promise<number> {
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    
    const [result] = await db
      .select({ count: sql<number>`count(distinct ${userSessions.userId})` })
      .from(userSessions)
      .where(and(
        eq(userSessions.isActive, true),
        sql`${userSessions.lastActiveAt} >= ${dayAgo}`
      ));
    return result?.count || 0;
  }

  async getLoginCount(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(endUserActivities)
      .where(and(
        eq(endUserActivities.activityType, 'login'),
        sql`${endUserActivities.createdAt} >= ${thirtyDaysAgo}`
      ));
    return result?.count || 0;
  }

  // Domain-specific analytics methods for white-label clients
  async getUserCountForWhiteLabel(whiteLabelId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(
        eq(users.whiteLabelId, whiteLabelId),
        eq(users.role, 'end_user')
      ));
    return result?.count || 0;
  }

  async getTotalPurchasesForWhiteLabel(whiteLabelId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(purchaseHistory)
      .where(and(
        eq(purchaseHistory.whiteLabelId, whiteLabelId),
        eq(purchaseHistory.status, 'completed')
      ));
    return result?.count || 0;
  }

  async getPurchasedUsersCountForWhiteLabel(whiteLabelId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(distinct ${purchaseHistory.userId})` })
      .from(purchaseHistory)
      .where(and(
        eq(purchaseHistory.whiteLabelId, whiteLabelId),
        eq(purchaseHistory.status, 'completed')
      ));
    return result?.count || 0;
  }

  async getLoginCountForWhiteLabel(whiteLabelId: number): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(endUserActivities)
      .where(and(
        eq(endUserActivities.whiteLabelId, whiteLabelId),
        eq(endUserActivities.activityType, 'login'),
        sql`${endUserActivities.createdAt} >= ${thirtyDaysAgo}`
      ));
    return result?.count || 0;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getTotalRevenue(): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`coalesce(sum(${subscriptions.amount}), 0)` })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));
    return result.total;
  }

  async getTotalRevenueForWhiteLabel(whiteLabelId: number): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)` })
      .from(purchaseHistory)
      .where(and(
        eq(purchaseHistory.whiteLabelId, whiteLabelId),
        eq(purchaseHistory.status, 'completed')
      ));
    return result.total;
  }

  // Integration operations
  async getIntegrations(userId: string): Promise<Integration[]> {
    return db.select().from(integrations).where(eq(integrations.userId, userId));
  }

  async getIntegration(id: number): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.id, id));
    return integration;
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const [newIntegration] = await db.insert(integrations).values(integration).returning();
    return newIntegration;
  }

  async updateIntegration(id: number, integrationData: Partial<InsertIntegration>): Promise<Integration> {
    const [updatedIntegration] = await db
      .update(integrations)
      .set(integrationData)
      .where(eq(integrations.id, id))
      ; // .returning() removed for MySQL compatibility
    return updatedIntegration;
  }

  async deleteIntegration(id: number): Promise<void> {
    await db.delete(integrations).where(eq(integrations.id, id));
  }

  // Integration log operations
  async getIntegrationLogs(integrationId: number): Promise<IntegrationLog[]> {
    return db.select().from(integrationLogs).where(eq(integrationLogs.integrationId, integrationId));
  }

  async createIntegrationLog(log: InsertIntegrationLog): Promise<IntegrationLog> {
    const [newLog] = await db.insert(integrationLogs).values(log).returning();
    return newLog;
  }

  // AI Content Generation operations
  async getAiGeneratedContent(userId: string): Promise<AiGeneratedContent[]> {
    return await db
      .select()
      .from(aiGeneratedContent)
      .where(eq(aiGeneratedContent.userId, userId))
      .orderBy(desc(aiGeneratedContent.createdAt));
  }

  async createAiGeneratedContent(content: InsertAiGeneratedContent): Promise<AiGeneratedContent> {
    const [aiContent] = await db
      .insert(aiGeneratedContent)
      .values(content)
      ; // .returning() removed for MySQL compatibility
    return aiContent;
  }

  async updateAiGeneratedContent(id: number, contentData: Partial<InsertAiGeneratedContent>): Promise<AiGeneratedContent> {
    const [updatedContent] = await db
      .update(aiGeneratedContent)
      .set({ ...contentData, updatedAt: new Date() })
      .where(eq(aiGeneratedContent.id, id))
      ; // .returning() removed for MySQL compatibility
    return updatedContent;
  }

  // AI Recommendations operations
  async getAiRecommendations(userId: string): Promise<AiRecommendation[]> {
    return await db
      .select()
      .from(aiRecommendations)
      .where(eq(aiRecommendations.userId, userId))
      .orderBy(desc(aiRecommendations.priority), desc(aiRecommendations.createdAt));
  }

  async createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const [aiRecommendation] = await db
      .insert(aiRecommendations)
      .values(recommendation)
      ; // .returning() removed for MySQL compatibility
    return aiRecommendation;
  }

  async markRecommendationViewed(id: number): Promise<void> {
    await db
      .update(aiRecommendations)
      .set({ isViewed: true })
      .where(eq(aiRecommendations.id, id));
  }

  async markRecommendationActioned(id: number): Promise<void> {
    await db
      .update(aiRecommendations)
      .set({ isActioned: true })
      .where(eq(aiRecommendations.id, id));
  }

  // AI Content Optimization operations
  async getAiContentOptimizations(userId: string): Promise<AiContentOptimization[]> {
    return await db
      .select()
      .from(aiContentOptimizations)
      .where(eq(aiContentOptimizations.userId, userId))
      .orderBy(desc(aiContentOptimizations.createdAt));
  }

  async createAiContentOptimization(optimization: InsertAiContentOptimization): Promise<AiContentOptimization> {
    const [aiOptimization] = await db
      .insert(aiContentOptimizations)
      .values(optimization)
      ; // .returning() removed for MySQL compatibility
    return aiOptimization;
  }

  async markOptimizationApplied(id: number): Promise<void> {
    await db
      .update(aiContentOptimizations)
      .set({ isApplied: true })
      .where(eq(aiContentOptimizations.id, id));
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates).orderBy(templates.createdAt);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values(template).returning();
    return newTemplate;
  }

  async updateTemplate(id: number, templateData: Partial<InsertTemplate>): Promise<Template> {
    const [updatedTemplate] = await db
      .update(templates)
      .set({ ...templateData, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  // Theme operations
  async getThemes(): Promise<Theme[]> {
    return await db.select().from(themes).where(eq(themes.isActive, true)).orderBy(desc(themes.createdAt));
  }

  async getTheme(id: number): Promise<Theme | undefined> {
    const [theme] = await db.select().from(themes).where(eq(themes.id, id));
    return theme;
  }

  async createTheme(themeData: InsertTheme): Promise<Theme> {
    const [theme] = await db.insert(themes).values(themeData).returning();
    return theme;
  }

  async updateTheme(id: number, themeData: Partial<InsertTheme>): Promise<Theme> {
    const [theme] = await db.update(themes)
      .set({ ...themeData, updatedAt: new Date() })
      .where(eq(themes.id, id))
      .returning();
    return theme;
  }

  async deleteTheme(id: number): Promise<void> {
    await db.delete(themes).where(eq(themes.id, id));
  }

  // User theme preference operations
  async getUserThemePreference(userId: string): Promise<UserThemePreference | undefined> {
    const [preference] = await db.select().from(userThemePreferences)
      .where(and(eq(userThemePreferences.userId, userId), eq(userThemePreferences.isActive, true)));
    return preference;
  }

  async setUserThemePreference(userId: string, themeId: number): Promise<UserThemePreference> {
    // Clear existing preferences
    await db.update(userThemePreferences)
      .set({ isActive: false })
      .where(eq(userThemePreferences.userId, userId));

    // Set new preference
    const [preference] = await db.insert(userThemePreferences)
      .values({ userId, themeId, isActive: true })
      ; // .returning() removed for MySQL compatibility
    return preference;
  }

  async clearUserThemePreference(userId: string): Promise<void> {
    await db.update(userThemePreferences)
      .set({ isActive: false })
      .where(eq(userThemePreferences.userId, userId));
  }

  // Client template customization operations
  async getClientTemplateCustomizations(clientId: number): Promise<ClientTemplateCustomization[]> {
    return await db.select().from(clientTemplateCustomizations).where(eq(clientTemplateCustomizations.clientId, clientId));
  }

  async getClientTemplateCustomization(id: number): Promise<ClientTemplateCustomization | undefined> {
    const [customization] = await db.select().from(clientTemplateCustomizations).where(eq(clientTemplateCustomizations.id, id));
    return customization;
  }

  async createClientTemplateCustomization(customization: InsertClientTemplateCustomization): Promise<ClientTemplateCustomization> {
    const [newCustomization] = await db.insert(clientTemplateCustomizations).values(customization).returning();
    return newCustomization;
  }

  async updateClientTemplateCustomization(id: number, customizationData: Partial<InsertClientTemplateCustomization>): Promise<ClientTemplateCustomization> {
    const [updatedCustomization] = await db
      .update(clientTemplateCustomizations)
      .set({ ...customizationData, updatedAt: new Date() })
      .where(eq(clientTemplateCustomizations.id, id))
      .returning();
    return updatedCustomization;
  }

  async deleteClientTemplateCustomization(id: number): Promise<void> {
    await db.delete(clientTemplateCustomizations).where(eq(clientTemplateCustomizations.id, id));
  }

  // Platform settings operations
  async getPlatformSettings(): Promise<PlatformSetting[]> {
    return await db.select().from(platformSettings).orderBy(platformSettings.category, platformSettings.key);
  }

  async getPlatformSetting(key: string): Promise<PlatformSetting | undefined> {
    const [setting] = await db.select().from(platformSettings).where(eq(platformSettings.key, key));
    return setting;
  }

  async createPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting> {
    const [newSetting] = await db.insert(platformSettings).values(setting).returning();
    return newSetting;
  }

  async updatePlatformSetting(key: string, settingData: Partial<InsertPlatformSetting>): Promise<PlatformSetting> {
    const [updatedSetting] = await db
      .update(platformSettings)
      .set({ ...settingData, updatedAt: new Date() })
      .where(eq(platformSettings.key, key))
      ; // .returning() removed for MySQL compatibility
    return updatedSetting;
  }

  async deletePlatformSetting(key: string): Promise<void> {
    await db.delete(platformSettings).where(eq(platformSettings.key, key));
  }

  // Analytics operations
  async getAnalyticsEvents(filters?: { userId?: string; eventType?: string; startDate?: Date; endDate?: Date }): Promise<AnalyticsEvent[]> {
    let query = db.select().from(analyticsEvents);
    
    if (filters?.userId) {
      query = query.where(eq(analyticsEvents.userId, filters.userId));
    }
    if (filters?.eventType) {
      query = query.where(eq(analyticsEvents.eventType, filters.eventType));
    }
    
    return await query.orderBy(analyticsEvents.timestamp).limit(1000);
  }

  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }

  async getAnalyticsMetrics(filters?: { metricName?: string; period?: string; startDate?: Date; endDate?: Date }): Promise<AnalyticsMetric[]> {
    let query = db.select().from(analyticsMetrics);
    
    if (filters?.metricName) {
      query = query.where(eq(analyticsMetrics.metricName, filters.metricName));
    }
    if (filters?.period) {
      query = query.where(eq(analyticsMetrics.period, filters.period));
    }
    
    return await query.orderBy(analyticsMetrics.date);
  }

  async createAnalyticsMetric(metric: InsertAnalyticsMetric): Promise<AnalyticsMetric> {
    const [newMetric] = await db.insert(analyticsMetrics).values(metric).returning();
    return newMetric;
  }

  async getAnalyticsOverview(): Promise<{
    totalUsers: number;
    totalEvents: number;
    topEvents: { eventType: string; count: number }[];
    recentActivity: AnalyticsEvent[];
  }> {
    const totalUsers = await db.select().from(users);
    const totalEventsResult = await db.select().from(analyticsEvents);
    const recentActivity = await db.select().from(analyticsEvents)
      .orderBy(analyticsEvents.timestamp)
      .limit(10);

    return {
      totalUsers: totalUsers.length,
      totalEvents: totalEventsResult.length,
      topEvents: [],
      recentActivity,
    };
  }

  // Landing page operations
  async getLandingPages(userId: string): Promise<LandingPage[]> {
    return await db.select().from(landingPages).where(eq(landingPages.userId, userId));
  }

  async getLandingPage(id: number): Promise<LandingPage | undefined> {
    const [page] = await db.select().from(landingPages).where(eq(landingPages.id, id));
    return page;
  }

  async getLandingPageByDomainPath(domainPath: string): Promise<LandingPage | undefined> {
    const [page] = await db.select().from(landingPages).where(eq(landingPages.domainPath, domainPath));
    return page;
  }

  async createLandingPage(landingPage: InsertLandingPage): Promise<LandingPage> {
    const [newPage] = await db.insert(landingPages).values(landingPage).returning();
    return newPage;
  }

  async updateLandingPage(id: number, landingPageData: Partial<InsertLandingPage>): Promise<LandingPage> {
    const [updatedPage] = await db
      .update(landingPages)
      .set({ ...landingPageData, updatedAt: new Date() })
      .where(eq(landingPages.id, id))
      .returning();
    
    return updatedPage;
  }

  async clearAllUserDomainPaths(userId: string): Promise<void> {
    // Clear domain paths from all landing pages for this user
    await db
      .update(landingPages)
      .set({ domainPath: null })
      .where(eq(landingPages.userId, userId));
    
    // Also clear domain path from white label if exists
    await db
      .update(whiteLabels)
      .set({ domainPath: null })
      .where(eq(whiteLabels.userId, userId));
  }

  async deleteLandingPage(id: number): Promise<void> {
    await db.delete(landingPages).where(eq(landingPages.id, id));
  }

  async publishLandingPage(id: number): Promise<LandingPage> {
    const [publishedPage] = await db
      .update(landingPages)
      .set({ isPublished: true, publishedAt: new Date() })
      .where(eq(landingPages.id, id))
      ; // .returning() removed for MySQL compatibility
    return publishedPage;
  }

  async getPublishedLandingPageByUser(userId: string): Promise<LandingPage | undefined> {
    const [page] = await db
      .select()
      .from(landingPages)
      .where(and(eq(landingPages.userId, userId), eq(landingPages.isPublished, true)))
      .orderBy(desc(landingPages.publishedAt))
      .limit(1);
    return page;
  }

  async validateDomainPath(domainPath: string, excludeId?: number, currentUserId?: string): Promise<{ available: boolean; message: string; ownedBySameUser?: boolean }> {
    const conditions = excludeId
      ? and(eq(landingPages.domainPath, domainPath), not(eq(landingPages.id, excludeId)))
      : eq(landingPages.domainPath, domainPath);
    
    const [existingPage] = await db
      .select()
      .from(landingPages)
      .where(conditions);
    
    if (!existingPage) {
      return { 
        available: true, 
        message: "Domain path is available" 
      };
    }
    
    // Check if it's owned by the same user
    const ownedBySameUser = currentUserId && existingPage.userId === currentUserId;
    
    if (ownedBySameUser) {
      return { 
        available: true, 
        message: "This is your current domain path",
        ownedBySameUser: true
      };
    }
    
    return { 
      available: false, 
      message: "Domain already taken. Please choose a different one" 
    };
  }

  // Create professional default landing page for white-label clients
  async createDefaultLandingPage(userId: string, domainPath: string, companyName?: string): Promise<LandingPage> {
    // Get user role to determine if affiliate signup should be excluded
    let userRole = '';
    try {
      const user = await this.getUser(userId);
      userRole = user?.role || '';
    } catch (error) {
      console.error('Error getting user role:', error);
    }

    // Customize content with company name if provided
    const customizedElements = defaultLandingPageElements
      .map(element => {
        const customElement = { ...element };
        
        if (element.type === 'hero' && companyName) {
          customElement.content = {
            ...element.content,
            title: `Transform Your Business with ${companyName}`,
            subtitle: `${companyName} helps businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform"Changed So You Know I Get It".`
          };
        } else if (element.type === 'footer' && companyName) {
          customElement.content = {
            ...element.content,
            company: companyName,
            description: `${companyName} - Empowering businesses with innovative solutions and exceptional service.`
          };
        }
        
        return customElement;
      });

    const customizedSettings = {
      ...defaultLandingPageSettings,
      meta: {
        ...defaultLandingPageSettings.meta,
        title: companyName ? `${companyName} - Professional Business Solutions` : defaultLandingPageSettings.meta.title
      }
    };

    const landingPageData: InsertLandingPage = {
      userId,
      name: companyName ? `${companyName} Landing Page` : "Professional Landing Page",
      domainPath,
      elements: customizedElements,
      settings: customizedSettings,
      isPublished: true,
      publishedAt: new Date()
    };

    const [newPage] = await db.insert(landingPages).values(landingPageData).returning();
    
    return newPage;
  }

  // Get or create default landing page for a user with domain path
  async getOrCreateUserLandingPage(userId: string, domainPath: string, companyName?: string): Promise<LandingPage> {
    // Check if user already has a landing page with this domain path
    const existingPage = await this.getLandingPageByDomainPath(domainPath);
    if (existingPage && existingPage.userId === userId) {
      return existingPage;
    }

    // Check if user has any published landing page to use as their main page
    const userMainPage = await this.getPublishedLandingPageByUser(userId);
    if (userMainPage && !userMainPage.domainPath) {
      // Update existing page with domain path
      return await this.updateLandingPage(userMainPage.id, { domainPath });
    }

    // Create new default landing page
    return await this.createDefaultLandingPage(userId, domainPath, companyName);
  }

  // Custom domain operations
  async getCustomDomains(userId: string): Promise<CustomDomain[]> {
    return await db.select().from(customDomains).where(eq(customDomains.userId, userId));
  }

  async getCustomDomain(id: number): Promise<CustomDomain | undefined> {
    const [domain] = await db.select().from(customDomains).where(eq(customDomains.id, id));
    return domain;
  }

  async getCustomDomainByDomain(domain: string): Promise<CustomDomain | undefined> {
    const [customDomain] = await db.select().from(customDomains).where(eq(customDomains.domain, domain));
    return customDomain;
  }

  async createCustomDomain(customDomain: InsertCustomDomain): Promise<CustomDomain> {
    const [newDomain] = await db.insert(customDomains).values(customDomain).returning();
    return newDomain;
  }

  async updateCustomDomain(id: number, customDomainData: Partial<InsertCustomDomain>): Promise<CustomDomain> {
    const [updatedDomain] = await db
      .update(customDomains)
      .set({ ...customDomainData, updatedAt: new Date() })
      .where(eq(customDomains.id, id))
      .returning();
    
    return updatedDomain;
  }

  async deleteCustomDomain(id: number): Promise<void> {
    await db.delete(customDomains).where(eq(customDomains.id, id));
  }

  async verifyCustomDomain(id: number): Promise<CustomDomain> {
    const [verifiedDomain] = await db
      .update(customDomains)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(customDomains.id, id))
      .returning();
    
    return verifiedDomain;
  }

  generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Products operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    // Get user's white label and return only their products
    const whiteLabel = await this.getWhiteLabelByUserId(userId);
    if (!whiteLabel) {
      return [];
    }
    
    return db
      .select()
      .from(products)
      .where(eq(products.whiteLabelId, whiteLabel.id))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(productData)
      .returning();
    
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id))
      .returning();
    
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Categories operations (removed duplicate - using proper filtering method above)

  // Announcements methods
  async createAnnouncement(announcementData: any) {
    try {
      // Create a copy of data without targeting fields for backward compatibility
      const { targetingType, targetedPlanIds, ...safeData } = announcementData;
      
      // Try to insert with targeting fields first, fall back to safe data if columns don't exist
      try {
        const [announcement] = await db
          .insert(announcements)
          .values(announcementData)
          .returning({
            id: announcements.id,
            userId: announcements.userId,
            title: announcements.title,
            content: announcements.content,
            attachments: announcements.attachments,
            visibility: announcements.visibility,
            status: announcements.status,
            scheduledAt: announcements.scheduledAt,
            publishedAt: announcements.publishedAt,
            isPinned: announcements.isPinned,
            createdAt: announcements.createdAt,
            updatedAt: announcements.updatedAt
          });
        
        if (!announcement) {
          throw new Error('Failed to create announcement');
        }
        
        return announcement;
      } catch (columnError: any) {
        if (columnError.code === '42703') { // Column does not exist
          console.log('Targeting columns not yet available, inserting without targeting data');
          const [announcement] = await db
            .insert(announcements)
            .values(safeData)
            .returning({
              id: announcements.id,
              userId: announcements.userId,
              title: announcements.title,
              content: announcements.content,
              attachments: announcements.attachments,
              visibility: announcements.visibility,
              status: announcements.status,
              scheduledAt: announcements.scheduledAt,
              publishedAt: announcements.publishedAt,
              isPinned: announcements.isPinned,
              createdAt: announcements.createdAt,
              updatedAt: announcements.updatedAt
            });
          
          if (!announcement) {
            throw new Error('Failed to create announcement');
          }
          
          return announcement;
        }
        throw columnError;
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  async getPublicAnnouncements(limit = 20, offset = 0, userId?: string) {
    console.log('Fetching public announcements...');
    
    // Auto-publish scheduled announcements that are due
    await this.autoPublishScheduledAnnouncements();
    
    // Get user's purchased plans if userId is provided (for plan-based filtering)
    let userPlanIds: number[] = [];
    if (userId) {
      try {
        const userPlans = await this.getUserPurchasedPlans(userId);
        userPlanIds = userPlans.map(plan => plan.id);
        console.log(`[DEBUG] User ${userId} has plans:`, userPlanIds);
      } catch (error) {
        console.error('Error fetching user plans for announcement filtering:', error);
      }
    }
    
    const query = db
      .select({
        id: announcements.id,
        userId: announcements.userId,
        title: announcements.title,
        content: announcements.content,
        attachments: announcements.attachments,
        visibility: announcements.visibility,
        status: announcements.status,
        scheduledAt: announcements.scheduledAt,
        publishedAt: announcements.publishedAt,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        targetingType: announcements.targetingType,
        targetedPlanIds: announcements.targetedPlanIds,
        authorName: sql`CONCAT(COALESCE(${users.firstName}, ''), ' ', COALESCE(${users.lastName}, ''))`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        likesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id}
        ), 0)`.as('likesCount'),
        commentsCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementComments} 
          WHERE ${announcementComments.announcementId} = ${announcements.id} 
          AND ${announcementComments.isActive} = true
        ), 0)`.as('commentsCount'),
        sharesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementShares} 
          WHERE ${announcementShares.announcementId} = ${announcements.id}
        ), 0)`.as('sharesCount'),
        userLiked: userId ? sql`(
          SELECT COUNT(*) > 0 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id} 
          AND ${announcementLikes.userId} = ${userId}
        )`.as('userLiked') : sql`false`.as('userLiked'),
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.userId, users.id))
      .where(
        and(
          eq(announcements.isActive, true),
          or(
            // Show published announcements to everyone
            eq(announcements.status, 'published'),
            // Show draft/scheduled announcements only to their creators
            userId ? and(
              eq(announcements.userId, userId),
              sql`${announcements.status} IN ('draft', 'scheduled')`
            ) : sql`false`
          )
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await query;
    console.log('Public announcements fetched (before filtering):', result.length);
    
    // Apply plan-based filtering if user is authenticated
    if (userId && userPlanIds.length > 0) {
      const filteredResult = result.filter(announcement => {
        // If targeting type is 'everyone' or null/undefined, show to all users
        if (!announcement.targetingType || announcement.targetingType === 'everyone') {
          return true;
        }
        
        // If targeting type is 'by_plan', check if user has any of the targeted plans
        if (announcement.targetingType === 'by_plan' && announcement.targetedPlanIds) {
          try {
            const targetedPlans = JSON.parse(announcement.targetedPlanIds);
            if (Array.isArray(targetedPlans)) {
              // Check if user has any of the targeted plans
              const hasTargetedPlan = targetedPlans.some(planId => userPlanIds.includes(planId));
              console.log(`[DEBUG] Announcement ${announcement.id} targets plans ${targetedPlans}, user has ${userPlanIds}, match: ${hasTargetedPlan}`);
              return hasTargetedPlan;
            }
          } catch (error) {
            console.error('Error parsing targetedPlanIds for announcement:', announcement.id, error);
            // If parsing fails, show the announcement to be safe
            return true;
          }
        }
        
        // Default: show announcement if targeting logic is unclear
        return true;
      });
      
      console.log('Public announcements after plan filtering:', filteredResult.length);
      return filteredResult;
    }
    
    // If no user or no plans, return all announcements (but filter out plan-targeted ones for unauthenticated users)
    if (!userId) {
      const publicResult = result.filter(announcement => 
        !announcement.targetingType || announcement.targetingType === 'everyone'
      );
      console.log('Public announcements for unauthenticated user:', publicResult.length);
      return publicResult;
    }
    
    console.log('Public announcements fetched (final):', result.length);
    return result;
  }

  async autoPublishScheduledAnnouncements() {
    const now = new Date();
    const nowIso = now.toISOString();
    console.log('Auto-publish check at:', nowIso);
    
    // First, find announcements that should be published
    const scheduledAnnouncements = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        scheduledAt: announcements.scheduledAt,
        status: announcements.status
      })
      .from(announcements)
      .where(
        and(
          eq(announcements.status, 'scheduled'),
          sql`${announcements.scheduledAt} <= ${nowIso}`,
          eq(announcements.isActive, true)
        )
      );
    
    console.log('Found scheduled announcements to publish:', scheduledAnnouncements.length);
    
    if (scheduledAnnouncements.length > 0) {
      scheduledAnnouncements.forEach(ann => {
        console.log(`Publishing announcement ${ann.id}: "${ann.title}" scheduled for ${ann.scheduledAt}`);
      });
      
      // Update them to published
      await db
        .update(announcements)
        .set({
          status: 'published',
          publishedAt: nowIso,
          updatedAt: nowIso
        })
        .where(
          and(
            eq(announcements.status, 'scheduled'),
            sql`${announcements.scheduledAt} <= ${nowIso}`,
            eq(announcements.isActive, true)
          )
        );
        
      console.log('Successfully published scheduled announcements');
    }
  }

  async getSuperAdminAnnouncements(userId?: string, limit = 20, offset = 0) {
    console.log('Fetching Super Admin announcements...');
    const query = db
      .select({
        id: announcements.id,
        userId: announcements.userId,
        title: announcements.title,
        content: announcements.content,
        attachments: announcements.attachments,
        visibility: announcements.visibility,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        authorName: sql`CONCAT(COALESCE(${users.firstName}, ''), ' ', COALESCE(${users.lastName}, ''))`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        likesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id}
        ), 0)`.as('likesCount'),
        commentsCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementComments} 
          WHERE ${announcementComments.announcementId} = ${announcements.id} 
          AND ${announcementComments.isActive} = true
        ), 0)`.as('commentsCount'),
        sharesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementShares} 
          WHERE ${announcementShares.announcementId} = ${announcements.id}
        ), 0)`.as('sharesCount'),
        userLiked: userId ? sql`(
          SELECT COUNT(*) > 0 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id} 
          AND ${announcementLikes.userId} = ${userId}
        )`.as('userLiked') : sql`false`.as('userLiked'),
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.userId, users.id))
      .where(
        and(
          eq(announcements.isActive, true),
          eq(announcements.visibility, 'public'),
          eq(users.role, 'super_admin')
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await query;
    console.log('Super Admin announcements fetched:', result.length);
    return result;
  }

  async getAnnouncementsByUserId(userId: string, limit = 20, offset = 0) {
    console.log('Fetching announcements for user:', userId);
    const query = db
      .select({
        id: announcements.id,
        userId: announcements.userId,
        title: announcements.title,
        content: announcements.content,
        attachments: announcements.attachments,
        visibility: announcements.visibility,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        authorName: sql`CONCAT(COALESCE(${users.firstName}, ''), ' ', COALESCE(${users.lastName}, ''))`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        likesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id}
        ), 0)`.as('likesCount'),
        commentsCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementComments} 
          WHERE ${announcementComments.announcementId} = ${announcements.id} 
          AND ${announcementComments.isActive} = true
        ), 0)`.as('commentsCount'),
        sharesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementShares} 
          WHERE ${announcementShares.announcementId} = ${announcements.id}
        ), 0)`.as('sharesCount'),
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.userId, users.id))
      .where(
        and(
          eq(announcements.isActive, true),
          eq(announcements.userId, userId)
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await query;
    console.log('User announcements fetched:', result.length);
    return result;
  }

  // ADDED: Get announcements by white-label client ID for affiliate dashboard
  async getAnnouncementsByWhiteLabelId(whiteLabelId: number, userId?: string, limit = 20, offset = 0) {
    console.log('Fetching announcements for white-label ID:', whiteLabelId);
    const query = db
      .select({
        id: announcements.id,
        userId: announcements.userId,
        title: announcements.title,
        content: announcements.content,
        attachments: announcements.attachments,
        visibility: announcements.visibility,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        authorName: sql`CONCAT(COALESCE(${users.firstName}, ''), ' ', COALESCE(${users.lastName}, ''))`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        likesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id}
        ), 0)`.as('likesCount'),
        commentsCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementComments} 
          WHERE ${announcementComments.announcementId} = ${announcements.id} 
          AND ${announcementComments.isActive} = true
        ), 0)`.as('commentsCount'),
        sharesCount: sql`COALESCE((
          SELECT COUNT(*) 
          FROM ${announcementShares} 
          WHERE ${announcementShares.announcementId} = ${announcements.id}
        ), 0)`.as('sharesCount'),
        userLiked: userId ? sql`(
          SELECT COUNT(*) > 0 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id} 
          AND ${announcementLikes.userId} = ${userId}
        )`.as('userLiked') : sql`false`.as('userLiked'),
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.userId, users.id))
      .where(
        and(
          eq(announcements.isActive, true),
          eq(announcements.whiteLabelId, whiteLabelId)
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await query;
    console.log('White-label announcements fetched:', result.length);
    return result;
  }

  async getWhiteLabelByDomain(domainPath: string) {
    const result = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.domainPath, domainPath))
      .limit(1);
    
    return result[0] || null;
  }

  async getAffiliateNotifications(whiteLabelUserId: string, domain: string) {
    const notifications = [];
    
    try {
      // Get recent announcements from white-label client
      const recentAnnouncements = await db
        .select({
          id: announcements.id,
          title: announcements.title,
          content: announcements.content,
          createdAt: announcements.createdAt,
          authorName: sql`CONCAT(COALESCE(${users.firstName}, ''), ' ', COALESCE(${users.lastName}, ''))`.as('authorName'),
        })
        .from(announcements)
        .leftJoin(users, eq(announcements.userId, users.id))
        .where(
          and(
            eq(announcements.userId, whiteLabelUserId),
            eq(announcements.isActive, true),
            gte(announcements.createdAt, sql`DATE_SUB(NOW(), INTERVAL 7 DAY)`)
          )
        )
        .orderBy(desc(announcements.createdAt))
        .limit(10);

      // Add announcement notifications
      recentAnnouncements.forEach(announcement => {
        notifications.push({
          type: 'announcement',
          message: `New announcement: "${announcement.title}"`,
          time: this.formatTimeAgo(announcement.createdAt),
          data: announcement
        });
      });

      // Get recent signups from this domain
      const recentSignups = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          createdAt: users.createdAt,
        })
        .from(users)
        .leftJoin(domainUserSessions, eq(users.id, domainUserSessions.userId))
        .where(
          and(
            eq(domainUserSessions.domainPath, domain),
            gte(users.createdAt, sql`DATE_SUB(NOW(), INTERVAL 7 DAY)`)
          )
        )
        .orderBy(desc(users.createdAt))
        .limit(10);

      // Add signup notifications
      recentSignups.forEach(signup => {
        const userName = signup.firstName && signup.lastName 
          ? `${signup.firstName} ${signup.lastName}`
          : signup.email;
        notifications.push({
          type: 'signup',
          message: `New user signed up: ${userName}`,
          time: this.formatTimeAgo(signup.createdAt),
          data: signup
        });
      });

      // Get recent purchases from this domain
      const recentPurchases = await db
        .select({
          id: purchaseHistory.id,
          userId: purchaseHistory.userId,
          planId: purchaseHistory.planId,
          amount: purchaseHistory.amount,
          createdAt: purchaseHistory.createdAt,
          planName: plans.name,
          userEmail: users.email,
          userFirstName: users.firstName,
          userLastName: users.lastName,
        })
        .from(purchaseHistory)
        .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
        .leftJoin(users, eq(purchaseHistory.userId, users.id))
        .leftJoin(domainUserSessions, eq(purchaseHistory.userId, domainUserSessions.userId))
        .where(
          and(
            eq(domainUserSessions.domainPath, domain),
            gte(purchaseHistory.createdAt, sql`DATE_SUB(NOW(), INTERVAL 7 DAY)`)
          )
        )
        .orderBy(desc(purchaseHistory.createdAt))
        .limit(10);

      // Add purchase notifications
      recentPurchases.forEach(purchase => {
        const userName = purchase.userFirstName && purchase.userLastName 
          ? `${purchase.userFirstName} ${purchase.userLastName}`
          : purchase.userEmail;
        notifications.push({
          type: 'purchase',
          message: `${userName} purchased ${purchase.planName}`,
          time: this.formatTimeAgo(purchase.createdAt),
          amount: purchase.amount,
          data: purchase
        });
      });

      // Sort all notifications by time (most recent first)
      notifications.sort((a, b) => {
        const timeA = a.data.createdAt;
        const timeB = b.data.createdAt;
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });

      return notifications.slice(0, 15); // Return latest 15 notifications
    } catch (error) {
      console.error('Error fetching affiliate notifications:', error);
      return [];
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  async getAnnouncements(userId: string, limit = 20, offset = 0) {
    const userQuery = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!userQuery.length) return [];
    
    const user = userQuery[0];
    const userRole = user.role;

    // Build visibility filter based on user role
    let visibilityFilter;
    if (userRole === 'super_admin') {
      visibilityFilter = undefined; // Super admin sees all
    } else if (userRole === 'white_label_client') {
      visibilityFilter = or(
        eq(announcements.visibility, 'public'),
        eq(announcements.visibility, 'clients')
      );
    } else if (userRole === 'white_label_affiliate' || userRole === 'super_admin_affiliate') {
      visibilityFilter = or(
        eq(announcements.visibility, 'public'),
        eq(announcements.visibility, 'affiliates')
      );
    } else {
      visibilityFilter = eq(announcements.visibility, 'public');
    }

    const query = db
      .select({
        id: announcements.id,
        userId: announcements.userId,
        title: announcements.title,
        content: announcements.content,
        attachments: announcements.attachments,
        visibility: announcements.visibility,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        likesCount: sql`(
          SELECT COUNT(*) 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id}
        )`.as('likesCount'),
        commentsCount: sql`(
          SELECT COUNT(*) 
          FROM ${announcementComments} 
          WHERE ${announcementComments.announcementId} = ${announcements.id} 
          AND ${announcementComments.isActive} = true
        )`.as('commentsCount'),
        sharesCount: sql`(
          SELECT COUNT(*) 
          FROM ${announcementShares} 
          WHERE ${announcementShares.announcementId} = ${announcements.id}
        )`.as('sharesCount'),
        userLiked: sql`(
          SELECT COUNT(*) > 0 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id} 
          AND ${announcementLikes.userId} = ${userId}
        )`.as('userLiked'),
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.userId, users.id))
      .where(
        and(
          eq(announcements.isActive, true),
          visibilityFilter
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
      .limit(limit)
      .offset(offset);

    return await query;
  }

  async getAnnouncementById(id: number, userId: string) {
    const result = await db
      .select({
        id: announcements.id,
        userId: announcements.userId,
        title: announcements.title,
        content: announcements.content,
        attachments: announcements.attachments,
        visibility: announcements.visibility,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        likesCount: sql`(
          SELECT COUNT(*) 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id}
        )`.as('likesCount'),
        commentsCount: sql`(
          SELECT COUNT(*) 
          FROM ${announcementComments} 
          WHERE ${announcementComments.announcementId} = ${announcements.id} 
          AND ${announcementComments.isActive} = true
        )`.as('commentsCount'),
        sharesCount: sql`(
          SELECT COUNT(*) 
          FROM ${announcementShares} 
          WHERE ${announcementShares.announcementId} = ${announcements.id}
        )`.as('sharesCount'),
        userLiked: sql`(
          SELECT COUNT(*) > 0 
          FROM ${announcementLikes} 
          WHERE ${announcementLikes.announcementId} = ${announcements.id} 
          AND ${announcementLikes.userId} = ${userId}
        )`.as('userLiked'),
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.userId, users.id))
      .where(and(eq(announcements.id, id), eq(announcements.isActive, true)))
      .limit(1);

    return result[0] || null;
  }

  async toggleAnnouncementLike(announcementId: number, userId: string) {
    // Check if user already liked
    const existingLike = await db
      .select()
      .from(announcementLikes)
      .where(
        and(
          eq(announcementLikes.announcementId, announcementId),
          eq(announcementLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(announcementLikes)
        .where(
          and(
            eq(announcementLikes.announcementId, announcementId),
            eq(announcementLikes.userId, userId)
          )
        );
      return { liked: false };
    } else {
      // Like
      await db
        .insert(announcementLikes)
        .values({
          announcementId,
          userId,
        });
      return { liked: true };
    }
  }

  async likeAnnouncement(announcementId: number, userId: string): Promise<void> {
    await this.toggleAnnouncementLike(announcementId, userId);
  }

  async getAnnouncementComments(announcementId: number, limit = 50, offset = 0) {
    return await db
      .select({
        id: announcementComments.id,
        content: announcementComments.content,
        parentCommentId: announcementComments.parentCommentId,
        createdAt: announcementComments.createdAt,
        updatedAt: announcementComments.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName'),
        authorEmail: users.email,
        authorProfileImage: users.profileImageUrl,
        userId: announcementComments.userId,
      })
      .from(announcementComments)
      .leftJoin(users, eq(announcementComments.userId, users.id))
      .where(
        and(
          eq(announcementComments.announcementId, announcementId),
          eq(announcementComments.isActive, true)
        )
      )
      .orderBy(desc(announcementComments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createAnnouncementComment(commentData: z.infer<typeof insertAnnouncementCommentSchema>) {
    const [comment] = await db
      .insert(announcementComments)
      .values(commentData)
      .returning();
    
    if (!comment) {
      throw new Error('Failed to create announcement comment');
    }
    
    return comment;
  }

  // Announcement analytics implementations
  async createAnnouncementAnalytics(data: z.infer<typeof insertAnnouncementAnalyticsSchema>) {
    try {
      const [analyticsEntry] = await db
        .insert(announcementAnalytics)
        .values(data)
        .returning({
          id: announcementAnalytics.id,
          announcementId: announcementAnalytics.announcementId,
          userId: announcementAnalytics.userId,
          eventType: announcementAnalytics.eventType,
          createdAt: announcementAnalytics.createdAt
        });
      
      if (!analyticsEntry) {
        throw new Error('Failed to create analytics record');
      }
      
      return analyticsEntry;
    } catch (error) {
      console.error('Error in createAnnouncementAnalytics:', error);
      throw error;
    }
  }

  async getAnnouncementAnalytics(announcementId: number) {
    // Get all analytics data for this announcement
    const allAnalytics = await db
      .select()
      .from(announcementAnalytics)
      .where(eq(announcementAnalytics.announcementId, announcementId))
      .orderBy(desc(announcementAnalytics.createdAt));

    // Group by event types
    const views = allAnalytics.filter(a => a.eventType === 'view');
    const clicks = allAnalytics.filter(a => a.eventType === 'click');
    const conversions = allAnalytics.filter(a => a.eventType === 'conversion');

    return {
      views: views.length,
      clicks: clicks.length,
      conversions: conversions.length,
      viewsData: views,
      clicksData: clicks,
      conversionsData: conversions
    };
  }

  async shareAnnouncement(announcementId: number, userId: string, sharedWith = 'public') {
    const [share] = await db
      .insert(announcementShares)
      .values({
        announcementId,
        userId,
        sharedWith,
      })
      .returning();
    return share;
  }

  // Plan-Product Management operations
  async linkPlanToProduct(planId: number, productId: number): Promise<void> {
    await db.insert(planProducts).values({
      planId,
      productId,
      isActive: true,
    });
  }

  async unlinkPlanFromProduct(planId: number, productId: number): Promise<void> {
    await db
      .delete(planProducts)
      .where(
        and(
          eq(planProducts.planId, planId),
          eq(planProducts.productId, productId)
        )
      );
  }

  async getPlanProducts(planId: number): Promise<Product[]> {
    const result = await db
      .select({
        id: products.id,
        whiteLabelId: products.whiteLabelId,
        categoryId: products.categoryId,
        createdBy: products.createdBy,
        name: products.name,
        description: products.description,
        price: products.price,
        type: products.type,
        contentUrl: products.contentUrl,
        accessDuration: products.accessDuration,
        imageUrl: products.imageUrl,
        metadata: products.metadata,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .innerJoin(planProducts, eq(products.id, planProducts.productId))
      .where(
        and(
          eq(planProducts.planId, planId),
          eq(planProducts.isActive, true),
          eq(products.isActive, true)
        )
      );
    return result;
  }

  async getProductsByPlan(planId: number): Promise<Product[]> {
    return this.getPlanProducts(planId);
  }

  // Plan-Category Management operations  
  async linkPlanToCategory(planId: number, categoryId: number): Promise<void> {
    await db.insert(planCategories).values({
      planId,
      categoryId,
      isActive: true,
    });
  }

  async unlinkPlanFromCategory(planId: number, categoryId: number): Promise<void> {
    await db
      .delete(planCategories)
      .where(
        and(
          eq(planCategories.planId, planId),
          eq(planCategories.categoryId, categoryId)
        )
      );
  }

  async getPlanCategories(planId: number): Promise<Category[]> {
    const result = await db
      .select({
        id: categories.id,
        whiteLabelId: categories.whiteLabelId,
        name: categories.name,
        description: categories.description,
        parentCategoryId: categories.parentCategoryId,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .innerJoin(planCategories, eq(categories.id, planCategories.categoryId))
      .where(
        and(
          eq(planCategories.planId, planId),
          eq(planCategories.isActive, true),
          eq(categories.isActive, true)
        )
      );
    return result;
  }

  async getCategoriesByPlan(planId: number): Promise<Category[]> {
    return this.getPlanCategories(planId);
  }

  // End-User Plan Access operations
  async getUserPurchasedPlans(userId: string): Promise<{
    id: number;
    name: string;
    description: string | null;
    monthlyPrice: string | null;
    purchaseDate: Date;
    categories: Category[];
    products: Product[];
  }[]> {
    // Get all purchased plans from purchase_history
    const purchasedPlans = await db
      .select({
        id: plans.id,
        name: plans.name,
        description: plans.description,
        monthlyPrice: plans.monthlyPrice,
        purchaseDate: purchaseHistory.createdAt,
      })
      .from(purchaseHistory)
      .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
      .where(
        and(
          eq(purchaseHistory.userId, userId),
          eq(purchaseHistory.status, 'completed')
        )
      )
      .orderBy(desc(purchaseHistory.createdAt));

    // CRITICAL FIX: Also check subscriptions table for white-label clients
    // Get user's white label to check subscriptions
    const userWhiteLabel = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.userId, userId))
      .limit(1);

    let subscriptionPlans: any[] = [];
    if (userWhiteLabel.length > 0) {
      // Get active subscription plans for this white-label client
      subscriptionPlans = await db
        .select({
          id: plans.id,
          name: plans.name,
          description: plans.description,
          monthlyPrice: plans.monthlyPrice,
          purchaseDate: subscriptions.createdAt,
        })
        .from(subscriptions)
        .leftJoin(plans, eq(subscriptions.planId, plans.id))
        .where(
          and(
            eq(subscriptions.whiteLabelId, userWhiteLabel[0].id),
            eq(subscriptions.status, 'active')
          )
        )
        .orderBy(desc(subscriptions.createdAt));
    }

    // Combine and deduplicate plans from both sources, filtering out null plans
    const allPlans = [...purchasedPlans, ...subscriptionPlans];
    console.log(`[DEBUG] getUserPurchasedPlans - All plans before filtering:`, allPlans);
    const validPlans = allPlans.filter(plan => plan.id !== null);
    console.log(`[DEBUG] getUserPurchasedPlans - Valid plans (non-null):`, validPlans);
    const uniquePlans = validPlans.filter((plan, index, self) => 
      index === self.findIndex(p => p.id === plan.id)
    );
    console.log(`[DEBUG] getUserPurchasedPlans - Unique plans:`, uniquePlans);

    // Get categories and products for each unique plan
    const planDetails = await Promise.all(
      uniquePlans.map(async (plan) => {
        const categories = await this.getPlanCategories(plan.id);
        const products = await this.getPlanProducts(plan.id);
        
        return {
          ...plan,
          categories,
          products,
        };
      })
    );

    return planDetails;
  }

  async getUserPurchasedPlansByDomain(userId: string, domainPath: string): Promise<{
    id: number;
    name: string;
    description: string | null;
    monthlyPrice: string | null;
    purchaseDate: Date;
    categories: Category[];
    products: Product[];
  }[]> {
    // First, get the white label record for this domain
    const whiteLabel = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.domainPath, domainPath))
      .limit(1);

    if (whiteLabel.length === 0) {
      return [];
    }

    const domainOwnerId = whiteLabel[0].userId; // Get the domain owner's user ID

    // Get ALL purchased plans by this user from purchase history
    const purchasedPlans = await db
      .select({
        id: plans.id,
        name: plans.name,
        description: plans.description,
        monthlyPrice: plans.monthlyPrice,
        purchaseDate: purchaseHistory.createdAt,
        createdBy: plans.createdBy,
      })
      .from(purchaseHistory)
      .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
      .where(
        and(
          eq(purchaseHistory.userId, userId),
          eq(purchaseHistory.status, 'completed')
        )
      )
      .orderBy(desc(purchaseHistory.createdAt));

    // ALSO get ALL active subscriptions
    const activeSubscriptions = await db
      .select({
        id: plans.id,
        name: plans.name,
        description: plans.description,
        monthlyPrice: plans.monthlyPrice,
        purchaseDate: subscriptions.createdAt,
        createdBy: plans.createdBy,
      })
      .from(subscriptions)
      .leftJoin(plans, eq(subscriptions.planId, plans.id))
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active')
        )
      )
      .orderBy(desc(subscriptions.createdAt));

    // Combine both sources and remove duplicates
    const allPlans = [...purchasedPlans, ...activeSubscriptions];
    const uniquePlans = allPlans.filter((plan, index, self) => 
      index === self.findIndex(p => p.id === plan.id)
    );

    // CRITICAL: Filter to only show plans created by the domain owner
    const domainOwnerPlans = uniquePlans.filter(plan => plan.createdBy === domainOwnerId);

    // Get categories and products for each plan
    const planDetails = await Promise.all(
      domainOwnerPlans.map(async (plan) => {
        const categories = await this.getPlanCategories(plan.id);
        const products = await this.getPlanProducts(plan.id);
        
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          monthlyPrice: plan.monthlyPrice,
          purchaseDate: plan.purchaseDate,
          categories,
          products,
        };
      })
    );

    return planDetails;
  }

  async getSubscriptions(userId: string): Promise<any[]> {
    console.log('getSubscriptions called with userId:', userId);
    
    // Get user's completed purchases from purchase_history table
    console.log('Checking purchase_history for completed purchases...');
    const userPurchases = await db
      .select()
      .from(purchaseHistory)
      .where(and(
        eq(purchaseHistory.userId, userId),
        eq(purchaseHistory.status, 'completed')
      ))
      .orderBy(desc(purchaseHistory.createdAt));

    console.log('Purchase history found:', userPurchases.length);
    console.log('Purchase details:', JSON.stringify(userPurchases, null, 2));

    if (userPurchases.length > 0) {
      // Get plan names for each purchase and format as subscription-like objects
      const subscriptionsFromPurchases = await Promise.all(
        userPurchases.map(async (purchase) => {
          const plan = await db
            .select({ name: plans.name })
            .from(plans)
            .where(eq(plans.id, purchase.planId))
            .limit(1);
          
          return {
            id: purchase.id,
            userId: purchase.userId,
            planId: purchase.planId,
            plan_id: purchase.planId, // Keep both formats for compatibility
            status: 'active', // Treat completed purchases as active subscriptions
            createdAt: purchase.createdAt,
            created_at: purchase.createdAt, // Keep both formats for compatibility
            planName: plan[0]?.name || 'Unknown Plan',
            amount: purchase.amount,
            transactionId: purchase.transactionId,
            paymentMethod: purchase.paymentMethod
          };
        })
      );

      console.log('Returning subscriptions from purchase history:', subscriptionsFromPurchases.length);
      return subscriptionsFromPurchases;
    }

    // Fallback: check the old subscriptions table for backward compatibility
    console.log('No purchases found, checking old subscriptions table...');
    const directSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));

    console.log('Direct subscriptions found:', directSubs.length);

    if (directSubs.length > 0) {
      // Get plan names for each subscription
      const subscriptionsWithPlanNames = await Promise.all(
        directSubs.map(async (sub) => {
          const plan = await db
            .select({ name: plans.name })
            .from(plans)
            .where(eq(plans.id, sub.planId))
            .limit(1);
          
          return {
            ...sub,
            planName: plan[0]?.name || 'Unknown Plan'
          };
        })
      );

      console.log('Returning direct subscriptions with plan names:', subscriptionsWithPlanNames.length);
      return subscriptionsWithPlanNames;
    }

    // Final fallback: get subscriptions through the white label relationship
    console.log('No direct subscriptions found, trying white label approach...');
    const userWhiteLabel = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.userId, userId))
      .limit(1);

    console.log('White label records found:', userWhiteLabel.length);
    if (userWhiteLabel.length === 0) {
      console.log('No white label found, returning empty array');
      return [];
    }

    // Get subscriptions via white label
    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.whiteLabelId, userWhiteLabel[0].id))
      .orderBy(desc(subscriptions.createdAt));

    // Get plan names for each subscription
    const subscriptionsWithPlanNames = await Promise.all(
      subs.map(async (sub) => {
        const plan = await db
          .select({ name: plans.name })
          .from(plans)
          .where(eq(plans.id, sub.planId))
          .limit(1);
        
        return {
          ...sub,
          planName: plan[0]?.name || 'Unknown Plan'
        };
      })
    );

    return subscriptionsWithPlanNames;
  }

  async getSubscriptionsByDomain(userId: string, domainPath: string): Promise<Subscription[]> {
    // First, get the white label ID for this domain
    const whiteLabel = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.domainPath, domainPath))
      .limit(1);

    if (whiteLabel.length === 0) {
      return [];
    }

    const whiteLabelId = whiteLabel[0].id;

    // Get subscriptions filtered by domain (white label)
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.whiteLabelId, whiteLabelId))
      .orderBy(desc(subscriptions.createdAt));
  }

  async getSubscriptionById(subscriptionId: number): Promise<Subscription | null> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, subscriptionId))
      .limit(1);
    
    return subscription || null;
  }

  async updateSubscriptionSelections(
    subscriptionId: number,
    selectedCategories: number[],
    selectedProducts: number[]
  ): Promise<Subscription> {
    // MySQL doesn't support .returning(), so we update first then query the updated record
    await db
      .update(subscriptions)
      .set({
        selectedCategories: JSON.stringify(selectedCategories),
        selectedProducts: JSON.stringify(selectedProducts),
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, subscriptionId));
    
    const [updatedSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, subscriptionId))
      .limit(1);
    
    return updatedSubscription;
  }

  // Link Meta Images operations
  async createLinkMetaImage(data: z.infer<typeof insertLinkMetaImageSchema>) {
    const [metaImage] = await db
      .insert(linkMetaImages)
      .values(data)
      ; // .returning() removed for MySQL compatibility
    return metaImage;
  }

  async getLinkMetaImage(url: string) {
    const [metaImage] = await db
      .select()
      .from(linkMetaImages)
      .where(eq(linkMetaImages.url, url))
      .limit(1);
    return metaImage;
  }

  async updateLinkMetaImage(id: number, updates: Partial<z.infer<typeof insertLinkMetaImageSchema>>) {
    const [metaImage] = await db
      .update(linkMetaImages)
      .set(updates)
      .where(eq(linkMetaImages.id, id))
      ; // .returning() removed for MySQL compatibility
    return metaImage;
  }

  async updateAnnouncement(id: number, userId: string, updateData: any) {
    // Check if user owns the announcement or is admin
    const announcement = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id))
      .limit(1);

    if (!announcement.length) {
      throw new Error('Announcement not found');
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw new Error('User not found');
    }

    const isOwner = announcement[0].userId === userId;
    const isAdmin = user[0].role === 'super_admin';

    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized to update this announcement');
    }

    try {
      // Create a copy of data without targeting fields for backward compatibility
      const { targetingType, targetedPlanIds, ...safeData } = updateData;
      
      // Try to update with targeting fields first, fall back to safe data if columns don't exist
      try {
        await db
          .update(announcements)
          .set({
            ...updateData,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(announcements.id, id));
        
        // Fetch the updated record (MySQL doesn't support .returning())
        const [updated] = await db
          .select()
          .from(announcements)
          .where(eq(announcements.id, id))
          .limit(1);
        
        return updated;
      } catch (columnError: any) {
        if (columnError.code === '42703') { // Column does not exist
          console.log('Targeting columns not yet available, updating without targeting data');
          await db
            .update(announcements)
            .set({
              ...safeData,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(announcements.id, id));
          
          // Fetch the updated record (MySQL doesn't support .returning())
          const [updated] = await db
            .select()
            .from(announcements)
            .where(eq(announcements.id, id))
            .limit(1);
          
          return updated;
        }
        throw columnError;
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  }

  async deleteAnnouncement(id: number, userId: string) {
    // Check if user owns the announcement or is admin
    const announcement = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id))
      .limit(1);

    if (!announcement.length) {
      throw new Error('Announcement not found');
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw new Error('User not found');
    }

    const isOwner = announcement[0].userId === userId;
    const isAdmin = user[0].role === 'super_admin';

    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized to delete this announcement');
    }

    await db
      .update(announcements)
      .set({ isActive: false })
      .where(eq(announcements.id, id));

    return { success: true };
  }

  // Referral tracking implementations
  async getReferralLink(userId: string): Promise<ReferralLink | undefined> {
    const [referralLink] = await db
      .select()
      .from(referralLinks)
      .where(eq(referralLinks.affiliateId, userId))
      .limit(1);
    return referralLink;
  }

  async createReferralLink(userId: string): Promise<ReferralLink> {
    // Check if user already has a referral link
    const existing = await this.getReferralLink(userId);
    if (existing) {
      return existing;
    }

    // Generate unique referral code
    const referralCode = `REF_${userId}_${Date.now()}`;
    
    const [referralLink] = await db
      .insert(referralLinks)
      .values({
        affiliateId: userId,
        referralCode,
        isActive: true,
      })
      ; // .returning() removed for MySQL compatibility

    return referralLink;
  }

  async getReferralStats(userId: string): Promise<{ totalClicks: number; totalSignups: number; whitelabelClients: number; conversionRate: number }> {
    const referralLink = await this.getReferralLink(userId);
    if (!referralLink) {
      return { totalClicks: 0, totalSignups: 0, whitelabelClients: 0, conversionRate: 0 };
    }

    // Get total clicks
    const [clicksResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(referralClicks)
      .where(eq(referralClicks.referralLinkId, referralLink.id));

    // Get total signups
    const [signupsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(referralSignups)
      .where(eq(referralSignups.referralLinkId, referralLink.id));

    // Get White-Label Clients specifically (users who chose White-Label role)
    const whitelabelClientsResult = await db
      .select({ 
        count: sql<number>`count(*)` 
      })
      .from(referralSignups)
      .innerJoin(users, eq(referralSignups.signupUserId, users.id))
      .innerJoin(whiteLabels, eq(whiteLabels.userId, users.id))
      .where(eq(referralSignups.referralLinkId, referralLink.id));

    const totalClicks = clicksResult?.count || 0;
    const totalSignups = signupsResult?.count || 0;
    const whitelabelClients = whitelabelClientsResult[0]?.count || 0;
    const conversionRate = totalClicks > 0 ? (totalSignups / totalClicks) * 100 : 0;

    return {
      totalClicks,
      totalSignups,
      whitelabelClients,
      conversionRate: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
    };
  }

  async trackReferralClick(referralCode: string, ipAddress?: string, userAgent?: string): Promise<ReferralClick> {
    const [click] = await db
      .insert(referralClicks)
      .values({
        referralCode,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      })
      ; // .returning() removed for MySQL compatibility

    return click;
  }

  async getReferralClients(userId: string): Promise<{ id: string; email: string; firstName: string; lastName: string; createdAt: string; businessName?: string }[]> {
    const referralLink = await this.getReferralLink(userId);
    if (!referralLink) {
      return [];
    }

    // Get all White-Label Clients who signed up through this referral
    const clients = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        businessName: whiteLabels.businessName,
      })
      .from(referralSignups)
      .innerJoin(users, eq(referralSignups.signupUserId, users.id))
      .innerJoin(whiteLabels, eq(whiteLabels.userId, users.id))
      .where(eq(referralSignups.referralLinkId, referralLink.id))
      .orderBy(desc(referralSignups.createdAt));

    return clients.map(client => ({
      id: client.id,
      email: client.email || '',
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      createdAt: client.createdAt?.toISOString() || '',
      businessName: client.businessName || undefined,
    }));
  }

  async trackReferralSignup(referralCode: string, signupUserId: string, ipAddress?: string, userAgent?: string): Promise<ReferralSignup> {
    const [signup] = await db
      .insert(referralSignups)
      .values({
        referralCode,
        signupUserId,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      })
      ; // .returning() removed for MySQL compatibility

    return signup;
  }

  // Purchase operations - Using purchase_history table for all purchase operations
  async getPurchases(): Promise<PurchaseHistory[]> {
    return await db.select().from(purchaseHistory).orderBy(desc(purchaseHistory.createdAt));
  }

  async getPurchasesByUser(userId: string): Promise<PurchaseHistory[]> {
    return await db
      .select({
        id: purchaseHistory.id,
        userId: purchaseHistory.userId,
        whiteLabelId: purchaseHistory.whiteLabelId,
        planId: purchaseHistory.planId,
        amount: purchaseHistory.amount,
        transactionId: purchaseHistory.transactionId,
        paymentMethod: purchaseHistory.paymentMethod,
        status: purchaseHistory.status,
        metadata: purchaseHistory.metadata,
        createdAt: purchaseHistory.createdAt,
        planName: plans.name,
        isMainSitePlan: plans.isMainSitePlan,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username
        }
      })
      .from(purchaseHistory)
      .leftJoin(users, eq(purchaseHistory.userId, users.id))
      .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
      .where(eq(purchaseHistory.userId, userId))
      .orderBy(desc(purchaseHistory.createdAt));
  }

  async getPurchasesByPlan(planId: number): Promise<PurchaseHistory[]> {
    return await db
      .select()
      .from(purchaseHistory)
      .where(eq(purchaseHistory.planId, planId))
      .orderBy(desc(purchaseHistory.createdAt));
  }

  // Note: createPurchase now redirects to createPurchaseHistory for consistency
  async createPurchase(purchase: InsertPurchaseHistory): Promise<PurchaseHistory> {
    return await this.createPurchaseHistory(purchase);
  }

  async updatePurchaseStatus(id: number, status: string): Promise<PurchaseHistory> {
    const [updatedPurchase] = await db
      .update(purchaseHistory)
      .set({ 
        status: status as any,
      })
      .where(eq(purchaseHistory.id, id))
      .returning();
    return updatedPurchase;
  }

  // Purchase history operations for plan analytics
  async createPurchaseHistory(purchase: InsertPurchaseHistory): Promise<PurchaseHistory> {
    const [insertedRecord] = await db
      .insert(purchaseHistory)
      .values(purchase)
      .returning();
    
    if (!insertedRecord) {
      throw new Error('Failed to create purchase history record');
    }
    
    return insertedRecord;
  }

  // End-user activity tracking methods
  async createEndUserActivity(activity: InsertEndUserActivity): Promise<EndUserActivity> {
    const [insertedRecord] = await db
      .insert(endUserActivities)
      .values(activity)
      .returning();
    
    if (!insertedRecord) {
      throw new Error('Failed to create end user activity record');
    }
    
    return insertedRecord;
  }

  async trackEndUserActivity(activity: InsertEndUserActivity): Promise<EndUserActivity> {
    return await this.createEndUserActivity(activity);
  }

  async getEndUserActivitiesByWhiteLabel(whiteLabelId: number, limit = 50): Promise<EndUserActivity[]> {
    console.log('🔍 [Storage] getEndUserActivitiesByWhiteLabel called:', {
      whiteLabelId,
      limit
    });
    
    try {
      const activities = await db
        .select({
          id: endUserActivities.id,
          userId: endUserActivities.userId,
          whiteLabelId: endUserActivities.whiteLabelId,
          activityType: endUserActivities.activityType,
          description: endUserActivities.description,
          metadata: endUserActivities.metadata,
          createdAt: endUserActivities.createdAt,
          user: {
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        })
        .from(endUserActivities)
        .leftJoin(users, eq(endUserActivities.userId, users.id))
        .where(eq(endUserActivities.whiteLabelId, whiteLabelId))
        .orderBy(desc(endUserActivities.createdAt))
        .limit(limit);
      
      console.log('✅ [Storage] getEndUserActivitiesByWhiteLabel retrieved activities:', {
        whiteLabelId,
        count: activities.length,
        limit,
        activities: activities.map(a => ({
          id: a.id,
          userId: a.userId,
          activityType: a.activityType,
          description: a.description,
          userEmail: a.user?.email,
          createdAt: a.createdAt
        }))
      });
      
      return activities;
    } catch (error) {
      console.error('❌ [Storage] getEndUserActivitiesByWhiteLabel error:', {
        whiteLabelId,
        limit,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getEndUserActivityStats(whiteLabelId: number): Promise<{
    totalSignups: number;
    totalLogins: number;
    totalPurchases: number;
    recentSignups: number;
    activeUsers: number;
  }> {
    // Get date 7 days ago for recent activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Total signups
    const [signupCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(endUserActivities)
      .where(and(
        eq(endUserActivities.whiteLabelId, whiteLabelId),
        eq(endUserActivities.activityType, 'signup')
      ));

    // Total logins
    const [loginCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(endUserActivities)
      .where(and(
        eq(endUserActivities.whiteLabelId, whiteLabelId),
        eq(endUserActivities.activityType, 'login')
      ));

    // Total purchases
    const [purchaseCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(endUserActivities)
      .where(and(
        eq(endUserActivities.whiteLabelId, whiteLabelId),
        eq(endUserActivities.activityType, 'purchase')
      ));

    // Recent signups (last 7 days)
    const [recentSignupCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(endUserActivities)
      .where(and(
        eq(endUserActivities.whiteLabelId, whiteLabelId),
        eq(endUserActivities.activityType, 'signup'),
        sql`${endUserActivities.createdAt} >= ${weekAgo}`
      ));

    // Active users (logged in within last 24 hours)
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    
    const [activeUserCount] = await db
      .select({ count: sql<number>`count(distinct ${userSessions.userId})` })
      .from(userSessions)
      .where(and(
        eq(userSessions.whiteLabelId, whiteLabelId),
        eq(userSessions.isActive, true),
        sql`${userSessions.lastActiveAt} >= ${dayAgo}`
      ));

    return {
      totalSignups: signupCount?.count || 0,
      totalLogins: loginCount?.count || 0,
      totalPurchases: purchaseCount?.count || 0,
      recentSignups: recentSignupCount?.count || 0,
      activeUsers: activeUserCount?.count || 0,
    };
  }

  // User session tracking methods
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [newSession] = await db
      .insert(userSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateUserSession(sessionToken: string, data: Partial<InsertUserSession>): Promise<void> {
    await db
      .update(userSessions)
      .set({ 
        ...data,
        lastActiveAt: new Date()
      })
      .where(eq(userSessions.sessionToken, sessionToken));
  }

  async getActiveUsersByWhiteLabel(whiteLabelId: number): Promise<User[]> {
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);

    return await db
      .select()
      .from(users)
      .innerJoin(userSessions, eq(users.id, userSessions.userId))
      .where(and(
        eq(userSessions.whiteLabelId, whiteLabelId),
        eq(userSessions.isActive, true),
        sql`${userSessions.lastActiveAt} >= ${dayAgo}`
      ));
  }

  async getUserLoginStatus(userId: string): Promise<{ isOnline: boolean; lastActiveAt?: Date }> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true)
      ))
      .orderBy(desc(userSessions.lastActiveAt))
      .limit(1);

    if (!session) {
      return { isOnline: false };
    }

    // Consider user online if last active within 15 minutes
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const isOnline = session.lastActiveAt && session.lastActiveAt > fifteenMinutesAgo;

    return {
      isOnline: !!isOnline,
      lastActiveAt: session.lastActiveAt || undefined
    };
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    // Mark all user sessions as inactive to force re-login
    await db
      .update(userSessions)
      .set({ 
        isActive: false,
        lastActiveAt: new Date()
      })
      .where(eq(userSessions.userId, userId));
    
    console.log(`Invalidated all sessions for user: ${userId}`);
  }

  // End-user management for white-label clients
  async getEndUsersByWhiteLabel(whiteLabelId: number): Promise<{
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    lastLoginAt?: Date;
    isOnline: boolean;
    totalPurchases: number;
    totalSpent: string;
  }[]> {
    // Get all end-users for this white-label client
    const endUsers = await db
      .select()
      .from(users)
      .where(and(
        eq(users.whiteLabelId, whiteLabelId),
        eq(users.role, 'end_user')
      ))
      .orderBy(desc(users.createdAt));

    // Get additional data for each user
    const enrichedUsers = await Promise.all(
      endUsers.map(async (user) => {
        // Get last login activity
        const [lastLogin] = await db
          .select()
          .from(endUserActivities)
          .where(and(
            eq(endUserActivities.userId, user.id),
            eq(endUserActivities.activityType, 'login')
          ))
          .orderBy(desc(endUserActivities.createdAt))
          .limit(1);

        // Get login status
        const loginStatus = await this.getUserLoginStatus(user.id);

        // Get purchase statistics
        const [purchaseStats] = await db
          .select({
            count: sql<number>`count(*)`,
            total: sql<string>`coalesce(sum(${purchaseHistory.amount}), 0)`
          })
          .from(purchaseHistory)
          .where(and(
            eq(purchaseHistory.userId, user.id),
            eq(purchaseHistory.whiteLabelId, whiteLabelId),
            eq(purchaseHistory.status, 'completed')
          ));

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLoginAt: lastLogin?.createdAt,
          isOnline: loginStatus.isOnline,
          totalPurchases: purchaseStats?.count || 0,
          totalSpent: purchaseStats?.total || '0',
        };
      })
    );

    return enrichedUsers;
  }

  async getEndUserPurchaseHistory(userId: string, whiteLabelId: number): Promise<PurchaseHistory[]> {
    return await db
      .select()
      .from(purchaseHistory)
      .where(and(
        eq(purchaseHistory.userId, userId),
        eq(purchaseHistory.whiteLabelId, whiteLabelId)
      ))
      .orderBy(desc(purchaseHistory.createdAt));
  }

  async getPlanAnalytics(userId: string): Promise<any[]> {
    console.log('🔍 [Storage] getPlanAnalytics called for userId:', userId);
    
    try {
      // Get user's white label ID for filtering their own purchases
      const whiteLabel = await db
        .select()
        .from(whiteLabels)
        .where(eq(whiteLabels.userId, userId))
        .limit(1);

      const whiteLabelId = whiteLabel && whiteLabel.length > 0 ? whiteLabel[0].id : null;
      
      console.log('📊 [Storage] getPlanAnalytics white label lookup:', {
        userId,
        whiteLabelFound: whiteLabel.length > 0,
        whiteLabelId,
        whiteLabel: whiteLabel[0] || null
      });

    // Get ALL active plans (not just user-specific) so users can see buyers for any plan
    const allPlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true));

    console.log('📋 [Storage] getPlanAnalytics active plans found:', {
      count: allPlans.length,
      plans: allPlans.map(p => ({ id: p.id, name: p.name, price: p.price }))
    });

    const planAnalytics = await Promise.all(
      allPlans.map(async (plan) => {
        console.log(`🔍 [Storage] Processing plan analytics for plan: ${plan.name} (ID: ${plan.id})`);
        
        // Get purchase statistics for this plan across ALL purchases (not filtered by whiteLabelId)
        const purchaseStats = await db
          .select({
            totalPurchases: sql`COUNT(*)`.as('totalPurchases'),
            totalRevenue: sql`SUM(CAST(amount AS DECIMAL))`.as('totalRevenue'),
            uniqueBuyers: sql`COUNT(DISTINCT user_id)`.as('uniqueBuyers'),
          })
          .from(purchaseHistory)
          .where(
            and(
              eq(purchaseHistory.planId, plan.id),
              eq(purchaseHistory.status, 'completed')
            )
          );

        console.log(`📊 [Storage] Plan ${plan.name} purchase stats:`, {
          planId: plan.id,
          stats: purchaseStats[0] || { totalPurchases: 0, totalRevenue: 0, uniqueBuyers: 0 }
        });

        // Get all purchasers for this plan across ALL purchases
        const purchasers = await db
          .select({
            userId: purchaseHistory.userId,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            purchaseDate: purchaseHistory.createdAt,
            amount: purchaseHistory.amount,
            transactionId: purchaseHistory.transactionId,
            status: purchaseHistory.status,
            whiteLabelId: purchaseHistory.whiteLabelId,
            businessName: sql`COALESCE(${whiteLabels.businessName}, 'Direct Purchase')`.as('businessName'),
          })
          .from(purchaseHistory)
          .leftJoin(users, eq(purchaseHistory.userId, users.id))
          .leftJoin(whiteLabels, eq(purchaseHistory.whiteLabelId, whiteLabels.id))
          .where(eq(purchaseHistory.planId, plan.id))
          .orderBy(desc(purchaseHistory.createdAt));

        // Get recent purchases (last 10) across ALL purchases
        const recentPurchases = await db
          .select({
            userId: purchaseHistory.userId,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            purchaseDate: purchaseHistory.createdAt,
            amount: purchaseHistory.amount,
            transactionId: purchaseHistory.transactionId,
            businessName: sql`COALESCE(${whiteLabels.businessName}, 'Direct Purchase')`.as('businessName'),
          })
          .from(purchaseHistory)
          .leftJoin(users, eq(purchaseHistory.userId, users.id))
          .leftJoin(whiteLabels, eq(purchaseHistory.whiteLabelId, whiteLabels.id))
          .where(
            and(
              eq(purchaseHistory.planId, plan.id),
              eq(purchaseHistory.status, 'completed')
            )
          )
          .orderBy(desc(purchaseHistory.createdAt))
          .limit(10);

        const stats = purchaseStats[0] || {
          totalPurchases: 0,
          totalRevenue: 0,
          uniqueBuyers: 0,
        };

        const planResult = {
          planId: plan.id,
          planName: plan.name,
          totalSales: Number(stats.totalPurchases) || 0,
          totalRevenue: Number(stats.totalRevenue) || 0,
          totalPurchases: Number(stats.totalPurchases) || 0,
          purchasers: purchasers.map((p) => ({
            userId: p.userId,
            email: p.email || (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.firstName || p.lastName || p.userId),
            purchaseDate: p.purchaseDate,
            amount: Number(p.amount),
            transactionId: p.transactionId,
            status: p.status,
            businessName: p.businessName,
            whiteLabelId: p.whiteLabelId,
          })),
          recentPurchases: recentPurchases.map((p) => ({
            userId: p.userId,
            email: p.email || (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.firstName || p.lastName || p.userId),
            purchaseDate: p.purchaseDate,
            amount: Number(p.amount),
            transactionId: p.transactionId,
            businessName: p.businessName,
          })),
        };

        console.log(`✅ [Storage] Plan ${plan.name} analytics completed:`, {
          planId: plan.id,
          totalSales: planResult.totalSales,
          totalRevenue: planResult.totalRevenue,
          purchasersCount: planResult.purchasers.length,
          recentPurchasesCount: planResult.recentPurchases.length
        });

        return planResult;
      })
    );

    console.log('🎯 [Storage] getPlanAnalytics final result:', {
      userId,
      whiteLabelId,
      totalPlans: planAnalytics.length,
      summary: planAnalytics.map(p => ({
        planName: p.planName,
        totalSales: p.totalSales,
        totalRevenue: p.totalRevenue
      }))
    });

    return planAnalytics;
    } catch (error) {
      console.error('❌ [Storage] getPlanAnalytics error:', {
        userId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Plan category and product association methods
  async getPlanCategories(planId: number): Promise<Category[]> {
    const plan = await this.getPlan(planId);
    if (!plan || !plan.selectedCategories || !Array.isArray(plan.selectedCategories)) {
      return [];
    }
    
    // Get the selected categories first
    const selectedCategories = await db
      .select()
      .from(categories)
      .where(inArray(categories.id, plan.selectedCategories));
    
    if (selectedCategories.length === 0) {
      return [];
    }
    
    // Get the white label ID from the first selected category
    const whiteLabelId = selectedCategories[0].whiteLabelId;
    
    // Get all categories for this white label
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.whiteLabelId, whiteLabelId));
    
    // Function to get all descendant categories
    const getDescendantCategories = (parentIds: number[]): number[] => {
      const descendants = allCategories
        .filter(cat => cat.parentCategoryId && parentIds.includes(cat.parentCategoryId))
        .map(cat => cat.id);
      
      if (descendants.length > 0) {
        return [...descendants, ...getDescendantCategories(descendants)];
      }
      return [];
    };
    
    // Get all categories including descendants
    const allIncludedCategoryIds = [
      ...plan.selectedCategories,
      ...getDescendantCategories(plan.selectedCategories)
    ];
    
    const categoriesResult = await db
      .select()
      .from(categories)
      .where(inArray(categories.id, allIncludedCategoryIds));
    
    return categoriesResult;
  }

  async getPlanProducts(planId: number): Promise<Product[]> {
    const plan = await this.getPlan(planId);
    if (!plan) {
      return [];
    }
    
    // Get explicitly selected products
    const selectedProducts = plan.selectedProducts && Array.isArray(plan.selectedProducts) ? plan.selectedProducts : [];
    
    // Get products from selected categories and their descendants
    const categoryProducts: Product[] = [];
    if (plan.selectedCategories && Array.isArray(plan.selectedCategories)) {
      const allCategories = await this.getPlanCategories(planId);
      const allCategoryIds = allCategories.map(cat => cat.id);
      
      if (allCategoryIds.length > 0) {
        const categoryProductsResult = await db
          .select()
          .from(products)
          .where(inArray(products.categoryId, allCategoryIds));
        categoryProducts.push(...categoryProductsResult);
      }
    }
    
    // Get explicitly selected products
    const explicitProducts: Product[] = [];
    if (selectedProducts.length > 0) {
      const explicitProductsResult = await db
        .select()
        .from(products)
        .where(inArray(products.id, selectedProducts));
      explicitProducts.push(...explicitProductsResult);
    }
    
    // Combine and deduplicate products
    const allProducts = [...categoryProducts, ...explicitProducts];
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueProducts;
  }

  // Get plan with its categories and products
  async getPlanWithContent(planId: number): Promise<any> {
    const plan = await this.getPlan(planId);
    if (!plan) {
      return null;
    }

    const categories = await this.getPlanCategories(planId);
    const products = await this.getPlanProducts(planId);

    // Get products for each category
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const categoryProducts = await db
          .select()
          .from(products)
          .where(eq(products.categoryId, category.id));
        
        return {
          ...category,
          products: categoryProducts,
        };
      })
    );

    return {
      ...plan,
      categories: categoriesWithProducts,
      products: products.filter(p => !p.categoryId), // Standalone products
    };
  }

  // Referral tracking operations
  async createReferralTracking(referralData: {
    affiliateId: string;
    referredUserId: string;
    whiteLabelId: number;
    domainPath: string;
    referralSource?: string;
  }): Promise<void> {
    await db.insert(referralTracking).values({
      affiliateId: referralData.affiliateId,
      referredUserId: referralData.referredUserId,
      whiteLabelId: referralData.whiteLabelId,
      domainPath: referralData.domainPath,
      referralSource: referralData.referralSource || 'landing_page',
    });
  }

  // Legacy alias for trackReferral (maintains compatibility)
  async trackReferral(referralData: {
    affiliateId: string;
    referredUserId: string;
    whiteLabelId: number;
    domainPath: string;
    status?: string;
  }): Promise<void> {
    await this.createReferralTracking({
      affiliateId: referralData.affiliateId,
      referredUserId: referralData.referredUserId,
      whiteLabelId: referralData.whiteLabelId,
      domainPath: referralData.domainPath,
      referralSource: 'domain_purchase'
    });
  }

  async getReferralsByAffiliate(affiliateId: string): Promise<any[]> {
    // Get all referral commissions for this affiliate
    const rawReferrals = await db
      .select({
        id: referralCommissions.id,
        subscriptionId: referralCommissions.subscriptionId,
        purchaserUserId: referralCommissions.purchaserUserId,
        planId: referralCommissions.planId,
        referralCode: referralCommissions.referralCode,
        commissionAmount: referralCommissions.commissionAmount,
        commissionPercentage: referralCommissions.commissionPercentage,
        planAmount: referralCommissions.planAmount,
        status: referralCommissions.status,
        createdAt: referralCommissions.createdAt,
        // Join with users table to get purchaser details
        purchaser: {
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
        },
        // Join with plans table to get plan details
        plan: {
          name: plans.name,
          description: plans.description,
          monthlyPrice: plans.monthlyPrice,
        },
        // Join with white_labels table to get business details
        business: {
          businessName: whiteLabels.businessName,
          domainPath: whiteLabels.domainPath,
        }
      })
      .from(referralCommissions)
      .leftJoin(users, eq(referralCommissions.purchaserUserId, users.id))
      .leftJoin(plans, eq(referralCommissions.planId, plans.id))
      .leftJoin(whiteLabels, eq(users.id, whiteLabels.userId))
      .where(eq(referralCommissions.affiliateId, affiliateId))
      .orderBy(desc(referralCommissions.createdAt));

    // Deduplicate by subscriptionId (unique purchase)
    const seenSubs = new Set<number | string>();
    const dedupedReferrals = rawReferrals.filter((r: any) => {
      if (r.subscriptionId == null) return true; // keep if no subscription id
      if (seenSubs.has(r.subscriptionId)) return false;
      seenSubs.add(r.subscriptionId);
      return true;
    });

    // Group by purchaser user ID to aggregate purchases per client
    const groupedReferrals = dedupedReferrals.reduce((acc: any, referral: any) => {
      const userId = referral.purchaserUserId;
      
      if (!acc[userId]) {
        acc[userId] = {
          purchaser: referral.purchaser,
          business: referral.business,
          totalCommission: 0,
          totalPurchases: 0,
          plans: {}, // { [planId]: { name, count } }
          lastPurchaseDate: referral.createdAt,
        };
      }
      
      // Aggregate commission amounts
      acc[userId].totalCommission += parseFloat(referral.commissionAmount || '0');
      acc[userId].totalPurchases += 1;
      
      // Track plan purchases
      const planId = referral.planId;
      const planName = referral.plan?.name || 'Unknown Plan';
      if (!acc[userId].plans[planId]) {
        acc[userId].plans[planId] = { name: planName, count: 0 };
      }
      acc[userId].plans[planId].count += 1;
      
      // Update last purchase date
      if (new Date(referral.createdAt) > new Date(acc[userId].lastPurchaseDate)) {
        acc[userId].lastPurchaseDate = referral.createdAt;
      }
      
      return acc;
    }, {});

    // Convert grouped data to array format
    return Object.values(groupedReferrals).map((group: any) => ({
      purchaser: group.purchaser,
      business: group.business,
      totalCommission: group.totalCommission.toFixed(2),
      totalPurchases: group.totalPurchases,
      planSummary: Object.values(group.plans)
        .map((p: any) => `${p.name}(${p.count})`)
        .join(', '),
      lastPurchaseDate: group.lastPurchaseDate,
    }));
  }

  async getReferralsByWhiteLabel(whiteLabelId: number): Promise<any[]> {
    return await db
      .select({
        id: referralTracking.id,
        affiliateId: referralTracking.affiliateId,
        referredUserId: referralTracking.referredUserId,
        domainPath: referralTracking.domainPath,
        referralSource: referralTracking.referralSource,
        status: referralTracking.status,
        createdAt: referralTracking.createdAt,
        // Join with users table to get both affiliate and referred user info
        affiliate: {
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(referralTracking)
      .leftJoin(users, eq(referralTracking.affiliateId, users.id))
      .where(eq(referralTracking.whiteLabelId, whiteLabelId))
      .orderBy(desc(referralTracking.createdAt));
  }

  // Affiliate plan visibility operations
  async getAffiliatePlanVisibility(affiliateId: string): Promise<AffiliatePlanVisibility[]> {
    return await db
      .select()
      .from(affiliatePlanVisibility)
      .where(eq(affiliatePlanVisibility.affiliateId, affiliateId));
  }

  async setAffiliatePlanVisibility(affiliateId: string, planId: number, isVisible: boolean): Promise<AffiliatePlanVisibility> {
    // Check if record already exists
    const existing = await db
      .select()
      .from(affiliatePlanVisibility)
      .where(and(
        eq(affiliatePlanVisibility.affiliateId, affiliateId),
        eq(affiliatePlanVisibility.planId, planId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      const [updated] = await db
        .update(affiliatePlanVisibility)
        .set({ isVisible, updatedAt: new Date() })
        .where(and(
          eq(affiliatePlanVisibility.affiliateId, affiliateId),
          eq(affiliatePlanVisibility.planId, planId)
        ))
        ; // .returning() removed for MySQL compatibility
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(affiliatePlanVisibility)
        .values({
          affiliateId,
          planId,
          isVisible
        })
        ; // .returning() removed for MySQL compatibility
      return created;
    }
  }

  async getVisiblePlansForAffiliate(affiliateId: string): Promise<Plan[]> {
    // Get all plans that this affiliate has marked as visible
    const visiblePlanIds = await db
      .select({ planId: affiliatePlanVisibility.planId })
      .from(affiliatePlanVisibility)
      .where(and(
        eq(affiliatePlanVisibility.affiliateId, affiliateId),
        eq(affiliatePlanVisibility.isVisible, true)
      ));

    if (visiblePlanIds.length === 0) {
      return [];
    }

    // Get the actual plan data
    const rawPlans = await db
      .select()
      .from(plans)
      .where(inArray(plans.id, visiblePlanIds.map(v => v.planId)));
    
    return rawPlans.map(plan => this.parsePlanJsonFields(plan));
  }

  async getPromotablePlansForAffiliate(affiliateId: string): Promise<Plan[]> {
    // This method requires BOTH conditions:
    // 1. White label client has enabled allowAffiliatePromotion=true
    // 2. Affiliate has marked the plan as isVisible=true
    
    // Get all plans that this affiliate has marked as visible
    const visiblePlanIds = await db
      .select({ planId: affiliatePlanVisibility.planId })
      .from(affiliatePlanVisibility)
      .where(and(
        eq(affiliatePlanVisibility.affiliateId, affiliateId),
        eq(affiliatePlanVisibility.isVisible, true)
      ));

    if (visiblePlanIds.length === 0) {
      return [];
    }

    // Get the actual plan data but ONLY for plans with affiliate promotion enabled
    const rawPlans = await db
      .select()
      .from(plans)
      .where(and(
        inArray(plans.id, visiblePlanIds.map(v => v.planId)),
        eq(plans.allowAffiliatePromotion, true),
        eq(plans.status, 'published') // Only published plans can be promoted
      ));
    
    return rawPlans.map(plan => this.parsePlanJsonFields(plan));
  }

  async getAffiliatePlanVisibilitySettings(affiliateId: string): Promise<Array<{planId: number, isVisible: boolean}>> {
    const settings = await db
      .select({
        planId: affiliatePlanVisibility.planId,
        isVisible: affiliatePlanVisibility.isVisible
      })
      .from(affiliatePlanVisibility)
      .where(eq(affiliatePlanVisibility.affiliateId, affiliateId));
    
    return settings;
  }

  async getAffiliatePlanVisibilitySettings(affiliateId: string): Promise<Array<{planId: number, isVisible: boolean}>> {
    const settings = await db
      .select({
        planId: affiliatePlanVisibility.planId,
        isVisible: affiliatePlanVisibility.isVisible
      })
      .from(affiliatePlanVisibility)
      .where(eq(affiliatePlanVisibility.affiliateId, affiliateId));
    
    return settings;
  }

  // Commission tracking methods
  async getCommissionDataForAffiliate(affiliateId: string, domain: string): Promise<any[]> {
    console.log(`getCommissionDataForAffiliate called with affiliateId: ${affiliateId}, domain: ${domain}`);
    
    // Get the white-label client associated with this domain
    const whiteLabelClient = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.domainPath, domain))
      .limit(1);

    if (!whiteLabelClient.length) {
      console.log(`No white-label client found for domain: ${domain}`);
      return [];
    }

    console.log(`Found white-label client: ${whiteLabelClient[0].userId} for domain: ${domain}`);

    // Get ALL active plans from this specific white-label client (affiliates should see all plans)
    const allPlans = await db
      .select({
        id: plans.id,
        name: plans.name,
        monthlyPrice: plans.monthlyPrice,
        affiliateCommissionPercentage: plans.affiliateCommissionPercentage,
        isPublic: plans.isPublic,
      })
      .from(plans)
      .where(and(
        eq(plans.isActive, true),
        eq(plans.createdBy, whiteLabelClient[0].userId)
      ));

    // For each plan, calculate commission data
    const commissionData = await Promise.all(
      allPlans.map(async (plan) => {
        // Get ALL purchases for this plan (total revenue from public plans)
        const allPurchases = await db
          .select({
            id: purchaseHistory.id,
            userId: purchaseHistory.userId,
            planId: purchaseHistory.planId,
            price: purchaseHistory.amount,
            purchaseDate: purchaseHistory.createdAt,
            userEmail: users.email,
            userFirstName: users.firstName,
            userLastName: users.lastName,
          })
          .from(purchaseHistory)
          .leftJoin(users, eq(purchaseHistory.userId, users.id))
          .where(eq(purchaseHistory.planId, plan.id));

        // Get ONLY purchases from users referred by this affiliate (for referral tracking)
        const referralPurchases = await db
          .select({
            id: purchaseHistory.id,
            userId: purchaseHistory.userId,
            planId: purchaseHistory.planId,
            price: purchaseHistory.amount,
            purchaseDate: purchaseHistory.createdAt,
            userEmail: users.email,
            userFirstName: users.firstName,
            userLastName: users.lastName,
          })
          .from(referralTracking)
          .innerJoin(purchaseHistory, eq(referralTracking.referredUserId, purchaseHistory.userId))
          .leftJoin(users, eq(purchaseHistory.userId, users.id))
          .where(and(
            eq(purchaseHistory.planId, plan.id),
            eq(purchaseHistory.status, 'completed'),
            eq(referralTracking.affiliateId, affiliateId),
            eq(referralTracking.domainPath, domain)
          ));
          
        // Get ALL referral purchases for this affiliate across all domains for this plan
        // Use DISTINCT to avoid duplicate purchases from multiple referral tracking entries
        const allAffiliateReferralPurchases = await db
          .selectDistinct({
            id: purchaseHistory.id,
            userId: purchaseHistory.userId,
            planId: purchaseHistory.planId,
            price: purchaseHistory.amount,
            purchaseDate: purchaseHistory.createdAt,
            userEmail: users.email,
            userFirstName: users.firstName,
            userLastName: users.lastName,
          })
          .from(referralTracking)
          .innerJoin(purchaseHistory, eq(referralTracking.referredUserId, purchaseHistory.userId))
          .leftJoin(users, eq(purchaseHistory.userId, users.id))
          .where(and(
            eq(purchaseHistory.planId, plan.id),
            eq(purchaseHistory.status, 'completed'),
            eq(referralTracking.affiliateId, affiliateId)
            // Remove domain restriction to get all affiliate commissions
          ));

        console.log(`Plan ${plan.name}: Found ${allAffiliateReferralPurchases.length} total referral purchases for affiliate ${affiliateId}`);

        // Calculate commission metrics - use actual referral commission records
        const totalPurchases = allAffiliateReferralPurchases.length;
        const totalRevenue = allAffiliateReferralPurchases.reduce((sum, purchase) => {
          return sum + parseFloat(purchase.price || '0');
        }, 0);

        // Get ACTUAL commission records from the referral_commissions table for this plan and affiliate
        const actualCommissions = await db
          .select({
            commissionAmount: referralCommissions.commissionAmount,
            commissionPercentage: referralCommissions.commissionPercentage,
          })
          .from(referralCommissions)
          .where(and(
            eq(referralCommissions.planId, plan.id),
            eq(referralCommissions.affiliateId, affiliateId)
          ));

        // Calculate total actual commission earned (from referral_commissions table)
        const affiliateCommission = actualCommissions.reduce((sum, commission) => {
          return sum + parseFloat(commission.commissionAmount || '0');
        }, 0);

        const commissionPercentage = parseFloat(plan.affiliateCommissionPercentage || '0');
        
        console.log(`Plan ${plan.name}: referralPurchases=${allAffiliateReferralPurchases.length}, totalRevenue=${totalRevenue}, actualCommissions=${actualCommissions.length}, commission%=${commissionPercentage}, affiliateCommission=${affiliateCommission}`);

        return {
          plan: {
            id: plan.id,
            name: plan.name,
            monthlyPrice: plan.monthlyPrice,
            affiliateCommissionPercentage: commissionPercentage,
          },
          metrics: {
            totalPurchases,
            totalRevenue: affiliateCommission, // Show commission earned instead of sales revenue
            affiliateCommission: affiliateCommission, // Commission amount for affiliate
          },
          purchasers: allPurchases.map(p => ({
            userId: p.userId,
            email: p.userEmail,
            firstName: p.userFirstName,
            lastName: p.userLastName,
            purchaseDate: p.purchaseDate,
            price: p.price,
          })),
        };
      })
    );

    return commissionData;
  }

  // Simple method to get ONLY super admin affiliates (NOT white label affiliates)
  async getAllAffiliatesForSuperAdmin(): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    whiteLabelBusiness?: string;
    totalSales: number;
    totalRevenue: number;
    referralCount: number;
    joinDate: Date;
  }[]> {
    try {
      // Get ONLY super admin affiliates - NOT white label affiliates
      const superAdminAffiliates = await db
        .select()
        .from(users)
        .where(eq(users.role, 'super_admin_affiliate'));

      if (superAdminAffiliates.length === 0) {
        return [];
      }

      // Build simple response without complex calculations that cause DB errors
      const affiliateList = superAdminAffiliates.map(affiliate => ({
        id: affiliate.id,
        name: affiliate.name || `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unnamed Affiliate',
        email: affiliate.email || 'no-email@example.com',
        role: affiliate.role,
        whiteLabelBusiness: '', // Will be populated separately if needed
        totalSales: 0, // Simplified for now
        totalRevenue: 0, // Simplified for now
        referralCount: 0, // Simplified for now
        joinDate: affiliate.createdAt || new Date(),
      }));

      return affiliateList.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    } catch (error) {
      console.error('Error in getAllAffiliatesForSuperAdmin:', error);
      return [];
    }
  }

  // Get global commission data for Super Admin from referral_commissions table
  async getGlobalCommissionData(): Promise<{
    affiliateId: string;
    affiliateName: string;
    affiliateEmail: string;
    role: string;
    whiteLabelBusiness?: string;
    totalCommissions: number;
    totalReferrals: number;
    totalRevenue: number;
    recentActivity: any[];
  }[]> {
    try {
      // Get all affiliates using the simple method
      const affiliates = await this.getAllAffiliatesForSuperAdmin();
      
      // Get commission data for each affiliate from referral_commissions table
      const commissionData = await Promise.all(
        affiliates.map(async (affiliate) => {
          // Get actual commission data from referral_commissions table
          const commissions = await db
            .select({
              commissionAmount: referralCommissions.commissionAmount,
              planAmount: referralCommissions.planAmount,
              purchaserUserId: referralCommissions.purchaserUserId,
              createdAt: referralCommissions.createdAt,
            })
            .from(referralCommissions)
            .where(eq(referralCommissions.affiliateId, affiliate.id));

          // Calculate totals from real data
          const totalCommissions = commissions.reduce((sum, commission) => {
            return sum + parseFloat(commission.commissionAmount || '0');
          }, 0);

          const totalRevenue = commissions.reduce((sum, commission) => {
            return sum + parseFloat(commission.planAmount || '0');
          }, 0);

          const totalReferrals = commissions.length;

          return {
            affiliateId: affiliate.id,
            affiliateName: affiliate.name,
            affiliateEmail: affiliate.email,
            role: affiliate.role,
            whiteLabelBusiness: affiliate.whiteLabelBusiness,
            totalCommissions,
            totalReferrals,
            totalRevenue,
            recentActivity: commissions.slice(0, 5).map(commission => ({
              type: 'commission',
              amount: commission.commissionAmount,
              date: commission.createdAt,
              purchaser: commission.purchaserUserId
            }))
          };
        })
      );

      return commissionData;
    } catch (error) {
      console.error('Error in getGlobalCommissionData:', error);
      return [];
    }
  }

  async getPlanPurchasers(planId: number): Promise<any[]> {
    return await db
      .select({
        id: purchaseHistory.id,
        userId: purchaseHistory.userId,
        planId: purchaseHistory.planId,
        price: purchaseHistory.amount,
        purchaseDate: purchaseHistory.createdAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
      })
      .from(purchaseHistory)
      .leftJoin(users, eq(purchaseHistory.userId, users.id))
      .where(eq(purchaseHistory.planId, planId))
      .orderBy(desc(purchaseHistory.createdAt));
  }

  async updateReferralStatus(id: number, status: string): Promise<void> {
    await db
      .update(referralTracking)
      .set({ status, updatedAt: new Date() })
      .where(eq(referralTracking.id, id));
  }

  async getReferralsByUser(userId: string): Promise<any[]> {
    return await db
      .select({
        id: referralTracking.id,
        referredUserId: referralTracking.referredUserId,
        whiteLabelId: referralTracking.whiteLabelId,
        domainPath: referralTracking.domainPath,
        referralSource: referralTracking.referralSource,
        status: referralTracking.status,
        createdAt: referralTracking.createdAt,
        // Join with users table to get referred user info
        referredUser: {
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(referralTracking)
      .leftJoin(users, eq(referralTracking.referredUserId, users.id))
      .where(eq(referralTracking.affiliateId, userId))
      .orderBy(desc(referralTracking.createdAt));
  }

  async updateAffiliatePlanVisibility(planId: number, affiliateId: string, isVisible: boolean): Promise<void> {
    // Check if record already exists
    const existing = await db
      .select()
      .from(affiliatePlanVisibility)
      .where(and(
        eq(affiliatePlanVisibility.affiliateId, affiliateId),
        eq(affiliatePlanVisibility.planId, planId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      await db
        .update(affiliatePlanVisibility)
        .set({ isVisible, updatedAt: new Date() })
        .where(and(
          eq(affiliatePlanVisibility.affiliateId, affiliateId),
          eq(affiliatePlanVisibility.planId, planId)
        ));
    } else {
      // Create new record
      await db
        .insert(affiliatePlanVisibility)
        .values({
          affiliateId,
          planId,
          isVisible
        });
    }
  }

  // Real affiliate data methods for top performers
  async getTopAffiliatesByWhiteLabel(whiteLabelId: number, limit = 3): Promise<{
    id: string;
    name: string;
    email: string;
    totalSales: number;
    totalPurchases: number;
    totalRevenue: number;
    referralCount: number;
    joinDate: Date;
  }[]> {
    // Get all affiliate users associated with this white-label client
    // IMPORTANT: Filter by affiliateOfWhiteLabelId, not whiteLabelId!
    const allAffiliates = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(
        eq(users.affiliateOfWhiteLabelId, whiteLabelId),
        eq(users.role, 'white_label_affiliate')
      ));

    // If no affiliates found, return empty array
    if (allAffiliates.length === 0) {
      return [];
    }

    const affiliates = allAffiliates;

    // Calculate metrics for each affiliate
    const affiliateMetrics = await Promise.all(
      affiliates.map(async (affiliate) => {
        // Get referrals made by this affiliate
        const referrals = await db
          .select()
          .from(referralTracking)
          .where(and(
            eq(referralTracking.affiliateId, affiliate.id),
            eq(referralTracking.whiteLabelId, whiteLabelId)
          ));

        // Get purchases made by users referred by this affiliate
        const referralPurchases = await db
          .select({
            amount: purchaseHistory.amount,
            planId: purchaseHistory.planId,
          })
          .from(purchaseHistory)
          .innerJoin(
            referralTracking,
            eq(purchaseHistory.userId, referralTracking.referredUserId)
          )
          .where(and(
            eq(referralTracking.affiliateId, affiliate.id),
            eq(referralTracking.whiteLabelId, whiteLabelId),
            eq(purchaseHistory.status, 'completed')
          ));

        const totalPurchases = referralPurchases.length;
        const totalRevenue = referralPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0);

        return {
          id: affiliate.id,
          name: affiliate.name || `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unnamed Affiliate',
          email: affiliate.email || 'no-email@example.com',
          totalSales: totalPurchases,
          totalPurchases,
          totalRevenue,
          referralCount: referrals.length,
          joinDate: affiliate.createdAt || new Date(),
        };
      })
    );

    // Sort by total revenue (lifetime sales) and return top performers
    return affiliateMetrics
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  async getAffiliateDetails(affiliateId: string): Promise<{
    id: string;
    name: string;
    email: string;
    totalSales: number;
    totalPurchases: number;
    totalRevenue: number;
    referralCount: number;
    joinDate: Date;
    recentReferrals: any[];
    recentPurchases: any[];
  } | null> {
    // Get affiliate info
    const [affiliate] = await db
      .select()
      .from(users)
      .where(eq(users.id, affiliateId));

    if (!affiliate) {
      return null;
    }

    // Get referrals
    const referrals = await db
      .select({
        id: referralTracking.id,
        referredUserId: referralTracking.referredUserId,
        createdAt: referralTracking.createdAt,
        referredUserEmail: users.email,
        referredUserName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('name'),
      })
      .from(referralTracking)
      .leftJoin(users, eq(referralTracking.referredUserId, users.id))
      .where(eq(referralTracking.affiliateId, affiliateId))
      .orderBy(desc(referralTracking.createdAt))
      .limit(10);

    // Get purchases from referred users
    const referralPurchases = await db
      .select({
        id: purchaseHistory.id,
        amount: purchaseHistory.amount,
        planId: purchaseHistory.planId,
        createdAt: purchaseHistory.createdAt,
        planName: plans.name,
        userEmail: users.email,
      })
      .from(purchaseHistory)
      .innerJoin(
        referralTracking,
        eq(purchaseHistory.userId, referralTracking.referredUserId)
      )
      .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
      .leftJoin(users, eq(purchaseHistory.userId, users.id))
      .where(and(
        eq(referralTracking.affiliateId, affiliateId),
        eq(purchaseHistory.status, 'completed')
      ))
      .orderBy(desc(purchaseHistory.createdAt))
      .limit(10);

    const totalPurchases = referralPurchases.length;
    const totalRevenue = referralPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0);

    return {
      id: affiliate.id,
      name: affiliate.name || `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unnamed Affiliate',
      email: affiliate.email || 'no-email@example.com',
      totalSales: totalPurchases,
      totalPurchases,
      totalRevenue,
      referralCount: referrals.length,
      joinDate: affiliate.createdAt || new Date(),
      recentReferrals: referrals.map(r => ({
        id: r.id,
        referredUserId: r.referredUserId,
        referredUserEmail: r.referredUserEmail,
        referredUserName: r.referredUserName,
        createdAt: r.createdAt,
      })),
      recentPurchases: referralPurchases.map(p => ({
        id: p.id,
        amount: parseFloat(p.amount),
        planName: p.planName,
        userEmail: p.userEmail,
        createdAt: p.createdAt,
      })),
    };
  }

  // Super Admin specific methods for platform overview
  async getAllWhiteLabelClients(): Promise<any[]> {
    try {
      const whiteLabelClients = await db
        .select({
          id: whiteLabels.id,
          businessName: whiteLabels.businessName,
          domainPath: whiteLabels.domainPath,
          userId: whiteLabels.userId,
          createdAt: whiteLabels.createdAt,
          isActive: whiteLabels.isActive,
          userEmail: users.email,
          userName: users.name,
        })
        .from(whiteLabels)
        .leftJoin(users, eq(whiteLabels.userId, users.id))
        .where(eq(whiteLabels.isActive, true))
        .orderBy(desc(whiteLabels.createdAt));

      // Get additional stats for each white-label client
      const clientsWithStats = await Promise.all(
        whiteLabelClients.map(async (client) => {
          // Get total plans created by this client
          const clientPlans = await db
            .select({ count: sql<number>`count(*)` })
            .from(plans)
            .where(eq(plans.createdBy, client.userId));

          // Get total revenue from this client's plans (money they earned)
          const clientRevenue = await db
            .select({ 
              totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)` 
            })
            .from(purchaseHistory)
            .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
            .where(and(
              eq(plans.createdBy, client.userId),
              eq(purchaseHistory.status, 'completed')
            ));

          // Get total spent by this client (their own purchases of main site plans)
          const clientSpent = await db
            .select({ 
              totalSpent: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)` 
            })
            .from(purchaseHistory)
            .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
            .where(and(
              eq(purchaseHistory.userId, client.userId),
              eq(plans.isMainSitePlan, true),
              eq(purchaseHistory.status, 'completed')
            ));

          // Get end-user count for this client
          const endUserCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(and(
              eq(users.role, 'end_user'),
              eq(users.whiteLabelId, client.id)
            ));

          return {
            ...client,
            totalPlans: clientPlans[0]?.count || 0,
            totalRevenue: parseFloat(clientRevenue[0]?.totalRevenue?.toString() || '0'),
            totalSpent: parseFloat(clientSpent[0]?.totalSpent?.toString() || '0'),
            totalEndUsers: endUserCount[0]?.count || 0,
          };
        })
      );

      return clientsWithStats;
    } catch (error) {
      console.error('Error fetching white-label clients:', error);
      return [];
    }
  }

  async getMainSitePlans(): Promise<any[]> {
    try {
      // Get plans with isMainSitePlan = true (main site plans)
      const mainSitePlans = await db
        .select()
        .from(plans)
        .where(and(
          eq(plans.isMainSitePlan, true),
          eq(plans.isActive, true)
        ))
        .orderBy(desc(plans.createdAt));

      return mainSitePlans;
    } catch (error) {
      console.error('Error fetching main site plans:', error);
      return [];
    }
  }

  async getMainSitePlanAnalytics(): Promise<any[]> {
    try {
      // Get analytics for plans with isMainSitePlan = true only
      const planAnalytics = await db
        .select({
          planId: plans.id,
          planName: plans.name,
          totalSales: sql<number>`coalesce(count(${purchaseHistory.id}), 0)`,
          totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`,
        })
        .from(plans)
        .leftJoin(purchaseHistory, and(
          eq(purchaseHistory.planId, plans.id),
          eq(purchaseHistory.status, 'completed')
        ))
        .where(and(
          eq(plans.isMainSitePlan, true),
          eq(plans.isActive, true)
        ))
        .groupBy(plans.id, plans.name)
        .orderBy(desc(sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`));

      return planAnalytics.map(plan => ({
        ...plan,
        totalSales: Number(plan.totalSales),
        totalRevenue: parseFloat(plan.totalRevenue?.toString() || '0'),
      }));
    } catch (error) {
      console.error('Error fetching main site plan analytics:', error);
      return [];
    }
  }

  async getMainSitePurchaseHistory(): Promise<any[]> {
    try {
      // Get purchase history for plans with isMainSitePlan = true only
      const purchases = await db
        .select({
          id: purchaseHistory.id,
          amount: purchaseHistory.amount,
          status: purchaseHistory.status,
          createdAt: purchaseHistory.createdAt,
          planName: plans.name,
          userEmail: users.email,
          userName: users.name,
          planId: plans.id,
        })
        .from(purchaseHistory)
        .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
        .leftJoin(users, eq(purchaseHistory.userId, users.id))
        .where(and(
          eq(plans.isMainSitePlan, true),
          eq(purchaseHistory.status, 'completed')
        ))
        .orderBy(desc(purchaseHistory.createdAt))
        .limit(50);

      return purchases.map(purchase => ({
        ...purchase,
        amount: parseFloat(purchase.amount || '0'),
        purchaseDate: purchase.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching main site purchase history:', error);
      return [];
    }
  }

  async getPlanPurchasers(planId: number): Promise<any[]> {
    try {
      // Get all purchasers of a specific plan with their white-label client details
      const purchasers = await db
        .select({
          id: purchaseHistory.id,
          amount: purchaseHistory.amount,
          status: purchaseHistory.status,
          createdAt: purchaseHistory.createdAt,
          userEmail: users.email,
          userName: users.name,
          userId: users.id,
          userRole: users.role,
          userWhiteLabelId: users.whiteLabelId,
          whiteLabelBusinessName: whiteLabels.businessName,
          whiteLabelDomainPath: whiteLabels.domainPath,
        })
        .from(purchaseHistory)
        .leftJoin(users, eq(purchaseHistory.userId, users.id))
        .leftJoin(whiteLabels, eq(users.whiteLabelId, whiteLabels.id))
        .where(and(
          eq(purchaseHistory.planId, planId),
          eq(purchaseHistory.status, 'completed')
        ))
        .orderBy(desc(purchaseHistory.createdAt));

      return purchasers.map(purchaser => ({
        ...purchaser,
        amount: parseFloat(purchaser.amount || '0'),
        purchaseDate: purchaser.createdAt,
        isWhiteLabelClient: purchaser.userRole === 'white_label_client',
        isEndUser: purchaser.userRole === 'end_user',
        // For main site plans, show business name as "Direct Customer" if no white-label association
        whiteLabelBusinessName: purchaser.whiteLabelBusinessName || 'Direct Customer',
        whiteLabelDomainPath: purchaser.whiteLabelDomainPath || 'main-site',
      }));
    } catch (error) {
      console.error('Error fetching plan purchasers:', error);
      return [];
    }
  }

  async getWhiteLabelTrackingData(): Promise<any[]> {
    try {
      // Get all white-label clients with their tracking data
      const whiteLabelClients = await db
        .select()
        .from(whiteLabels)
        .leftJoin(users, eq(whiteLabels.userId, users.id))
        .orderBy(desc(whiteLabels.createdAt));

      // Get detailed stats for each white-label client
      const clientsWithTrackingData = await Promise.all(
        whiteLabelClients.map(async (client) => {
          // Get last login for the white-label client
          const lastLogin = await db
            .select({ lastActivity: userSessions.lastActivity })
            .from(userSessions)
            .where(eq(userSessions.userId, client.white_labels.userId))
            .orderBy(desc(userSessions.lastActivity))
            .limit(1);

          // Get purchase count for this white-label client
          const purchaseCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(purchaseHistory)
            .where(and(
              eq(purchaseHistory.userId, client.white_labels.userId),
              eq(purchaseHistory.status, 'completed')
            ));

          // Get total spent by this white-label client
          const totalSpent = await db
            .select({ totalSpent: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)` })
            .from(purchaseHistory)
            .where(and(
              eq(purchaseHistory.userId, client.white_labels.userId),
              eq(purchaseHistory.status, 'completed')
            ));

          return {
            id: client.white_labels.id,
            businessName: client.white_labels.businessName,
            domainPath: client.white_labels.domainPath,
            userId: client.white_labels.userId,
            userEmail: client.users?.email || null,
            userName: client.users?.name || null,
            joinedDate: client.white_labels.createdAt,
            lastLogin: lastLogin[0]?.lastActivity || null,
            purchaseCount: purchaseCount[0]?.count || 0,
            totalSpent: parseFloat(totalSpent[0]?.totalSpent?.toString() || '0'),
          };
        })
      );

      return clientsWithTrackingData;
    } catch (error) {
      console.error('Error fetching white-label tracking data:', error);
      return [];
    }
  }

  async getCommissionDataByWhiteLabel(whiteLabelId: number): Promise<{
    affiliateId: string;
    affiliateName: string;
    affiliateEmail: string;
    totalCommissions: number;
    totalReferrals: number;
    totalRevenue: number;
    recentActivity: any[];
  }[]> {
    // Get all affiliates for this white-label client
    // IMPORTANT: Filter by affiliateOfWhiteLabelId, not whiteLabelId!
    const affiliates = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        name: users.name,
      })
      .from(users)
      .where(and(
        eq(users.affiliateOfWhiteLabelId, whiteLabelId),
        eq(users.role, 'white_label_affiliate')
      ));

    // Calculate commission data for each affiliate
    const commissionData = await Promise.all(
      affiliates.map(async (affiliate) => {
        // Get referrals by this affiliate
        const referrals = await db
          .select()
          .from(referralTracking)
          .where(and(
            eq(referralTracking.affiliateId, affiliate.id),
            eq(referralTracking.whiteLabelId, whiteLabelId)
          ));

        // Get purchases from referrals
        const referralPurchases = await db
          .select({
            id: purchaseHistory.id,
            amount: purchaseHistory.amount,
            planId: purchaseHistory.planId,
            createdAt: purchaseHistory.createdAt,
            planName: plans.name,
          })
          .from(purchaseHistory)
          .innerJoin(
            referralTracking,
            eq(purchaseHistory.userId, referralTracking.referredUserId)
          )
          .leftJoin(plans, eq(purchaseHistory.planId, plans.id))
          .where(and(
            eq(referralTracking.affiliateId, affiliate.id),
            eq(referralTracking.whiteLabelId, whiteLabelId),
            eq(purchaseHistory.status, 'completed')
          ))
          .orderBy(desc(purchaseHistory.createdAt));

        const totalRevenue = referralPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0);
        // Assume 10% commission rate (in real app, this would be configurable)
        const totalCommissions = totalRevenue * 0.1;

        return {
          affiliateId: affiliate.id,
          affiliateName: affiliate.name || `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unnamed Affiliate',
          affiliateEmail: affiliate.email,
          totalCommissions,
          totalReferrals: referrals.length,
          totalRevenue,
          recentActivity: referralPurchases.slice(0, 5).map(p => ({
            type: 'purchase',
            planName: p.planName,
            amount: parseFloat(p.amount),
            date: p.createdAt,
          })),
        };
      })
    );

    return commissionData.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    try {
      const [preferences] = await db
        .select({
          ...userPreferences,
          // Override logoUrl with logoImageUrl from users table if available
          logoUrl: sql`COALESCE(${users.logoImageUrl}, ${userPreferences.logoUrl})`.as('logoUrl')
        })
        .from(userPreferences)
        .leftJoin(users, eq(users.id, userPreferences.userId))
        .where(eq(userPreferences.userId, userId));
      return preferences;
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return undefined;
    }
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    await db
      .insert(userPreferences)
      .values(preferences);
    
    // MySQL doesn't support .returning(), so we need to fetch the created record
    const newPreferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, preferences.userId))
      .limit(1);
    
    return newPreferences[0];
  }

  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    await db
      .update(userPreferences)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(userPreferences.userId, userId));
    
    // MySQL doesn't support .returning(), so we need to fetch the updated record
    const updatedPreferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    
    return updatedPreferences[0];
  }

  async getScheduledPlansReadyToPublish(currentTime: string): Promise<Plan[]> {
    try {
      console.log('Querying for scheduled plans where scheduledAt <=', currentTime);
      const scheduledPlans = await db
        .select()
        .from(plans)
        .where(
          and(
            eq(plans.status, 'scheduled'),
            lte(plans.scheduledAt, currentTime)
          )
        );
      
      scheduledPlans.forEach(plan => {
        console.log(`Found scheduled plan: ${plan.name} (ID: ${plan.id}) scheduled for: ${plan.scheduledAt?.toISOString()}`);
      });
      
      return scheduledPlans.map(plan => this.parsePlanJsonFields(plan));
    } catch (error) {
      console.error("Error getting scheduled plans ready to publish:", error);
      return [];
    }
  }
  // Payment account operations
  async getPaymentAccount(userId: string): Promise<PaymentAccount | undefined> {
    try {
      const [account] = await db
        .select()
        .from(paymentAccounts)
        .where(eq(paymentAccounts.userId, userId))
        .limit(1);
      return account;
    } catch (error) {
      console.error("Error getting payment account:", error);
      return undefined;
    }
  }

  // Get payment account for affiliate (using payment_accounts table)
  async getAffiliatePaymentAccount(affiliateId: string): Promise<any> {
    try {
      console.log(`🔍 Searching payment_accounts for affiliate: ${affiliateId}`);
      
      const [account] = await db
        .select()
        .from(paymentAccounts)
        .where(eq(paymentAccounts.userId, affiliateId))
        .limit(1);
      
      if (account) {
        console.log(`✅ Payment account found for ${affiliateId}:`, {
          id: account.id,
          userId: account.userId,
          bankName: account.bankName,
          accountOwnerName: account.accountOwnerName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          isActive: account.isActive,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt
        });
      } else {
        console.log(`❌ No payment account found for affiliate: ${affiliateId}`);
      }
      
      return account || null;
    } catch (error) {
      console.error("Error getting affiliate payment account:", error);
      return null;
    }
  }

  async createPaymentAccount(account: InsertPaymentAccount): Promise<PaymentAccount> {
    try {
      const [newAccount] = await db
        .insert(paymentAccounts)
        .values(account)
        .returning();
        
      if (!newAccount) {
        throw new Error('Failed to create payment account');
      }
        
      return newAccount;
    } catch (error) {
      console.error("Error creating payment account:", error);
      throw error;
    }
  }

  async updatePaymentAccount(userId: string, account: Partial<InsertPaymentAccount>): Promise<PaymentAccount> {
    try {
      await db
        .update(paymentAccounts)
        .set({ ...account, updatedAt: new Date() })
        .where(eq(paymentAccounts.userId, userId));
      
      // For MySQL, we need to fetch the updated record separately
      const [updatedAccount] = await db
        .select()
        .from(paymentAccounts)
        .where(eq(paymentAccounts.userId, userId))
        .limit(1);
      
      if (!updatedAccount) {
        throw new Error("Payment account not found");
      }
      
      return updatedAccount;
    } catch (error) {
      console.error("Error updating payment account:", error);
      throw error;
    }
  }

  // Affiliate payment tracking operations
  async getAffiliatePayments(affiliateId: string): Promise<AffiliatePayment[]> {
    try {
      return await db
        .select()
        .from(affiliatePayments)
        .where(eq(affiliatePayments.affiliateId, affiliateId))
        .orderBy(desc(affiliatePayments.createdAt));
    } catch (error) {
      console.error("Error getting affiliate payments:", error);
      return [];
    }
  }

  async getTotalPaidToAffiliate(affiliateId: string): Promise<number> {
    try {
      const result = await db
        .select({ total: sum(affiliatePayments.amount) })
        .from(affiliatePayments)
        .where(eq(affiliatePayments.affiliateId, affiliateId))
        .groupBy(affiliatePayments.affiliateId);
      
      return result.length > 0 ? parseFloat(result[0].total || "0") : 0;
    } catch (error) {
      console.error("Error getting total paid to affiliate:", error);
      return 0;
    }
  }

  async createAffiliatePayment(payment: InsertAffiliatePayment): Promise<AffiliatePayment> {
    try {
      const [newPayment] = await db
        .insert(affiliatePayments)
        .values(payment)
        .returning();
      
      if (!newPayment) {
        throw new Error('Failed to create affiliate payment');
      }
      
      return newPayment;
    } catch (error) {
      console.error("Error creating affiliate payment:", error);
      throw error;
    }
  }

  async getAffiliatePaymentSummary(requestingUserId?: string): Promise<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    totalCommission: number;
    totalPaid: number;
    needToPay: number;
    hasAccountDetails: boolean;
    totalCommission: number;
    totalPaid: number;
    needToPay: number;
    hasAccountDetails: boolean;
  }>> {
    try {
      // Determine which affiliates to include based on requesting user
      const requestingUser = requestingUserId ? await this.getUserById(requestingUserId) : null;
      
      if (requestingUser?.role === 'super_admin') {
        // Super Admin sees all Super Admin Affiliates
        const affiliates = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role,
          })
          .from(users)
          .where(eq(users.role, "super_admin_affiliate"));

        const summaries = [];

        for (const affiliate of affiliates) {
          // Get total commission for this affiliate
          const commissions = await db
            .select({
              commissionAmount: referralCommissions.commissionAmount
            })
            .from(referralCommissions)
            .where(eq(referralCommissions.affiliateId, affiliate.id));

          const totalCommission = commissions.reduce((sum, c) => 
            sum + parseFloat(c.commissionAmount || "0"), 0);

          // Get total paid to this affiliate - simplified query
          const payments = await db
            .select({
              amount: affiliatePayments.amount
            })
            .from(affiliatePayments)
            .where(eq(affiliatePayments.affiliateId, affiliate.id));

          const totalPaid = payments.reduce((sum, p) => 
            sum + parseFloat(String(p.amount) || "0"), 0);

          // Check if affiliate has payment account details
          const paymentAccount = await this.getAffiliatePaymentAccount(affiliate.id);
          const hasAccountDetails = !!(paymentAccount?.bankName && paymentAccount?.accountOwnerName && paymentAccount?.accountNumber);

          summaries.push({
            id: affiliate.id,
            name: `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unknown',
            email: affiliate.email || 'No email',
            role: affiliate.role,
            totalCommission,
            totalPaid,
            needToPay: Math.max(0, totalCommission - totalPaid),
            hasAccountDetails,
          });
        }

        return summaries;
      } else if (requestingUser?.role === 'super_admin_affiliate') {
        // Super Admin Affiliate only sees themselves
        const commissions = await db
          .select({
            commissionAmount: referralCommissions.commissionAmount
          })
          .from(referralCommissions)
          .where(eq(referralCommissions.affiliateId, requestingUserId!));

        const totalCommission = commissions.reduce((sum, c) => 
          sum + parseFloat(c.commissionAmount || "0"), 0);

        const payments = await db
          .select({
            amount: affiliatePayments.amount
          })
          .from(affiliatePayments)
          .where(eq(affiliatePayments.affiliateId, requestingUserId!));

        const totalPaid = payments.reduce((sum, p) => 
          sum + parseFloat(String(p.amount) || "0"), 0);

        // Check if affiliate has payment account details
        const paymentAccount = await this.getAffiliatePaymentAccount(requestingUserId!);
        const hasAccountDetails = !!(paymentAccount?.bankName && paymentAccount?.accountOwnerName && paymentAccount?.accountNumber);

        return [{
          id: requestingUser.id,
          name: `${requestingUser.firstName || ''} ${requestingUser.lastName || ''}`.trim() || 'Unknown',
          email: requestingUser.email || 'No email',
          role: requestingUser.role,
          totalCommission,
          totalPaid,
          needToPay: Math.max(0, totalCommission - totalPaid),
          hasAccountDetails,
        }];
      } else if (requestingUser?.role === 'white_label_client') {
        // White Label Client sees their white label affiliates
        const whiteLabel = await this.getWhiteLabelByUserId(requestingUserId!);
        if (!whiteLabel) {
          return [];
        }

        const affiliates = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            name: users.name,
            email: users.email,
            role: users.role,
          })
          .from(users)
          .where(and(
            eq(users.role, "white_label_affiliate"),
            eq(users.affiliateOfWhiteLabelId, whiteLabel.id)
          ));

        const summaries = [];

        for (const affiliate of affiliates) {
          // Get total commission for this affiliate
          const commissions = await db
            .select({
              commissionAmount: referralCommissions.commissionAmount
            })
            .from(referralCommissions)
            .where(eq(referralCommissions.affiliateId, affiliate.id));

          const totalCommission = commissions.reduce((sum, c) => 
            sum + parseFloat(c.commissionAmount || "0"), 0);

          // Get total paid to this affiliate
          const payments = await db
            .select({
              amount: affiliatePayments.amount
            })
            .from(affiliatePayments)
            .where(eq(affiliatePayments.affiliateId, affiliate.id));

          const totalPaid = payments.reduce((sum, p) => 
            sum + parseFloat(String(p.amount) || "0"), 0);

          // Check if affiliate has payment account details
          const paymentAccount = await this.getAffiliatePaymentAccount(affiliate.id);
          const hasAccountDetails = !!(paymentAccount?.bankName && paymentAccount?.accountOwnerName && paymentAccount?.accountNumber);

          summaries.push({
            id: affiliate.id,
            name: affiliate.name || `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unknown',
            email: affiliate.email || 'No email',
            role: affiliate.role,
            totalCommission,
            totalPaid,
            needToPay: Math.max(0, totalCommission - totalPaid),
            hasAccountDetails,
          });
        }

        return summaries;
      } else {
        // No access for other roles
        return [];
      }
    } catch (error) {
      console.error("Error getting affiliate payment summary:", error);
      return [];
    }
  }

  // Organization creation implementation
  async createOrganization(organizationData: {
    businessName: string;
    organizationFirstName: string;
    organizationLastName: string;
    username: string;
    password: string;
    domainPath: string;
    industry?: string;
    website?: string;
  }): Promise<{ user: User; whiteLabel: WhiteLabel }> {
    const bcrypt = await import('bcryptjs');
    
    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, organizationData.username))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Username already exists');
    }

    // Check if domain path already exists
    const existingDomain = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.domainPath, organizationData.domainPath))
      .limit(1);

    if (existingDomain.length > 0) {
      throw new Error('Domain path already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(organizationData.password, 10);

    // Generate unique user ID
    const userId = `${Date.now()}_${organizationData.username}`;

    // Create user record - MySQL compatible approach
    await db
      .insert(users)
      .values({
        id: userId,
        username: organizationData.username,
        firstName: organizationData.organizationFirstName,
        lastName: organizationData.organizationLastName,
        password: hashedPassword,
        role: 'white_label_client',
        authProvider: 'local',
        isActive: true,
      });

    // Query the created user
    const [newUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Create white-label record - MySQL compatible approach
    await db
      .insert(whiteLabels)
      .values({
        userId: newUser.id,
        businessName: organizationData.businessName,
        domainPath: organizationData.domainPath,
        landingPageCode: 'default',
        isActive: true,
      });

    // Query the created white-label record
    const [newWhiteLabel] = await db
      .select()
      .from(whiteLabels)
      .where(eq(whiteLabels.domainPath, organizationData.domainPath))
      .limit(1);

    if (!newWhiteLabel) {
      throw new Error('Failed to create white-label record');
    }

    return { user: newUser, whiteLabel: newWhiteLabel };
  }

  // Get Super Admin plan analytics for plans they created
  async getSuperAdminPlanAnalytics(userId: string): Promise<any[]> {
    console.log('STORAGE DEBUG - Getting Super Admin plan analytics for user:', userId);
    
    // Get all plans created by this Super Admin
    const superAdminPlans = await db
      .select()
      .from(plans)
      .where(eq(plans.createdBy, userId));

    console.log('STORAGE DEBUG - Found Super Admin plans:', superAdminPlans.length);

    if (superAdminPlans.length === 0) {
      return [];
    }

    const planIds = superAdminPlans.map(p => p.id);

    // Get purchase statistics for these plans
    const planAnalytics = await Promise.all(
      superAdminPlans.map(async (plan) => {
        // Get all purchases for this plan
        const purchases = await db
          .select({
            id: purchaseHistory.id,
            amount: purchaseHistory.amount,
            userId: purchaseHistory.userId,
            createdAt: purchaseHistory.createdAt,
            transactionId: purchaseHistory.transactionId,
          })
          .from(purchaseHistory)
          .where(eq(purchaseHistory.planId, plan.id));

        console.log(`STORAGE DEBUG - Plan ${plan.name} (ID: ${plan.id}) has ${purchases.length} purchases`);

        // Calculate statistics
        const totalSales = purchases.length;
        const totalRevenue = purchases.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
        const uniquePurchasers = new Set(purchases.map(p => p.userId)).size;

        // Get recent purchases (last 10)
        const recentPurchases = purchases
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
          .map(p => ({
            id: p.id,
            userId: p.userId,
            email: p.userId, // Use userId as fallback since userEmail doesn't exist
            amount: parseFloat(p.amount || '0'),
            purchaseDate: p.createdAt,
            transactionId: p.transactionId || 'N/A',
            businessName: 'Direct Purchase'
          }));

        return {
          planId: plan.id,
          planName: plan.name,
          totalSales,
          totalRevenue,
          uniquePurchasers,
          recentPurchases
        };
      })
    );

    return planAnalytics;
  }

  // NMI Credentials Management
  async createNmiCredentials(data: InsertNmiCredentials): Promise<NmiCredentials> {
    // Import crypto utilities for encryption
    const { encrypt } = await import('./crypto-utils');
    
    // Encrypt sensitive fields before storing
    const encryptedData: InsertNmiCredentials = {
      userId: data.userId,
      username: data.username,
      password: encrypt(data.password),
      securityKey: encrypt(data.securityKey),
      gatewayUrl: data.gatewayUrl,
      isTestMode: data.isTestMode,
      isActive: data.isActive
    };
    
    const result = await db.insert(nmiCredentials).values(encryptedData).returning();
    return this.getNmiCredentials(data.userId);
  }

  async getNmiCredentials(userId: string): Promise<NmiCredentials | null> {
    const [result] = await db
      .select()
      .from(nmiCredentials)
      .where(and(eq(nmiCredentials.userId, userId), eq(nmiCredentials.isActive, true)))
      .limit(1);
    
    if (!result) {
      return null;
    }

    // Import crypto utilities for decryption
    const { decrypt } = await import('./crypto-utils');
    
    // Decrypt sensitive fields before returning
    return {
      ...result,
      password: decrypt(result.password),
      securityKey: decrypt(result.securityKey)
    };
  }

  async updateNmiCredentials(userId: string, data: Partial<InsertNmiCredentials>): Promise<NmiCredentials | null> {
    // Import crypto utilities for encryption
    const { encrypt } = await import('./crypto-utils');
    
    // Encrypt sensitive fields if they are being updated
    const encryptedData = { ...data };
    if (data.password) {
      encryptedData.password = encrypt(data.password);
    }
    if (data.securityKey) {
      encryptedData.securityKey = encrypt(data.securityKey);
    }
    
    await db
      .update(nmiCredentials)
      .set({ ...encryptedData, updatedAt: new Date() })
      .where(eq(nmiCredentials.userId, userId));
    return this.getNmiCredentials(userId);
  }

  async deleteNmiCredentials(userId: string): Promise<void> {
    await db
      .update(nmiCredentials)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(nmiCredentials.userId, userId));
  }

  async getNmiCredentialsByPlanOwner(planId: number): Promise<NmiCredentials | null> {
    // Get the plan to find its owner
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1);
    
    if (!plan || !plan.createdBy) {
      return null;
    }

    // Get NMI credentials for the plan owner
    return this.getNmiCredentials(plan.createdBy);
  }

  async testNmiCredentials(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const credentials = await this.getNmiCredentials(userId);
      if (!credentials) {
        return { success: false, error: 'No NMI credentials found' };
      }

      // TODO: Implement actual NMI API test call
      // For now, just validate that required fields are present
      if (!credentials.username || !credentials.password || !credentials.securityKey) {
        return { success: false, error: 'Missing required NMI credentials' };
      }

      // Update test status
      await db
        .update(nmiCredentials)
        .set({ 
          lastTestedAt: new Date(),
          testStatus: 'success',
          testErrorMessage: null,
          updatedAt: new Date()
        })
        .where(eq(nmiCredentials.userId, userId));

      return { success: true };
    } catch (error) {
      console.error('Error testing NMI credentials:', error);
      
      // Update test status with error
      await db
        .update(nmiCredentials)
        .set({ 
          lastTestedAt: new Date(),
          testStatus: 'failed',
          testErrorMessage: error.message,
          updatedAt: new Date()
        })
        .where(eq(nmiCredentials.userId, userId));

      return { success: false, error: error.message };
    }
  }

  // Admin user management methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async getUsersByWhiteLabelId(whiteLabelId: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.userOfWhiteLabelId, whiteLabelId))
      .orderBy(users.createdAt);
  }

  async getEndUserActivitiesByUserId(userId: string): Promise<EndUserActivity[]> {
    return await db
      .select()
      .from(endUserActivities)
      .where(eq(endUserActivities.userId, userId))
      .orderBy(endUserActivities.createdAt);
  }

  async getUserPurchasesByUserId(userId: string): Promise<PurchaseHistory[]> {
    return await db
      .select()
      .from(purchaseHistory)
      .where(eq(purchaseHistory.userId, userId))
      .orderBy(purchaseHistory.purchaseDate);
  }

  // Comprehensive Analytics Functions for Super-Admin Dashboard
  async getRevenueOverview(startDate?: string, endDate?: string): Promise<any> {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      // Main site revenue (from main site plan purchases)
      const mainSiteRevenue = await db
        .select({ 
          totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`,
          totalSales: sql<number>`count(${purchaseHistory.id})`
        })
        .from(purchaseHistory)
        .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
        .where(and(
          eq(plans.isMainSitePlan, true),
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ));

      // White label revenue (from white label created plan purchases)
      const whiteLabelRevenue = await db
        .select({ 
          totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`,
          totalSales: sql<number>`count(${purchaseHistory.id})`
        })
        .from(purchaseHistory)
        .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
        .where(and(
          eq(plans.isMainSitePlan, false),
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ));

      // Monthly revenue trend
      const monthlyRevenue = await db
        .select({
          month: sql<string>`to_char(${purchaseHistory.createdAt}, 'YYYY-MM')`,
          mainSiteRevenue: sql<number>`coalesce(sum(case when ${plans.isMainSitePlan} = true then cast(${purchaseHistory.amount} as decimal) else 0 end), 0)`,
          whiteLabelRevenue: sql<number>`coalesce(sum(case when ${plans.isMainSitePlan} = false then cast(${purchaseHistory.amount} as decimal) else 0 end), 0)`
        })
        .from(purchaseHistory)
        .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
        .where(and(
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ))
        .groupBy(sql`to_char(${purchaseHistory.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${purchaseHistory.createdAt}, 'YYYY-MM')`);

      return {
        mainSiteRevenue: {
          total: parseFloat(mainSiteRevenue[0]?.totalRevenue?.toString() || '0'),
          sales: Number(mainSiteRevenue[0]?.totalSales || 0)
        },
        whiteLabelRevenue: {
          total: parseFloat(whiteLabelRevenue[0]?.totalRevenue?.toString() || '0'),
          sales: Number(whiteLabelRevenue[0]?.totalSales || 0)
        },
        monthlyTrend: monthlyRevenue.map(item => ({
          month: item.month,
          mainSiteRevenue: parseFloat(item.mainSiteRevenue?.toString() || '0'),
          whiteLabelRevenue: parseFloat(item.whiteLabelRevenue?.toString() || '0')
        }))
      };
    } catch (error) {
      console.error('Error fetching revenue overview:', error);
      return { mainSiteRevenue: { total: 0, sales: 0 }, whiteLabelRevenue: { total: 0, sales: 0 }, monthlyTrend: [] };
    }
  }

  async getWhiteLabelMetrics(startDate?: string, endDate?: string): Promise<any> {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      // Build date filter for whiteLabels.createdAt (timestamps stored as strings)
      const wlConditions: any[] = [];
      if (startDate) wlConditions.push(gte(whiteLabels.createdAt, new Date(startDate).toISOString()));
      if (endDate) wlConditions.push(lte(whiteLabels.createdAt, new Date(endDate).toISOString()));
      const wlDateFilter = wlConditions.length > 1 ? and(...wlConditions) : wlConditions[0];
      
      // Active white labels count
      const activeWhiteLabels = await db
        .select({ count: sql<number>`count(*)` })
        .from(whiteLabels)
        .where(and(
          eq(whiteLabels.isActive, true),
          wlDateFilter ? wlDateFilter : undefined
        ));

      // New white labels in period
      const newWhiteLabels = await db
        .select({ count: sql<number>`count(*)` })
        .from(whiteLabels)
        .where(wlDateFilter || sql`true`);

      // White label performance
      const whiteLabelPerformance = await db
        .select({
          whiteLabelId: whiteLabels.id,
          businessName: whiteLabels.businessName,
          totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`,
          totalSales: sql<number>`count(${purchaseHistory.id})`,
          totalPlans: sql<number>`count(distinct ${plans.id})`
        })
        .from(whiteLabels)
        .leftJoin(users, eq(whiteLabels.userId, users.id))
        .leftJoin(plans, eq(plans.createdBy, users.id))
        .leftJoin(purchaseHistory, and(
          eq(purchaseHistory.planId, plans.id),
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ))
        .where(eq(whiteLabels.isActive, true))
        .groupBy(whiteLabels.id, whiteLabels.businessName)
        .orderBy(desc(sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`))
        .limit(10);

      return {
        activeCount: Number(activeWhiteLabels[0]?.count || 0),
        newCount: Number(newWhiteLabels[0]?.count || 0),
        topPerformers: whiteLabelPerformance.map(wl => ({
          id: wl.whiteLabelId,
          businessName: wl.businessName,
          totalRevenue: parseFloat(wl.totalRevenue?.toString() || '0'),
          totalSales: Number(wl.totalSales || 0),
          totalPlans: Number(wl.totalPlans || 0)
        }))
      };
    } catch (error) {
      console.error('Error fetching white label metrics:', error);
      return { activeCount: 0, newCount: 0, topPerformers: [] };
    }
  }

  async getPlanPerformance(startDate?: string, endDate?: string): Promise<any> {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      // Main site plan performance
      const mainSitePlans = await db
        .select({
          planId: plans.id,
          planName: plans.name,
          price: plans.price,
          totalSales: sql<number>`count(${purchaseHistory.id})`,
          totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`
        })
        .from(plans)
        .leftJoin(purchaseHistory, and(
          eq(purchaseHistory.planId, plans.id),
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ))
        .where(and(
          eq(plans.isMainSitePlan, true),
          eq(plans.isActive, true)
        ))
        .groupBy(plans.id, plans.name, plans.price)
        .orderBy(desc(sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`));

      // Total plans count
      const totalPlansCount = await db
        .select({ 
          mainSitePlans: sql<number>`count(case when ${plans.isMainSitePlan} = true then 1 end)`,
          whiteLabelPlans: sql<number>`count(case when ${plans.isMainSitePlan} = false then 1 end)`
        })
        .from(plans)
        .where(eq(plans.isActive, true));

      return {
        mainSitePlans: mainSitePlans.map(plan => ({
          id: plan.planId,
          name: plan.planName,
          price: parseFloat(plan.price || '0'),
          totalSales: Number(plan.totalSales || 0),
          totalRevenue: parseFloat(plan.totalRevenue?.toString() || '0')
        })),
        totalCounts: {
          mainSitePlans: Number(totalPlansCount[0]?.mainSitePlans || 0),
          whiteLabelPlans: Number(totalPlansCount[0]?.whiteLabelPlans || 0)
        }
      };
    } catch (error) {
      console.error('Error fetching plan performance:', error);
      return { mainSitePlans: [], totalCounts: { mainSitePlans: 0, whiteLabelPlans: 0 } };
    }
  }

  async getPurchaseTrends(startDate?: string, endDate?: string): Promise<any> {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      // Daily purchase trends
      const dailyTrends = await db
        .select({
          date: sql<string>`date(${purchaseHistory.createdAt})`,
          totalPurchases: sql<number>`count(${purchaseHistory.id})`,
          totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`,
          mainSitePurchases: sql<number>`count(case when ${plans.isMainSitePlan} = true then 1 end)`,
          whiteLabelPurchases: sql<number>`count(case when ${plans.isMainSitePlan} = false then 1 end)`
        })
        .from(purchaseHistory)
        .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
        .where(and(
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ))
        .groupBy(sql`date(${purchaseHistory.createdAt})`)
        .orderBy(sql`date(${purchaseHistory.createdAt})`);

      // Recent purchases
      const recentPurchases = await db
        .select({
          id: purchaseHistory.id,
          amount: purchaseHistory.amount,
          createdAt: purchaseHistory.createdAt,
          planName: plans.name,
          userEmail: users.email,
          isMainSitePlan: plans.isMainSitePlan
        })
        .from(purchaseHistory)
        .innerJoin(plans, eq(purchaseHistory.planId, plans.id))
        .leftJoin(users, eq(purchaseHistory.userId, users.id))
        .where(and(
          eq(purchaseHistory.status, 'completed'),
          dateFilter
        ))
        .orderBy(desc(purchaseHistory.createdAt))
        .limit(20);

      return {
        dailyTrends: dailyTrends.map(trend => ({
          date: trend.date,
          totalPurchases: Number(trend.totalPurchases || 0),
          totalRevenue: parseFloat(trend.totalRevenue?.toString() || '0'),
          mainSitePurchases: Number(trend.mainSitePurchases || 0),
          whiteLabelPurchases: Number(trend.whiteLabelPurchases || 0)
        })),
        recentPurchases: recentPurchases.map(purchase => ({
          id: purchase.id,
          amount: parseFloat(purchase.amount || '0'),
          createdAt: purchase.createdAt,
          planName: purchase.planName,
          userEmail: purchase.userEmail,
          isMainSitePlan: purchase.isMainSitePlan
        }))
      };
    } catch (error) {
      console.error('Error fetching purchase trends:', error);
      return { dailyTrends: [], recentPurchases: [] };
    }
  }

  async getComparisonData(startDate: string, endDate: string, compareStartDate: string, compareEndDate: string, metrics: string[]): Promise<any> {
    try {
      const currentPeriodFilter = this.buildDateFilter(startDate, endDate);
      const comparePeriodFilter = this.buildDateFilter(compareStartDate, compareEndDate);
      
      const comparisonData: any = {};

      if (metrics.includes('revenue')) {
        // Current period revenue
        const currentRevenue = await db
          .select({ 
            totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`
          })
          .from(purchaseHistory)
          .where(and(
            eq(purchaseHistory.status, 'completed'),
            currentPeriodFilter
          ));

        // Compare period revenue
        const compareRevenue = await db
          .select({ 
            totalRevenue: sql<number>`coalesce(sum(cast(${purchaseHistory.amount} as decimal)), 0)`
          })
          .from(purchaseHistory)
          .where(and(
            eq(purchaseHistory.status, 'completed'),
            comparePeriodFilter
          ));

        comparisonData.revenue = {
          current: parseFloat(currentRevenue[0]?.totalRevenue?.toString() || '0'),
          previous: parseFloat(compareRevenue[0]?.totalRevenue?.toString() || '0')
        };
      }

      if (metrics.includes('sales')) {
        // Current period sales
        const currentSales = await db
          .select({ 
            totalSales: sql<number>`count(${purchaseHistory.id})`
          })
          .from(purchaseHistory)
          .where(and(
            eq(purchaseHistory.status, 'completed'),
            currentPeriodFilter
          ));

        // Compare period sales
        const compareSales = await db
          .select({ 
            totalSales: sql<number>`count(${purchaseHistory.id})`
          })
          .from(purchaseHistory)
          .where(and(
            eq(purchaseHistory.status, 'completed'),
            comparePeriodFilter
          ));

        comparisonData.sales = {
          current: Number(currentSales[0]?.totalSales || 0),
          previous: Number(compareSales[0]?.totalSales || 0)
        };
      }

      if (metrics.includes('whiteLabels')) {
        // Current period new white labels
        const currentWhiteLabels = await db
          .select({ count: sql<number>`count(*)` })
          .from(whiteLabels)
          .where(currentPeriodWlFilter || sql`true`);

        // Compare period new white labels
        const compareWhiteLabels = await db
          .select({ count: sql<number>`count(*)` })
          .from(whiteLabels)
          .where(comparePeriodWlFilter || sql`true`);

        comparisonData.whiteLabels = {
          current: Number(currentWhiteLabels[0]?.count || 0),
          previous: Number(compareWhiteLabels[0]?.count || 0)
        };
      }

      return comparisonData;
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      return {};
    }
  }

  private buildDateFilter(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) return undefined;
    
    const conditions: any[] = [];
    if (startDate) {
      conditions.push(gte(purchaseHistory.createdAt, new Date(startDate).toISOString()));
    }
    if (endDate) {
      conditions.push(lte(purchaseHistory.createdAt, new Date(endDate).toISOString()));
    }
    
    return conditions.length > 1 ? and(...conditions) : conditions[0];
  }
}

export const storage = new DatabaseStorage();
