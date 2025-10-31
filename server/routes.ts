import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./ai";
import { generateDefaultBuilderElements } from "./defaultLandingPage";
import { db, connection } from "./db";
import { purchaseHistory, users, whiteLabels, referralTracking, referralCommissions, subscriptions, plans, insertUserPreferencesSchema, announcements, products, categories } from "@shared/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { setupAuth, isAuthenticated } from "./auth";
import { registerAuthRoutes } from "./authRoutes";
import { registerWhiteLabelCustomizationRoutes } from "./whiteLabelCustomizations";
import { ObjectStorageService } from "./objectStorage";
import { sendWelcomeEmail, sendWhiteLabelInvitation } from "./emailService";
import { z } from "zod";
import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { generateId } from "lucia";

// FIXED: Helper function to extract domain from request for affiliate dashboard
function extractDomainFromRequest(req: any): string {
  const urlPath = req.originalUrl || req.url;
  const referer = req.headers.referer || '';
  
  console.log(`Domain extraction - URL: ${urlPath}, Referer: ${referer}`);
  
  let domainPath = null;
  
  // PRIORITY 1: Extract from URL parameter if present
  if (req.query?.domain) {
    domainPath = req.query.domain;
    console.log(`Domain from query parameter: ${domainPath}`);
  }
  
  // PRIORITY 2: For API calls, extract domain from referer
  if (!domainPath && urlPath.startsWith('/api/')) {
    // Match patterns like: /four1234/affiliate, /shoot/user, etc.
    const refererMatch = referer.match(/\/([^\/]+)\/(affiliate|user)(?:\/|$|#|\?)/);
    if (refererMatch) {
      domainPath = refererMatch[1];
      console.log(`Domain from referer affiliate/user pattern: ${domainPath}`);
    }
    
    // Fallback: Extract first path segment from referer
    if (!domainPath) {
      const broadMatch = referer.match(/https?:\/\/[^\/]+\/([^\/\?\#]+)/);
      if (broadMatch && broadMatch[1] !== 'api' && broadMatch[1] !== '' && !broadMatch[1].includes('.')) {
        domainPath = broadMatch[1];
        console.log(`Domain from referer broad pattern: ${domainPath}`);
      }
    }
  }
  
  // PRIORITY 3: For regular pages, extract from URL path
  if (!domainPath && !urlPath.startsWith('/api/')) {
    const urlMatch = urlPath.match(/^\/([^\/]+)\//);
    if (urlMatch) {
      domainPath = urlMatch[1];
      console.log(`Domain from URL path: ${domainPath}`);
    }
  }
  
  console.log(`Final extracted domain: "${domainPath}"`);
  return domainPath || '';
}

function setupStaticFileServing(app: Express) {
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  console.log('Static file serving setup for /uploads');
  
  // Serve static files from client/public directory (favicon.ico, etc.)
  app.use(express.static(path.join(process.cwd(), 'client', 'public')));
  console.log('Static file serving setup for client/public');
}

// Meta image extraction endpoint
async function extractMetaImage(url: string): Promise<string | null> {
  try {
    console.log('Extracting meta image for URL:', url);
    
    // Use microlink.io API with correct parameters for meta extraction
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=false&video=false&audio=false`;
    console.log('Calling microlink API:', apiUrl);
    
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      console.log('Microlink response data:', JSON.stringify(data, null, 2));
      
      // Try different possible image fields
      let imageUrl = null;
      if (data.data?.image?.url) {
        imageUrl = data.data.image.url;
      } else if (data.data?.logo?.url) {
        imageUrl = data.data.logo.url;
      } else if (data.data?.screenshot?.url) {
        imageUrl = data.data.screenshot.url;
      }
      
      if (imageUrl) {
        console.log('Found meta image:', imageUrl);
        return imageUrl;
      }
      
      // If no image found, log available data
      console.log('No image found in meta data. Available fields:', Object.keys(data.data || {}));
      console.log('Full data structure:', data.data);
    } else {
      console.error('Microlink API error:', response.status, response.statusText);
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting meta image:', error);
    return null;
  }
}

// Domain-specific authentication middleware
function isDomainAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    const user = req.user;
    
    // Special handling for end-users: they need domain-specific authentication
    if (user?.role === 'end_user' && user?.requiresDomainAuth) {
      // End-users with domain auth requirements cannot access main app routes
      return res.status(401).json({ error: "Domain-specific authentication required" });
    }
    
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}

// Enhanced authentication middleware that handles both regular and domain-specific authentication
async function isAuthenticatedWithDomainSupport(req: any, res: any, next: any) {
  // Extract domain from URL path or referer - prioritize referer for API calls
  const urlPath = req.originalUrl || req.url;
  const referer = req.headers.referer || '';
  
  // For API calls, prioritize referer header over URL path
  let domainPath = null;
  if (urlPath.startsWith('/api/')) {
    // For API calls, extract domain from referer
    const refererMatch = referer.match(/\/([^\/]+)\/affiliate/) || referer.match(/\/([^\/]+)\/user/) || referer.match(/\/([^\/]+)$/);
    domainPath = refererMatch ? refererMatch[1] : null;
    
    // Also check for domain-specific API calls (e.g., /api/affiliate/plans/shoot)
    const apiDomainMatch = urlPath.match(/\/api\/affiliate\/plans\/([^\/]+)/) || urlPath.match(/\/api\/.*\/([^\/]+)$/);
    if (!domainPath && apiDomainMatch) {
      domainPath = apiDomainMatch[1];
    }
  } else {
    // For regular pages, extract from URL path
    const urlMatch = urlPath.match(/^\/([^\/]+)\//);
    domainPath = urlMatch ? urlMatch[1] : null;
  }
  
  console.log('Domain auth check - URL path:', urlPath, 'Referer:', referer, 'Domain:', domainPath);
  
  // Check regular authentication first
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log('Regular session found - User role:', user?.role);
    
    // For white-label clients, allow access regardless of domain
    if (user?.role === 'white_label_client') {
      console.log('White-label client access granted');
      return next();
    }
    
    // For end-users accessing domain-specific routes, validate domain access
    if (user?.role === 'end_user' && domainPath) {
      try {
        // CRITICAL FIX: Check if user owns this domain (accessing their own domain management)
        const userWhiteLabels = await storage.getWhiteLabelsByUserId(user.id);
        const ownsThisDomain = userWhiteLabels.some(wl => wl.domainPath === domainPath);
        
        let whiteLabelId = null;
        
        if (ownsThisDomain) {
          // User is accessing their OWN domain - check their domain session for their own domain
          const domainSession = await storage.getDomainUserSession(user.id, domainPath);
          console.log('Own domain session check:', domainSession);
          
          if (!domainSession || !domainSession.isActive) {
            console.log('Own domain session not found or inactive');
            return res.status(401).json({ error: 'Not authenticated for your own domain' });
          }
          
          whiteLabelId = domainSession.whiteLabelId;
        } else {
          // User is visiting SOMEONE ELSE'S domain as affiliate - just need basic authentication
          // No domain session required for affiliate visits to other domains
          console.log(`End-user ${user.id} visiting external domain ${domainPath} as affiliate - allowed with basic auth`);
          
          // Get white-label ID for the domain they're visiting
          const visitedWhiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
          whiteLabelId = visitedWhiteLabel ? visitedWhiteLabel.id : null;
        }
        
        // Add domain context to request
        req.domainContext = {
          domainPath,
          whiteLabelId: whiteLabelId
        };
        console.log('Domain authentication successful');
        return next();
      } catch (error) {
        console.error('Error checking domain authentication:', error);
        return res.status(401).json({ error: 'Authentication error' });
      }
    }
    
    // For end-users without domain context, require domain-specific authentication
    if (user?.role === 'end_user' && user?.requiresDomainAuth) {
      console.log('Domain authentication required but not provided');
      return res.status(401).json({ error: "Domain-specific authentication required" });
    }
    
    console.log('Regular authentication successful');
    return next();
  }
  
  // If no regular authentication but we have a domain, check for domain-only authentication
  if (domainPath) {
    try {
      const sessionId = req.sessionID || (req.session && req.session.id);
      console.log('Checking domain-only authentication for session:', sessionId, 'domain:', domainPath);
      
      if (sessionId) {
        // Look for an active domain session
        const domainSessions = await storage.getDomainUserSessionsBySessionId(sessionId, domainPath);
        
        if (domainSessions && domainSessions.length > 0) {
          const domainSession = domainSessions[0];
          console.log('Found domain session:', domainSession);
          
          // Get the user data from the domain session
          const user = await storage.getUserById(domainSession.userId);
          
          if (user) {
            console.log('Domain-only authentication successful for user:', user.id, 'role:', user.role);
            
            // Set user in request for downstream middleware
            req.user = user;
            req.domainContext = {
              domainPath,
              whiteLabelId: domainSession.whiteLabelId
            };
            
            return next();
          }
        }
      }
    } catch (error) {
      console.error('Error checking domain-only authentication:', error);
    }
  }
  
  console.log('User not authenticated');
  res.status(401).json({ error: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup static file serving for uploads
  setupStaticFileServing(app);
  
  // Setup authentication system first
  await setupAuth(app);
  
  // Register authentication routes
  registerAuthRoutes(app);
  
  // Register white label customization routes
  registerWhiteLabelCustomizationRoutes(app);
  
  const server = createServer(app);
  
  // Test page for domain registration
  app.get('/test-shoot-registration', (req, res) => {
    res.sendFile(process.cwd() + '/test_shoot_registration.html');
  });
  
  // This route is now handled by our custom auth system in authRoutes.ts

  // User access permissions endpoint
  app.get('/api/user/access', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const dbUser = await storage.getUserById(userId);
      if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Super admins have access to everything
      if (dbUser.role === 'super_admin') {
        return res.json({
          hasCategories: true,
          hasAffiliates: true,
          hasLandingPageBuilder: true,
          planName: 'Super Admin'
        });
      }

      // For white-label clients, check their purchased plans for access
      if (dbUser.role === 'white_label_client') {
        // Get user's purchased plans and check their accesses
        console.log(`[DEBUG] Calling getUserPurchasedPlans with userId: ${userId}, dbUser.id: ${dbUser.id}, dbUser.email: ${dbUser.email}`);
        const purchasedPlans = await storage.getUserPurchasedPlans(userId);
        console.log(`[DEBUG] User ${userId} purchased plans:`, purchasedPlans);
        
        // Collect all accesses from purchased plans
        const allAccesses = new Set<string>();
        
        // Get plan details for all purchased plans
        for (const plan of purchasedPlans) {
          if (plan.id) {
            try {
              const planDetails = await storage.getPlanById(plan.id);
              console.log(`[DEBUG] Plan ${plan.id} details:`, planDetails);
              
              // Parse the accesses field if it's a string (JSON)
              let accesses = planDetails?.accesses;
              if (typeof accesses === 'string') {
                try {
                  accesses = JSON.parse(accesses);
                } catch (parseError) {
                  console.error(`Error parsing accesses JSON for plan ${plan.id}:`, parseError);
                  accesses = [];
                }
              }
              
              if (accesses && Array.isArray(accesses)) {
                console.log(`[DEBUG] Plan ${plan.id} accesses:`, accesses);
                accesses.forEach((access: string) => allAccesses.add(access));
              }
            } catch (error) {
              console.error(`Error fetching plan details for plan ${plan.id}:`, error);
            }
          }
        }

        console.log(`[DEBUG] All collected accesses:`, Array.from(allAccesses));

        // If no purchased plans or empty accesses, deny access
        const hasCategories = allAccesses.has('categories');
        const hasAffiliates = allAccesses.has('affiliates');
        const hasLandingPageBuilder = allAccesses.has('landing_page_builder');
        
        console.log(`[DEBUG] Final access results: categories=${hasCategories}, affiliates=${hasAffiliates}, landingPageBuilder=${hasLandingPageBuilder}`);
        
        return res.json({
          hasCategories,
          hasAffiliates,
          hasLandingPageBuilder,
          planName: purchasedPlans.length > 0 ? purchasedPlans[0].name : 'No Plan'
        });
      }

      // Other roles get basic access
      return res.json({
        hasCategories: false,
        hasAffiliates: false,
        hasLandingPageBuilder: false,
        planName: null
      });
    } catch (error) {
      console.error('Error checking user access:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Domain-specific login route
  app.get('/api/login', (req, res) => {
    const { domain } = req.query;
    
    // Store domain context in session before authentication
    if (domain) {
      req.session.endUserDomainPath = domain as string;
      console.log('Storing domain context for login:', domain);
      
      // Find the white-label client associated with this domain
      storage.getWhiteLabelByDomainPath(domain as string)
        .then(whiteLabel => {
          if (whiteLabel) {
            req.session.whiteLabelId = whiteLabel.id;
            console.log('Storing white-label ID for login context:', whiteLabel.id);
          }
        })
        .catch(error => {
          console.error('Error finding white-label for domain:', error);
        });
    }
    
    // Store return URL for domain-specific redirect
    const returnUrl = req.headers.referer || `${req.protocol}://${req.get('host')}/`;
    req.session.returnUrl = returnUrl;
    console.log('Storing return URL in session:', returnUrl);
    
    // Redirect to authentication
    res.redirect('/api/auth/login');
  });

  // Domain-specific logout route
  app.post('/api/logout', async (req, res) => {
    const { domain } = req.body;
    
    if (req.isAuthenticated()) {
      const user = req.user;
      
      // If logging out from specific domain and user is an end-user
      if (domain && user.role === 'end_user') {
        try {
          // Remove domain-specific session
          await storage.removeDomainUserSession(user.id, domain);
          console.log(`Removed domain session for user ${user.id} on domain: ${domain}`);
          
          // Don't destroy the main session, just the domain session
          return res.json({ success: true, message: `Logged out from ${domain}` });
        } catch (error) {
          console.error('Error removing domain session:', error);
          return res.status(500).json({ error: 'Domain logout failed' });
        }
      }
    }
    
    // Traditional logout - clear entire session
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      
      // Clear session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ error: 'Session cleanup failed' });
        }
        
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
      });
    });
  });



  // Global announcements (public)
  app.get('/api/announcements', async (req, res) => {
    try {
      // Get userId from session if authenticated for proper visibility filtering
      const userId = req.user?.id;
      const publicAnnouncements = await storage.getPublicAnnouncements(20, 0, userId);
      res.json(publicAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Affiliate announcements - only from their white-label client
  app.get('/api/affiliate/announcements', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // FIXED: Use the enhanced domain extraction function
      const domain = extractDomainFromRequest(req);
      console.log('Affiliate announcements - extracted domain:', domain);
      
      if (!domain) {
        return res.status(400).json({ error: 'Domain parameter required' });
      }
      
      console.log('Fetching announcements for domain:', domain);
      
      // FIXED: Get white-label client for this domain using correct method
      const whiteLabel = await storage.getWhiteLabelByDomainPath(domain);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found for domain' });
      }
      
      console.log('Found white-label client:', whiteLabel.userId, 'for domain:', domain);
      
      // FIXED: Get announcements only from this white-label client using correct field
      const announcements = await storage.getAnnouncementsByWhiteLabelId(whiteLabel.id, user.id);
      console.log('Found announcements:', announcements.length);
      
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching affiliate announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // FIXED: Affiliate notifications - using simple auth for affiliate visitors  
  app.get('/api/affiliate/notifications', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // FIXED: Use the enhanced domain extraction function  
      const domain = extractDomainFromRequest(req);
      console.log(`AFFILIATE NOTIFICATIONS - Extracted domain: "${domain}"`);
      console.log(`AFFILIATE NOTIFICATIONS - Request URL: ${req.originalUrl}`);
      console.log(`AFFILIATE NOTIFICATIONS - Referer: ${req.get('referer')}`);
      
      if (!domain) {
        return res.status(400).json({ error: 'Domain parameter required' });
      }
      
      console.log('Fetching notifications for domain:', domain);
      
      // Get white-label client for this domain
      const whiteLabel = await storage.getWhiteLabelByDomain(domain);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found for domain' });
      }
      
      console.log('Found white-label client:', whiteLabel.userId, 'for domain:', domain);
      
      // Get notifications for this affiliate
      const notifications = await storage.getAffiliateNotifications(whiteLabel.userId, domain);
      console.log('Found notifications:', notifications.length);
      
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching affiliate notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // Real affiliate data endpoints with role-based logic
  app.get('/api/top-affiliates', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if we're in impersonation mode - prioritize impersonated user context
      let targetUser = user;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          targetUser = impersonatedUser;
          console.log('TOP-AFFILIATES DEBUG - Using impersonated user for affiliates:', targetUser.id, 'Role:', targetUser.role);
        }
      }

      // Handle Super Admin - show ALL affiliates across platform (only if not impersonating)
      if (targetUser.role === 'super_admin' && !req.session?.isImpersonating) {
        const allAffiliates = await storage.getAllAffiliatesForSuperAdmin();
        const topAffiliates = allAffiliates.slice(0, 3); // Top 3 by revenue
        res.json(topAffiliates);
        return;
      }

      // Handle White Label Client - show only their affiliates
      if (targetUser.role === 'white_label_client') {
        const whiteLabel = await storage.getWhiteLabelByUserId(targetUser.id);
        if (!whiteLabel) {
          return res.status(404).json({ error: 'White-label client not found' });
        }

        const topAffiliates = await storage.getTopAffiliatesByWhiteLabel(whiteLabel.id, 3);
        console.log('TOP-AFFILIATES DEBUG - Found affiliates for white-label:', whiteLabel.id, 'Count:', topAffiliates.length);
        res.json(topAffiliates);
        return;
      }

      // Other roles don't have access to affiliate data
      res.status(403).json({ error: 'Access denied. Super Admin or White Label Client role required.' });
    } catch (error) {
      console.error('Error fetching top affiliates:', error);
      res.status(500).json({ error: 'Failed to fetch top affiliates' });
    }
  });

  app.get('/api/affiliate-details/:affiliateId', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { affiliateId } = req.params;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get affiliate details with lifetime metrics
      const affiliateDetails = await storage.getAffiliateDetails(affiliateId);
      
      if (!affiliateDetails) {
        return res.status(404).json({ error: 'Affiliate not found' });
      }

      res.json(affiliateDetails);
    } catch (error) {
      console.error('Error fetching affiliate details:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate details' });
    }
  });

  // Commission data endpoint with role-based logic
  app.get('/api/commissions', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Handle Super Admin - show ALL commission data across platform
      if (user.role === 'super_admin') {
        const globalCommissionData = await storage.getGlobalCommissionData();
        res.json(globalCommissionData);
        return;
      }

      // Handle White Label Client - show only their commission data
      if (user.role === 'white_label_client') {
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        if (!whiteLabel) {
          return res.status(404).json({ error: 'White-label client not found' });
        }

        const commissionData = await storage.getCommissionDataByWhiteLabel(whiteLabel.id);
        res.json(commissionData);
        return;
      }

      // Other roles don't have access to commission data
      res.status(403).json({ error: 'Access denied. Super Admin or White Label Client role required.' });
    } catch (error) {
      console.error('Error fetching commission data:', error);
      res.status(500).json({ error: 'Failed to fetch commission data' });
    }
  });

  // Individual affiliate details endpoint
  app.get('/api/affiliate-details/:id', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const affiliateId = req.params.id;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Only Super Admin can access individual affiliate details
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Access denied. Super Admin role required.' });
      }

      // Get the affiliate user details
      const affiliate = await storage.getUserById(affiliateId);
      if (!affiliate) {
        return res.status(404).json({ error: 'Affiliate not found' });
      }

      // Get referral data for this affiliate
      const referrals = await storage.getReferralsByAffiliate(affiliateId);
      const commissionData = await storage.getReferralCommissionsByAffiliate(affiliateId);
      const totalCommissions = await storage.getTotalReferralCommissions(affiliateId);

      // Build detailed response
      const affiliateDetails = {
        id: affiliate.id,
        name: affiliate.name || `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Unnamed Affiliate',
        email: affiliate.email,
        role: affiliate.role,
        joinDate: affiliate.createdAt,
        totalSales: commissionData.length,
        totalRevenue: commissionData.reduce((sum, commission) => sum + parseFloat(commission.planAmount || '0'), 0),
        referralCount: referrals.length,
        commissionEarnings: parseFloat(totalCommissions.totalCommissions || '0'),
        recentActivity: commissionData.slice(0, 10), // Last 10 transactions
      };

      res.json(affiliateDetails);
    } catch (error) {
      console.error('Error fetching affiliate details:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate details' });
    }
  });

  // Legacy affiliates endpoint with role-based logic (returns ALL affiliates, not just top 3)
  app.get('/api/affiliates', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      console.log(`🔍 /api/affiliates - User role: ${user.role}, User ID: ${user.id}`);

      // Handle Super Admin - show ALL affiliates across platform
      if (user.role === 'super_admin') {
        console.log('📊 Fetching ALL affiliates for Super Admin');
        const allAffiliates = await storage.getAllAffiliatesForSuperAdmin();
        console.log(`✅ Found ${allAffiliates.length} affiliates for Super Admin`);
        res.json(allAffiliates);
        return;
      }

      // Handle White Label Client - show only their affiliates
      if (user.role === 'white_label_client') {
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        if (!whiteLabel) {
          console.log(`❌ White-label record not found for user ${user.id}`);
          return res.status(404).json({ error: 'White-label client not found' });
        }

        console.log(`🏢 White Label Client - whiteLabelId: ${whiteLabel.id}, Business: ${whiteLabel.businessName}`);
        
        // Get ALL affiliates (not just top 3)
        const allAffiliates = await storage.getTopAffiliatesByWhiteLabel(whiteLabel.id, 1000);
        console.log(`✅ Found ${allAffiliates.length} affiliates for white label ${whiteLabel.id}`);
        console.log(`📋 Affiliate IDs: ${allAffiliates.map(a => a.id).join(', ')}`);
        res.json(allAffiliates);
        return;
      }

      // Other roles don't have access to affiliate data
      console.log(`⛔ Access denied for role: ${user.role}`);
      res.status(403).json({ error: 'Access denied. Super Admin or White Label Client role required.' });
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      res.status(500).json({ error: 'Failed to fetch affiliates' });
    }
  });

  // Super Admin specific endpoints for platform overview
  app.get('/api/super-admin/white-labels', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Get all white-label clients with their activity
      const whiteLabelClients = await storage.getAllWhiteLabelClients();
      
      res.json(whiteLabelClients);
    } catch (error) {
      console.error('Error fetching white-label clients:', error);
      res.status(500).json({ error: 'Failed to fetch white-label clients' });
    }
  });

  app.get('/api/super-admin/main-site-plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Get only main site plans (created by Super Admin)
      const mainSitePlans = await storage.getMainSitePlans();
      
      res.json(mainSitePlans);
    } catch (error) {
      console.error('Error fetching main site plans:', error);
      res.status(500).json({ error: 'Failed to fetch main site plans' });
    }
  });

  app.get('/api/super-admin/plan-analytics', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Get analytics for main site plans only
      const planAnalytics = await storage.getMainSitePlanAnalytics();
      
      res.json(planAnalytics);
    } catch (error) {
      console.error('Error fetching plan analytics:', error);
      res.status(500).json({ error: 'Failed to fetch plan analytics' });
    }
  });

  app.get('/api/super-admin/purchase-history', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Get purchase history for main site plans only
      const purchaseHistory = await storage.getMainSitePurchaseHistory();
      
      res.json(purchaseHistory);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      res.status(500).json({ error: 'Failed to fetch purchase history' });
    }
  });

  app.get('/api/super-admin/plan-purchasers/:planId', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      const { planId } = req.params;
      const purchasers = await storage.getPlanPurchasers(parseInt(planId));
      
      res.json(purchasers);
    } catch (error) {
      console.error('Error fetching plan purchasers:', error);
      res.status(500).json({ error: 'Failed to fetch plan purchasers' });
    }
  });

  app.get('/api/super-admin/white-label-tracking', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Get tracking data for all white-label clients
      const trackingData = await storage.getWhiteLabelTrackingData();
      
      res.json(trackingData);
    } catch (error) {
      console.error('Error fetching white-label tracking data:', error);
      res.status(500).json({ error: 'Failed to fetch white-label tracking data' });
    }
  });

  // Send single white-label invitation
  app.post('/api/admin/send-invitation', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Strict super admin role validation
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Input validation with zod
      const invitationSchema = z.object({
        email: z.string().email('Valid email is required'),
        firstName: z.string().min(1, 'First name is required').max(50),
        lastName: z.string().min(1, 'Last name is required').max(50),
        businessName: z.string().min(1, 'Business name is required').max(100)
      });

      const validatedData = invitationSchema.parse(req.body);
      
      // Get super admin user details for invitation
      const superAdminUser = await storage.getUserById(user.id);
      if (!superAdminUser) {
        return res.status(500).json({ error: 'Super admin user not found' });
      }

      const inviterName = `${superAdminUser.firstName || 'Super'} ${superAdminUser.lastName || 'Admin'}`;

      // Send invitation email
      const emailSent = await sendWhiteLabelInvitation(
        validatedData.email,
        validatedData.firstName,
        validatedData.lastName,
        validatedData.businessName,
        inviterName
      );

      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send invitation email' });
      }

      res.json({ 
        success: true, 
        message: 'Invitation sent successfully',
        recipient: validatedData.email
      });

    } catch (error) {
      console.error('Send invitation error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      
      res.status(500).json({ error: 'Failed to send invitation' });
    }
  });

  // Send bulk white-label invitations
  app.post('/api/admin/send-bulk-invitations', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Strict super admin role validation
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Input validation for bulk invitations
      const bulkInvitationSchema = z.object({
        invitations: z.array(z.object({
          email: z.string().email('Valid email is required'),
          firstName: z.string().min(1, 'First name is required').max(50),
          lastName: z.string().min(1, 'Last name is required').max(50),
          businessName: z.string().min(1, 'Business name is required').max(100)
        })).min(1, 'At least one invitation is required').max(100, 'Maximum 100 invitations per batch')
      });

      const validatedData = bulkInvitationSchema.parse(req.body);
      
      // Get super admin user details for invitation
      const superAdminUser = await storage.getUserById(user.id);
      if (!superAdminUser) {
        return res.status(500).json({ error: 'Super admin user not found' });
      }

      const inviterName = `${superAdminUser.firstName || 'Super'} ${superAdminUser.lastName || 'Admin'}`;

      // Process invitations with individual error tracking
      let successCount = 0;
      let failureCount = 0;
      const results = [];

      for (const invitation of validatedData.invitations) {
        try {
          const emailSent = await sendWhiteLabelInvitation(
            invitation.email,
            invitation.firstName,
            invitation.lastName,
            invitation.businessName,
            inviterName
          );

          if (emailSent) {
            successCount++;
            results.push({
              email: invitation.email,
              status: 'success',
              message: 'Invitation sent successfully'
            });
          } else {
            failureCount++;
            results.push({
              email: invitation.email,
              status: 'failed',
              message: 'Failed to send email'
            });
          }
        } catch (inviteError) {
          failureCount++;
          results.push({
            email: invitation.email,
            status: 'failed',
            message: 'Error processing invitation'
          });
          console.error(`Error sending invitation to ${invitation.email}:`, inviteError);
        }
      }

      res.json({
        success: true,
        summary: {
          total: validatedData.invitations.length,
          successful: successCount,
          failed: failureCount
        },
        results: results
      });

    } catch (error) {
      console.error('Send bulk invitations error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      
      res.status(500).json({ error: 'Failed to send bulk invitations' });
    }
  });

  // Create announcement with file upload support (authenticated)
  app.post('/api/announcements', isAuthenticated, async (req, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      const fs = await import('fs');
      
      // Ensure uploads directory exists
      const uploadsDir = './uploads/';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Configure multer for announcement file uploads
      const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          // Generate unique filename with better sanitization
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
          cb(null, `announcement_${uniqueSuffix}_${name}${ext}`);
        }
      });
      
      const upload = multer.default({ 
        storage: multerStorage,
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
          files: 1 // Only one file at a time
        },
        fileFilter: (req, file, cb) => {
          // Allow images, documents, and common file types
          const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|mp4|mov|avi/;
          const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
          const mimetype = allowedTypes.test(file.mimetype);
          
          if (mimetype && extname) {
            return cb(null, true);
          } else {
            cb(new Error('Invalid file type. Allowed types: images, PDF, documents, videos, and ZIP files.'));
          }
        }
      }).single('attachment');
      
      upload(req, res, async (err) => {
        try {
          if (err) {
            console.error('File upload error:', err);
            let errorMessage = 'File upload failed';
            
            if (err.code === 'LIMIT_FILE_SIZE') {
              errorMessage = 'File too large. Maximum size is 10MB.';
            } else if (err.message.includes('Invalid file type')) {
              errorMessage = err.message;
            }
            
            return res.status(400).json({ error: errorMessage });
          }
          
          // Validate required fields
          const { title, content, visibility, status, scheduledAt, targetingType, targetedPlanIds } = req.body;
          
          if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title is required' });
          }
          
          // Content is optional - allow empty content
          // if (!content || content.trim().length === 0) {
          //   return res.status(400).json({ error: 'Content is required' });
          // }
          
          const user = req.user;
          
          if (!user || (user.role !== 'super_admin' && user.role !== 'super_admin_affiliate' && user.role !== 'white_label_client')) {
            return res.status(403).json({ error: 'Unauthorized. Only admins and white-label clients can create announcements.' });
          }

          // Get white-label ID for white-label clients when creating announcements
          let whiteLabelId = null;
          if (user.role === 'white_label_client') {
            try {
              const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
              if (whiteLabel) {
                whiteLabelId = whiteLabel.id;
                console.log(`Setting whiteLabelId ${whiteLabelId} for announcement from white-label client ${user.id}`);
              } else {
                return res.status(400).json({ error: 'White-label account not found for user' });
              }
            } catch (error) {
              console.error('Error fetching white-label data:', error);
              return res.status(500).json({ error: 'Failed to fetch white-label information' });
            }
          } else if (user.role === 'super_admin' || user.role === 'super_admin_affiliate') {
            // For super admin announcements, allow null white label ID (global announcements)
            whiteLabelId = null;
            console.log(`Allowing null whiteLabelId for super admin announcement from user ${user.id}`);
          }

          // Process attachment if uploaded
          let attachments = [];
          if (req.file) {
            const fileUrl = `/uploads/${req.file.filename}`;
            const fileType = req.file.mimetype;
            
            attachments = [{
              url: fileUrl,
              type: fileType,
              name: req.file.originalname,
              size: req.file.size
            }];
            
            console.log(`Attachment uploaded: ${req.file.originalname} -> ${fileUrl} (${fileType}, ${req.file.size} bytes)`);
          }

          // Validate status
          const validStatuses = ['draft', 'published', 'scheduled'];
          const finalStatus = status && validStatuses.includes(status) ? status : 'published';
          
          // Validate scheduled date if status is scheduled
          let scheduledDate = null;
          if (finalStatus === 'scheduled') {
            if (!scheduledAt) {
              return res.status(400).json({ error: 'Scheduled date is required for scheduled announcements' });
            }
            
            scheduledDate = new Date(scheduledAt);
            if (isNaN(scheduledDate.getTime())) {
              return res.status(400).json({ error: 'Invalid scheduled date format' });
            }
            
            if (scheduledDate <= new Date()) {
              return res.status(400).json({ error: 'Scheduled date must be in the future' });
            }
          }
          
          console.log('Creating announcement with data:', {
            title: title.substring(0, 50) + '...',
            status: finalStatus,
            scheduledAt: scheduledDate,
            whiteLabelId,
            userId: user.id
          });
          
          // Parse targetedPlanIds if it's a string (from FormData)
          let parsedTargetedPlanIds = [];
          if (targetedPlanIds && targetedPlanIds !== 'undefined' && targetedPlanIds !== 'null') {
            try {
              parsedTargetedPlanIds = typeof targetedPlanIds === 'string' ? JSON.parse(targetedPlanIds) : targetedPlanIds;
              
              // Validate that it's an array
              if (!Array.isArray(parsedTargetedPlanIds)) {
                parsedTargetedPlanIds = [];
              }
            } catch (e) {
              console.error('Error parsing targetedPlanIds:', e);
              parsedTargetedPlanIds = [];
            }
          }
          
          // Validate visibility
          const validVisibilities = ['public', 'private', 'targeted'];
          const finalVisibility = visibility && validVisibilities.includes(visibility) ? visibility : 'public';
          
          // Create announcement data
          const announcementData: any = {
            title: title.trim(),
            content: content.trim(),
            visibility: finalVisibility,
            status: finalStatus,
            scheduledAt: scheduledDate,
            publishedAt: finalStatus === 'published' ? new Date() : null,
            userId: user.id,
            whiteLabelId: whiteLabelId,
            attachments: attachments
          };
          
          // Only add targeting fields if they're provided
          if (targetingType) {
            // Map frontend values to database values
            if (targetingType === 'everyone') {
              announcementData.targetingType = 'everyone';
              announcementData.targetedPlanIds = []; // Clear plan IDs for everyone targeting
            } else if (targetingType === 'by_plan') {
              announcementData.targetingType = 'by_plan';
              announcementData.targetedPlanIds = parsedTargetedPlanIds;
            }
          } else {
            // Default to everyone if not specified
            announcementData.targetingType = 'everyone';
            announcementData.targetedPlanIds = [];
          }
          
          // Use database retry logic
          const { executeWithRetry } = await import('./db');
          const announcement = await executeWithRetry(async () => {
            return await storage.createAnnouncement(announcementData);
          });

          console.log(`Announcement created successfully with ID: ${announcement?.id || 'unknown'}, attachments: ${attachments.length}`);
          
          if (!announcement || !announcement.id) {
            throw new Error('Failed to create announcement: Invalid announcement object returned');
          }
          
          res.json({
            ...announcement,
            message: 'Announcement created successfully'
          });
          
        } catch (innerError) {
          console.error('Error in announcement creation inner try-catch:', innerError);
          
          // Clean up uploaded file if announcement creation failed
          if (req.file && req.file.path) {
            try {
              const fs = await import('fs');
              fs.unlinkSync(req.file.path);
              console.log('Cleaned up uploaded file after error');
            } catch (cleanupError) {
              console.error('Error cleaning up file:', cleanupError);
            }
          }
          
          if (innerError instanceof Error) {
            if (innerError.message.includes('Duplicate entry')) {
              return res.status(409).json({ error: 'An announcement with this title already exists' });
            }
            if (innerError.message.includes('cannot be null')) {
              return res.status(400).json({ error: 'Missing required fields' });
            }
          }
          
          res.status(500).json({ error: 'Failed to create announcement. Please try again.' });
        }
      });
    } catch (error) {
      console.error('Error creating announcement (outer catch):', error);
      res.status(500).json({ error: 'Failed to create announcement. Please check your request and try again.' });
    }
  });

  // Update announcement
  app.put('/api/announcements/:id', isAuthenticated, async (req, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      const fs = await import('fs');
      
      // Ensure uploads directory exists
      const uploadsDir = './uploads/';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Configure multer for announcement file uploads
      const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          // Generate unique filename with better sanitization
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
          cb(null, `announcement_${uniqueSuffix}_${name}${ext}`);
        }
      });
      
      const upload = multer.default({ 
        storage: multerStorage,
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
          files: 1 // Only one file at a time
        },
        fileFilter: (req, file, cb) => {
          // Allow images, documents, and common file types
          const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|mp4|mov|avi/;
          const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
          const mimetype = allowedTypes.test(file.mimetype);
          
          if (mimetype && extname) {
            return cb(null, true);
          } else {
            cb(new Error('Invalid file type. Allowed types: images, PDF, documents, videos, and ZIP files.'));
          }
        }
      }).single('attachment');
      
      upload(req, res, async (err) => {
        try {
          if (err) {
            console.error('File upload error:', err);
            let errorMessage = 'File upload failed';
            
            if (err.code === 'LIMIT_FILE_SIZE') {
              errorMessage = 'File too large. Maximum size is 10MB.';
            } else if (err.message.includes('Invalid file type')) {
              errorMessage = err.message;
            }
            
            return res.status(400).json({ error: errorMessage });
          }
          
          const announcementId = parseInt(req.params.id);
          if (isNaN(announcementId) || announcementId <= 0) {
            return res.status(400).json({ error: 'Invalid announcement ID' });
          }
          
          // Validate required fields
          const { title, content, visibility, status, scheduledAt, targetingType, targetedPlanIds } = req.body;
          
          if (title !== undefined && (!title || title.trim().length === 0)) {
            return res.status(400).json({ error: 'Title cannot be empty' });
          }
          
          // Content is optional - allow empty content for updates
          // if (content !== undefined && (!content || content.trim().length === 0)) {
          //   return res.status(400).json({ error: 'Content cannot be empty' });
          // }
          
          const user = req.user;
          
          if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
          }

          // Get existing announcement to check ownership and permissions
          let existingAnnouncement;
          try {
            const { executeWithRetry } = await import('./db');
            existingAnnouncement = await executeWithRetry(async () => {
              return await storage.getAnnouncementById(announcementId, user.id);
            });
          } catch (error) {
            console.error('Error fetching existing announcement:', error);
            return res.status(500).json({ error: 'Failed to fetch announcement data' });
          }
          
          if (!existingAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found or you do not have permission to edit it' });
          }

          // Check if user has permission to edit this announcement
          const canEdit = (
            user.role === 'super_admin' || 
            user.role === 'super_admin_affiliate' ||
            (user.role === 'white_label_client' && existingAnnouncement.userId === user.id)
          );
          
          if (!canEdit) {
            return res.status(403).json({ error: 'You do not have permission to edit this announcement' });
          }

          // Process attachment if uploaded
          let attachments = existingAnnouncement.attachments || [];
          if (req.file) {
            const fileUrl = `/uploads/${req.file.filename}`;
            const fileType = req.file.mimetype;
            
            // Clean up old attachment files if they exist
            if (attachments.length > 0) {
              for (const oldAttachment of attachments) {
                if (oldAttachment.url && oldAttachment.url.startsWith('/uploads/')) {
                  const oldFilePath = `.${oldAttachment.url}`;
                  try {
                    if (fs.existsSync(oldFilePath)) {
                      fs.unlinkSync(oldFilePath);
                      console.log('Cleaned up old attachment:', oldFilePath);
                    }
                  } catch (cleanupError) {
                    console.error('Error cleaning up old attachment:', cleanupError);
                  }
                }
              }
            }
            
            attachments = [{
              url: fileUrl,
              type: fileType,
              name: req.file.originalname,
              size: req.file.size
            }];
            
            console.log(`New attachment uploaded: ${req.file.originalname} -> ${fileUrl} (${fileType}, ${req.file.size} bytes)`);
          }

          // Validate status
          const validStatuses = ['draft', 'published', 'scheduled'];
          const finalStatus = status && validStatuses.includes(status) ? status : existingAnnouncement.status;
          
          // Validate scheduled date if status is scheduled
          let scheduledDate = existingAnnouncement.scheduledAt;
          if (finalStatus === 'scheduled') {
            if (scheduledAt) {
              scheduledDate = new Date(scheduledAt);
              if (isNaN(scheduledDate.getTime())) {
                return res.status(400).json({ error: 'Invalid scheduled date format' });
              }
              
              if (scheduledDate <= new Date()) {
                return res.status(400).json({ error: 'Scheduled date must be in the future' });
              }
            } else if (!existingAnnouncement.scheduledAt) {
              return res.status(400).json({ error: 'Scheduled date is required for scheduled announcements' });
            }
          }
          
          console.log('Updating announcement with data:', {
            id: announcementId,
            title: title ? title.substring(0, 50) + '...' : 'unchanged',
            status: finalStatus,
            scheduledAt: scheduledDate,
            userId: user.id
          });
          
          // Parse targetedPlanIds if it's a string (from FormData)
          let parsedTargetedPlanIds = existingAnnouncement.targetedPlanIds || [];
          if (targetedPlanIds && targetedPlanIds !== 'undefined' && targetedPlanIds !== 'null') {
            try {
              parsedTargetedPlanIds = typeof targetedPlanIds === 'string' ? JSON.parse(targetedPlanIds) : targetedPlanIds;
              
              // Validate that it's an array
              if (!Array.isArray(parsedTargetedPlanIds)) {
                parsedTargetedPlanIds = existingAnnouncement.targetedPlanIds || [];
              }
            } catch (e) {
              console.error('Error parsing targetedPlanIds:', e);
              parsedTargetedPlanIds = existingAnnouncement.targetedPlanIds || [];
            }
          }
          
          // Validate visibility
          const validVisibilities = ['public', 'private', 'targeted'];
          const finalVisibility = visibility && validVisibilities.includes(visibility) ? visibility : existingAnnouncement.visibility;
          
          // Create update data - only include fields that are being updated
          const updateData: any = {};
          
          if (title !== undefined) updateData.title = title.trim();
          if (content !== undefined) updateData.content = content.trim();
          if (visibility !== undefined) updateData.visibility = finalVisibility;
          if (status !== undefined) updateData.status = finalStatus;
          if (scheduledAt !== undefined || finalStatus === 'scheduled') updateData.scheduledAt = scheduledDate;
          
          // Set publishedAt if changing from draft/scheduled to published
          if (finalStatus === 'published' && existingAnnouncement.status !== 'published') {
            updateData.publishedAt = new Date();
          }
          
          // Always update attachments if a new file was uploaded
          if (req.file) {
            updateData.attachments = attachments;
          }
          
          // Only add targeting fields if they're provided
          if (targetingType && ['all', 'specific_plans'].includes(targetingType)) {
            updateData.targetingType = targetingType;
          }
          if (targetedPlanIds !== undefined) {
            updateData.targetedPlanIds = parsedTargetedPlanIds;
          }
          
          // Use database retry logic
          const { executeWithRetry } = await import('./db');
          const updatedAnnouncement = await executeWithRetry(async () => {
            return await storage.updateAnnouncement(announcementId, user.id, updateData);
          });

          console.log(`Announcement ${announcementId} updated successfully with ${attachments.length} attachments`);
          res.json({
            ...updatedAnnouncement,
            message: 'Announcement updated successfully'
          });
          
        } catch (innerError) {
          console.error('Error in announcement update inner try-catch:', innerError);
          
          // Clean up uploaded file if update failed
          if (req.file && req.file.path) {
            try {
              const fs = await import('fs');
              fs.unlinkSync(req.file.path);
              console.log('Cleaned up uploaded file after error');
            } catch (cleanupError) {
              console.error('Error cleaning up file:', cleanupError);
            }
          }
          
          if (innerError instanceof Error) {
            if (innerError.message.includes('Duplicate entry')) {
              return res.status(409).json({ error: 'An announcement with this title already exists' });
            }
            if (innerError.message.includes('cannot be null')) {
              return res.status(400).json({ error: 'Missing required fields' });
            }
            if (innerError.message.includes('not found')) {
              return res.status(404).json({ error: 'Announcement not found' });
            }
          }
          
          res.status(500).json({ error: 'Failed to update announcement. Please try again.' });
        }
      });
    } catch (error) {
      console.error('Error updating announcement (outer catch):', error);
      res.status(500).json({ error: 'Failed to update announcement. Please check your request and try again.' });
    }
  });

  // Like announcement
  app.post('/api/announcements/:id/like', async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const result = await storage.toggleAnnouncementLike(parseInt(id), user.id);
      res.json(result);
    } catch (error) {
      console.error('Error liking announcement:', error);
      res.status(500).json({ error: 'Failed to like announcement' });
    }
  });

  // Get comments for announcement
  app.get('/api/announcements/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getAnnouncementComments(parseInt(id));
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // Add comment to announcement
  app.post('/api/announcements/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const comment = await storage.createAnnouncementComment({
        announcementId: parseInt(id),
        userId: user.id,
        content: content,
        isActive: true
      });
      res.json(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // Analytics endpoints for announcements
  app.post('/api/announcements/:id/analytics', async (req, res) => {
    try {
      const { id } = req.params;
      const { eventType, eventData } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Save analytics event
      const analyticsEntry = await storage.createAnnouncementAnalytics({
        announcementId: parseInt(id),
        userId,
        eventType,
        eventData: eventData || {}
      });

      res.json(analyticsEntry);
    } catch (error) {
      console.error('Error saving analytics:', error);
      res.status(500).json({ error: 'Failed to save analytics' });
    }
  });

  app.get('/api/announcements/:id/analytics', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const announcementId = parseInt(id);

      // Check if user is the creator of this announcement
      const announcement = await storage.getAnnouncementById(announcementId, user.id);
      if (!announcement || announcement.authorId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to view analytics for this announcement' });
      }

      const analytics = await storage.getAnnouncementAnalytics(announcementId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Plans endpoints
  app.get('/api/plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - use impersonated user's plans
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('PLANS DEBUG - Using impersonated user ID for plans:', targetUserId);
      }
      
      // All users see their own plans (regardless of role or isMainSitePlan status)
      const plans = await storage.getPlansByUser(targetUserId);
      
      // For white label clients accessing from their domain, filter by published status for landing page display
      const domain = req.query.domain as string;
      if (domain && user.role === 'white_label_client') {
        // If accessing from domain context, only show published plans for landing page
        const publishedPlans = plans.filter(plan => plan.status === 'published');
        res.json(publishedPlans);
      } else {
        // Default: show all plans (for subscription management interface)
        res.json(plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });

  // Get plan content with categories and products
  app.get('/api/plans/:id/content', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const planWithContent = await storage.getPlanWithContent(parseInt(id));
      res.json(planWithContent);
    } catch (error) {
      console.error('Error fetching plan content:', error);
      res.status(500).json({ error: 'Failed to fetch plan content' });
    }
  });

  // Public plans endpoint for pricing page
  app.get('/api/plans/public', async (req, res) => {
    try {
      // Check if there's a referral code in the request
      const { referralCode } = req.query;
      
      const allPlans = await storage.getPlans();
      
      if (referralCode) {
        // Referral visit - show only plans where allowAffiliatePromotion = true
        const affiliatePromotablePlans = allPlans.filter(plan => 
          plan.isMainSitePlan === true && plan.allowAffiliatePromotion === true
        );
        res.json(affiliatePromotablePlans);
      } else {
        // Direct visit - show all main site plans
        const mainSitePlans = allPlans.filter(plan => plan.isMainSitePlan === true);
        res.json(mainSitePlans);
      }
    } catch (error) {
      console.error('Error fetching public plans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });

  // Toggle plan visibility endpoint
  app.post('/api/plans/:id/toggle-visibility', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const { id } = req.params;
      const planId = parseInt(id);
      
      // Check if user has permission to toggle this plan
      const user = req.user;
      console.log(`Toggle visibility request for plan ${planId} by user:`, {
        userId: user.id,
        role: user.role,
        whiteLabelId: user.whiteLabelId,
        referer: req.headers.referer,
        domainContext: req.domainContext
      });
      
      const plan = await storage.getPlan(planId);
      
      if (!plan) {
        console.log(`Plan ${planId} not found`);
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      console.log(`Plan ${planId} found, created by: ${plan.createdBy}`);
      
      // Allow super admins, plan creators, and affiliates to toggle visibility
      // For affiliates, they can only toggle plans from their associated white-label client
      if (user.role === 'super_admin' || plan.createdBy === user.id) {
        console.log('Access granted: Super admin or plan creator');
        // Full access for super admins and plan creators
      } else if (user.role === 'end_user' && user.whiteLabelId) {
        console.log(`Checking affiliate permissions for whiteLabelId: ${user.whiteLabelId}`);
        // For affiliates (end_users with whiteLabelId), check if plan belongs to their white-label client
        const whiteLabel = await storage.getWhiteLabelById(user.whiteLabelId);
        console.log(`White label found:`, whiteLabel ? { id: whiteLabel.id, userId: whiteLabel.userId } : null);
        
        if (!whiteLabel || plan.createdBy !== whiteLabel.userId) {
          console.log(`Access denied: Plan createdBy (${plan.createdBy}) does not match whiteLabel userId (${whiteLabel?.userId})`);
          return res.status(403).json({ error: 'Unauthorized to modify this plan' });
        }
        console.log('Access granted: Affiliate can modify this plan');
      } else {
        console.log(`Access denied: Invalid role (${user.role}) or missing whiteLabelId`);
        return res.status(403).json({ error: 'Unauthorized to modify this plan' });
      }
      
      const updatedPlan = await storage.togglePlanVisibility(planId);
      console.log(`Plan ${planId} visibility toggled to: ${updatedPlan.isPublic}`);
      res.json(updatedPlan);
    } catch (error) {
      console.error('Error toggling plan visibility:', error);
      res.status(500).json({ error: 'Failed to toggle plan visibility' });
    }
  });

  // Plans analytics endpoint - shows ALL purchases for plan owners
  app.get('/api/plans/analytics', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      console.log('🔍 PLAN ANALYTICS REQUEST - User ID:', user.id, 'Role:', user.role, 'Email:', user.email);
      
      // Check if we're in impersonation mode - use impersonated user's plans
      let targetUser = user;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          targetUser = impersonatedUser;
          console.log('🎭 IMPERSONATION MODE - Using impersonated user for analytics:', targetUser.id, 'Role:', targetUser.role);
        }
      }
      
      // For Super-Admin users and white_label_client users, show analytics for plans they created
      if (targetUser.role === 'super_admin' || targetUser.role === 'white_label_client') {
        console.log('👑 SUPER-ADMIN/WHITE-LABEL-CLIENT - Fetching analytics for created plans. User ID:', targetUser.id);
        const superAdminAnalytics = await storage.getSuperAdminPlanAnalytics(targetUser.id);
        console.log('📊 SUPER-ADMIN ANALYTICS RESULT - Found', superAdminAnalytics.length, 'plans with analytics');
        superAdminAnalytics.forEach((plan, index) => {
          console.log(`  Plan ${index + 1}: "${plan.planName}" - Sales: ${plan.totalSales}, Revenue: $${plan.totalRevenue}, Purchasers: ${plan.recentPurchases?.length || 0}`);
        });
        return res.json(superAdminAnalytics);
      }
      
      // Get the user's white label ID - this determines which business's analytics to show
      let userWhiteLabelId = targetUser.whiteLabelId;
      console.log('🏢 WHITE LABEL CHECK - User whiteLabelId:', userWhiteLabelId);
      
      // If user doesn't have a whiteLabelId, check if they own a white label business
      if (!userWhiteLabelId) {
        console.log('🔍 SEARCHING FOR OWNED WHITE LABEL - User has no whiteLabelId, checking if they own a business');
        const ownedWhiteLabel = await db
          .select({ id: whiteLabels.id })
          .from(whiteLabels)
          .where(eq(whiteLabels.userId, targetUser.id))
          .limit(1);
        
        if (ownedWhiteLabel.length > 0) {
          userWhiteLabelId = ownedWhiteLabel[0].id;
          console.log('✅ FOUND OWNED WHITE LABEL - User owns white label business ID:', userWhiteLabelId);
        } else {
          console.log('❌ NO OWNED WHITE LABEL - User does not own any white label business');
        }
      }
      
      // If user has a white label association, show analytics for that business
      if (userWhiteLabelId) {
        console.log('🏢 WHITE LABEL ANALYTICS - Processing analytics for white label ID:', userWhiteLabelId);
        
        // Get plans associated with this white label business
        const userPlans = await db
          .select()
          .from(plans)
          .leftJoin(whiteLabels, eq(plans.whiteLabelId, whiteLabels.id))
          .where(eq(plans.whiteLabelId, userWhiteLabelId));
        
        console.log('📋 PLANS FOUND - Found', userPlans.length, 'plans for white label ID:', userWhiteLabelId);
        userPlans.forEach((planRow, index) => {
          console.log(`  Plan ${index + 1}: ID ${planRow.plans.id} - "${planRow.plans.name}"`);
        });
        
        // Create analytics based on ALL purchases of the white label's plans
        const planAnalytics = await Promise.all(
          userPlans.map(async (planRow) => {
            const plan = planRow.plans;
            console.log(`💰 PROCESSING PURCHASES - Plan "${plan.name}" (ID: ${plan.id})`);
            
            // Get ALL purchases for this plan (filtered by white-label ID)
            const allPlanPurchases = await db
              .select({
                id: purchaseHistory.id,
                userId: purchaseHistory.userId,
                planId: purchaseHistory.planId,
                amount: purchaseHistory.amount,
                transactionId: purchaseHistory.transactionId,
                status: purchaseHistory.status,
                createdAt: purchaseHistory.createdAt,
                whiteLabelId: purchaseHistory.whiteLabelId,
                userEmail: users.email,
                userFirstName: users.firstName,
                userLastName: users.lastName,
                businessName: whiteLabels.businessName,
              })
              .from(purchaseHistory)
              .leftJoin(users, eq(purchaseHistory.userId, users.id))
              .leftJoin(whiteLabels, eq(purchaseHistory.whiteLabelId, whiteLabels.id))
              .where(
                and(
                  eq(purchaseHistory.planId, plan.id),
                  eq(purchaseHistory.status, 'completed'),
                  eq(purchaseHistory.whiteLabelId, userWhiteLabelId)
                )
              )
              .orderBy(desc(purchaseHistory.createdAt));

            console.log(`  📊 PURCHASE DATA - Found ${allPlanPurchases.length} completed purchases for plan "${plan.name}"`);
            
            const totalSales = allPlanPurchases.length;
            const totalRevenue = allPlanPurchases.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
            
            console.log(`  💵 PLAN METRICS - Sales: ${totalSales}, Revenue: $${totalRevenue.toFixed(2)}`);
            
            if (allPlanPurchases.length > 0) {
              console.log(`  👥 RECENT PURCHASERS:`);
              allPlanPurchases.slice(0, 3).forEach((purchase, idx) => {
                const buyerName = purchase.userEmail || (purchase.userFirstName && purchase.userLastName ? `${purchase.userFirstName} ${purchase.userLastName}` : purchase.userFirstName || purchase.userLastName || purchase.userId);
                console.log(`    ${idx + 1}. ${buyerName} - $${purchase.amount} on ${purchase.createdAt}`);
              });
            }
            
            return {
              planId: plan.id,
              planName: plan.name,
              totalSales,
              totalRevenue,
              purchasers: allPlanPurchases.map(p => ({ 
                userId: p.userId, 
                email: p.userEmail || (p.userFirstName && p.userLastName ? `${p.userFirstName} ${p.userLastName}` : p.userFirstName || p.userLastName || p.userId),
                amount: parseFloat(p.amount || '0'),
                purchaseDate: p.createdAt,
                transactionId: p.transactionId || 'N/A',
                status: p.status || 'completed',
                businessName: p.businessName || 'Direct Purchase',
                whiteLabelId: p.whiteLabelId || 0
              })),
              recentPurchases: allPlanPurchases.slice(-5).map(p => ({
                userId: p.userId,
                email: p.userEmail || (p.userFirstName && p.userLastName ? `${p.userFirstName} ${p.userLastName}` : p.userFirstName || p.userLastName || p.userId),
                amount: parseFloat(p.amount || '0'),
                purchaseDate: p.createdAt,
                transactionId: p.transactionId || 'N/A',
                businessName: p.businessName || 'Direct Purchase'
              }))
            };
          })
        );
        
        console.log('🎯 FINAL WHITE LABEL ANALYTICS - Returning', planAnalytics.length, 'plan analytics');
        const totalPlansWithSales = planAnalytics.filter(p => p.totalSales > 0).length;
        const totalRevenue = planAnalytics.reduce((sum, p) => sum + p.totalRevenue, 0);
        console.log(`  📈 SUMMARY - Plans with sales: ${totalPlansWithSales}/${planAnalytics.length}, Total revenue: $${totalRevenue.toFixed(2)}`);
        
        return res.json(planAnalytics);
      }
      
      // For Super-Admin users, show analytics for plans they created
      if (targetUser.role === 'super_admin') {
        console.log('👑 FALLBACK SUPER-ADMIN - Fetching analytics for created plans. User ID:', targetUser.id);
        const superAdminAnalytics = await storage.getSuperAdminPlanAnalytics(targetUser.id);
        console.log('📊 FALLBACK SUPER-ADMIN RESULT - Found', superAdminAnalytics.length, 'plans with analytics');
        return res.json(superAdminAnalytics);
      }
      
      // For other users without white label association, return empty analytics
      console.log('❌ NO ANALYTICS AVAILABLE - User has no white label association, returning empty analytics');
      console.log('   User ID:', targetUser.id, 'Role:', targetUser.role, 'WhiteLabelId:', targetUser.whiteLabelId);
      res.json([]);
    } catch (error) {
      console.error('💥 PLAN ANALYTICS ERROR:', error.message);
      console.error('   Stack trace:', error.stack);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // DEBUG ANALYTICS ENDPOINT - Comprehensive troubleshooting for analytics issues
  app.get('/api/debug/analytics', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const debugInfo = {
        timestamp: new Date().toISOString(),
        requestInfo: {
          originalUser: {
            id: user.id,
            email: user.email,
            role: user.role,
            whiteLabelId: user.whiteLabelId,
            firstName: user.firstName,
            lastName: user.lastName
          },
          impersonationMode: !!req.session?.isImpersonating,
          impersonatedUserId: req.session?.impersonatedUserId || null
        },
        steps: [],
        errors: [],
        finalResult: null
      };

      console.log('🔧 DEBUG ANALYTICS START - User:', user.id, 'Email:', user.email, 'Role:', user.role);
      debugInfo.steps.push(`🔧 DEBUG START - User: ${user.id}, Email: ${user.email}, Role: ${user.role}`);

      // Step 1: Determine target user (handle impersonation)
      let targetUser = user;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        try {
          const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
          if (impersonatedUser) {
            targetUser = impersonatedUser;
            debugInfo.steps.push(`🎭 IMPERSONATION - Using impersonated user: ${targetUser.id} (${targetUser.email})`);
          } else {
            debugInfo.errors.push('❌ IMPERSONATION ERROR - Impersonated user not found');
          }
        } catch (error) {
          debugInfo.errors.push(`❌ IMPERSONATION ERROR - ${error.message}`);
        }
      }

      debugInfo.requestInfo.targetUser = {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        whiteLabelId: targetUser.whiteLabelId,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName
      };

      // Step 2: Check if user is super admin or white label client
      if (targetUser.role === 'super_admin' || targetUser.role === 'white_label_client') {
        debugInfo.steps.push(`👑 SUPER-ADMIN/WHITE-LABEL-CLIENT detected - Role: ${targetUser.role}`);
        
        try {
          const superAdminAnalytics = await storage.getSuperAdminPlanAnalytics(targetUser.id);
          debugInfo.steps.push(`📊 SUPER-ADMIN ANALYTICS - Found ${superAdminAnalytics.length} plans`);
          debugInfo.finalResult = {
            type: 'super_admin_analytics',
            planCount: superAdminAnalytics.length,
            plans: superAdminAnalytics.map(plan => ({
              planId: plan.planId,
              planName: plan.planName,
              totalSales: plan.totalSales,
              totalRevenue: plan.totalRevenue,
              purchaserCount: plan.recentPurchases?.length || 0
            }))
          };
          
          return res.json(debugInfo);
        } catch (error) {
          debugInfo.errors.push(`❌ SUPER-ADMIN ANALYTICS ERROR - ${error.message}`);
          console.error('SUPER-ADMIN ANALYTICS FULL ERROR:', error);
        }
      }

      // Step 3: Determine white label ID
      let userWhiteLabelId = targetUser.whiteLabelId;
      debugInfo.steps.push(`🏢 INITIAL WHITE LABEL ID - ${userWhiteLabelId || 'null'}`);

      // Step 4: If no whiteLabelId, check if user owns a white label business
      if (!userWhiteLabelId) {
        debugInfo.steps.push('🔍 SEARCHING FOR OWNED WHITE LABEL - User has no whiteLabelId');
        
        try {
          const ownedWhiteLabel = await db
            .select({ id: whiteLabels.id, businessName: whiteLabels.businessName })
            .from(whiteLabels)
            .where(eq(whiteLabels.userId, targetUser.id))
            .limit(1);
          
          debugInfo.steps.push(`🔍 OWNED WHITE LABEL QUERY - Found ${ownedWhiteLabel.length} owned businesses`);
          
          if (ownedWhiteLabel.length > 0) {
            userWhiteLabelId = ownedWhiteLabel[0].id;
            debugInfo.steps.push(`✅ FOUND OWNED WHITE LABEL - ID: ${userWhiteLabelId}, Business: ${ownedWhiteLabel[0].businessName}`);
          } else {
            debugInfo.steps.push('❌ NO OWNED WHITE LABEL - User does not own any white label business');
          }
        } catch (error) {
          debugInfo.errors.push(`❌ OWNED WHITE LABEL QUERY ERROR - ${error.message}`);
        }
      }

      // Step 5: If we have a white label ID, get plans and analytics
      if (userWhiteLabelId) {
        debugInfo.steps.push(`🏢 PROCESSING WHITE LABEL ANALYTICS - ID: ${userWhiteLabelId}`);
        
        try {
          // Get plans for this white label
          const userPlans = await db
            .select({
              planId: plans.id,
              planName: plans.name,
              planPrice: plans.price,
              planStatus: plans.status,
              planCreatedAt: plans.createdAt,
              planWhiteLabelId: plans.whiteLabelId,
              businessName: whiteLabels.businessName
            })
            .from(plans)
            .leftJoin(whiteLabels, eq(plans.whiteLabelId, whiteLabels.id))
            .where(eq(plans.whiteLabelId, userWhiteLabelId));
          
          debugInfo.steps.push(`📋 PLANS QUERY - Found ${userPlans.length} plans for white label ID: ${userWhiteLabelId}`);
          
          const planDetails = userPlans.map(plan => ({
            id: plan.planId,
            name: plan.planName,
            price: plan.planPrice,
            status: plan.planStatus,
            createdAt: plan.planCreatedAt,
            whiteLabelId: plan.planWhiteLabelId,
            businessName: plan.businessName
          }));
          
          debugInfo.steps.push(`📋 PLAN DETAILS - ${JSON.stringify(planDetails, null, 2)}`);

          // Get purchase statistics for each plan
          const planAnalytics = [];
          for (const planRow of userPlans) {
            debugInfo.steps.push(`💰 PROCESSING PURCHASES - Plan "${planRow.planName}" (ID: ${planRow.planId})`);
            
            try {
              const allPlanPurchases = await db
                .select({
                  id: purchaseHistory.id,
                  userId: purchaseHistory.userId,
                  planId: purchaseHistory.planId,
                  amount: purchaseHistory.amount,
                  status: purchaseHistory.status,
                  createdAt: purchaseHistory.createdAt,
                  whiteLabelId: purchaseHistory.whiteLabelId
                })
                .from(purchaseHistory)
                .where(
                  and(
                    eq(purchaseHistory.planId, planRow.planId),
                    eq(purchaseHistory.status, 'completed'),
                    eq(purchaseHistory.whiteLabelId, userWhiteLabelId)
                  )
                );

              const totalSales = allPlanPurchases.length;
              const totalRevenue = allPlanPurchases.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
              
              debugInfo.steps.push(`  📊 PURCHASE STATS - Plan "${planRow.planName}": ${totalSales} sales, $${totalRevenue.toFixed(2)} revenue`);
              
              planAnalytics.push({
                planId: planRow.planId,
                planName: planRow.planName,
                totalSales,
                totalRevenue,
                purchaseCount: allPlanPurchases.length,
                purchases: allPlanPurchases.map(p => ({
                  id: p.id,
                  userId: p.userId,
                  amount: p.amount,
                  status: p.status,
                  createdAt: p.createdAt
                }))
              });
            } catch (error) {
              debugInfo.errors.push(`❌ PURCHASE QUERY ERROR for plan ${planRow.planId} - ${error.message}`);
            }
          }
          
          debugInfo.finalResult = {
            type: 'white_label_analytics',
            whiteLabelId: userWhiteLabelId,
            planCount: userPlans.length,
            analytics: planAnalytics,
            totalPlansWithSales: planAnalytics.filter(p => p.totalSales > 0).length,
            totalRevenue: planAnalytics.reduce((sum, p) => sum + p.totalRevenue, 0)
          };
          
        } catch (error) {
          debugInfo.errors.push(`❌ WHITE LABEL ANALYTICS ERROR - ${error.message}`);
          console.error('WHITE LABEL ANALYTICS FULL ERROR:', error);
        }
      } else {
        debugInfo.steps.push('❌ NO WHITE LABEL ASSOCIATION - User has no white label ID and owns no white label business');
        debugInfo.finalResult = {
          type: 'no_analytics',
          reason: 'No white label association found'
        };
      }

      // Step 6: Final summary
      debugInfo.steps.push(`🎯 DEBUG COMPLETE - Result type: ${debugInfo.finalResult?.type || 'error'}`);
      
      console.log('🔧 DEBUG ANALYTICS COMPLETE - Check response for detailed information');
      
      return res.json(debugInfo);
      
    } catch (error) {
      console.error('💥 DEBUG ANALYTICS ERROR:', error.message);
      return res.status(500).json({
        error: 'Debug endpoint failed',
        message: error.message,
        stack: error.stack
      });
    }
  });

  // Products API endpoints
  app.get('/api/products', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - use impersonated user's products
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('PRODUCTS DEBUG - Using impersonated user ID for products:', targetUserId);
      }
      
      const products = await storage.getProductsByUser(targetUserId);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White label not found' });
      }
      
      let productData = { ...req.body, whiteLabelId: whiteLabel.id, createdBy: user.id };
      
      // Auto-fetch meta image for website_link products
      if (productData.type === 'website_link' && productData.contentUrl) {
        console.log('Auto-fetching meta image for website_link product:', productData.contentUrl);
        const metaImageUrl = await extractMetaImage(productData.contentUrl);
        if (metaImageUrl) {
          productData.imageUrl = metaImageUrl;
          console.log('Auto-populated imageUrl:', metaImageUrl);
        }
      }
      
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Extract meta image from URL endpoint
  app.post('/api/products/extract-meta-image', isAuthenticated, async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      const metaImageUrl = await extractMetaImage(url);
      res.json({ imageUrl: metaImageUrl });
    } catch (error) {
      console.error('Error extracting meta image:', error);
      res.status(500).json({ error: 'Failed to extract meta image' });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      let updateData = { ...req.body };
      
      // Auto-fetch meta image for website_link products when contentUrl changes
      if (updateData.type === 'website_link' && updateData.contentUrl) {
        console.log('Auto-fetching meta image for updated website_link product:', updateData.contentUrl);
        const metaImageUrl = await extractMetaImage(updateData.contentUrl);
        if (metaImageUrl) {
          updateData.imageUrl = metaImageUrl;
          console.log('Auto-updated imageUrl:', metaImageUrl);
        }
      }
      
      const product = await storage.updateProduct(parseInt(id), updateData);
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Categories API endpoints
  app.get('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - use impersonated user's categories
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('CATEGORIES DEBUG - Using impersonated user ID for categories:', targetUserId);
      }
      
      const categories = await storage.getCategories(targetUserId);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White label not found' });
      }
      
      const categoryData = { ...req.body, whiteLabelId: whiteLabel.id, createdBy: user.id };
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.put('/api/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.updateCategory(parseInt(id), req.body);
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  app.post('/api/plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      console.log('POST /api/plans received data:', {
        status: req.body.status,
        scheduledAt: req.body.scheduledAt,
        isMainSitePlan: req.body.isMainSitePlan,
        selectedCategories: req.body.selectedCategories,
        selectedProducts: req.body.selectedProducts
      });
      
      // Determine isMainSitePlan based on user role - only Super Admin can create main site plans
      const planData = { 
        ...req.body, 
        createdBy: user.id,
        // CRITICAL: Only Super Admin can create main site plans, White Label clients create plans for their own sites
        isMainSitePlan: user.role === 'super_admin',
        // Handle accesses array for Super Admin
        accesses: user.role === 'super_admin' && req.body.accesses ? req.body.accesses : undefined,
        // Handle allowAffiliatePromotion field
        allowAffiliatePromotion: req.body.allowAffiliatePromotion || false,
        // Ensure status defaults to published for backward compatibility
        status: req.body.status || 'published',
        // Set timestamps based on status
        publishedAt: req.body.status === 'published' || (!req.body.status) ? new Date() : (req.body.publishedAt ? new Date(req.body.publishedAt) : null),
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null
      };
      
      console.log('Processed planData before storage.createPlan:', {
        selectedCategories: planData.selectedCategories,
        selectedProducts: planData.selectedProducts
      });
      
      const plan = await storage.createPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error('Error creating plan:', error);
      res.status(500).json({ error: 'Failed to create plan' });
    }
  });

  // Get individual plan by ID
  app.get('/api/plans/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      
      // Check if user owns this plan or is super admin
      if (user.role !== 'super_admin') {
        const plan = await storage.getPlan(parseInt(id));
        if (!plan || plan.createdBy !== user.id) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
      }
      
      const plan = await storage.getPlan(parseInt(id));
      
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      res.json(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
      res.status(500).json({ error: 'Failed to fetch plan' });
    }
  });

  app.put('/api/plans/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      console.log('PUT /api/plans/:id received data:', {
        status: req.body.status,
        scheduledAt: req.body.scheduledAt,
        isMainSitePlan: req.body.isMainSitePlan
      });
      
      // Check if user owns this plan or is super admin
      if (user.role !== 'super_admin') {
        const plan = await storage.getPlanById(parseInt(id));
        if (!plan || plan.createdBy !== user.id) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
      }
      
      // Prepare update data with proper status handling
      const updateData = {
        ...req.body,
        // CRITICAL: Ensure isMainSitePlan is always based on user role, cannot be changed via frontend
        isMainSitePlan: user.role === 'super_admin',
        // Handle allowAffiliatePromotion field
        allowAffiliatePromotion: req.body.hasOwnProperty('allowAffiliatePromotion') ? req.body.allowAffiliatePromotion : undefined,
        // Set timestamps based on status changes
        publishedAt: req.body.status === 'published' && !req.body.publishedAt ? new Date() : (req.body.publishedAt ? new Date(req.body.publishedAt) : null),
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null
      };
      
      const updatedPlan = await storage.updatePlan(parseInt(id), updateData);
      res.json(updatedPlan);
    } catch (error) {
      console.error('Error updating plan:', error);
      res.status(500).json({ error: 'Failed to update plan' });
    }
  });

  app.delete('/api/plans/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      
      // Check if user owns this plan or is super admin
      if (user.role !== 'super_admin') {
        const plan = await storage.getPlanById(parseInt(id));
        if (!plan || plan.createdBy !== user.id) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
      }
      
      await storage.deletePlan(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting plan:', error);
      res.status(500).json({ error: 'Failed to delete plan' });
    }
  });

  // Admin endpoint to fix all plans' isMainSitePlan values
  app.post('/api/admin/fix-plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Only super admin can run this fix
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }
      
      console.log('🔧 Starting plan isMainSitePlan fix...');
      
      // Get all plans
      const allPlans = await storage.getPlans();
      console.log(`Found ${allPlans.length} total plans to check`);
      
      const fixes = [];
      
      for (const plan of allPlans) {
        // Get the user who created this plan
        const creator = await storage.getUserById(plan.createdBy);
        
        if (!creator) {
          console.log(`⚠️  Plan ${plan.id} (${plan.name}): Creator not found (${plan.createdBy})`);
          fixes.push({
            planId: plan.id,
            planName: plan.name,
            status: 'error',
            message: 'Creator not found'
          });
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
          await storage.updatePlan(plan.id, { isMainSitePlan: correctValue });
          
          console.log(`   ✅ Updated!`);
          fixes.push({
            planId: plan.id,
            planName: plan.name,
            creator: creator.username,
            creatorRole: creator.role,
            oldValue: plan.isMainSitePlan,
            newValue: correctValue,
            status: 'fixed'
          });
        } else {
          console.log(`✓ Plan ${plan.id} (${plan.name}) is already correct (creator: ${creator.role}, isMainSitePlan: ${plan.isMainSitePlan})`);
          fixes.push({
            planId: plan.id,
            planName: plan.name,
            creator: creator.username,
            creatorRole: creator.role,
            value: plan.isMainSitePlan,
            status: 'already_correct'
          });
        }
      }
      
      console.log('\n✅ Plan fix complete!');
      res.json({
        success: true,
        totalPlans: allPlans.length,
        fixed: fixes.filter(f => f.status === 'fixed').length,
        alreadyCorrect: fixes.filter(f => f.status === 'already_correct').length,
        errors: fixes.filter(f => f.status === 'error').length,
        details: fixes
      });
    } catch (error) {
      console.error('Error fixing plans:', error);
      res.status(500).json({ error: 'Failed to fix plans' });
    }
  });

  // Delete announcement endpoint
  app.delete('/api/announcements/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const announcementId = parseInt(id);
      if (isNaN(announcementId) || announcementId <= 0) {
        return res.status(400).json({ error: 'Invalid announcement ID' });
      }
      
      // Get existing announcement to check ownership and permissions
      let existingAnnouncement;
      try {
        const { executeWithRetry } = await import('./db');
        existingAnnouncement = await executeWithRetry(async () => {
          return await storage.getAnnouncementById(announcementId, user.id);
        });
      } catch (error) {
        console.error('Error fetching existing announcement:', error);
        return res.status(500).json({ error: 'Failed to fetch announcement data' });
      }
      
      if (!existingAnnouncement) {
        return res.status(404).json({ error: 'Announcement not found or you do not have permission to delete it' });
      }
      
      // Check if user has permission to delete this announcement
      const canDelete = (
        user.role === 'super_admin' || 
        user.role === 'super_admin_affiliate' ||
        (user.role === 'white_label_client' && existingAnnouncement.userId === user.id) ||
        existingAnnouncement.userId === user.id
      );
      
      if (!canDelete) {
        return res.status(403).json({ error: 'You do not have permission to delete this announcement' });
      }
      
      // Clean up attachment files if they exist
      if (existingAnnouncement.attachments && existingAnnouncement.attachments.length > 0) {
        for (const attachment of existingAnnouncement.attachments) {
          if (attachment.url && attachment.url.startsWith('/uploads/')) {
            const filePath = `.${attachment.url}`;
            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('Cleaned up attachment file:', filePath);
              }
            } catch (cleanupError) {
              console.error('Error cleaning up attachment file:', cleanupError);
            }
          }
        }
      }
      
      // Delete the announcement from database
      await storage.deleteAnnouncement(announcementId, user.id);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Failed to delete announcement' });
    }
  });



  // White-label endpoints
  app.get('/api/white-labels', isAuthenticated, async (req, res) => {
    try {
      const whiteLabels = await storage.getWhiteLabels();
      res.json(whiteLabels);
    } catch (error) {
      console.error('Error fetching white labels:', error);
      res.status(500).json({ error: 'Failed to fetch white labels' });
    }
  });

  // Get white-label data by ID (for authentication flow)
  app.get('/api/white-labels/by-id/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid ID parameter is required' });
      }

      let whiteLabel = await storage.getWhiteLabelById(id);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White label not found' });
      }

      // Auto-fix: If domainPath is undefined/null, set it to the domain value
      if (!whiteLabel.domainPath && whiteLabel.domain) {
        console.log(`🔧 AUTO-FIX: Setting domainPath to "${whiteLabel.domain}" for white label ID ${id}`);
        try {
          whiteLabel = await storage.updateWhiteLabel(id, { domainPath: whiteLabel.domain });
          console.log(`✅ Successfully updated domainPath for white label ID ${id}`);
        } catch (updateError) {
          console.error('Failed to auto-update domainPath:', updateError);
        }
      }

      // Return only the necessary fields for authentication flow
      res.json({
        id: whiteLabel.id,
        domainPath: whiteLabel.domainPath || whiteLabel.domain,
        businessName: whiteLabel.businessName,
        userId: whiteLabel.userId
      });
    } catch (error) {
      console.error('Error fetching white label by ID:', error);
      res.status(500).json({ error: 'Failed to fetch white label data' });
    }
  });

  // Get current user's white-label data
  app.get('/api/white-labels/my', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      
      if (user.role === 'white_label_client') {
        // White-label client - get their own data
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        if (!whiteLabel) {
          return res.status(404).json({ error: 'White-label account not found' });
        }
        return res.json(whiteLabel);
      } else {
        // Check if user is linked to a white-label client (affiliate or end_user with white_label_id)
        const userWithWhiteLabel = await storage.getUserById(user.id);
        if (!userWithWhiteLabel || !userWithWhiteLabel.whiteLabelId) {
          return res.status(403).json({ error: 'Access restricted to white-label clients and affiliates' });
        }
        
        // Get the parent white-label client's data
        const whiteLabel = await storage.getWhiteLabelById(userWithWhiteLabel.whiteLabelId);
        if (!whiteLabel) {
          return res.status(404).json({ error: 'Parent white-label account not found' });
        }
        return res.json(whiteLabel);
      }
    } catch (error) {
      console.error('Error fetching my white label data:', error);
      res.status(500).json({ error: 'Failed to fetch white-label data' });
    }
  });

  // Get user's landing page code for landing builder logic
  app.get('/api/white-labels/landing-page-code', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      
      if (user.role === 'white_label_client') {
        // White-label client - get their own landing_page_code
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        if (!whiteLabel) {
          return res.status(404).json({ error: 'White-label account not found' });
        }
        return res.json({ 
          landingPageCode: whiteLabel.landingPageCode || 'default',
          userId: user.id,
          whiteLabelId: whiteLabel.id
        });
      } else {
        // Check if user is linked to a white-label client
        const userWithWhiteLabel = await storage.getUserById(user.id);
        if (!userWithWhiteLabel || !userWithWhiteLabel.whiteLabelId) {
          return res.status(403).json({ error: 'Access restricted to white-label clients and affiliates' });
        }
        
        // Get the parent white-label client's landing_page_code
        const whiteLabel = await storage.getWhiteLabelById(userWithWhiteLabel.whiteLabelId);
        if (!whiteLabel) {
          return res.status(404).json({ error: 'Parent white-label account not found' });
        }
        return res.json({ 
          landingPageCode: whiteLabel.landingPageCode || 'default',
          userId: user.id,
          whiteLabelId: whiteLabel.id
        });
      }
    } catch (error) {
      console.error('Error fetching landing page code:', error);
      res.status(500).json({ error: 'Failed to fetch landing page code' });
    }
  });

  // Update white-label client's domain path
  app.put('/api/white-labels/update-domain', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const { domainPath } = req.body;

      if (!domainPath) {
        return res.status(400).json({ error: 'Domain path is required' });
      }

      // Validate domain path format
      const domainPathRegex = /^[a-z0-9-]+$/;
      if (!domainPathRegex.test(domainPath)) {
        return res.status(400).json({ error: 'Domain path can only contain lowercase letters, numbers, and hyphens' });
      }

      let currentWhiteLabel;
      if (user.role === 'white_label_client') {
        // White-label client - update their own domain
        currentWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
      } else {
        // Check if user is linked to a white-label client (affiliate or end_user with white_label_id)
        const userWithWhiteLabel = await storage.getUserById(user.id);
        if (!userWithWhiteLabel || !userWithWhiteLabel.whiteLabelId) {
          return res.status(403).json({ error: 'Access restricted to white-label clients and affiliates' });
        }
        currentWhiteLabel = await storage.getWhiteLabelById(userWithWhiteLabel.whiteLabelId);
      }

      if (!currentWhiteLabel) {
        return res.status(404).json({ error: 'White-label account not found' });
      }

      // Check if domain path is already taken by another white-label client
      const existingWhiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
      if (existingWhiteLabel && existingWhiteLabel.id !== currentWhiteLabel.id) {
        return res.status(409).json({ error: 'Domain path already taken by other white-label client' });
      }

      // Update domain path
      const updatedWhiteLabel = await storage.updateWhiteLabel(currentWhiteLabel.id, {
        domainPath: domainPath
      });

      res.json(updatedWhiteLabel);
    } catch (error) {
      console.error('Error updating white-label domain:', error);
      res.status(500).json({ error: 'Failed to update domain path' });
    }
  });

  app.post('/api/white-labels', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const whiteLabelData = { ...req.body, userId: user.id };
      const whiteLabel = await storage.createWhiteLabel(whiteLabelData);
      res.json(whiteLabel);
    } catch (error) {
      console.error('Error creating white label:', error);
      res.status(500).json({ error: 'Failed to create white label' });
    }
  });

  // Create Organization endpoint (Super Admin only)
  app.post('/api/admin/create-organization', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Only Super Admin can create organizations
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Only Super Admin can create organizations' });
      }
      
      console.log('POST /api/admin/create-organization - Request body:', {
        businessName: req.body.businessName ? req.body.businessName.substring(0, 30) + '...' : 'missing',
        username: req.body.username || 'missing',
        domainPath: req.body.domainPath || 'missing'
      });
      
      // Validate required fields with detailed error messages
      const { businessName, organizationFirstName, organizationLastName, username, password, domainPath } = req.body;
      
      const missingFields = [];
      if (!businessName || businessName.trim().length === 0) missingFields.push('businessName');
      if (!organizationFirstName || organizationFirstName.trim().length === 0) missingFields.push('organizationFirstName');
      if (!organizationLastName || organizationLastName.trim().length === 0) missingFields.push('organizationLastName');
      if (!username || username.trim().length === 0) missingFields.push('username');
      if (!password || password.trim().length === 0) missingFields.push('password');
      if (!domainPath || domainPath.trim().length === 0) missingFields.push('domainPath');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields
        });
      }
      
      // Validate field formats and constraints
      if (businessName.trim().length < 2) {
        return res.status(400).json({ error: 'Business name must be at least 2 characters long' });
      }
      
      if (businessName.trim().length > 100) {
        return res.status(400).json({ error: 'Business name must be less than 100 characters' });
      }
      
      if (username.trim().length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long' });
      }
      
      if (username.trim().length > 50) {
        return res.status(400).json({ error: 'Username must be less than 50 characters' });
      }
      
      // Validate username format (alphanumeric and underscores only)
      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
      }
      
      if (password.trim().length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      
      if (domainPath.trim().length < 2) {
        return res.status(400).json({ error: 'Domain path must be at least 2 characters long' });
      }
      
      if (domainPath.trim().length > 50) {
        return res.status(400).json({ error: 'Domain path must be less than 50 characters' });
      }
      
      // Validate domain path format (alphanumeric and hyphens only)
      if (!/^[a-zA-Z0-9-]+$/.test(domainPath.trim())) {
        return res.status(400).json({ error: 'Domain path can only contain letters, numbers, and hyphens' });
      }
      
      // Validate first and last names
      if (organizationFirstName.trim().length < 1 || organizationFirstName.trim().length > 50) {
        return res.status(400).json({ error: 'First name must be between 1 and 50 characters' });
      }
      
      if (organizationLastName.trim().length < 1 || organizationLastName.trim().length > 50) {
        return res.status(400).json({ error: 'Last name must be between 1 and 50 characters' });
      }
      
      // Validate optional fields if provided
      if (req.body.industry && req.body.industry.trim().length > 100) {
        return res.status(400).json({ error: 'Industry must be less than 100 characters' });
      }
      
      if (req.body.website && req.body.website.trim().length > 200) {
        return res.status(400).json({ error: 'Website URL must be less than 200 characters' });
      }
      
      // Validate website URL format if provided
      if (req.body.website && req.body.website.trim().length > 0) {
        try {
          const url = new URL(req.body.website.trim());
          if (!['http:', 'https:'].includes(url.protocol)) {
            return res.status(400).json({ error: 'Website must be a valid HTTP or HTTPS URL' });
          }
        } catch (urlError) {
          return res.status(400).json({ error: 'Website must be a valid URL' });
        }
      }
      
      console.log('Creating organization with validated data...');
      
      // Use database retry logic for organization creation
      const { executeWithRetry } = await import('./db');
      const result = await executeWithRetry(async () => {
        return await storage.createOrganization({
          businessName: businessName.trim(),
          organizationFirstName: organizationFirstName.trim(),
          organizationLastName: organizationLastName.trim(),
          username: username.trim(),
          password: password.trim(),
          domainPath: domainPath.trim(),
          industry: req.body.industry ? req.body.industry.trim() : null,
          website: req.body.website ? req.body.website.trim() : null,
        });
      });
      
      console.log('Organization created successfully:', {
        userId: result.user.id,
        businessName: result.whiteLabel.businessName,
        domainPath: result.whiteLabel.domainPath
      });
      
      res.json({
        success: true,
        message: 'Organization created successfully',
        organization: {
          user: {
            id: result.user.id,
            username: result.user.username,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
          },
          whiteLabel: {
            id: result.whiteLabel.id,
            businessName: result.whiteLabel.businessName,
            domainPath: result.whiteLabel.domainPath,
            industry: result.whiteLabel.industry,
            website: result.whiteLabel.website,
          },
        },
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      
      // Handle specific database errors
      if (error instanceof Error) {
        if (error.message.includes('Username already exists') || error.message.includes('Duplicate entry') && error.message.includes('username')) {
          return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
        }
        
        if (error.message.includes('Domain path already exists') || error.message.includes('Duplicate entry') && error.message.includes('domainPath')) {
          return res.status(409).json({ error: 'Domain path already exists. Please choose a different domain path.' });
        }
        
        if (error.message.includes('cannot be null') || error.message.includes('NOT NULL')) {
          return res.status(400).json({ error: 'Missing required database fields. Please check all required information is provided.' });
        }
        
        if (error.message.includes('Data too long') || error.message.includes('too long')) {
          return res.status(400).json({ error: 'One or more fields exceed the maximum allowed length.' });
        }
        
        if (error.message.includes('Connection') || error.message.includes('timeout')) {
          return res.status(503).json({ error: 'Database connection issue. Please try again in a moment.' });
        }
      }
      
      res.status(500).json({ 
        error: 'Failed to create organization. Please check your information and try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Send single invitation (Super Admin only)
  app.post('/api/admin/send-invitation', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Only Super Admin can send invitations
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Only Super Admin can send invitations' });
      }
      
      const { email, businessName, firstName, lastName, inviterName } = req.body;
      
      if (!email || !businessName || !firstName || !lastName) {
        return res.status(400).json({ 
          error: 'Missing required fields: email, businessName, firstName, lastName' 
        });
      }
      
      // Send invitation email
      const emailService = await import('./emailService.js');
      const success = await emailService.sendWhiteLabelInvitation(
        email,
        firstName,
        lastName,
        businessName,
        inviterName || 'Super Admin'
      );
      
      if (success) {
        console.log('Invitation sent successfully to:', email);
        res.json({ success: true, message: 'Invitation sent successfully' });
      } else {
        throw new Error('Failed to send invitation email');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      res.status(500).json({ error: 'Failed to send invitation' });
    }
  });

  // Send bulk invitations (Super Admin only)
  app.post('/api/admin/send-bulk-invitations', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Only Super Admin can send invitations
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Only Super Admin can send invitations' });
      }
      
      const { invitations } = req.body;
      
      if (!invitations || !Array.isArray(invitations) || invitations.length === 0) {
        return res.status(400).json({ error: 'Invitations array is required and must not be empty' });
      }
      
      let successCount = 0;
      let errorCount = 0;
      const errors = [];
      
      // Send invitations one by one
      const emailService = await import('./emailService.js');
      
      for (const invitation of invitations) {
        const { email, businessName, firstName, lastName, inviterName } = invitation;
        
        if (!email || !businessName || !firstName || !lastName) {
          errorCount++;
          errors.push(`Missing required fields for ${email || 'unknown email'}`);
          continue;
        }
        
        try {
          const success = await emailService.sendWhiteLabelInvitation(
            email,
            firstName,
            lastName,
            businessName,
            inviterName || 'Super Admin'
          );
          
          if (success) {
            successCount++;
            console.log('Bulk invitation sent successfully to:', email);
          } else {
            errorCount++;
            errors.push(`Failed to send invitation to ${email}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`Error sending to ${email}: ${error.message}`);
          console.error('Error in bulk invitation:', error);
        }
      }
      
      console.log(`Bulk invitation summary: ${successCount} success, ${errorCount} errors`);
      
      res.json({
        successCount,
        errorCount,
        errors: errors.slice(0, 10), // Limit errors shown
        message: `Sent ${successCount} invitations successfully. ${errorCount} failed.`
      });
    } catch (error) {
      console.error('Error in bulk invitation sending:', error);
      res.status(500).json({ error: 'Failed to send bulk invitations' });
    }
  });

  // Landing pages endpoints
  // Domain path validation endpoint
  app.post('/api/domain-paths/validate', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const { domainPath, excludeId } = req.body;
      
      if (!domainPath) {
        return res.status(400).json({ error: 'Domain path is required' });
      }
      
      // Check if domain path is already taken by white-label client
      const existingWhiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
      if (existingWhiteLabel) {
        // Check if it's the same user checking their own domain
        const requestingUser = req.user;
        if (requestingUser && existingWhiteLabel.userId === requestingUser.id) {
          return res.json({
            available: true,
            message: 'This is your current domain'
          });
        }
        
        return res.json({
          available: false,
          message: 'Domain path already taken by other white-label client'
        });
      }
      
      // Domain path is available
      // Note: Only white-label clients can have domain paths in this system
      
      res.json({
        available: true,
        message: 'Domain path is available'
      });
    } catch (error) {
      console.error('Error validating domain path:', error);
      res.status(500).json({ error: 'Failed to validate domain path' });
    }
  });

  app.get('/api/landing-pages', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - use impersonated user's landing pages
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('LANDING-PAGES DEBUG - Using impersonated user ID for landing pages:', targetUserId);
      }
      
      const landingPages = await storage.getLandingPages(targetUserId);
      res.json(landingPages);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      res.status(500).json({ error: 'Failed to fetch landing pages' });
    }
  });

  app.post('/api/landing-pages', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const landingPageData = { ...req.body, userId: user.id };
      const landingPage = await storage.createLandingPage(landingPageData);
      res.json(landingPage);
    } catch (error) {
      console.error('Error creating landing page:', error);
      res.status(500).json({ error: 'Failed to create landing page' });
    }
  });

  // Get individual landing page by ID
  app.get('/api/landing-pages/:id', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const landingPageId = parseInt(req.params.id);
      
      // Check if we're in impersonation mode - use impersonated user's landing pages
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('LANDING-PAGE DEBUG - Using impersonated user ID for landing page:', targetUserId);
      }
      
      const landingPage = await storage.getLandingPage(landingPageId);
      
      if (!landingPage) {
        return res.status(404).json({ error: 'Landing page not found' });
      }
      
      // Verify the landing page belongs to the user (or impersonated user)
      if (landingPage.userId !== targetUserId) {
        return res.status(403).json({ error: 'Not authorized to access this landing page' });
      }
      
      res.json(landingPage);
    } catch (error) {
      console.error('Error fetching landing page:', error);
      res.status(500).json({ error: 'Failed to fetch landing page' });
    }
  });

  // Get default landing page for /shoot route (public endpoint)
  app.get('/api/landing-pages/default', async (req, res) => {
    try {
      const domain = req.query.domain as string;
      
      console.log('Fetching default landing page for domain:', domain);
      
      let landingPage = null;
      let whiteLabel = null;
      
      // If domain is provided, get the specific user's landing page
      if (domain) {
        whiteLabel = await storage.getWhiteLabelByDomainPath(domain);
        
        if (whiteLabel && whiteLabel.defaultLandingPageId) {
          // Get the user's specific default landing page
          const userLandingPage = await storage.getLandingPage(whiteLabel.defaultLandingPageId);
          if (userLandingPage) {
            landingPage = userLandingPage;
          }
        }
      }
      
      // If no domain-specific landing page found, fall back to the first active one
      if (!landingPage) {
        console.log('No domain-specific landing page found, falling back to first active one');
        const defaultLandingPages = await db.select()
          .from(landingPages)
          .innerJoin(whiteLabels, eq(whiteLabels.defaultLandingPageId, landingPages.id))
          .where(eq(whiteLabels.isActive, true))
          .limit(1);

        if (defaultLandingPages.length === 0) {
          return res.status(404).json({ error: 'No default landing page found' });
        }

        landingPage = defaultLandingPages[0].landing_pages;
        whiteLabel = defaultLandingPages[0].white_labels;
      }
      
      // Get white-label customizations for this domain
      let customizations = null;
      if (whiteLabel) {
        try {
          const customizationData = await db.select()
            .from(clientTemplateCustomizations)
            .where(eq(clientTemplateCustomizations.clientId, whiteLabel.id))
            .limit(1);
            
          if (customizationData.length > 0) {
            customizations = customizationData[0].customConfig;
          } else {
            // Return default customizations with user's business info
            customizations = {
              text: {
                heroTitle: "Welcome to Our Platform",
                heroSubtitle: "Discover amazing features and services",
                ctaButtonText: "Get Started",
                companyName: whiteLabel.businessName || "Your Company",
                footerText: "© 2024 All rights reserved"
              },
              colors: {
                primary: "#6366f1",
                secondary: "#8b5cf6",
                accent: "#06b6d4",
                background: "#ffffff",
                text: "#1f2937",
                buttonBackground: "#6366f1",
                buttonText: "#ffffff"
              },
              logo: {
                logoImageUrl: whiteLabel.logoImageUrl || null
              }
            };
          }
        } catch (error) {
          console.error('Error fetching customizations:', error);
        }
      }
      
      console.log('Returning landing page for domain:', domain, 'with customizations:', !!customizations);
      
      // Return the landing page data with customizations
      res.json({
        id: landingPage.id,
        name: landingPage.name,
        elements: landingPage.elements,
        settings: landingPage.settings,
        landing_page_code: 'default',
        html_content: null,
        customizations: customizations,
        whiteLabel: whiteLabel ? {
          id: whiteLabel.id,
          businessName: whiteLabel.businessName,
          domainPath: whiteLabel.domainPath,
          logoImageUrl: whiteLabel.logoImageUrl
        } : null
      });
    } catch (error) {
      console.error('Error fetching default landing page:', error);
      res.status(500).json({ error: 'Failed to fetch default landing page' });
    }
  });

  // Set landing page as default - shows amazing default page ON USER'S PERSONAL DOMAIN
  app.post('/api/landing-pages/:id/set-default', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const landingPageId = parseInt(req.params.id);
      
      // Verify the landing page belongs to the user
      const landingPage = await storage.getLandingPage(landingPageId);
      if (!landingPage || landingPage.userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to modify this landing page' });
      }
      
      // Check if user has a white-label client account
      const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
      if (whiteLabel && whiteLabel.domainPath) {
        // White-label client - deploy to their domain
        // Use the new landing page template with revenue sharing & commission tracking
        const newDefaultElements = [
          // Hero Section with Revenue Sharing & Commission Tracking
          {
            id: "hero-section",
            type: "hero",
            name: "Hero Section",
            locked: false,
            visible: true,
            style: {
              position: "relative",
              width: "100%",
              height: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              textAlign: "center",
              padding: 80,
              backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay"
            },
            content: {
              title: `Powerful Revenue Sharing & Commission Tracking`,
              subtitle: "Automated calculations, transparent distribution, and real-time analytics for every stakeholder",
              buttonText: "Explore Analytics",
              buttonUrl: "#analytics"
            }
          },
          // Other sections from the default template
          ...generateDefaultBuilderElements(whiteLabel.businessName || 'Your Business').slice(1)
        ];
        
        await storage.updateLandingPage(landingPageId, {
          elements: newDefaultElements,
          isPublished: true,
          publishedAt: new Date()
        });
        
        // CRITICAL: Set this landing page as the default for the white-label domain
        await storage.setDefaultLandingPage(whiteLabel.id, landingPageId);
        
        res.json({
          success: true,
          message: 'New revenue sharing landing page set successfully on your domain',
          landingPageId: landingPageId,
          domainPath: whiteLabel.domainPath,
          domainUrl: `${req.protocol}://${req.get('host')}/${whiteLabel.domainPath}`,
          elementsPopulated: true
        });
      } else {
        // Regular user - they need to set up domain first
        return res.status(404).json({ error: 'No domain found. Please set up your domain first in Custom Domains.' });
      }
    } catch (error) {
      console.error('Error setting landing page as default:', error);
      res.status(500).json({ error: 'Failed to set landing page as default' });
    }
  });

  // Set as domain page - shows white-label client's landing page
  app.post('/api/landing-pages/:id/set-domain-page', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const landingPageId = parseInt(req.params.id);
      
      // Verify the landing page belongs to the user
      const landingPage = await storage.getLandingPage(landingPageId);
      if (!landingPage || landingPage.userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to modify this landing page' });
      }
      
      // Get the white-label client for this domain
      const domainPath = req.domainContext?.domainPath;
      if (!domainPath) {
        return res.status(400).json({ error: 'Domain context not found' });
      }
      
      const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found' });
      }
      
      // Get the white-label client's existing landing page elements
      let clientElements = [];
      if (whiteLabel.defaultLandingPageId) {
        const clientLandingPage = await storage.getLandingPage(whiteLabel.defaultLandingPageId);
        if (clientLandingPage && clientLandingPage.elements) {
          clientElements = clientLandingPage.elements;
        }
      }
      
      // If no client elements exist, create default ones
      if (clientElements.length === 0) {
        clientElements = generateDefaultBuilderElements(whiteLabel.businessName);
      }
      
      // Update the landing page with client's elements
      await storage.updateLandingPage(landingPageId, {
        elements: clientElements,
        isPublished: true,
        publishedAt: new Date()
      });
      
      // Check if user has a white-label client account
      const userWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
      if (userWhiteLabel && userWhiteLabel.domainPath) {
        // White-label client - deploy to their domain
        res.json({
          success: true,
          message: `${whiteLabel.businessName} Page Set! Your landing page now becomes just like ${whiteLabel.businessName}`,
          landingPageId: landingPageId,
          domainPath: userWhiteLabel.domainPath,
          domainUrl: `${req.protocol}://${req.get('host')}/${userWhiteLabel.domainPath}`,
          elementsPopulated: true
        });
      } else {
        // Regular user - they need to set up domain first
        return res.status(404).json({ error: 'No domain found. Please set up your domain first in Custom Domains.' });
      }
    } catch (error) {
      console.error('Error setting domain page:', error);
      res.status(500).json({ error: 'Failed to set domain page' });
    }
  });

  // Set page - saves current built page ON USER'S PERSONAL DOMAIN
  app.post('/api/landing-pages/:id/set-page', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const landingPageId = parseInt(req.params.id);
      
      // Verify the landing page belongs to the user
      const landingPage = await storage.getLandingPage(landingPageId);
      if (!landingPage || landingPage.userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to modify this landing page' });
      }
      
      // Check if user has a white-label client account
      const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
      if (whiteLabel && whiteLabel.domainPath) {
        // White-label client - deploy to their domain
        await storage.updateLandingPage(landingPageId, {
          isPublished: true,
          publishedAt: new Date()
        });
        
        res.json({
          success: true,
          message: 'Your custom page has been set as the landing page on your domain',
          landingPageId: landingPageId,
          domainPath: whiteLabel.domainPath,
          domainUrl: `${req.protocol}://${req.get('host')}/${whiteLabel.domainPath}`,
          elementsPopulated: false
        });
      } else {
        // Regular user - they need to set up domain first
        return res.status(404).json({ error: 'No domain found. Please set up your domain first in Custom Domains.' });
      }
    } catch (error) {
      console.error('Error setting page:', error);
      res.status(500).json({ error: 'Failed to set page' });
    }
  });

  // Payment intent endpoint
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      console.log('Creating payment intent with body:', req.body);
      
      // Validate required fields
      const { amount } = req.body;
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ 
          error: 'Invalid amount provided',
          details: 'Amount must be a positive number'
        });
      }

      // Validate amount range (prevent extremely large amounts)
      const numericAmount = parseFloat(amount);
      if (numericAmount > 999999) {
        return res.status(400).json({ 
          error: 'Amount too large',
          details: 'Maximum amount is $999,999'
        });
      }

      // Ensure session exists
      if (!req.session) {
        return res.status(500).json({ 
          error: 'Session not available',
          details: 'Please refresh the page and try again'
        });
      }

      const returnUrl = req.headers.referer || `${req.protocol}://${req.get('host')}/pricing`;
      
      // Extract domain path from URL parameters if present
      let domainPath = null;
      try {
        const urlParams = new URLSearchParams(returnUrl.split('?')[1] || '');
        domainPath = urlParams.get('domain');
      } catch (urlError) {
        console.warn('Error parsing return URL parameters:', urlError);
      }
      
      console.log('Storing return URL in session:', returnUrl);
      req.session.returnUrl = returnUrl;
      
      // Store domain context for authentication
      if (domainPath && domainPath.trim()) {
        req.session.endUserDomainPath = domainPath.trim();
        console.log('Storing domain path for end-user context:', domainPath);
        
        // Find the white-label client associated with this domain with retry logic
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath.trim());
            if (whiteLabel) {
              req.session.whiteLabelId = whiteLabel.id;
              console.log('Storing white-label ID for context:', whiteLabel.id);
            }
            break;
          } catch (error) {
            retryCount++;
            console.error(`Error finding white-label for domain (attempt ${retryCount}):`, error);
            
            if (retryCount >= maxRetries) {
              console.error('Max retries reached for white-label lookup');
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }
      }
      
      const intentData = {
        amount: Math.round(numericAmount * 100), // Convert to cents and ensure integer
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      };
      
      // Generate a more secure mock client secret
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const clientSecret = `mock_client_secret_${timestamp}_${randomSuffix}`;
      
      res.json({ 
        clientSecret,
        amount: intentData.amount,
        currency: intentData.currency
      });
      
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Internal server error';
      let statusCode = 500;
      
      if (error.name === 'ValidationError') {
        errorMessage = 'Invalid payment data provided';
        statusCode = 400;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        errorMessage = 'Database connection error';
        statusCode = 503;
      }
      
      res.status(statusCode).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Process payment endpoint
  app.post('/api/process-payment', isAuthenticated, async (req, res) => {
    try {
      console.log('Processing payment with body:', req.body);
      
      // Validate required fields
      const { planId, amount, paymentToken, referralCode, ...formData } = req.body;
      const user = req.user;
      
      if (!planId || !amount || !paymentToken) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: 'planId, amount, and paymentToken are required'
        });
      }

      // Validate planId format
      const numericPlanId = parseInt(planId);
      if (isNaN(numericPlanId) || numericPlanId <= 0) {
        return res.status(400).json({ 
          error: 'Invalid plan ID',
          details: 'Plan ID must be a positive number'
        });
      }

      // Validate amount
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ 
          error: 'Invalid amount',
          details: 'Amount must be a positive number'
        });
      }

      // Validate amount range
      if (numericAmount > 999999) {
        return res.status(400).json({ 
          error: 'Amount too large',
          details: 'Maximum amount is $999,999'
        });
      }

      // Validate user authentication
      if (!user || !user.id) {
        return res.status(401).json({ 
          error: 'User not authenticated',
          details: 'Please log in and try again'
        });
      }
      
      console.log('Processing payment for plan:', numericPlanId, 'amount:', numericAmount, 'user:', user.id);
      console.log('Referral code:', referralCode);
      
      // Get the plan details with retry logic
      let plan = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          plan = await storage.getPlan(numericPlanId);
          break;
        } catch (error) {
          retryCount++;
          console.error(`Error fetching plan (attempt ${retryCount}):`, error);
          
          if (retryCount >= maxRetries) {
            return res.status(503).json({ 
              error: 'Database connection error',
              details: 'Unable to fetch plan details. Please try again later.'
            });
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      if (!plan) {
        return res.status(404).json({ 
          error: 'Plan not found',
          details: 'The selected plan does not exist or has been removed'
        });
      }
      
      // Validate payment token (in production, you'd validate with actual payment processor)
      if (!paymentToken || typeof paymentToken !== 'string' || !paymentToken.startsWith('mock_client_secret_')) {
        return res.status(400).json({ 
          error: 'Invalid payment token',
          details: 'Payment token is invalid or expired'
        });
      }
      
      // Get white label context from session with enhanced error handling
      let whiteLabelId = req.session?.whiteLabelId;
      
      // FIXED: Handle both main site and white-label purchases
      if (!whiteLabelId) {
        try {
          const userWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
          if (userWhiteLabel) {
            whiteLabelId = userWhiteLabel.id;
            console.log('Found existing white-label record:', whiteLabelId);
          }
        } catch (error) {
          console.error('Error fetching user white-label:', error);
          // Continue without failing - we'll handle this below
        }
      }
      
      // Check if this is a main site plan (isMainSitePlan = true)
      const isMainSitePurchase = plan.isMainSitePlan;
      console.log('Purchase type - isMainSitePlan:', isMainSitePurchase, 'hasWhiteLabelId:', !!whiteLabelId);
      
      // For main site purchases, create a white-label record if needed
      if (isMainSitePurchase && !whiteLabelId) {
        console.log('Main site purchase - creating white-label record for user:', user.id);
        try {
          // Generate a unique domain path to avoid conflicts
          let domainPath = user.username || `user-${user.id}`;
          
          // Sanitize domain path
          domainPath = domainPath.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          
          // Validate domain path length
          if (domainPath.length < 3) {
            domainPath = `user-${user.id}`;
          }
          if (domainPath.length > 50) {
            domainPath = domainPath.substring(0, 50);
          }
          
          // Check if domain path is already taken and make it unique
          let attempts = 0;
          let finalDomainPath = domainPath;
          
          while (attempts < 10) {
            try {
              const existingDomain = await storage.getWhiteLabelByDomainPath(finalDomainPath);
              if (!existingDomain) {
                break; // Domain path is available
              }
              
              attempts++;
              finalDomainPath = `${domainPath}-${Date.now()}-${attempts}`;
              console.log(`Domain path conflict resolved, trying: ${finalDomainPath}`);
            } catch (error) {
              // If error checking domain, assume it's available
              console.warn('Error checking domain availability:', error);
              break;
            }
          }
          
          if (attempts >= 10) {
            return res.status(500).json({ 
              error: 'Unable to generate unique domain',
              details: 'Please try again or contact support'
            });
          }
          
          const businessName = user.company || `${user.firstName || user.username || 'User'}'s Business`;
          
          const newWhiteLabel = await storage.createWhiteLabel({
            userId: user.id,
            businessName: businessName.substring(0, 100), // Limit length
            domainPath: finalDomainPath,
            planId: plan.id,
            isActive: true
          });
          
          whiteLabelId = newWhiteLabel.id;
          console.log('Created new white-label record:', whiteLabelId);
        } catch (error) {
          console.error('Error creating white-label record:', error);
          return res.status(500).json({ 
            error: 'Unable to create business account for purchase',
            details: 'Please try again or contact support'
          });
        }
      }
      
      // Final validation - now we should have a whiteLabelId
      if (!whiteLabelId) {
        return res.status(400).json({ 
          error: 'Unable to process payment: Business account setup required',
          details: 'Please ensure you have a valid business account'
        });
      }
      
      // Cancel any existing active subscriptions for this user to prevent duplicates
      try {
        await storage.cancelExistingSubscriptionsByUserId(user.id);
        console.log('Cancelled existing subscriptions for user:', user.id);
      } catch (error) {
        console.error('Error cancelling existing subscriptions:', error);
        // Continue - don't fail the transaction for this
      }
      
      // Create subscription with retry logic and transaction safety
      let subscription = null;
      retryCount = 0;
      
      while (retryCount < maxRetries) {
        try {
          subscription = await storage.createSubscription({
            userId: user.id,
            planId: numericPlanId,
            whiteLabelId: whiteLabelId,
            status: 'active',
            billingCycle: 'monthly',
            amount: numericAmount,
            referralCode: referralCode || null,
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            cancelAtPeriodEnd: false,
            stripeSubscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock Stripe subscription ID
            stripeCustomerId: `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock Stripe customer ID
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          break;
        } catch (error) {
          retryCount++;
          console.error(`Error creating subscription (attempt ${retryCount}):`, error);
          
          if (retryCount >= maxRetries) {
            return res.status(500).json({ 
              error: 'Payment processing failed',
              details: 'Unable to create subscription. Please contact support.'
            });
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      if (!subscription) {
        return res.status(500).json({ 
          error: 'Payment processing failed',
          details: 'Unable to create subscription. Please contact support.'
        });
      }
      
      // Create purchase history record with retry logic
      retryCount = 0;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`[PURCHASE HISTORY] Attempt ${retryCount + 1}/${maxRetries} - Creating purchase history for user ${user.id}, plan ${numericPlanId}, amount $${numericAmount}`);
          
          // Generate a unique transaction ID
          const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${user.id.substr(-4)}`;
          
          const purchaseHistoryData = {
            userId: user.id,
            planId: numericPlanId,
            whiteLabelId: whiteLabelId,
            amount: numericAmount,
            transactionId: transactionId, // Add transaction ID
            status: 'completed',
            paymentMethod: 'credit_card',
            metadata: {
              referralCode: referralCode || null,
              planName: plan.name,
              source: 'process_payment',
              paymentToken: paymentToken, // Store payment token reference
              transactionId: transactionId // Also store in metadata for reference
            }
          };
          
          console.log('[PURCHASE HISTORY] Data to insert:', JSON.stringify(purchaseHistoryData, null, 2));
          
          const result = await storage.createPurchaseHistory(purchaseHistoryData);
          
          console.log(`[PURCHASE HISTORY] ✅ Successfully created purchase history record:`, result);
          break;
        } catch (error) {
          retryCount++;
          console.error(`[PURCHASE HISTORY] ❌ Error creating purchase history (attempt ${retryCount}/${maxRetries}):`, {
            error: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            stack: error.stack,
            userId: user.id,
            planId: numericPlanId,
            whiteLabelId: whiteLabelId,
            amount: numericAmount
          });
          
          if (retryCount >= maxRetries) {
            console.error(`[PURCHASE HISTORY] 🚨 CRITICAL: Failed to create purchase history after ${maxRetries} retries for user ${user.id}, plan ${numericPlanId}, amount $${numericAmount}`);
            console.error('[PURCHASE HISTORY] This will result in a subscription without purchase history!');
            
            // Log to a separate error file or monitoring system
            console.error('[PURCHASE HISTORY] ORPHANED SUBSCRIPTION ALERT:', {
              subscriptionId: subscription?.id,
              userId: user.id,
              planId: numericPlanId,
              whiteLabelId: whiteLabelId,
              amount: numericAmount,
              timestamp: new Date().toISOString(),
              finalError: error.message
            });
            
            // Don't fail the whole transaction for purchase history
          } else {
            console.log(`[PURCHASE HISTORY] Waiting ${1000 * retryCount}ms before retry...`);
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      }
      
      // Process referral commission if referral code was provided
      if (referralCode && typeof referralCode === 'string' && referralCode.trim() !== '') {
        try {
          const sanitizedReferralCode = referralCode.trim().substring(0, 50); // Limit length
          
          // Find the affiliate (Super Admin or White Label) who owns this referral code
          const affiliate = await storage.getUserByReferralCode(sanitizedReferralCode);
          
          if (affiliate && (affiliate.role === 'super_admin_affiliate' || affiliate.role === 'white_label_affiliate')) {
            // Calculate commission (using plan's affiliate commission percentage)
            const commissionPercentage = parseFloat(plan.affiliateCommissionPercentage || '0'); // Default 0% if not set
            
            // Validate commission percentage
            if (commissionPercentage >= 0 && commissionPercentage <= 100) {
              const commissionAmount = (numericAmount * commissionPercentage / 100).toFixed(2);
              
              // Create referral commission record
              await storage.createReferralCommission({
                affiliateId: affiliate.id,
                subscriptionId: subscription.id,
                planId: plan.id,
                referralCode: sanitizedReferralCode,
                purchaserUserId: user.id,
                commissionAmount,
                commissionPercentage: commissionPercentage.toString(),
                planAmount: numericAmount.toString(),
              });
              
              console.log('Referral commission created:', {
                affiliateId: affiliate.id,
                affiliateEmail: affiliate.email,
                affiliateRole: affiliate.role,
                commissionAmount,
                commissionPercentage,
                planAmount: numericAmount
              });
            } else {
              console.warn('Invalid commission percentage:', commissionPercentage);
            }
          } else {
            console.log('Invalid referral code or affiliate not found:', sanitizedReferralCode);
          }
        } catch (error) {
          console.error('Error processing referral commission:', error);
          // Don't fail the whole transaction for referral commission errors
        }
      }
      
      // Track activity for white-label analytics
      if (whiteLabelId) {
        try {
          await storage.trackEndUserActivity({
            userId: user.id,
            whiteLabelId: whiteLabelId,
            activityType: 'purchase',
            metadata: {
              planId: numericPlanId,
              planName: plan.name,
              amount: numericAmount
            }
          });
        } catch (error) {
          console.error('Error tracking purchase activity:', error);
          // Don't fail the transaction for tracking errors
        }
      }

      // Handle automatic affiliate referral tracking for purchases through affiliate domains
      const refererUrl = req.get('Referer') || '';
      console.log('Processing payment - Referer URL:', refererUrl);
      
      // Check if this purchase was made through an affiliate landing page
      if (refererUrl && refererUrl.includes('/affiliate')) {
        try {
          // Extract domain and affiliate identifier from referer URL
          const affiliateDomainMatch = refererUrl.match(/\/([^\/]+)\/affiliate/);
          if (affiliateDomainMatch) {
            const domainPath = affiliateDomainMatch[1];
            console.log('Detected affiliate purchase through domain:', domainPath);
            
            // Get the white-label client for this domain
            const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
            if (whiteLabel) {
              // Check if there's a specific affiliate logged into this domain
              // Look for any domain session that might indicate which affiliate is active
              const domainSessions = await storage.getActiveDomainSessions(domainPath, whiteLabel.id);
              
              console.log('Active domain sessions for', domainPath, ':', domainSessions);
              
              // Find an affiliate from the active sessions (someone who's currently logged into the affiliate dashboard)
              const affiliateSession = domainSessions.find(session => 
                session.userRole === 'end_user' && session.userId !== user.id
              );
              
              if (affiliateSession) {
                console.log('Found affiliate session for tracking:', affiliateSession.userId, affiliateSession.userEmail);
                
                // Create referral tracking record
                await storage.createReferralTracking({
                  affiliateId: affiliateSession.userId,
                  referredUserId: user.id,
                  whiteLabelId: whiteLabel.id,
                  domainPath: domainPath,
                  referralSource: 'affiliate_landing_page'
                });
                
                console.log('Affiliate referral tracking created successfully for affiliate:', affiliateSession.userEmail);
              } else {
                console.log('No active affiliate session found for domain:', domainPath);
              }
            }
          }
        } catch (error) {
          console.error('Error creating affiliate referral tracking:', error);
          // Don't fail the whole transaction for referral tracking errors
        }
      }
      
      // Send purchase confirmation and plan owner notification emails asynchronously
      setImmediate(async () => {
        try {
          const purchaserName = user.firstName || user.username || 'User';
          const planCost = numericAmount.toString();
          const purchaseDate = new Date();
          
          // Import email functions
          const { sendPurchaseConfirmationEmail, sendPlanOwnerNotificationEmail } = await import('./emailService');
          
          // Send purchase confirmation email to the purchaser
          if (user.email && user.email.includes('@')) {
            const confirmationSent = await sendPurchaseConfirmationEmail(
              user.email,
              purchaserName,
              plan.name,
              planCost,
              purchaseDate
            );
            
            if (confirmationSent) {
              console.log(`PURCHASE CONFIRMATION SENT - Email sent to ${user.email} for plan ${plan.name}`);
            } else {
              console.warn(`PURCHASE CONFIRMATION FAILED - Could not send email to ${user.email}`);
            }
          }
          
          // Send notification email to the plan owner (if different from purchaser)
          if (plan.createdBy && plan.createdBy !== user.id) {
            try {
              const planOwner = await storage.getUserById(plan.createdBy);
              if (planOwner && planOwner.email && planOwner.email.includes('@')) {
                const ownerName = planOwner.firstName || planOwner.username || 'Plan Owner';
                
                const ownerNotificationSent = await sendPlanOwnerNotificationEmail(
                  planOwner.email,
                  ownerName,
                  purchaserName,
                  plan.name,
                  planCost,
                  purchaseDate
                );
                
                if (ownerNotificationSent) {
                  console.log(`PLAN OWNER NOTIFICATION SENT - Email sent to ${planOwner.email} for sale of ${plan.name}`);
                } else {
                  console.warn(`PLAN OWNER NOTIFICATION FAILED - Could not send email to ${planOwner.email}`);
                }
              }
            } catch (ownerError) {
              console.error('Error sending plan owner notification:', ownerError);
            }
          }
          
        } catch (emailError) {
          console.error('Error sending purchase emails:', emailError);
          // Don't fail the payment for email errors
        }
      });

      res.json({
        success: true,
        message: 'Payment processed successfully',
        subscriptionId: subscription.id,
        userId: user.id,
        whiteLabelId: whiteLabelId,
        planId: numericPlanId,
        amount: numericAmount
      });
      
    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Payment processing failed. Please try again.';
      let statusCode = 500;
      
      if (error.name === 'ValidationError') {
        errorMessage = 'Invalid payment data provided';
        statusCode = 400;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        errorMessage = 'Database connection error. Please try again later.';
        statusCode = 503;
      } else if (error.message && error.message.includes('duplicate')) {
        errorMessage = 'Duplicate payment detected. Please check your account.';
        statusCode = 409;
      }
      
      res.status(statusCode).json({ 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // NMI Payment Processing Endpoint
  app.post('/api/confirm-nmi-payment', isAuthenticated, async (req, res) => {
    try {
      console.log('=== NMI PAYMENT CONFIRMATION DEBUG ===');
      console.log('Request headers:', JSON.stringify(req.headers, null, 2));
      console.log('Request body received:', JSON.stringify(req.body, null, 2));
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', Object.keys(req.body || {}));
      
      // Get authenticated user
      const authenticatedUser = req.user;
      console.log('Authenticated user:', authenticatedUser ? {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        role: authenticatedUser.role
      } : 'NOT AUTHENTICATED');
      
      const { 
        planId, 
        amount, 
        cardNumber, 
        expirationDate, 
        cvv, 
        firstName, 
        lastName, 
        email, 
        referralCode 
      } = req.body;
      
      console.log('Extracted fields:');
      console.log('- planId:', planId, typeof planId);
      console.log('- amount:', amount, typeof amount);
      console.log('- cardNumber:', cardNumber ? '[REDACTED]' : 'MISSING');
      console.log('- expirationDate:', expirationDate ? '[REDACTED]' : 'MISSING');
      console.log('- cvv:', cvv ? '[REDACTED]' : 'MISSING');
      console.log('- firstName:', firstName);
      console.log('- lastName:', lastName);
      console.log('- email:', email);
      console.log('- referralCode:', referralCode);
      
      // Validate required fields
      const missingFields = [];
      if (!planId) missingFields.push('planId');
      if (!amount) missingFields.push('amount');
      if (!cardNumber) missingFields.push('cardNumber');
      if (!expirationDate) missingFields.push('expirationDate');
      if (!cvv) missingFields.push('cvv');
      if (!firstName) missingFields.push('firstName');
      if (!lastName) missingFields.push('lastName');
      if (!email) missingFields.push('email');
      
      if (missingFields.length > 0) {
        console.log('❌ VALIDATION FAILED - Missing fields:', missingFields);
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields',
          details: `Missing fields: ${missingFields.join(', ')}. All fields (planId, amount, cardNumber, expirationDate, cvv, firstName, lastName, email) are required`,
          missingFields: missingFields
        });
      }
      
      console.log('✅ All required fields present, proceeding with payment...');

      // Get plan details
      const plan = await storage.getPlan(parseInt(planId));
      if (!plan) {
        return res.status(404).json({ 
          success: false,
          error: 'Plan not found',
          details: 'The selected plan does not exist'
        });
      }

      // Get plan owner's NMI credentials
      const planOwner = await storage.getUserById(plan.createdBy);
      if (!planOwner) {
        console.error('❌ PAYMENT ERROR: Plan owner not found', {
          planId,
          createdBy: plan.createdBy,
          timestamp: new Date().toISOString()
        });
        return res.status(404).json({ 
          success: false,
          error: 'Plan owner not found',
          details: 'Unable to process payment - plan owner not found'
        });
      }

      console.log('✅ Plan owner found:', {
        planId,
        ownerId: planOwner.id,
        ownerEmail: planOwner.email,
        timestamp: new Date().toISOString()
      });

      // Get NMI credentials for the plan owner
      const nmiCredentials = await storage.getNmiCredentials(planOwner.id);
      if (!nmiCredentials) {
        console.error('❌ NMI CREDENTIALS ERROR: No credentials found for plan owner', {
          planId,
          planOwnerId: planOwner.id,
          timestamp: new Date().toISOString()
        });
        return res.status(400).json({ 
          success: false,
          error: 'Payment gateway not configured',
          details: 'The plan owner has not configured their NMI payment gateway credentials'
        });
      }

      if (!nmiCredentials.isActive) {
        console.error('❌ NMI CREDENTIALS ERROR: Credentials are inactive', {
          planId,
          planOwnerId: planOwner.id,
          credentialsId: nmiCredentials.id,
          timestamp: new Date().toISOString()
        });
        return res.status(400).json({ 
          success: false,
          error: 'Payment gateway inactive',
          details: 'The payment gateway credentials are currently inactive'
        });
      }

      console.log('✅ NMI credentials found and active:', {
        planId,
        planOwnerId: planOwner.id,
        credentialsId: nmiCredentials.id,
        username: nmiCredentials.username,
        isTestMode: nmiCredentials.isTestMode,
        timestamp: new Date().toISOString()
      });

      // Process payment through NMI Gateway
      const { NmiPaymentProcessor } = await import('./nmi-payment');
      const nmiProcessor = new NmiPaymentProcessor({
        username: nmiCredentials.username,
        password: nmiCredentials.password,
        securityKey: nmiCredentials.securityKey,
        gatewayUrl: nmiCredentials.gatewayUrl,
        isTestMode: nmiCredentials.isTestMode
      });

      const orderId = `order_${Date.now()}_${planId}`;
      
      console.log('💳 Processing NMI payment:', {
        planId,
        orderId,
        amount: parseFloat(amount),
        customerEmail: email,
        isTestMode: nmiCredentials.isTestMode,
        timestamp: new Date().toISOString()
      });

      const nmiResult = await nmiProcessor.processPayment({
        orderId: orderId,
        amount: parseFloat(amount),
        cardNumber: cardNumber,
        expirationDate: expirationDate,
        cvv: cvv,
        firstName: firstName,
        lastName: lastName,
        email: email
      });

      console.log('💳 NMI Payment Result:', {
        success: nmiResult.success,
        transactionId: nmiResult.transactionId,
        authCode: nmiResult.authCode,
        message: nmiResult.message,
        error: nmiResult.error,
        timestamp: new Date().toISOString()
      });

      if (!nmiResult.success) {
        console.error('❌ NMI PAYMENT FAILED:', {
          planId,
          orderId,
          error: nmiResult.error,
          timestamp: new Date().toISOString()
        });
        return res.status(400).json({ 
          success: false,
          error: 'Payment processing failed',
          details: nmiResult.error || 'Payment was declined by the payment gateway'
        });
      }

      // Use authenticated user instead of creating new user from form data
      let userId = authenticatedUser.id;
      let user = authenticatedUser;
      
      // Get full user details including whiteLabelId
      const fullUser = await storage.getUserById(userId);
      const buyerWhiteLabelId = fullUser?.whiteLabelId || null;
      
      // Validate that buyer has a white label ID
      if (buyerWhiteLabelId === null) {
        console.error('❌ Buyer missing whiteLabelId:', {
          userId,
          email: user.email,
          role: user.role,
          timestamp: new Date().toISOString()
        });
        return res.status(400).json({ 
          success: false,
          error: 'Invalid account configuration',
          details: 'Your account is not properly configured for purchases. Please contact support.'
        });
      }
      
      console.log('✅ Using authenticated user for purchase:', {
        userId: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        whiteLabelId: buyerWhiteLabelId,
        timestamp: new Date().toISOString()
      });

      // Create subscription record
      const subscription = await storage.createSubscription({
        userId: userId,
        planId: parseInt(planId),
        whiteLabelId: buyerWhiteLabelId,
        status: 'active',
        billingCycle: 'monthly',
        amount: parseFloat(amount),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: nmiResult.transactionId,
        stripeCustomerId: `bypass_${nmiResult.transactionId}`,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Create purchase history record
      await storage.createPurchaseHistory({
        userId: userId,
        planId: parseInt(planId),
        whiteLabelId: buyerWhiteLabelId,
        amount: parseFloat(amount),
        transactionId: nmiResult.transactionId,
        status: 'completed',
        paymentMethod: 'NMI Credit Card',
        metadata: {
          planName: plan.name,
          nmiTransactionId: nmiResult.transactionId,
          nmiAuthCode: nmiResult.authCode,
          planOwnerId: plan.createdBy,
          customerEmail: user.email,
          customerName: `${user.firstName} ${user.lastName}`,
          referralCode: referralCode || null,
          paymentMethod: 'NMI Credit Card',
          orderId: orderId
        }
      });

      // Process referral commission if referral code was provided
      if (referralCode && typeof referralCode === 'string' && referralCode.trim() !== '') {
        try {
          const sanitizedReferralCode = referralCode.trim().substring(0, 50); // Limit length
          
          console.log('🎯 Processing referral commission for code:', sanitizedReferralCode);
          
          // Find the affiliate (Super Admin or White Label) who owns this referral code
          const affiliate = await storage.getUserByReferralCode(sanitizedReferralCode);
          
          if (affiliate && (affiliate.role === 'super_admin_affiliate' || affiliate.role === 'white_label_affiliate')) {
            // Calculate commission (using plan's affiliate commission percentage)
            const commissionPercentage = parseFloat(plan.affiliateCommissionPercentage || '0'); // Default 0% if not set
            
            console.log('💰 Commission calculation:', {
              affiliateId: affiliate.id,
              affiliateEmail: affiliate.email,
              affiliateRole: affiliate.role,
              commissionPercentage,
              planAmount: parseFloat(amount)
            });
            
            // Validate commission percentage
            if (commissionPercentage >= 0 && commissionPercentage <= 100) {
              const commissionAmount = (parseFloat(amount) * commissionPercentage / 100).toFixed(2);
              
              // Create referral commission record
              await storage.createReferralCommission({
                affiliateId: affiliate.id,
                subscriptionId: subscription.id,
                planId: plan.id,
                referralCode: sanitizedReferralCode,
                purchaserUserId: userId,
                commissionAmount,
                commissionPercentage: commissionPercentage.toString(),
                planAmount: parseFloat(amount).toString(),
              });
              
              console.log('✅ Referral commission created successfully:', {
                affiliateId: affiliate.id,
                affiliateEmail: affiliate.email,
                affiliateRole: affiliate.role,
                commissionAmount,
                commissionPercentage,
                planAmount: parseFloat(amount),
                subscriptionId: subscription.id
              });
            } else {
              console.warn('❌ Invalid commission percentage:', commissionPercentage);
            }
          } else {
            console.log('❌ Invalid referral code or affiliate not found:', sanitizedReferralCode);
          }
        } catch (error) {
          console.error('❌ Error processing referral commission:', error);
          // Don't fail the whole transaction for referral commission errors
        }
      }

      console.log('✅ PURCHASE COMPLETED WITH NMI - Payment processed successfully:', nmiResult.transactionId);

      res.json({
        success: true,
        message: 'Purchase completed successfully',
        transactionId: nmiResult.transactionId,
        subscriptionId: subscription.id,
        planName: plan.name,
        amount: amount,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        userId: userId
      });

    } catch (error) {
      console.error('NMI payment processing error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Payment processing failed',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  });

  // NMI Credentials Management Endpoints
  app.post('/api/nmi-credentials', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { username, password, securityKey, gatewayUrl, isTestMode } = req.body;

      if (!username || !password || !securityKey) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: 'Username, password, and security key are required'
        });
      }

      // TODO: Encrypt sensitive data before storing
      const credentials = await storage.createNmiCredentials({
        userId: user.id,
        username,
        password, // Should be encrypted
        securityKey, // Should be encrypted
        gatewayUrl: gatewayUrl || 'https://secure.networkmerchants.com/api/transact.php',
        isTestMode: isTestMode || false,
        isActive: true
      });

      res.json({
        success: true,
        message: 'NMI credentials saved successfully',
        credentialsId: credentials.id
      });

    } catch (error) {
      console.error('Error saving NMI credentials:', error);
      res.status(500).json({ 
        error: 'Failed to save credentials',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  });

  app.get('/api/nmi-credentials', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const credentials = await storage.getNmiCredentials(user.id);

      if (!credentials) {
        return res.json({
          hasCredentials: false,
          message: 'No NMI credentials configured'
        });
      }

      // Return credentials without sensitive data
      res.json({
        hasCredentials: true,
        credentials: {
          id: credentials.id,
          username: credentials.username,
          gatewayUrl: credentials.gatewayUrl,
          isTestMode: credentials.isTestMode,
          isActive: credentials.isActive,
          lastTestedAt: credentials.lastTestedAt,
          testStatus: credentials.testStatus
        }
      });

    } catch (error) {
      console.error('Error fetching NMI credentials:', error);
      res.status(500).json({ 
        error: 'Failed to fetch credentials',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  });

  // Dashboard statistics endpoint - with proper white-label data isolation
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      console.log('ANALYTICS DEBUG - User:', user.id, 'Role:', user.role);
      console.log('ANALYTICS DEBUG - Session impersonation:', req.session?.isImpersonating, 'Impersonated ID:', req.session?.impersonatedUserId);
      
      // Check if we're in impersonation mode - this takes priority
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser && impersonatedUser.role === 'white_label_client') {
          console.log('ANALYTICS DEBUG - Using impersonated user data for:', impersonatedUser.id);
          const whiteLabel = await storage.getWhiteLabelByUserId(impersonatedUser.id);
          
          if (whiteLabel) {
            const totalUsers = await storage.getUserCountForWhiteLabel(whiteLabel.id);
            const totalPurchases = await storage.getTotalPurchasesForWhiteLabel(whiteLabel.id);
            const purchasedUsers = await storage.getPurchasedUsersCountForWhiteLabel(whiteLabel.id);
            const loginCount = await storage.getLoginCountForWhiteLabel(whiteLabel.id);
            const totalRevenue = await storage.getTotalRevenueForWhiteLabel(whiteLabel.id);
            
            console.log('ANALYTICS DEBUG - Impersonated white-label stats:', { totalUsers, totalPurchases, purchasedUsers, loginCount, totalRevenue });
            
            return res.json({
              totalSignups: totalUsers.toString(),
              totalLogins: loginCount.toString(),
              totalPurchases: totalPurchases.toString(),
              totalRevenue: totalRevenue.toString(),
              activeUsers: purchasedUsers.toString(),
              recentSignups: '0'
            });
          }
        }
      }
      
      // For white-label clients, get stats for their domain ONLY
      if (user.role === 'white_label_client') {
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        console.log('ANALYTICS DEBUG - WhiteLabel found:', whiteLabel ? whiteLabel.id : 'NONE');
        
        if (whiteLabel) {
          // Get domain-specific stats for this white-label client ONLY
          const totalUsers = await storage.getUserCountForWhiteLabel(whiteLabel.id);
          const totalPurchases = await storage.getTotalPurchasesForWhiteLabel(whiteLabel.id);
          const purchasedUsers = await storage.getPurchasedUsersCountForWhiteLabel(whiteLabel.id);
          const loginCount = await storage.getLoginCountForWhiteLabel(whiteLabel.id);
          const totalRevenue = await storage.getTotalRevenueForWhiteLabel(whiteLabel.id);
          
          console.log('ANALYTICS DEBUG - White-label stats:', { totalUsers, totalPurchases, purchasedUsers, loginCount, totalRevenue });
          
          return res.json({
            totalSignups: totalUsers.toString(),
            totalLogins: loginCount.toString(),
            totalPurchases: totalPurchases.toString(),
            totalRevenue: totalRevenue.toString(),
            activeUsers: purchasedUsers.toString(),
            recentSignups: '0'
          });
        } else {
          // New white-label client with no record yet - return zeros
          console.log('ANALYTICS DEBUG - New white-label client, returning zeros');
          return res.json({
            totalSignups: '0',
            totalLogins: '0', 
            totalPurchases: '0',
            totalRevenue: '0',
            activeUsers: '0',
            recentSignups: '0'
          });
        }
      }
      
      // For super admin and others, get overall system stats
      const totalUsers = await storage.getUserCount();
      const totalPurchases = await storage.getTotalPurchases();
      const activeUsers = await storage.getActiveUserCount();
      const loginCount = await storage.getLoginCount();
      const totalRevenue = await storage.getTotalRevenue();
      
      console.log('ANALYTICS DEBUG - Super admin stats:', { totalUsers, totalPurchases, activeUsers, loginCount, totalRevenue });
      
      res.json({
        totalSignups: totalUsers.toString(),
        totalLogins: loginCount.toString(),
        totalPurchases: totalPurchases.toString(),
        totalRevenue: totalRevenue.toString(),
        activeUsers: activeUsers.toString(),
        recentSignups: '0'
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // End-user statistics - with real data
  app.get('/api/end-users/stats', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      console.log('END-USERS STATS DEBUG - User:', user.id, 'Role:', user.role);
      console.log('END-USERS STATS DEBUG - Session impersonation:', req.session?.isImpersonating, 'Impersonated ID:', req.session?.impersonatedUserId);
      
      // Check if we're in impersonation mode - this takes priority
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser && impersonatedUser.role === 'white_label_client') {
          console.log('END-USERS STATS DEBUG - Using impersonated user data for:', impersonatedUser.id);
          const whiteLabel = await storage.getWhiteLabelByUserId(impersonatedUser.id);
          
          if (whiteLabel) {
            const totalUsers = await storage.getUserCountForWhiteLabel(whiteLabel.id);
            const totalPurchases = await storage.getTotalPurchasesForWhiteLabel(whiteLabel.id);
            const purchasedUsers = await storage.getPurchasedUsersCountForWhiteLabel(whiteLabel.id);
            const loginCount = await storage.getLoginCountForWhiteLabel(whiteLabel.id);
            const totalRevenue = await storage.getTotalRevenueForWhiteLabel(whiteLabel.id);
            
            console.log('END-USERS STATS DEBUG - Impersonated white-label stats:', { totalUsers, totalPurchases, purchasedUsers, loginCount, totalRevenue });
            
            return res.json({
              totalSignups: totalUsers.toString(),
              totalLogins: loginCount.toString(),
              totalPurchases: totalPurchases.toString(),
              totalRevenue: totalRevenue.toString(),
              activeUsers: purchasedUsers.toString(),
              recentSignups: '0'
            });
          }
        }
      }
      
      // For white-label clients, get stats for their domain ONLY
      if (user.role === 'white_label_client') {
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        console.log('ANALYTICS DEBUG - WhiteLabel found:', whiteLabel ? whiteLabel.id : 'NONE');
        
        if (whiteLabel) {
          // Get domain-specific stats for this white-label client ONLY
          const totalUsers = await storage.getUserCountForWhiteLabel(whiteLabel.id);
          const totalPurchases = await storage.getTotalPurchasesForWhiteLabel(whiteLabel.id);
          const purchasedUsers = await storage.getPurchasedUsersCountForWhiteLabel(whiteLabel.id);
          const loginCount = await storage.getLoginCountForWhiteLabel(whiteLabel.id);
          const totalRevenue = await storage.getTotalRevenueForWhiteLabel(whiteLabel.id);
          
          console.log('ANALYTICS DEBUG - White-label stats:', { totalUsers, totalPurchases, purchasedUsers, loginCount, totalRevenue });
          
          return res.json({
            totalSignups: totalUsers.toString(),
            totalLogins: loginCount.toString(),
            totalPurchases: totalPurchases.toString(),
            totalRevenue: totalRevenue.toString(),
            activeUsers: purchasedUsers.toString(),
            recentSignups: '0'
          });
        } else {
          // New white-label client with no record yet - return zeros
          console.log('ANALYTICS DEBUG - New white-label client, returning zeros');
          return res.json({
            totalSignups: '0',
            totalLogins: '0',
            totalPurchases: '0',
            totalRevenue: '0',
            activeUsers: '0',
            recentSignups: '0'
          });
        }
      }
      
      // For super admin and others, get overall system stats
      const totalUsers = await storage.getUserCount();
      const totalPurchases = await storage.getTotalPurchases();
      const activeUsers = await storage.getActiveUserCount();
      const loginCount = await storage.getLoginCount();
      const totalRevenue = await storage.getTotalRevenue();
      
      console.log('ANALYTICS DEBUG - Super admin stats:', { totalUsers, totalPurchases, activeUsers, loginCount, totalRevenue });
      
      res.json({
        totalSignups: totalUsers.toString(),
        totalLogins: loginCount.toString(),
        totalPurchases: totalPurchases.toString(),
        totalRevenue: totalRevenue.toString(),
        activeUsers: activeUsers.toString(),
        recentSignups: '0'
      });
    } catch (error) {
      console.error('Error fetching end-user stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // API endpoints for end-users with domain-specific filtering
  app.get('/api/purchases', async (req, res) => {
    try {
      // Check authentication first
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const user = req.user;
      const domainPath = req.query.domain as string || req.session.endUserDomainPath;
      
      // If this is an end-user and domain context is available, filter by domain
      if (user.role === 'end_user' && domainPath) {
        // Validate domain-specific authentication
        let domainSession = await storage.getDomainUserSession(user.id, domainPath);
        
        // If no domain session, try to create one if user belongs to this domain
        if (!domainSession || !domainSession.isActive) {
          const dbUser = await storage.getUserById(user.id);
          if (dbUser && dbUser.whiteLabelId) {
            const whiteLabel = await storage.getWhiteLabelById(dbUser.whiteLabelId);
            if (whiteLabel && whiteLabel.domainPath === domainPath) {
              // Create domain session for end-user
              await storage.createDomainUserSession(user.id, domainPath, req.sessionID);
              console.log(`Created domain session for purchases endpoint: user ${user.id} on domain ${domainPath}`);
              domainSession = await storage.getDomainUserSession(user.id, domainPath);
            }
          }
        }
        
        if (!domainSession || !domainSession.isActive) {
          return res.status(401).json({ error: 'Not authenticated for this domain' });
        }
        
        const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
        if (whiteLabel) {
          const domainPurchases = await storage.getPurchasesByWhiteLabel(whiteLabel.id);
          // Filter to only show purchases by this specific user on this domain
          const userDomainPurchases = domainPurchases.filter(p => p.userId === user.id);
          return res.json(userDomainPurchases);
        }
      }
      
      // Default behavior for other users
      const purchases = await storage.getPurchasesByUser(user.id);
      res.json(purchases);
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      res.status(500).json({ error: 'Failed to fetch purchases' });
    }
  });

  // Get purchased plans for end-user (filtered by domain)
  app.get('/api/user/plans', async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const domain = req.query.domain as string;
      
      // Prevent browser caching to ensure fresh data after filtering changes
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      if (domain) {
        // Filter plans by domain - only show plans purchased from specific domain
        const plans = await storage.getUserPurchasedPlansByDomain(user.id, domain);
        res.json(plans);
      } else {
        // Fallback to all plans if no domain specified
        const plans = await storage.getUserPurchasedPlans(user.id);
        res.json(plans);
      }
    } catch (error) {
      console.error('Error fetching user plans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });

  // Get plan products
  app.get('/api/plans/:planId/products', async (req, res) => {
    try {
      const { planId } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const products = await storage.getPlanProducts(parseInt(planId));
      res.json(products);
    } catch (error) {
      console.error('Error fetching plan products:', error);
      res.status(500).json({ error: 'Failed to fetch plan products' });
    }
  });

  // Get plan categories
  app.get('/api/plans/:planId/categories', async (req, res) => {
    try {
      const { planId } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const categories = await storage.getPlanCategories(parseInt(planId));
      res.json(categories);
    } catch (error) {
      console.error('Error fetching plan categories:', error);
      res.status(500).json({ error: 'Failed to fetch plan categories' });
    }
  });

  // Get user products based on subscriptions and domain, grouped by plans and categories
  app.get('/api/user-products', async (req, res) => {
    try {
      const { domain } = req.query;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      console.log('Fetching user products for user:', user.id, 'domain:', domain);
      
      // Get user's purchased plans filtered by domain
      const userPlans = domain 
        ? await storage.getUserPurchasedPlansByDomain(user.id, domain as string)
        : await storage.getUserPurchasedPlans(user.id);
      
      console.log('User plans (filtered by domain):', userPlans.length);
      
      if (!userPlans || userPlans.length === 0) {
        console.log('No plans found for user:', user.id, 'on domain:', domain);
        return res.json({ plans: [] });
      }
      
      // Structure to hold plans with their products grouped by categories
      const plansWithProducts = [];
      
      for (const plan of userPlans) {
        try {
          // Get full plan details
          const [planDetails] = await db.select({
            id: plans.id,
            name: plans.name,
            description: plans.description,
            monthlyPrice: plans.monthlyPrice,
            features: plans.features,
            selectedProducts: plans.selectedProducts,
            selectedCategories: plans.selectedCategories
          })
            .from(plans)
            .where(eq(plans.id, plan.id));
          
          if (!planDetails) {
            console.log(`Plan not found: ${plan.id}`);
            continue;
          }
          
          console.log(`Processing plan: ${planDetails.name} (ID: ${planDetails.id})`);
          
          const planData = {
            id: planDetails.id,
            name: planDetails.name,
            description: planDetails.description,
            monthlyPrice: planDetails.monthlyPrice,
            features: planDetails.features,
            categories: []
          };
          
          // Get products for this plan
          if (planDetails.selectedProducts) {
            try {
              const selectedProducts = JSON.parse(planDetails.selectedProducts);
              console.log(`Selected products for plan ${planDetails.id}:`, selectedProducts);
              
              if (Array.isArray(selectedProducts) && selectedProducts.length > 0) {
                const productIds = selectedProducts.map(id => parseInt(id)).filter(id => !isNaN(id));
                
                if (productIds.length > 0) {
                  // Get products with their category information
                  const productResults = await db.select({
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
                    attachments: products.attachments,
                    metadata: products.metadata,
                    isActive: products.isActive,
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                    categoryName: categories.name,
                    categoryDescription: categories.description
                  })
                    .from(products)
                    .leftJoin(categories, eq(products.categoryId, categories.id))
                    .where(and(
                      inArray(products.id, productIds),
                      eq(products.isActive, true)
                    ));
                  
                  console.log(`Products found for plan ${planDetails.id}:`, productResults.length);
                  
                  // Group products by category
                  const categoriesMap = new Map();
                  
                  for (const product of productResults) {
                    const categoryId = product.categoryId || 0; // Use 0 for uncategorized
                    const categoryName = product.categoryName || 'Uncategorized';
                    const categoryDescription = product.categoryDescription || 'Products without a specific category';
                    
                    if (!categoriesMap.has(categoryId)) {
                      categoriesMap.set(categoryId, {
                        id: categoryId,
                        name: categoryName,
                        description: categoryDescription,
                        products: []
                      });
                    }
                    
                    // Add product to category (excluding category fields from product object)
                    const { categoryName: _, categoryDescription: __, ...productData } = product;
                    categoriesMap.get(categoryId).products.push(productData);
                  }
                  
                  // Convert map to array
                  planData.categories = Array.from(categoriesMap.values());
                  
                  // Sort categories by name, with "Uncategorized" last
                  planData.categories.sort((a, b) => {
                    if (a.name === 'Uncategorized') return 1;
                    if (b.name === 'Uncategorized') return -1;
                    return a.name.localeCompare(b.name);
                  });
                }
              }
            } catch (parseError) {
              console.error(`Error parsing selected_products for plan ${planDetails.id}:`, parseError);
            }
          }
          
          plansWithProducts.push(planData);
          
        } catch (error) {
          console.error(`Error fetching products for plan ${plan.id}:`, error);
        }
      }
      
      console.log('Plans with products prepared:', plansWithProducts.length);
      res.json({ plans: plansWithProducts });
      
    } catch (error) {
      console.error('Error fetching user products:', error);
      res.status(500).json({ error: 'Failed to fetch user products' });
    }
  });

  // Comprehensive debugging endpoint for user plan display testing
  app.get('/api/enduserplandisplaytesting', async (req, res) => {
    try {
      const { domain } = req.query;
      const user = req.user;
      const isAuthenticated = req.isAuthenticated();
      
      const debugInfo = {
        timestamp: new Date().toISOString(),
        requestInfo: {
          url: req.url,
          method: req.method,
          userAgent: req.headers['user-agent'],
          sessionId: req.sessionID
        },
        authentication: {
          isAuthenticated: isAuthenticated,
          userId: user?.id || null,
          userEmail: user?.email || null,
          userRole: user?.role || null,
          sessionValid: !!req.sessionID
        },
        subscriptions: [],
        plans: [],
        products: [],
        categories: [],
        errors: []
      };
      
      if (!isAuthenticated || !user) {
        debugInfo.errors.push('User not authenticated');
        return res.status(401).json(debugInfo);
      }
      
      const effectiveUserId = user.id;
      
      try {
        // Query purchase_history table directly for the current user
        const [purchaseRows] = await connection.execute(
          `SELECT ph.*, p.name as plan_name 
           FROM purchase_history ph 
           JOIN plans p ON ph.plan_id = p.id 
           WHERE ph.user_id = ? AND ph.status = 'completed'
           ORDER BY ph.created_at DESC`,
          [effectiveUserId]
        );
        
        if (purchaseRows.length === 0) {
          debugInfo.errors.push('No completed purchases found for user in purchase_history table');
        } else {
          // Extract unique plan names and IDs from purchase history
          const purchasedPlanNames = [...new Set(purchaseRows.map(row => row.plan_name))];
          const purchasedPlanIds = [...new Set(purchaseRows.map(row => row.plan_id))];
          
          // Add purchased plans to debugInfo.plans with simplified structure
          for (const planName of purchasedPlanNames) {
            debugInfo.plans.push({
              name: planName,
              source: 'purchase_history'
            });
          }
          
          // Fetch products associated with purchased plans
          if (purchasedPlanIds.length > 0) {
            try {
              const planIdsPlaceholder = purchasedPlanIds.map(() => '?').join(',');
              const productQuery = `SELECT DISTINCT p.id, p.name, p.description, pp.plan_id
                 FROM products p 
                 JOIN plan_products pp ON p.id = pp.product_id 
                 WHERE pp.plan_id IN (${planIdsPlaceholder})`;
              
              const [productRows] = await connection.execute(productQuery, purchasedPlanIds);
              
              for (const product of productRows) {
                debugInfo.products.push({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  planId: product.plan_id,
                  source: 'plan_products'
                });
              }
            } catch (productError) {
              debugInfo.errors.push(`Error fetching products: ${productError.message}`);
            }
            
            // Fetch categories associated with purchased plans
            try {
              const planIdsPlaceholder = purchasedPlanIds.map(() => '?').join(',');
              const categoryQuery = `SELECT DISTINCT c.id, c.name, c.description, pc.plan_id
                 FROM categories c 
                 JOIN plan_categories pc ON c.id = pc.category_id 
                 WHERE pc.plan_id IN (${planIdsPlaceholder})`;
              
              const [categoryRows] = await connection.execute(categoryQuery, purchasedPlanIds);
              
              for (const category of categoryRows) {
                debugInfo.categories.push({
                  id: category.id,
                  name: category.name,
                  description: category.description,
                  planId: category.plan_id,
                  source: 'plan_categories'
                });
              }
            } catch (categoryError) {
              debugInfo.errors.push(`Error fetching categories: ${categoryError.message}`);
            }
          }
        }
        
        // Additional database checks
        try {
          // Check total users
          const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
          debugInfo.databaseStats = {
            totalUsers: userCount[0].count
          };
          
          // Check total plans
          const [planCount] = await connection.execute('SELECT COUNT(*) as count FROM plans');
          debugInfo.databaseStats.totalPlans = planCount[0].count;
          
          // Check total products
          const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
          debugInfo.databaseStats.totalProducts = productCount[0].count;
          
          // Check total categories
          const [categoryCount] = await connection.execute('SELECT COUNT(*) as count FROM categories');
          debugInfo.databaseStats.totalCategories = categoryCount[0].count;
        } catch (statsError) {
          debugInfo.errors.push(`Error getting database stats: ${statsError.message}`);
        }
        
      } catch (error) {
        const errorMsg = `Error in main debugging logic: ${error.message}`;
        debugInfo.errors.push(errorMsg);
      }
      
      res.json(debugInfo);
      
    } catch (error) {
      res.status(500).json({ 
        error: 'Critical error in debugging endpoint',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Get user categories based on subscriptions and domain
  app.get('/api/user-categories', isAuthenticated, async (req, res) => {
    try {
      const { domain } = req.query;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      console.log('Fetching user categories for user:', user.id, 'domain:', domain);
      
      // Get user's purchased plans filtered by domain
      const userPlans = domain 
        ? await storage.getUserPurchasedPlansByDomain(user.id, domain as string)
        : await storage.getUserPurchasedPlans(user.id);
      
      console.log('User plans (filtered by domain):', userPlans.length);
      
      if (!userPlans || userPlans.length === 0) {
        console.log('No plans found for user:', user.id, 'on domain:', domain);
        return res.json([]);
      }
      
      // Get all categories from user's purchased plans
      const allCategories = [];
      const categoryMap = new Map();
      
      for (const plan of userPlans) {
        try {
          // Get plan categories
          const planCategories = await storage.getPlanCategories(plan.id);
          console.log(`Categories for plan ${plan.id}:`, planCategories.length);
          
          for (const category of planCategories) {
            if (!categoryMap.has(category.id)) {
              // Get products for this category
              const productRows = await db.select({
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
                attachments: products.attachments,
                metadata: products.metadata,
                isActive: products.isActive,
                createdAt: products.createdAt,
                updatedAt: products.updatedAt
              })
                .from(products)
                .where(and(
                  eq(products.categoryId, category.id),
                  eq(products.isActive, true)
                ));
              
              categoryMap.set(category.id, {
                ...category,
                products: productRows || [],
                subcategories: []
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching categories for plan ${plan.id}:`, error);
        }
      }
      
      // Convert map to array and organize hierarchically
      const categories = Array.from(categoryMap.values());
      
      // Organize into parent-child hierarchy
      const rootCategories = [];
      const childCategories = [];
      
      categories.forEach(category => {
        if (category.parentCategoryId) {
          childCategories.push(category);
        } else {
          rootCategories.push(category);
        }
      });
      
      // Add subcategories to their parents
      childCategories.forEach(child => {
        const parent = categories.find(cat => cat.id === child.parentCategoryId);
        if (parent) {
          parent.subcategories.push(child);
        }
      });
      
      console.log('Returning categories:', rootCategories.length);
      res.json(rootCategories);
      
    } catch (error) {
      console.error('Error fetching user categories:', error);
      res.status(500).json({ error: 'Failed to fetch user categories' });
    }
  });

  // Link plan to product (admin/white-label client only)
  app.post('/api/plans/:planId/products/:productId', async (req, res) => {
    try {
      const { planId, productId } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if user can manage this plan
      if (user.role !== 'super_admin' && user.role !== 'white_label_client') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      await storage.linkPlanToProduct(parseInt(planId), parseInt(productId));
      res.json({ success: true });
    } catch (error) {
      console.error('Error linking plan to product:', error);
      res.status(500).json({ error: 'Failed to link plan to product' });
    }
  });

  // Link plan to category (admin/white-label client only)
  app.post('/api/plans/:planId/categories/:categoryId', async (req, res) => {
    try {
      const { planId, categoryId } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if user can manage this plan
      if (user.role !== 'super_admin' && user.role !== 'white_label_client') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      await storage.linkPlanToCategory(parseInt(planId), parseInt(categoryId));
      res.json({ success: true });
    } catch (error) {
      console.error('Error linking plan to category:', error);
      res.status(500).json({ error: 'Failed to link plan to category' });
    }
  });

  app.get('/api/end-users', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - use impersonated user's end users
      let targetUserId = user.id;
      let targetUserRole = user.role;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          targetUserId = impersonatedUser.id;
          targetUserRole = impersonatedUser.role;
          console.log('END-USERS DEBUG - Using impersonated user for end users:', targetUserId, 'Role:', targetUserRole);
        }
      }
      
      // Only white-label clients can see their end-users
      if (targetUserRole === 'white_label_client') {
        const whiteLabel = await storage.getWhiteLabelByUserId(targetUserId);
        if (whiteLabel) {
          const endUsers = await storage.getEndUsersByWhiteLabel(whiteLabel.id);
          console.log('END-USERS DEBUG - Found end users for white-label:', whiteLabel.id, 'Count:', endUsers.length);
          return res.json(endUsers);
        }
      }
      
      // Super admins can see all end-users - this functionality would need getAllUsers method
      if (targetUserRole === 'super_admin') {
        // For now, return empty array since getUsers() method doesn't exist
        // This could be implemented with a new storage method if needed
        return res.json([]);
      }
      
      res.json([]);
    } catch (error) {
      console.error('Error fetching end users:', error);
      res.status(500).json({ error: 'Failed to fetch end users' });
    }
  });

  app.get('/api/end-users/activities', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      console.log('🎯 END-USER ACTIVITIES REQUEST - User ID:', user.id, 'Role:', user.role, 'Email:', user.email);
      
      // Check if we're in impersonation mode - use impersonated user's activities
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('🎭 IMPERSONATION MODE - Using impersonated user ID for activities:', targetUserId);
      }
      
      console.log(`🔍 ACTIVITIES PROCESSING - Target User: ${targetUserId}, Original Role: ${user.role}`);
      
      // ENHANCED LOGIC: Handle users with white-label accounts regardless of current role
      // This fixes the issue where purchasing Super Admin plan causes activities to get stuck
      const whiteLabel = await storage.getWhiteLabelByUserId(targetUserId);
      
      if (whiteLabel) {
        console.log(`🏢 WHITE LABEL FOUND - Business: "${whiteLabel.businessName}", ID: ${whiteLabel.id}, Domain: ${whiteLabel.domainPath}`);
        
        try {
          // Get ONLY domain-specific activities for this white-label client
          const domainActivities = await storage.getEndUserActivitiesByWhiteLabel(whiteLabel.id);
          
          console.log(`📊 DOMAIN ACTIVITIES - Found ${domainActivities.length} activities for white label ${whiteLabel.id}`);
          
          // Format activities with user information
          const formattedActivities = await Promise.all(
            domainActivities.map(async (activity) => {
              const activityUser = await storage.getUser(activity.userId);
              console.log(`  Activity: ${activity.activityType} by user ${activity.userId} - ${activityUser?.email || 'Unknown'}`);
              return {
                id: activity.id,
                userId: activity.userId,
                activityType: activity.activityType,
                description: activity.description,
                createdAt: activity.createdAt,
                whiteLabelId: whiteLabel.id,
                user: activityUser ? {
                  firstName: activityUser.firstName,
                  lastName: activityUser.lastName,
                  email: activityUser.email
                } : null
              };
            })
          );
          
          // Sort by date, take most recent 20
          const sortedActivities = formattedActivities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 20);
            
          console.log(`✅ WHITE LABEL ACTIVITIES RESULT - Returning ${sortedActivities.length} activities for white-label ${whiteLabel.id}`);
          return res.json(sortedActivities);
        } catch (activityError) {
          console.error('💥 WHITE LABEL ACTIVITIES ERROR:', activityError.message);
          console.log('🔄 FALLBACK - Attempting to get general activities instead');
          // Fall through to general activities if white-label activities fail
        }
      } else {
        console.log('❌ NO WHITE LABEL - User does not have a white label business');
      }
      
      // For users without white-label accounts or when white-label query fails
      // Get recent activities from all domains (Super Admin view)
      console.log(`🌐 GENERAL ACTIVITIES - Fetching system-wide activities for user ${user.id}`);
      
      const recentActivities = await storage.getRecentActivities(20);
      console.log(`📋 GENERAL ACTIVITIES FOUND - ${recentActivities.length} recent activities from system`);
      
      // Format for end-user activities display with user information
      const formattedActivities = await Promise.all(
        recentActivities.map(async (activity) => {
          const activityUser = await storage.getUser(activity.userId);
          return {
            id: activity.id,
            userId: activity.userId,
            activityType: activity.type,
            description: activity.description,
            createdAt: activity.createdAt,
            whiteLabelId: null,
            user: activityUser ? {
              firstName: activityUser.firstName,
              lastName: activityUser.lastName,
              email: activityUser.email
            } : null
          };
        })
      );
      
      console.log(`✅ GENERAL ACTIVITIES RESULT - Returning ${formattedActivities.length} general activities`);
      res.json(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // General activities endpoint for recent platform activities
  app.get('/api/activities', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Get recent activities from the system
      const activities = await storage.getRecentActivities(20);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // ===== SUPER ADMIN IMPERSONATION SYSTEM =====
  
  // Impersonate a white-label client
  app.post('/api/admin/impersonate/:userId', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { userId } = req.params;
      
      // Only super admin can impersonate
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Unauthorized - Super Admin access required' });
      }
      
      console.log(`Super Admin ${user.id} attempting to impersonate user ${userId}`);
      
      // Get the target user (white-label client)
      const targetUser = await storage.getUserById(userId);
      if (!targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Only allow impersonating white-label clients
      if (targetUser.role !== 'white_label_client') {
        return res.status(400).json({ error: 'Can only impersonate white-label clients' });
      }
      
      // Store original admin info in session before impersonation
      req.session.originalAdminId = user.id;
      req.session.originalAdminRole = user.role;
      req.session.isImpersonating = true;
      req.session.impersonatedUserId = targetUser.id;
      
      // Update the session to act as the target user
      req.session.userId = targetUser.id;
      req.user = targetUser;
      
      console.log(`Impersonation successful: Admin ${user.id} is now ${targetUser.id} (${targetUser.role})`);
      
      res.json({
        success: true,
        message: 'Impersonation started successfully',
        impersonatedUser: {
          id: targetUser.id,
          email: targetUser.email,
          role: targetUser.role,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName
        },
        originalAdmin: {
          id: user.id,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error starting impersonation:', error);
      res.status(500).json({ error: 'Failed to start impersonation' });
    }
  });
  
  // Stop impersonation and return to original admin
  app.post('/api/admin/stop-impersonation', isAuthenticated, async (req, res) => {
    try {
      // Check if currently impersonating
      if (!req.session.isImpersonating || !req.session.originalAdminId) {
        return res.status(400).json({ error: 'Not currently impersonating' });
      }
      
      console.log(`Stopping impersonation: returning from ${req.session.impersonatedUserId} to ${req.session.originalAdminId}`);
      
      // Get original admin user
      const originalAdmin = await storage.getUserById(req.session.originalAdminId);
      if (!originalAdmin) {
        return res.status(404).json({ error: 'Original admin user not found' });
      }
      
      // Restore original admin session
      req.session.userId = originalAdmin.id;
      req.user = originalAdmin;
      
      // Clear impersonation data
      delete req.session.originalAdminId;
      delete req.session.originalAdminRole;
      delete req.session.isImpersonating;
      delete req.session.impersonatedUserId;
      
      res.json({
        success: true,
        message: 'Impersonation stopped successfully',
        restoredAdmin: {
          id: originalAdmin.id,
          email: originalAdmin.email,
          role: originalAdmin.role
        }
      });
    } catch (error) {
      console.error('Error stopping impersonation:', error);
      res.status(500).json({ error: 'Failed to stop impersonation' });
    }
  });

  // Get white-label clients with updated stats (super admin only)
  app.get('/api/white-labels/stats', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      // Get all white-label clients
      const allClients = await storage.getWhiteLabels();
      const total = allClients.length;
      
      // Count clients who have purchased super admin plans
      let active = 0;
      console.log(`Checking ${allClients.length} white-label clients for Super Admin plan purchases...`);
      
      for (const client of allClients) {
        const purchases = await storage.getPurchasesByUser(client.userId);
        console.log(`\n--- Client: ${client.businessName} (ID: ${client.userId}) ---`);
        console.log(`Purchases found: ${purchases.length}`);
        
        if (purchases.length > 0) {
          purchases.forEach((p, index) => {
            console.log(`  Purchase ${index + 1}: ${p.planName} | isMainSitePlan: ${p.isMainSitePlan} | Status: ${p.status}`);
          });
          
          // Check if any purchase is for a super admin plan (isMainSitePlan = true)
          const hasSuperAdminPlan = purchases.some(purchase => purchase.isMainSitePlan === true);
          if (hasSuperAdminPlan) {
            active++;
            console.log(`  ✅ Client ${client.businessName} HAS Super Admin plan - ACTIVE COUNT: ${active}`);
          } else {
            console.log(`  ❌ Client ${client.businessName} does NOT have Super Admin plan`);
          }
        } else {
          console.log(`  No purchases found for this client`);
        }
      }
      
      // Pending = Total - Active (those who haven't purchased super admin plans)
      const pending = total - active;

      const stats = {
        total,
        active,
        pending
      };
      
      console.log('=== WHITE-LABEL STATS DEBUG ===');
      console.log('Total clients found:', total);
      console.log('Active clients found:', active);
      console.log('Final stats:', stats);
      console.log('===============================');
      res.json(stats);
    } catch (error) {
      console.error('Error fetching white-label stats:', error);
      res.status(500).json({ error: 'Failed to fetch white-label stats' });
    }
  });

  // ===== SUPER ADMIN WHITE-LABEL CLIENT ANALYTICS ENDPOINTS =====
  
  // Get specific white-label client's analytics stats
  app.get('/api/white-labels/:whiteLabelId/analytics/stats', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { whiteLabelId } = req.params;
      
      // Only super admin can access other clients' analytics
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Unauthorized - Super Admin access required' });
      }
      
      console.log(`Super Admin ${user.id} requesting analytics for white-label ${whiteLabelId}`);
      
      // Get the white-label client
      const whiteLabel = await storage.getWhiteLabelById(parseInt(whiteLabelId));
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found' });
      }
      
      // Get analytics stats for this specific white-label client
      const totalUsers = await storage.getUserCountForWhiteLabel(whiteLabel.id);
      const totalPurchases = await storage.getTotalPurchasesForWhiteLabel(whiteLabel.id);
      const purchasedUsers = await storage.getPurchasedUsersCountForWhiteLabel(whiteLabel.id);
      const loginCount = await storage.getLoginCountForWhiteLabel(whiteLabel.id);
      const totalRevenue = await storage.getTotalRevenueForWhiteLabel(whiteLabel.id);
      
      console.log(`Analytics for white-label ${whiteLabelId}:`, { totalUsers, totalPurchases, purchasedUsers, loginCount, totalRevenue });
      
      res.json({
        totalSignups: totalUsers.toString(),
        totalLogins: loginCount.toString(),
        totalPurchases: totalPurchases.toString(),
        totalRevenue: totalRevenue.toString(),
        activeUsers: purchasedUsers.toString(),
        whiteLabelId: whiteLabel.id,
        businessName: whiteLabel.businessName,
        domainPath: whiteLabel.domainPath
      });
    } catch (error) {
      console.error('Error fetching white-label analytics stats:', error);
      res.status(500).json({ error: 'Failed to fetch analytics stats' });
    }
  });

  // Get specific white-label client's end-user activities
  app.get('/api/white-labels/:whiteLabelId/analytics/activities', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { whiteLabelId } = req.params;
      
      // Only super admin can access other clients' analytics
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Unauthorized - Super Admin access required' });
      }
      
      console.log(`Super Admin ${user.id} requesting activities for white-label ${whiteLabelId}`);
      
      // Get the white-label client
      const whiteLabel = await storage.getWhiteLabelById(parseInt(whiteLabelId));
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found' });
      }
      
      // Get activities for this specific white-label client
      const domainActivities = await storage.getEndUserActivitiesByWhiteLabel(whiteLabel.id);
      
      // Format activities with user information
      const formattedActivities = await Promise.all(
        domainActivities.map(async (activity) => {
          const activityUser = await storage.getUser(activity.userId);
          return {
            id: activity.id,
            userId: activity.userId,
            activityType: activity.activityType,
            description: activity.description,
            createdAt: activity.createdAt,
            whiteLabelId: whiteLabel.id,
            user: activityUser ? {
              firstName: activityUser.firstName,
              lastName: activityUser.lastName,
              email: activityUser.email
            } : null
          };
        })
      );
      
      // Sort by date, take most recent 50
      const sortedActivities = formattedActivities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50);
        
      console.log(`Returning ${sortedActivities.length} activities for white-label ${whiteLabelId}`);
      res.json(sortedActivities);
    } catch (error) {
      console.error('Error fetching white-label activities:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // Get specific white-label client's purchase history
  app.get('/api/white-labels/:whiteLabelId/analytics/purchases', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { whiteLabelId } = req.params;
      
      // Only super admin can access other clients' analytics
      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Unauthorized - Super Admin access required' });
      }
      
      console.log(`Super Admin ${user.id} requesting purchases for white-label ${whiteLabelId}`);
      
      // Get the white-label client
      const whiteLabel = await storage.getWhiteLabelById(parseInt(whiteLabelId));
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found' });
      }
      
      // Get purchases for this specific white-label client
      const purchases = await storage.getPurchasesByWhiteLabel(whiteLabel.id);
      
      // Format purchases with plan and user information
      const formattedPurchases = await Promise.all(
        purchases.map(async (purchase) => {
          const purchaseUser = await storage.getUser(purchase.userId);
          const plan = purchase.planId ? await storage.getPlanById(purchase.planId) : null;
          
          return {
            id: purchase.id,
            userId: purchase.userId,
            planId: purchase.planId,
            planName: plan?.name || 'Unknown Plan',
            amount: purchase.amount,
            total: purchase.amount,
            createdAt: purchase.createdAt,
            purchaseDate: purchase.createdAt,
            whiteLabelId: whiteLabel.id,
            customerEmail: purchaseUser?.email || 'Unknown',
            userEmail: purchaseUser?.email || 'Unknown',
            productName: plan?.name || 'Unknown Plan'
          };
        })
      );
      
      // Sort by date, most recent first
      const sortedPurchases = formattedPurchases
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
      console.log(`Returning ${sortedPurchases.length} purchases for white-label ${whiteLabelId}`);
      res.json(sortedPurchases);
    } catch (error) {
      console.error('Error fetching white-label purchases:', error);
      res.status(500).json({ error: 'Failed to fetch purchases' });
    }
  });

  // Referral link generation
  app.post('/api/referral-link', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { customSlug } = req.body;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const link = await storage.createReferralLink({
        userId: user.id,
        customSlug,
        isActive: true
      });

      res.json(link);
    } catch (error) {
      console.error('Error creating referral link:', error);
      res.status(500).json({ error: 'Failed to create referral link' });
    }
  });

  // Remove affiliate login endpoint - users now access both dashboards with same authentication

  // Affiliate signup endpoint
  app.post('/api/affiliate/signup', async (req, res) => {
    try {
      const { name, email, phone, company, reason, password, whiteLabelId } = req.body;
      
      console.log('Affiliate signup request:', { name, email, phone, company, reason, whiteLabelId });
      
      // Validate required fields
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Name, email, phone, and password are required' });
      }
      
      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      
      // Create new user with white_label_affiliate role
      const newUser = await storage.createUser({
        id: `affiliate_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`, // Generate unique ID for affiliate users
        email,
        username: email,
        name,
        phone,
        company,
        password, // Store password (in real app, this would be hashed)
        role: 'white_label_affiliate',
        whiteLabelId: whiteLabelId || null,
        affiliateOfWhiteLabelId: whiteLabelId || null, // Track which white label the affiliate signed up through
        isActive: true
      });
      
      console.log('Created new affiliate user:', newUser);
      
      res.json({
        success: true,
        message: 'Affiliate signup successful! Please check your email for next steps.',
        userId: newUser.id
      });
      
    } catch (error) {
      console.error('Error in affiliate signup:', error);
      res.status(500).json({ error: 'Failed to process affiliate signup' });
    }
  });

  // Affiliate dashboard API endpoint
  app.get('/api/affiliate/dashboard', async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const domain = req.query.domain as string;
      
      // For now, return basic affiliate dashboard data
      // In a full implementation, this would fetch real affiliate stats
      const dashboardData = {
        stats: {
          totalReferrals: 0,
          activeReferrals: 0,
          totalCommissions: 0,
          pendingCommissions: 0
        },
        recentActivity: [],
        commissionHistory: []
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching affiliate dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate dashboard data' });
    }
  });

  // REMOVED: Duplicate affiliate plans endpoint - using the enhanced version below

  // API endpoint to get white-label client info by domain
  app.get('/api/white-labels/by-domain/:domain', async (req, res) => {
    try {
      const domain = req.params.domain;
      
      if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
      }

      // Get white-label client by domain
      const whiteLabel = await storage.getWhiteLabelByDomainPath(domain);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White label client not found for this domain' });
      }

      // Get user info for the white-label client
      const user = await storage.getUser(whiteLabel.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found for this white-label client' });
      }

      res.json({
        ...whiteLabel,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Error fetching white-label info by domain:', error);
      res.status(500).json({ error: 'Failed to fetch white-label info' });
    }
  });

  // API endpoint for affiliates to view their referrals with detailed end-user information
  app.get('/api/affiliate/referrals', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Extract domain from referer
      const domain = extractDomainFromRequest(req);
      console.log('Fetching referrals for affiliate:', user.id, 'domain:', domain);
      
      // Get detailed referrals for this affiliate with end-user purchase information
      const referrals = await storage.getDetailedReferralsByAffiliate(user.id, domain);
      
      res.json(referrals);
    } catch (error) {
      console.error('Error fetching affiliate referrals:', error);
      res.status(500).json({ error: 'Failed to fetch referrals' });
    }
  });

  // API endpoint for white-label clients to view referrals for their affiliates
  app.get('/api/white-label/referrals', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_client') {
        return res.status(403).json({ error: 'Only white-label clients can view referral data' });
      }

      // Get white-label client's ID
      const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'White-label client not found' });
      }

      // Get all referrals for this white-label client
      const referrals = await storage.getReferralsByWhiteLabel(whiteLabel.id);
      
      res.json(referrals);
    } catch (error) {
      console.error('Error fetching white-label referrals:', error);
      res.status(500).json({ error: 'Failed to fetch referrals' });
    }
  });

  // API endpoint for affiliates to view commission data for their visible plans
  app.get('/api/affiliate/commissions', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Extract domain from referer
      const domain = extractDomainFromRequest(req);
      console.log('Domain extraction - URL:', req.url, 'Referer:', req.get('Referer'));
      console.log('Extracted domain:', JSON.stringify(domain));
      
      // Use the storage method that properly calculates commissions with correct percentages
      const commissionData = await storage.getCommissionDataForAffiliate(user.id, domain);
      
      res.json(commissionData);
    } catch (error) {
      console.error('Error fetching commission data:', error);
      res.status(500).json({ error: 'Failed to fetch commission data' });
    }
  });

  // API endpoint for affiliates to view purchasers for a specific plan
  app.get('/api/affiliate/plan-purchasers/:planId', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const { planId } = req.params;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get all purchasers for this plan
      const purchasers = await storage.getPlanPurchasers(parseInt(planId));
      
      res.json(purchasers);
    } catch (error) {
      console.error('Error fetching plan purchasers:', error);
      res.status(500).json({ error: 'Failed to fetch plan purchasers' });
    }
  });

  // FIXED: API endpoints for affiliate plan visibility management - using simple auth for affiliate visitors
  app.get('/api/affiliate/plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // FIXED: Enhanced domain extraction with detailed logging
      const domain = extractDomainFromRequest(req);
      console.log(`AFFILIATE PLANS - Extracted domain: "${domain}"`);
      console.log(`AFFILIATE PLANS - Request URL: ${req.originalUrl}`);
      console.log(`AFFILIATE PLANS - Referer: ${req.get('referer')}`);
      
      if (!domain) {
        console.error('AFFILIATE PLANS - No domain extracted from request');
        console.error('AFFILIATE PLANS - Available query params:', req.query);
        console.error('AFFILIATE PLANS - Available headers:', Object.keys(req.headers));
        return res.status(400).json({ error: 'Domain parameter is required for affiliate plans' });
      }
      
      // FIXED: Get white-label client for this specific domain
      const whiteLabel = await storage.getWhiteLabelByDomainPath(domain);
      console.log(`AFFILIATE PLANS - White-label lookup for domain "${domain}":`, whiteLabel ? `Found ID ${whiteLabel.id}, User ${whiteLabel.userId}` : 'Not found');
      
      if (!whiteLabel) {
        console.error(`AFFILIATE PLANS - No white-label client found for domain: ${domain}`);
        return res.status(404).json({ error: `White-label client not found for domain: ${domain}` });
      }

      // FIXED: Get all plans created by this specific white-label client
      const allPlans = await storage.getPlansByUser(whiteLabel.userId);
      console.log(`AFFILIATE PLANS - Found ${allPlans.length} plans for white-label user ${whiteLabel.userId}`);
      
      // Filter plans based on status and affiliate promotion settings
      const affiliateEligiblePlans = allPlans.filter(plan => {
        // Only show published plans with affiliate promotion enabled
        return plan.status === 'published' && plan.allowAffiliatePromotion === true;
      });
      console.log(`AFFILIATE PLANS - Filtered to ${affiliateEligiblePlans.length} affiliate-eligible plans`);
      
      // Get this affiliate's visibility settings
      const visibilitySettings = await storage.getAffiliatePlanVisibility(user.id);
      const visibilityMap = new Map(visibilitySettings.map(v => [v.planId, v.isVisible]));
      console.log(`AFFILIATE PLANS - User ${user.id} has visibility settings for ${visibilitySettings.length} plans`);
      
      // Combine plan data with visibility settings
      const plansWithVisibility = affiliateEligiblePlans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        isVisible: visibilityMap.get(plan.id) || false
      }));
      
      console.log(`AFFILIATE PLANS - Returning ${plansWithVisibility.length} plans for domain ${domain}`);
      res.json(plansWithVisibility);
    } catch (error) {
      console.error('AFFILIATE PLANS - Error fetching affiliate plans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });

  app.post('/api/affiliate/plans/:planId/toggle-visibility', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const { planId } = req.params;
      const { isVisible } = req.body;
      
      console.log('Toggle visibility request:', { 
        userId: user?.id, 
        planId, 
        isVisible, 
        body: req.body,
        params: req.params 
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if the plan allows affiliate promotion before allowing visibility toggle
      const plan = await storage.getPlan(parseInt(planId));
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      if (!plan.allowAffiliatePromotion || plan.status !== 'published') {
        return res.status(403).json({ error: 'The Plan Not Allow For Promoting' });
      }

      // Set the plan visibility for this affiliate
      const result = await storage.setAffiliatePlanVisibility(user.id, parseInt(planId), isVisible);
      
      console.log('Toggle visibility result:', result);
      
      res.json({ 
        success: true, 
        planId: parseInt(planId), 
        isVisible: result.isVisible 
      });
    } catch (error) {
      console.error('Error toggling plan visibility:', error);
      res.status(500).json({ error: 'Failed to update plan visibility' });
    }
  });

  // Domain-specific user dashboard routes - REQUIRE AUTHENTICATION
  app.get('/:domainPath/user', async (req, res, next) => {
    try {
      const { domainPath } = req.params;
      
      console.log(`Domain user route accessed: ${domainPath}/user`);
      console.log(`User authenticated: ${req.isAuthenticated()}`);
      console.log(`User:`, req.user);
      
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        console.log(`Redirecting unauthenticated user to login for domain: ${domainPath}`);
        // Redirect to login with domain context
        return res.redirect(`/api/login?domain=${domainPath}&returnTo=${encodeURIComponent(req.originalUrl)}`);
      }
      
      // For user dashboard, we allow any authenticated user to access
      // (Similar to affiliate dashboard behavior)
      console.log(`Authenticated user ${req.user.id} (${req.user.role}) authorized for domain ${domainPath}/user`);
      
      // User is authenticated - let React router handle the page
      return next();
    } catch (error) {
      console.error('Error in domain user route:', error);
      return res.status(500).send('Internal server error');
    }
  });

  // Domain-specific affiliate dashboard routes - REQUIRE AUTHENTICATION
  app.get('/:domainPath/affiliate', async (req, res, next) => {
    try {
      const { domainPath } = req.params;
      
      console.log(`Domain affiliate route accessed: ${domainPath}/affiliate`);
      console.log(`User authenticated: ${req.isAuthenticated()}`);
      console.log(`User:`, req.user);
      
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        console.log(`Redirecting unauthenticated user to login for domain: ${domainPath}`);
        // Redirect to login with domain context
        return res.redirect(`/api/login?domain=${domainPath}&returnTo=${encodeURIComponent(req.originalUrl)}`);
      }
      
      const user = req.user;
      
      // For affiliate dashboard, we allow any authenticated user to access
      // Store domain context for affiliate dashboard functionality
      try {
        const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
        if (!whiteLabel) {
          console.log(`No white label found for domain: ${domainPath}`);
          return res.status(404).send('Domain not found');
        }
        
        // Store affiliate domain context in session
        req.session.affiliateDomainContext = {
          whiteLabelId: whiteLabel.id,
          domainPath: domainPath,
          businessName: whiteLabel.business_name
        };
        
        console.log(`Stored affiliate domain context for ${user.id} on domain: ${domainPath}`);
        
        // User is authenticated - let React router handle the page
        return next();
      } catch (error) {
        console.error('Error setting up affiliate domain context:', error);
        return res.status(500).send('Error setting up domain access');
      }
    } catch (error) {
      console.error('Error in domain affiliate route:', error);
      return res.status(500).send('Internal server error');
    }
  });

  // Domain route handler - clean paths without /domain/ prefix
  // File upload endpoint for handling file uploads
  app.post('/api/upload', async (req, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      
      // Configure multer for file upload
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads/');
        },
        filename: (req, file, cb) => {
          // Generate unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `${name}_${uniqueSuffix}${ext}`);
        }
      });
      
      const upload = multer.default({ storage }).single('file');
      
      upload(req, res, (err) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(500).json({ error: 'File upload failed' });
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Return the filename for database storage
        res.json({ filename: req.file.filename });
      });
    } catch (error) {
      console.error('Error setting up file upload:', error);
      res.status(500).json({ error: 'Failed to setup file upload' });
    }
  });

  // File serving endpoint for serving uploaded files (images and documents)
  app.get('/api/files/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = `./uploads/${filename}`;
      
      // Check if file exists using ES modules
      const fs = await import('fs');
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Get file extension to determine content type
      const path = await import('path');
      const ext = path.extname(filename).toLowerCase();
      
      // Set appropriate content type based on file extension
      let contentType = 'application/octet-stream';
      let disposition = 'attachment'; // Default to download for unknown files
      
      // Handle image files - serve for display
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        switch (ext) {
          case '.jpg':
          case '.jpeg':
            contentType = 'image/jpeg';
            break;
          case '.png':
            contentType = 'image/png';
            break;
          case '.gif':
            contentType = 'image/gif';
            break;
          case '.webp':
            contentType = 'image/webp';
            break;
          case '.svg':
            contentType = 'image/svg+xml';
            break;
        }
        disposition = 'inline'; // Display images in browser
      }
      // Handle PDF files - can be displayed inline
      else if (ext === '.pdf') {
        contentType = 'application/pdf';
        disposition = 'inline';
      }
      
      // Set headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);
      
      // Send file using absolute path
      const absolutePath = path.resolve(process.cwd(), filePath);
      res.sendFile(absolutePath);
    } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).json({ error: 'Failed to serve file' });
    }
  });

  // Custom domains API routes
  app.get('/api/custom-domains', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - show impersonated user's domains
      let targetUser = user;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          targetUser = impersonatedUser;
          console.log('CUSTOM-DOMAINS DEBUG - Using impersonated user for domains:', targetUser.id, 'Role:', targetUser.role);
        }
      }
      
      // For end-users (affiliates), we show their own custom domains
      // For white-label clients, we show their domains
      // We need to distinguish between these two cases
      
      let domainsToShow = [];
      
      if (targetUser.role === 'end_user') {
        // For end-users (affiliates), first check if user_id exists in white_labels table
        console.log(`Checking for user_id ${targetUser.id} in white_labels table...`);
        
        const affiliateWhiteLabels = await storage.getWhiteLabelsByUserId(targetUser.id);
        console.log(`Found ${affiliateWhiteLabels.length} white-label entries for user ${targetUser.id}:`, affiliateWhiteLabels);
        
        if (affiliateWhiteLabels.length === 0) {
          // User ID not found in white_labels table
          console.log(`Can't Find The User_id ${targetUser.id} In Table`);
          return res.status(404).json({ 
            error: "Can't Find The User_id In Table",
            message: `User ID ${targetUser.id} not found in white_labels table`
          });
        }
        
        // User found - show their domain_path(s)
        domainsToShow = await storage.getCustomDomains(targetUser.id);
        
        // Add each white-label domain_path as a domain entry
        for (const whiteLabel of affiliateWhiteLabels) {
          if (whiteLabel.domainPath) {
            const affiliateDomain = {
              id: -whiteLabel.id, // Negative ID to indicate this is a white-label domain path
              userId: targetUser.id,
              domain: whiteLabel.domainPath, // Show the actual domain_path varchar
              isVerified: true,
              sslEnabled: false,
              isActive: true,
              createdAt: whiteLabel.createdAt || new Date(),
              updatedAt: whiteLabel.updatedAt || new Date(),
              isAffiliateDomain: true,
              landingPageId: whiteLabel.defaultLandingPageId,
              whiteLabelId: whiteLabel.id, // Store for updates
              businessName: whiteLabel.businessName
            };
            domainsToShow.unshift(affiliateDomain);
            console.log(`Added domain_path "${whiteLabel.domainPath}" for user ${targetUser.id}`);
          }
        }
      } else if (targetUser.role === 'white_label_client') {
        // For white-label clients, show their custom domains
        domainsToShow = await storage.getCustomDomains(targetUser.id);
        
        // Also show their main domain path
        const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
        if (whiteLabel && whiteLabel.domainPath) {
          const mainDomain = {
            id: -2, // Special ID for main domain
            userId: user.id,
            domain: whiteLabel.domainPath,
            isVerified: true,
            sslEnabled: false,
            isActive: true,
            createdAt: whiteLabel.createdAt || new Date(),
            updatedAt: whiteLabel.updatedAt || new Date(),
            isMainDomain: true, // Special flag
            landingPageId: whiteLabel.defaultLandingPageId
          };
          domainsToShow.unshift(mainDomain);
        }
      } else {
        // For other roles, show their custom domains
        domainsToShow = await storage.getCustomDomains(user.id);
      }
      
      res.json(domainsToShow);
    } catch (error) {
      console.error('Error fetching custom domains:', error);
      res.status(500).json({ error: 'Failed to fetch custom domains' });
    }
  });

  app.post('/api/custom-domains', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const { domain, landingPageId } = req.body;
      
      if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
      }
      
      // Validate domain format
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,})$/;
      if (!domainRegex.test(domain)) {
        return res.status(400).json({ error: 'Invalid domain format' });
      }
      
      // Check if domain already exists
      const existingDomain = await storage.getCustomDomainByDomain(domain);
      if (existingDomain) {
        return res.status(409).json({ error: 'Domain already exists' });
      }
      
      // Create new custom domain
      const newDomain = await storage.createCustomDomain({
        userId: user.id,
        domain: domain.toLowerCase(),
        landingPageId: landingPageId || null,
        verificationToken: storage.generateVerificationToken(),
      });
      
      res.status(201).json(newDomain);
    } catch (error) {
      console.error('Error creating custom domain:', error);
      res.status(500).json({ error: 'Failed to create custom domain' });
    }
  });

  app.put('/api/custom-domains/:id', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const domainId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Special handling for domain path updates (negative IDs indicate white-label entries)
      if (domainId < 0) {
        // This is updating a domain path from white_labels table
        const { domain, whiteLabelId } = updateData;
        if (!domain) {
          return res.status(400).json({ error: 'Domain path is required' });
        }
        
        console.log(`User ${user.id} (${user.role}) attempting to update white-label domain to: ${domain}`);
        
        // FIXED: Dynamic white-label ID resolution for all user types
        console.log(`Looking up white-label records for user ${user.id} (role: ${user.role})`);
        
        let whiteLabels;
        if (user.role === 'white_label_client') {
          // White-label clients update their own record
          const whiteLabel = await storage.getWhiteLabelByUserId(user.id);
          if (!whiteLabel) {
            console.log(`Can't Find White-label record for user_id ${user.id}`);
            return res.status(404).json({ 
              error: "White-label record not found",
              message: `White-label record for user ID ${user.id} not found`
            });
          }
          whiteLabels = [whiteLabel];
        } else {
          // For all other user types, get ALL their white-label records
          whiteLabels = await storage.getWhiteLabelsByUserId(user.id);
          if (whiteLabels.length === 0) {
            console.log(`Can't Find The User_id ${user.id} In affiliate white_labels table`);
            return res.status(404).json({ 
              error: "Can't Find The User_id In Table",
              message: `User ID ${user.id} not found in white_labels table`
            });
          }
        }
        
        console.log(`Found ${whiteLabels.length} white-label records:`, whiteLabels.map(wl => ({ id: wl.id, domainPath: wl.domainPath })));
        
        // Find the specific white-label entry to update
        let whiteLabel;
        if (user.role === 'white_label_client') {
          // For white-label clients, use their primary white-label record
          whiteLabel = whiteLabels[0];
        } else {
          // FIXED: Use the actual white-label ID from the request, or match by domain ID
          let targetWhiteLabelId;
          
          if (whiteLabelId) {
            // Use the provided white-label ID from the request
            targetWhiteLabelId = whiteLabelId;
          } else {
            // Convert negative domain ID to positive white-label ID
            targetWhiteLabelId = Math.abs(domainId);
          }
          
          console.log(`Searching for white-label ID: ${targetWhiteLabelId}`);
          whiteLabel = whiteLabels.find(wl => wl.id === targetWhiteLabelId);
          
          if (!whiteLabel) {
            console.log(`White-label ID ${targetWhiteLabelId} not found. Available IDs: ${whiteLabels.map(wl => wl.id).join(', ')}`);
            
            // FALLBACK: If the requested ID doesn't exist, use the first available record
            if (whiteLabels.length > 0) {
              whiteLabel = whiteLabels[0];
              console.log(`Using fallback white-label ID: ${whiteLabel.id} (domain: ${whiteLabel.domainPath})`);
            } else {
              return res.status(404).json({ 
                error: 'White-label entry not found',
                message: `No white-label records found for user ${user.id}. Available IDs: ${whiteLabels.map(wl => wl.id).join(', ')}`
              });
            }
          }
        }
        
        // Validate domain path format
        const domainPathRegex = /^[a-z0-9-]+$/;
        if (!domainPathRegex.test(domain)) {
          return res.status(400).json({ error: 'Domain path can only contain lowercase letters, numbers, and hyphens' });
        }
        
        // Check if domain path is available (exclude current user's entries)
        const existingWhiteLabel = await storage.getWhiteLabelByDomainPath(domain);
        if (existingWhiteLabel && existingWhiteLabel.userId !== user.id) {
          return res.status(409).json({ error: 'Domain path already taken' });
        }
        
        // Update the specific white-label domain path
        console.log(`Updating white-label ID ${whiteLabel.id} domain_path from "${whiteLabel.domainPath}" to "${domain}"`);
        const updatedWhiteLabel = await storage.updateWhiteLabel(whiteLabel.id, {
          domainPath: domain
        });
        console.log(`Successfully updated domain_path to: ${domain}`);
        
        // Return the updated domain info
        const updatedDomain = {
          id: -whiteLabel.id,
          userId: user.id,
          domain: domain,
          isVerified: true,
          sslEnabled: false,
          isActive: true,
          createdAt: whiteLabel.createdAt || new Date(),
          updatedAt: new Date(),
          isAffiliateDomain: true,
          landingPageId: whiteLabel.defaultLandingPageId,
          whiteLabelId: whiteLabel.id,
          businessName: updatedWhiteLabel.businessName
        };
        
        return res.json(updatedDomain);
      }
      
      // Regular custom domain update
      const domain = await storage.getCustomDomain(domainId);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      // Verify ownership
      if (domain.userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to modify this domain' });
      }
      
      const updatedDomain = await storage.updateCustomDomain(domainId, updateData);
      res.json(updatedDomain);
    } catch (error) {
      console.error('Error updating custom domain:', error);
      res.status(500).json({ error: 'Failed to update custom domain' });
    }
  });

  app.delete('/api/custom-domains/:id', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const domainId = parseInt(req.params.id);
      
      // Don't allow deletion of special domains (affiliate or main domain paths)
      if (domainId === -1 || domainId === -2) {
        return res.status(400).json({ error: 'Cannot delete domain path. Use domain update instead.' });
      }
      
      const domain = await storage.getCustomDomain(domainId);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      // Verify ownership
      if (domain.userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this domain' });
      }
      
      await storage.deleteCustomDomain(domainId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting custom domain:', error);
      res.status(500).json({ error: 'Failed to delete custom domain' });
    }
  });

  app.post('/api/custom-domains/:id/verify', isAuthenticatedWithDomainSupport, async (req, res) => {
    try {
      const user = req.user;
      const domainId = parseInt(req.params.id);
      
      const domain = await storage.getCustomDomain(domainId);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      // Verify ownership
      if (domain.userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to verify this domain' });
      }
      
      // In a real application, you would perform actual DNS verification here
      // For now, we'll just mark it as verified
      const verifiedDomain = await storage.verifyCustomDomain(domainId);
      res.json(verifiedDomain);
    } catch (error) {
      console.error('Error verifying custom domain:', error);
      res.status(500).json({ error: 'Failed to verify custom domain' });
    }
  });

  app.get('/:domainPath', async (req, res, next) => {
    try {
      // Extract domain path, decode URL encoding, and strip query string
      let { domainPath } = req.params;
      domainPath = decodeURIComponent(domainPath).split('?')[0]; // Decode and remove query string
      
      console.log(`🔍 FIRST ROUTE HANDLER - Processing domain: ${domainPath}`);
      
      // Skip if this looks like an API route, Vite dev server file, static file, or main app route
      if (domainPath.startsWith('api') || 
          domainPath.startsWith('src') ||
          domainPath.startsWith('@') ||
          domainPath.startsWith('node_modules') ||
          domainPath.includes('.') || 
          domainPath === 'favicon.ico' ||
          domainPath === 'auth' ||
          domainPath === 'reset-password' ||
          domainPath === 'login' ||
          domainPath === 'signup' ||
          domainPath === 'pricing' ||
          domainPath === 'contact' ||
          domainPath === 'white-label' ||
          domainPath === 'become-affiliate' ||
          domainPath === 'robots.txt' ||
          domainPath === 'sitemap.xml' ||
          domainPath === 'login' ||
          domainPath === 'signup' ||
          domainPath === 'dashboard' ||
          domainPath === 'super-admin-login' ||
          domainPath === 'super-admin' ||
          domainPath === 'white-label' ||
          domainPath === 'affiliate' ||
          domainPath === 'white-label-affiliate' ||
          domainPath === 'clients' ||
          domainPath === 'plans' ||
          domainPath === 'subscriptions' ||
          domainPath === 'subscription-plans' ||
          domainPath === 'products' ||
          domainPath === 'categories' ||
          domainPath === 'affiliates' ||
          domainPath === 'revenue' ||
          domainPath === 'ai-studio' ||
          domainPath === 'templates' ||
          domainPath === 'integrations' ||
          domainPath === 'settings' ||
          domainPath === 'landing-builder' ||
          domainPath === 'announcements' ||
          domainPath === 'news' ||
          domainPath === 'analytics' ||
          domainPath === 'notifications' ||
          domainPath === 'profile' ||
          domainPath === 'billing' ||
          domainPath === 'support' ||
          domainPath === 'help' ||
          domainPath === 'admin' ||
          domainPath === 'pricing' ||
          domainPath === 'become-affiliate' ||
          domainPath === 'checkout' ||
          domainPath === 'purchase-success' ||
          domainPath === 'contact' ||
          domainPath === 'commissions' ||
          domainPath === 'referrals' ||
          domainPath === 'links' ||
          domainPath === 'ai-content' ||
          domainPath === 'landing-page' ||
          domainPath === '') {
        // Skip this route - let Vite handle it
        return next();
      }

      // Check if this domain path belongs to a white label client
      const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
      
      console.log(`🔍 ROUTE DEBUG - Domain: ${domainPath}, WhiteLabel found:`, whiteLabel ? { id: whiteLabel.id, userId: whiteLabel.userId, landingPageCode: whiteLabel.landingPageCode, domain_path: whiteLabel.domain_path} : 'null');
      
      let landingPage = null;
      
      if (whiteLabel) {
        // Store white label ID in session for future purchases
        req.session.whiteLabelId = whiteLabel.id;
        req.session.whiteLabelDomain = domainPath;
        console.log(`Stored white label ID ${whiteLabel.id} for domain ${domainPath} in session`);
        
        // Fetch user logo from users table
        const user = await storage.getUserById(whiteLabel.userId);
        let userLogo = null;
        if (user && user.logoImageUrl) {
          userLogo = user.logoImageUrl;
          console.log(`Found user logo for domain ${domainPath}: ${userLogo}`);
        }
        
        // Also store domain context for end-user purchases
        req.session.domainContext = {
          whiteLabelId: whiteLabel.id,
          domainPath: domainPath,
          businessName: whiteLabel.business_name,
          userLogo: userLogo
        };
        // Normalize landingPageCode: treat "NULL" string as null and convert to "default"
        const normalizedLandingPageCode = (!whiteLabel.landingPageCode || 
                                            whiteLabel.landingPageCode === null || 
                                            whiteLabel.landingPageCode === 'NULL' || 
                                            whiteLabel.landingPageCode === 'null') 
                                            ? null 
                                            : whiteLabel.landingPageCode;
        
        // When landingPageCode is "default" or null, use the white label's default landing page
        if (normalizedLandingPageCode === 'default' || normalizedLandingPageCode === null) {
          console.log(`White label ${whiteLabel.id} (${domainPath}) is configured to use default landing page`);
          
          // First, try to use the white label's own default landing page (if set)
          if (whiteLabel.defaultLandingPageId) {
            console.log(`Attempting to use white label's default landing page ID: ${whiteLabel.defaultLandingPageId}`);
            const customLandingPage = await storage.getLandingPage(whiteLabel.defaultLandingPageId);
            
            // Only use custom landing page if it has meaningful content
            if (customLandingPage && customLandingPage.elements && Array.isArray(customLandingPage.elements) && customLandingPage.elements.length > 0) {
              console.log(`✅ Using white label's default landing page for domain: ${domainPath}`);
              landingPage = customLandingPage;
            } else {
              console.log(`❌ White label's default landing page has no valid elements`);
            }
          }
          
          // If no default landing page set, try to find by domain path
          if (!landingPage) {
            console.log(`No default landing page set, trying to find by domain path: ${domainPath}`);
            landingPage = await storage.getLandingPageByDomainPath(domainPath);
          }
          
          // As a last resort, try the "Default" template
          if (!landingPage) {
            console.log(`No landing page found, trying Default template fallback...`);
            try {
              const defaultTemplate = await storage.getLandingPageByDomainPath('Default');
              if (defaultTemplate && defaultTemplate.elements) {
                const elements = JSON.parse(defaultTemplate.elements);
                if (Array.isArray(elements) && elements.length > 0) {
                  console.log(`✅ Using Default template for white label domain: ${domainPath}`);
                  landingPage = defaultTemplate;
                }
              }
            } catch (error) {
              console.error('Error fetching Default template for white label:', error);
            }
          }
        } else {
          // If white label has a custom landingPageCode (other than "default"), use it differently
          // This branch is for future custom templates
          if (whiteLabel.defaultLandingPageId) {
            const customLandingPage = await storage.getLandingPage(whiteLabel.defaultLandingPageId);
            
            // Only use custom landing page if it has meaningful content
            if (customLandingPage && customLandingPage.elements && Array.isArray(customLandingPage.elements) && customLandingPage.elements.length > 0) {
              landingPage = customLandingPage;
            }
          }
          
          // If no custom default or custom page is empty, fall back to automatic landing page by domain path
          if (!landingPage) {
            landingPage = await storage.getLandingPageByDomainPath(domainPath);
          }
        }
      } else {
        // No white label found for this domain path, try direct lookup
        landingPage = await storage.getLandingPageByDomainPath(domainPath);
      }
      
      // If no landing page exists for this domain path, try Default template fallback
      if (!landingPage) {
        console.log(`No landing page found for domain path: ${domainPath}, trying Default template fallback...`);
        
        // Try to get the Default template as fallback
        try {
          const defaultTemplate = await storage.getLandingPageByDomainPath('Default');
          if (defaultTemplate && defaultTemplate.elements) {
            const elements = JSON.parse(defaultTemplate.elements);
            if (Array.isArray(elements) && elements.length > 0) {
              console.log(`Using Default template fallback for domain path: ${domainPath}`);
              landingPage = defaultTemplate;
            }
          }
        } catch (error) {
          console.error('Error fetching Default template:', error);
        }
      }
      
      // If still no landing page (including Default template), show not found
      if (!landingPage) {
        console.log(`No landing page or Default template found for domain path: ${domainPath}, showing 404`);
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Domain Not Found</title>
            <style>
              body { font-family: 'Inter', sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
              .container { max-width: 500px; margin: 0 auto; }
              h1 { color: #1a202c; margin-bottom: 20px; }
              p { color: #4a5568; margin-bottom: 30px; }
              .btn { 
                background: #667eea; 
                color: white; 
                padding: 12px 24px; 
                border: none; 
                border-radius: 6px; 
                text-decoration: none; 
                display: inline-block; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Domain Not Available</h1>
              <p>The domain path "${domainPath}" is not currently set up or is no longer available.</p>
              <a href="/" class="btn">Go to Homepage</a>
            </div>
          </body>
          </html>
        `);
      }

      // Get the white-label client's actual plans for dynamic pricing display
      let clientPlans = [];
      console.log('🔍 ROUTE DEBUG - About to fetch client plans for domain:', domainPath);
     
      // Use existing whiteLabel if available, otherwise find by domain path
      let currentWhiteLabel = whiteLabel;
      if (!currentWhiteLabel) {
        try {
          currentWhiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
          console.log('🔍 ROUTE DEBUG - Found whiteLabel by domain path:', currentWhiteLabel?.id);
        } catch (error) {
          console.error('Error finding white label:', error);
        }
      } else {
        console.log('🔍 ROUTE DEBUG - Using existing whiteLabel:', currentWhiteLabel?.id);
      }
      
      try {
        if (currentWhiteLabel) {
          // Get the domain owner user to check if they're a white-label client or affiliate
          const domainOwnerUser = await storage.getUserById(currentWhiteLabel.userId);
          
          // Check if domain owner is a white-label client (owns this domain) or an affiliate
          // A white-label client has BOTH a whiteLabelId AND owns a white-label business (record in white_labels table)
          const domainOwnerWhiteLabel = await storage.getWhiteLabelByUserId(domainOwnerUser.id);
          const isWhiteLabelClientDomain = domainOwnerWhiteLabel && domainOwnerWhiteLabel.domainPath === domainPath;
          const isAffiliateDomain = domainOwnerUser.whiteLabelId && !isWhiteLabelClientDomain;
          
          if (isAffiliateDomain) {
            // This is an affiliate's domain - show only plans that BOTH white label client allows AND affiliate has enabled
            const associatedWhiteLabel = await storage.getWhiteLabelById(domainOwnerUser.whiteLabelId);
            if (associatedWhiteLabel) {
              // Get plans that require BOTH allowAffiliatePromotion=true AND isVisible=true
              const promotablePlans = await storage.getPromotablePlansForAffiliate(domainOwnerUser.id);
              clientPlans = promotablePlans || [];
              console.log(`Domain ${domainPath}: Affiliate domain - showing ${clientPlans.length} promotable plans (client allowed + affiliate enabled) for affiliate ${domainOwnerUser.id} from white-label client ${associatedWhiteLabel.userId}`);
            }
          } else if (isWhiteLabelClientDomain) {
            // Check if domain owner is actually an end_user vs white_label_client
            if (domainOwnerUser.role === 'end_user') {
              // This is an END_USER's affiliate domain - show plans they have promotion rights for
              const promotablePlans = await storage.getPromotablePlansForAffiliate(currentWhiteLabel.userId);
              clientPlans = promotablePlans || [];
              console.log(`Domain ${domainPath}: End-user affiliate domain - showing ${clientPlans.length} promotable plans (client allowed + affiliate enabled) for user ${currentWhiteLabel.userId}`);
            } else {
              // This is a white-label client's own domain - show only published plans on landing page
              const plans = await storage.getPlansByUser(currentWhiteLabel.userId);
              clientPlans = (plans || []).filter(plan => plan.status === 'published');
              console.log(`Domain ${domainPath}: White-label client's own domain - showing ${clientPlans.length} published plans (${plans?.length || 0} total) from user ${currentWhiteLabel.userId}`);
            }
          } else {
            // Check if the domain owner is a super_admin_affiliate
            if (domainOwnerUser && domainOwnerUser.role === 'super_admin_affiliate') {
              // For super admin affiliates, show main site plans that they've made visible
              const allPlans = await storage.getPlans();
              const mainSitePlans = allPlans.filter(plan => plan.isMainSitePlan === true);
              
              // Get only the plans this super admin affiliate has marked as visible
              const visiblePlans = await storage.getVisiblePlansForAffiliate(domainOwnerUser.id);
              const visiblePlanIds = visiblePlans.map(vp => vp.id);
              
              clientPlans = mainSitePlans.filter(plan => visiblePlanIds.includes(plan.id));
              console.log(`Domain ${domainPath}: Super Admin Affiliate domain - showing ${clientPlans.length} visible main site plans for user ${currentWhiteLabel.userId}`);
            } else {
              // Check if domain owner is an end_user vs white_label_client
              if (domainOwnerUser && domainOwnerUser.role === 'end_user') {
                // This is an END_USER's affiliate domain - show plans they have promotion rights for
                const promotablePlans = await storage.getPromotablePlansForAffiliate(currentWhiteLabel.userId);
                clientPlans = promotablePlans || [];
                console.log(`Domain ${domainPath}: End-user affiliate domain - showing ${clientPlans.length} promotable plans (client allowed + affiliate enabled) for user ${currentWhiteLabel.userId}`);
              } else {
                // This is a regular white-label client's own domain - show only published plans on landing page
                const plans = await storage.getPlansByUser(currentWhiteLabel.userId);
                clientPlans = (plans || []).filter(plan => plan.status === 'published');
                console.log(`Domain ${domainPath}: White-label client's own domain - showing ${clientPlans.length} published plans (${plans?.length || 0} total) from user ${currentWhiteLabel.userId}`);
              }
            }
          }
        } else {
          console.log(`Domain ${domainPath}: No white-label client found`);
        }
      } catch (error) {
        console.error('Error fetching client plans:', error);
      }

      // 🔑 CRITICAL FIX: Check for referral code in URL and filter plans accordingly
      // Extract referral code from query parameters (supports ?code, ?ref=code, ?referralcode=code)
      const urlParams = new URL(req.url || '', `http://${req.headers.host}`).searchParams;
      let referralCode: string | null = null;
      
      // Check standard parameter formats
      referralCode = urlParams.get('ref') || urlParams.get('referralcode') || urlParams.get('referralCode');
      
      // If not found in standard params, check if referral code is passed as direct parameter (e.g., ?munibii)
      if (!referralCode) {
        const standardParams = ['domain', 'ref', 'referralcode', 'referralCode', 'context', 'plan', 'name', 'price', 'editMode', 'customizations'];
        for (const [key, value] of urlParams.entries()) {
          if (!standardParams.includes(key) && (value === '' || value === null || value === 'null')) {
            referralCode = key; // The parameter name itself is the referral code
            break;
          }
        }
      }
      
      console.log(`🔍 REFERRAL CODE DETECTION - Domain: ${domainPath}, Referral Code: ${referralCode || 'none'}`);
      
      // If referral code detected, filter plans to only show those with allowAffiliatePromotion = true
      if (referralCode && clientPlans.length > 0) {
        const beforeCount = clientPlans.length;
        clientPlans = clientPlans.filter(plan => plan.allowAffiliatePromotion === true);
        const afterCount = clientPlans.length;
        console.log(`🔍 REFERRAL FILTER - Filtered plans from ${beforeCount} to ${afterCount} (showing only plans with allowAffiliatePromotion=true)`);
      }

      // Determine if this is an affiliate domain or white-label client domain
      console.log('🔍 ROUTE DEBUG - About to determine domain type for:', domainPath);
      const domainOwnerUser = currentWhiteLabel ? await storage.getUserById(currentWhiteLabel.userId) : null;
      console.log('🔍 ROUTE DEBUG - Domain owner user:', domainOwnerUser?.id || 'none');
      const domainOwnerWhiteLabel = domainOwnerUser ? await storage.getWhiteLabelByUserId(domainOwnerUser.id) : null;
      console.log('🔍 ROUTE DEBUG - Domain owner white label:', domainOwnerWhiteLabel?.id || 'none');
      const isWhiteLabelClientDomain = domainOwnerWhiteLabel && domainOwnerWhiteLabel.domainPath === domainPath;
      const isAffiliateDomain = domainOwnerUser && domainOwnerUser.whiteLabelId && !isWhiteLabelClientDomain;
      console.log('🔍 ROUTE DEBUG - Domain type determined:', { isWhiteLabelClientDomain, isAffiliateDomain });
      
      // Generate HTML content with domain type information
      // Extract editMode and customizations from query parameters
      const editMode = req.query.editMode === 'true';
      let customizations = null;
      
      // Parse customizations from query parameter if provided
      if (req.query.customizations) {
        try {
          customizations = JSON.parse(decodeURIComponent(req.query.customizations as string));
          console.log('🔍 PARSED CUSTOMIZATIONS from query:', customizations);
        } catch (error) {
          console.error('Error parsing customizations from query:', error);
        }
      }
      
      console.log('🔍 CALLING generateLandingPageHTML with:', {
        landingPageExists: !!landingPage,
        clientPlansCount: clientPlans?.length || 0,
        whiteLabelId: currentWhiteLabel?.id,
        isAffiliateDomain,
        domainOwnerUserId: domainOwnerUser?.id,
        editMode
      });
      console.log('🔍 ROUTE DEBUG - About to call generateLandingPageHTML');
      const isAuthenticated = req.isAuthenticated();
      const authenticatedUser = req.user;
      const loginWhiteLabelId = (req.session as any).login_whitelabel_id || null;
      console.log('🔍 LOGIN DOMAIN DEBUG - loginWhiteLabelId from session:', loginWhiteLabelId, 'currentWhiteLabelId:', currentWhiteLabel?.id);
      const htmlContent = generateLandingPageHTML(landingPage, clientPlans, currentWhiteLabel, isAffiliateDomain, domainOwnerUser, editMode, customizations, isAuthenticated, authenticatedUser, loginWhiteLabelId);
      console.log('🔍 ROUTE DEBUG - generateLandingPageHTML returned, sending response');
      
      return res.send(htmlContent);
    } catch (error: any) {
      console.error('🚨 ROUTE ERROR - Error serving domain page:', error);
      console.error('🚨 ROUTE ERROR - Stack trace:', error.stack);
      res.status(500).send('Internal server error');
    }
  });

  // Add missing subscription endpoint for modal checkout
  app.post('/api/subscriptions', async (req, res) => {
    try {
      const { planId, status, planPrice, referralCode } = req.body;
      
      console.log('Creating subscription for plan:', planId, 'status:', status, 'price:', planPrice);
      console.log('Session whiteLabelId:', req.session?.whiteLabelId);
      console.log('Session domainContext:', req.session?.domainContext);
      
      // Get the plan details to get the price
      const plan = await storage.getPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      // DOMAIN-SPECIFIC AUTHENTICATION CHECK
      // Verify user logged in via the plan owner's domain
      const loginWhiteLabelId = (req.session as any).login_whitelabel_id;
      const planOwnerId = plan.userId;
      
      // Get the plan owner's white label ID
      const planOwnerWhiteLabel = await storage.getWhiteLabelByUserId(planOwnerId);
      
      if (planOwnerWhiteLabel && loginWhiteLabelId !== planOwnerWhiteLabel.id) {
        console.log('⚠️ DOMAIN AUTH MISMATCH - User login domain:', loginWhiteLabelId, 'Plan owner domain:', planOwnerWhiteLabel.id);
        return res.status(403).json({ 
          error: 'Domain authentication required',
          message: 'You must log in through the correct domain to purchase this plan',
          requiredDomain: planOwnerWhiteLabel.domainPath
        });
      }
      
      console.log('✅ DOMAIN AUTH CHECK PASSED - User authenticated on correct domain');
      
      // Use the price from the request (from frontend) or fall back to plan price
      const actualPrice = planPrice || plan.monthlyPrice || '0';
      
      // Get white label ID from session (stored when user visited domain-specific URL)
      let whiteLabelId = req.session?.whiteLabelId;
      
      // If no white label ID in session, try to get it from domain context
      if (!whiteLabelId && req.session?.domainContext) {
        whiteLabelId = req.session.domainContext.whiteLabelId;
      }
      
      // If still no white label ID, this might be a direct purchase from main site
      if (!whiteLabelId) {
        // For direct purchases, we need to handle differently
        console.log('No white label ID found - this might be a direct purchase from main site');
        
        // If user is a white-label client, associate with their own white label
        if (req.user?.role === 'white_label_client') {
          const userWhiteLabel = await storage.getWhiteLabelByUserId(req.user.id);
          if (userWhiteLabel) {
            whiteLabelId = userWhiteLabel.id;
            console.log('Associated purchase with user own white label:', whiteLabelId);
          }
        }
        
        // If still no white label ID, use default (this shouldn't happen in normal flow)
        if (!whiteLabelId) {
          whiteLabelId = 1; // Default fallback
          console.log('Using default white label ID as fallback');
        }
      }
      
      // IMPORTANT: Cancel any existing active subscriptions for this white-label client
      // to prevent duplicate billing issues
      console.log('Checking for existing active subscriptions for white-label ID:', whiteLabelId);
      try {
        // Cancel existing active subscriptions to prevent duplicates
        await storage.cancelExistingSubscriptions(whiteLabelId);
        console.log('Successfully cancelled existing active subscriptions');
      } catch (error) {
        console.error('Error cancelling existing subscriptions:', error);
        // Continue anyway - we still want to create the new subscription
      }
      
      // Create subscription with referral code
      const subscription = await storage.createSubscription({
        userId: req.user?.id,
        whiteLabelId: whiteLabelId, // Corrected field name to match schema
        planId,
        status: status || 'active',
        amount: actualPrice,
        billingCycle: 'monthly',
        referralCode: referralCode || null, // Include referral code if provided
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock Stripe subscription ID
        stripeCustomerId: `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock Stripe customer ID
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      
      // Also create purchase history record for analytics
      const purchaseHistory = await storage.createPurchaseHistory({
        userId: req.user?.id || 'anonymous_user',
        whiteLabelId: whiteLabelId,
        planId,
        amount: actualPrice,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: 'modal_checkout',
        status: 'completed',
        metadata: {
          planName: plan.name,
          source: 'modal_checkout',
          domainPath: req.session?.domainContext?.domainPath || 'direct',
          referralCode: referralCode || null
        }
      });
      
      // Process referral commission - handle both referral codes AND domain-based tracking
      let referralCommission = null;
      
      // Check for referral code first (Super Admin or White Label Affiliate)
      if (referralCode && referralCode.trim() !== '') {
        try {
          // Find the affiliate (Super Admin or White Label) who owns this referral code
          const affiliate = await storage.getUserByReferralCode(referralCode.trim());
          
          if (affiliate && (affiliate.role === 'super_admin_affiliate' || affiliate.role === 'white_label_affiliate')) {
            // Calculate commission (using plan's affiliate commission percentage)
            const commissionPercentage = parseFloat(plan.affiliateCommissionPercentage || '5'); // Default 5%
            const commissionAmount = (parseFloat(actualPrice) * commissionPercentage / 100).toFixed(2);
            
            // Create referral commission record
            await storage.createReferralCommission({
              affiliateId: affiliate.id,
              subscriptionId: subscription.id,
              planId: plan.id,
              referralCode: referralCode.trim(),
              purchaserUserId: req.user?.id || 'anonymous_user',
              commissionAmount,
              commissionPercentage: commissionPercentage.toString(),
              planAmount: actualPrice,
            });
            
            referralCommission = {
              affiliateId: affiliate.id,
              affiliateEmail: affiliate.email,
              affiliateRole: affiliate.role,
              commissionAmount,
              commissionPercentage,
            };
            
            console.log('Referral commission created for referral code:', referralCommission);
          } else {
            console.log('Invalid referral code or affiliate not found:', referralCode);
          }
        } catch (error) {
          console.error('Error processing referral commission:', error);
          // Don't fail the whole transaction for referral commission errors
        }
      }
      
      // ALSO check for domain-based affiliate tracking (end_user affiliates)
      const domainPath = req.session?.domainContext?.domainPath;
      if (domainPath && !referralCommission) { // Only if no referral code commission was created
        try {
          console.log('Processing domain-based affiliate tracking for domain:', domainPath);
          
          // Find the domain owner (end_user affiliate)
          const domainWhiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
          if (domainWhiteLabel) {
            const domainOwner = await storage.getUserById(domainWhiteLabel.userId);
            
            if (domainOwner && domainOwner.role === 'end_user') {
              console.log('Found end_user domain owner for commission:', domainOwner.id, domainOwner.username);
              
              // Create referral tracking record
              await storage.trackReferral({
                affiliateId: domainOwner.id,
                referredUserId: req.user?.id || 'anonymous_user',
                whiteLabelId: domainWhiteLabel.id,
                domainPath: domainPath,
                status: 'converted' // Purchase completed
              });
              
              // Calculate commission for end_user affiliate
              const commissionPercentage = parseFloat(plan.affiliateCommissionPercentage || '10'); // Default 10% for end_user affiliates
              const commissionAmount = (parseFloat(actualPrice) * commissionPercentage / 100).toFixed(2);
              
              console.log(`Domain affiliate commission: ${commissionAmount} (${commissionPercentage}% of ${actualPrice})`);
              
              // Create referral commission record for domain affiliate
              await storage.createReferralCommission({
                affiliateId: domainOwner.id,
                subscriptionId: subscription.id,
                planId: plan.id,
                referralCode: `domain_${domainPath}`, // Domain-based tracking identifier
                purchaserUserId: req.user?.id || 'anonymous_user',
                commissionAmount,
                commissionPercentage: commissionPercentage.toString(),
                planAmount: actualPrice,
              });
              
              referralCommission = {
                affiliateId: domainOwner.id,
                affiliateEmail: domainOwner.email,
                commissionAmount,
                commissionPercentage,
                type: 'domain_affiliate'
              };
              
              console.log('Domain-based referral commission created:', referralCommission);
            }
          }
        } catch (error) {
          console.error('Error processing domain-based affiliate tracking:', error);
          // Don't fail the whole transaction for domain affiliate tracking errors
        }
      }
      
      console.log('Subscription created:', subscription);
      console.log('Purchase history created:', purchaseHistory);
      
      res.json({ 
        success: true, 
        subscription,
        purchaseHistory,
        referralCommission,
        message: 'Subscription created successfully' 
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  // Get user subscriptions (filtered by domain)
  app.get('/api/subscriptions', async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const domain = req.query.domain as string;
      
      if (domain) {
        // Filter subscriptions by domain
        const subscriptions = await storage.getSubscriptionsByDomain(user.id, domain);
        res.json(subscriptions);
      } else {
        // Fallback to all subscriptions
        const subscriptions = await storage.getSubscriptions(user.id);
        res.json(subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  });

  // Get user's own subscriptions (for settings page)
  app.get('/api/subscriptions/my', async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if we're in impersonation mode - show impersonated user's subscriptions
      let targetUserId = user.id;
      let targetUserRole = user.role;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          targetUserId = impersonatedUser.id;
          targetUserRole = impersonatedUser.role;
          console.log('MY-SUBSCRIPTIONS DEBUG - Using impersonated user for subscriptions:', targetUserId, 'Role:', targetUserRole);
        }
      }
      
      // For white label clients, get their purchased super admin plans
      if (targetUserRole === 'white_label_client') {
        const subscriptions = await storage.getSubscriptions(targetUserId);
        console.log('MY-SUBSCRIPTIONS DEBUG - Found subscriptions for user:', targetUserId, 'Count:', subscriptions.length);
        res.json(subscriptions);
      } else {
        // For other roles, return empty array since they don't have subscriptions
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  });

  // Update user subscription selections (categories and products)
  app.put('/api/subscriptions/:subscriptionId/selections', async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { subscriptionId } = req.params;
      const { selectedCategories, selectedProducts } = req.body;

      // Validate input
      if (!Array.isArray(selectedCategories) || !Array.isArray(selectedProducts)) {
        return res.status(400).json({ error: 'selectedCategories and selectedProducts must be arrays' });
      }

      // Get the subscription to verify ownership
      const subscription = await storage.getSubscriptionById(parseInt(subscriptionId));
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Verify user has access to this subscription
      if (user.role === 'white_label_client') {
        const userWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
        if (!userWhiteLabel || subscription.whiteLabelId !== userWhiteLabel.id) {
          return res.status(403).json({ error: 'Access denied to this subscription' });
        }
      } else if (user.role === 'end_user') {
        if (subscription.userId !== user.id) {
          return res.status(403).json({ error: 'Access denied to this subscription' });
        }
      } else {
        return res.status(403).json({ error: 'Invalid user role for subscription management' });
      }

      // Update subscription selections
      const updatedSubscription = await storage.updateSubscriptionSelections(
        parseInt(subscriptionId),
        selectedCategories,
        selectedProducts
      );

      res.json({
        success: true,
        subscription: updatedSubscription,
        message: 'Subscription selections updated successfully'
      });
    } catch (error) {
      console.error('Error updating subscription selections:', error);
      res.status(500).json({ error: 'Failed to update subscription selections' });
    }
  });

function generateLandingPageHTML(landingPage: any, clientPlans: any[], whiteLabel: any, isAffiliateDomain: boolean = false, domainOwnerUser: any = null, editMode: boolean = false, customizations: any = null, isAuthenticated: boolean = false, authenticatedUser: any = null, loginWhiteLabelId: number | null = null) {
  const originalElements = (landingPage && landingPage.elements && Array.isArray(landingPage.elements)) ? landingPage.elements : [];
  const companyName = whiteLabel?.business_name || '';
  const domainPath = whiteLabel?.domainPath || 'dashboard';
  
  // Check if user role is end_user (only end_users can purchase)
  const currentWhiteLabelId = whiteLabel?.id;
  const userRole = authenticatedUser?.role;
  // Handle both "End-user" and "end_user" formats (case-insensitive)
  const isEndUser = userRole?.toLowerCase().replace('-', '_') === 'end_user';
  console.log('🔍 ROLE CHECK - User role:', userRole, 'isEndUser:', isEndUser);
  
  // Get user logo from domainOwnerUser if available
  const userLogo = domainOwnerUser?.logoImageUrl;
  
  // DEBUG: Log the user logo information
  console.log('🔍 LOGO DEBUG - domainOwnerUser:', domainOwnerUser ? { id: domainOwnerUser.id, username: domainOwnerUser.username, logoImageUrl: domainOwnerUser.logoImageUrl } : 'null');
  console.log('🔍 LOGO DEBUG - userLogo:', userLogo);
  console.log('🔍 LOGO DEBUG - whiteLabel logo_url:', whiteLabel?.logo_url);
  console.log('🔍 LOGO DEBUG - companyName:', companyName);
  
  // Always ensure we have a complete modern website structure
  const hasNavbar = originalElements.some(element => element && element.type === 'navbar');
  const hasHero = originalElements.some(element => element && element.type === 'hero');
  const hasFeatures = originalElements.some(element => element && element.type === 'features');
  const hasPricingSection = originalElements.some(element => element && element.type === 'pricing');
  const hasTestimonials = originalElements.some(element => element && element.type === 'testimonials');
  const hasContact = originalElements.some(element => element && element.type === 'contact');
  const hasFooter = originalElements.some(element => element && element.type === 'footer');
  
  // Create a new array to avoid mutating the original
  const elements = [...originalElements];
  
  // Add missing essential sections for a complete modern website
  if (!hasNavbar) {
    elements.unshift({
      type: 'navbar',
      content: { 
        brand: companyName,
        menuItems: [
          { text: 'Home', url: '#home' },
          { text: 'Features', url: '#features' },
          { text: 'Pricing', url: '#pricing' },
          { text: 'Testimonials', url: '#testimonials' },
          { text: 'Contact', url: '#contact' }
        ],
        ctaButton: { text: '🚀 Get Started', url: `/login?whitelabel_id=${whiteLabel?.id || ''}` }
      }
    });
  }
  
  if (!hasHero) {
    elements.splice(hasNavbar ? 1 : 0, 0, {
      type: 'hero',
      content: {
        title: `Transform Your Business with ${companyName}`,
        subtitle: '',
        ctaButton: { text: 'Start Your Journey', url: `/login?whitelabel_id=${whiteLabel?.id || ''}` },
        secondaryButton: { text: 'Learn More', url: '#features' }
      }
    });
  }
  
  if (!hasFeatures) {
    const featuresIndex = elements.findIndex(el => el.type === 'hero') + 1;
    elements.splice(featuresIndex, 0, {
      type: 'features',
      content: {
        title: 'Why Choose Us?',
        subtitle: 'Discover the features that make us the preferred choice for businesses world',
        features: [
          { icon: '🚀', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
          { icon: '🔒', title: 'Secure & Reliable', description: 'Enterprise-grade security you can trust' },
          { icon: '📱', title: 'Mobile Responsive', description: 'Perfect experience on any device' },
          { icon: '🎯', title: 'Easy to Use', description: 'Intuitive interface designed for everyone' },
          { icon: '💡', title: 'Smart Analytics', description: 'Data-driven insights to grow your business' },
          { icon: '🌟', title: '24/7 Support', description: 'Expert help whenever you need it' }
        ]
      }
    });
  }
  
  if (!hasPricingSection) {
    console.log(`Domain ${domainPath}: No pricing section found in elements, adding fallback with ${clientPlans.length} plans`);
    elements.push({
      type: 'pricing',
      content: { 
        title: 'Choose Your Perfect Plan',
        subtitle: 'Flexible pricing options designed to grow with your business'
      }
    });
  } else {
    console.log(`Domain ${domainPath}: Pricing section found in elements`);
  }
  
  if (!hasTestimonials) {
    elements.push({
      type: 'testimonials',
      content: {
        title: 'What Our Customers Say',
        subtitle: 'Join thousands of satisfied customers who trust us with their business',
        testimonials: [
          { name: 'Sarah Johnson', role: 'CEO, TechStart', content: 'This platform transformed our business operations completely. Highly recommended!', rating: 5 },
          { name: 'Michael Chen', role: 'Marketing Director', content: 'The best investment we made this year. ROI was visible within the first month.', rating: 5 },
          { name: 'Emily Rodriguez', role: 'Small Business Owner', content: 'User-friendly, powerful, and affordable. Everything we needed in one place.', rating: 5 }
        ]
      }
    });
  }
  
  // Add "Become an Affiliate" section before contact
  const hasAffiliate = elements.some(el => el.type === 'affiliate');
  if (!hasAffiliate) {
    elements.push({
      type: 'affiliate',
      content: {
        title: 'Become an Affiliate',
        subtitle: 'Join our affiliate program and unlock powerful earning opportunities',
        features: [
          {
            icon: '💰',
            title: 'Earn Commission',
            description: 'Promote our plans and earn competitive commissions on every successful referral'
          },
          {
            icon: '🎯',
            title: 'Manage Your White-Label',
            description: 'Full control over your white-label platform with custom branding and domain paths'
          },
          {
            icon: '🔧',
            title: 'Plan Control',
            description: 'Make any plan public or private, customize pricing, and manage your product offerings'
          },
          {
            icon: '🌐',
            title: 'Custom Landing Pages',
            description: 'Create professional landing pages with our drag-and-drop builder'
          },
          {
            icon: '🔗',
            title: 'Custom Domains',
            description: 'Use your own domain like affiliate.com or choose from available domain paths'
          },
          {
            icon: '📊',
            title: 'Referral Tracking',
            description: 'Advanced analytics to track your referrals, conversions, and earnings in real-time'
          },
          {
            icon: '💼',
            title: 'Professional Dashboard',
            description: 'Modern, comprehensive affiliate dashboard with all the tools you need to succeed'
          },
          {
            icon: '⚡',
            title: 'Full Professional Features',
            description: 'Access to complete affiliate management system with advanced marketing tools'
          }
        ],
        ctaButton: {
          text: '🚀 Start Your Affiliate Journey',
          url: `/login?role=affiliate&whitelabel_id=${whiteLabel?.id || ''}`
        }
      }
    });
  }

  if (!hasContact) {
    elements.push({
      type: 'contact',
      content: {
        title: 'Ready to Get Started?',
        subtitle: 'Contact us today and let\'s discuss how we can help your business grow',
        email: 'hello@' + (domainPath || 'company') + '.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, Suite 100, City, State 12345'
      }
    });
  }
  
  if (!hasFooter) {
    elements.push({
      type: 'footer',
      content: {
        brand: companyName,
        description: 'Empowering businesses with innovative solutions since 2024',
        links: [
          { category: 'Product', items: [
            { text: 'Features', url: '#features' },
            { text: 'Pricing', url: '#pricing' },
            { text: 'Security', url: '#security' }
          ]},
          { category: 'Company', items: [
            { text: 'About Us', url: '#about' },
            { text: 'Careers', url: '#careers' },
            { text: 'Contact', url: '#contact' }
          ]},
          { category: 'Support', items: [
            { text: 'Help Center', url: '#help' },
            { text: 'Documentation', url: '#docs' },
            { text: 'Community', url: '#community' }
          ]}
        ],
        socialMedia: [
          { platform: 'Twitter', url: '#', icon: '🐦' },
          { platform: 'LinkedIn', url: '#', icon: '💼' },
          { platform: 'Facebook', url: '#', icon: '📘' }
        ]
      }
    });
  }
  
  const elementsHtml = elements.map((element: any) => {
    if (element.type === 'navbar') {
      const menuItems = element.content?.menuItems || [];
      const menuHtml = menuItems.map((item: any) => `
        <a href="${item.url}" style="color: #374151; text-decoration: none; font-weight: 500; padding: 8px 16px; border-radius: 6px; transition: all 0.3s ease;">
          ${item.icon || ''} ${item.text}
        </a>
      `).join('');
      
      return `
        <nav style="position: fixed; top: 0; left: 0; right: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(25px); border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding: 4px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 9999; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); min-height: 80px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-left: 20px;">
            ${userLogo ? `<img src="${userLogo}" alt="${companyName} Logo" style="height: 72px; width: auto; object-fit: contain; border-radius: 8px;">` :
              whiteLabel?.logo_url ? `<img src="${whiteLabel.logo_url}" alt="${companyName} Logo" style="height: 72px; width: auto; object-fit: contain; border-radius: 8px;">` : 
              element.content?.logo ? `<img src="${element.content.logo}" alt="Logo" style="height: 72px; width: auto; object-fit: contain; border-radius: 8px;">` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 24px;">
            ${menuHtml}
            <a href="${isEndUser ? `/${whiteLabel?.domainPath || "dashboard"}/user` : (element.content?.ctaButton?.url || `/login?whitelabel_id=${whiteLabel?.id || ''}`)}" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 12px 24px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 14px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
              ${isEndUser ? 'Back to Dashboard' : (element.content?.ctaButton?.text || '🚀 Start Free Trial')}
            </a>
          </div>
        </nav>
      `;
    } else if (element.type === 'hero') {
      // Apply customizations if provided
      const heroTitle = customizations?.text?.heroTitle || element.content?.title || `Transform Your Business with ${companyName}`;
      const heroSubtitle = customizations?.text?.heroSubtitle || element.content?.subtitle || `${companyName} helps businesses grow with cutting-edge strategies and proven results. Join thousands of successful companies who trust our platform"Changed So You Know I Get It".`;
      const ctaButtonText = customizations?.text?.ctaButtonText || element.content?.ctaButton?.text || '🚀 Get Started Free';
      
      return `
        <section id="hero" style="position: relative; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; padding: 120px 0 80px; text-align: center; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <!-- Animated Background Elements -->
          <div class="hero-bg-animation" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
            <div class="floating-shapes">
              <div class="shape shape-1" style="position: absolute; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; top: 20%; left: 10%; animation: float 6s ease-in-out infinite;"></div>
              <div class="shape shape-2" style="position: absolute; width: 150px; height: 150px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; top: 60%; right: 15%; animation: float 8s ease-in-out infinite reverse;"></div>
              <div class="shape shape-3" style="position: absolute; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; bottom: 30%; left: 20%; animation: float 7s ease-in-out infinite;"></div>
              <div class="shape shape-4" style="position: absolute; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.06); border-radius: 50%; top: 40%; right: 30%; animation: float 9s ease-in-out infinite reverse;"></div>
            </div>
            <!-- Particle Effect -->
            <div class="particles" style="position: absolute; width: 100%; height: 100%;">
              <div class="particle" style="position: absolute; width: 4px; height: 4px; background: rgba(255, 255, 255, 0.6); border-radius: 50%; top: 10%; left: 5%; animation: twinkle 3s ease-in-out infinite;"></div>
              <div class="particle" style="position: absolute; width: 3px; height: 3px; background: rgba(255, 255, 255, 0.4); border-radius: 50%; top: 25%; left: 80%; animation: twinkle 4s ease-in-out infinite 1s;"></div>
              <div class="particle" style="position: absolute; width: 5px; height: 5px; background: rgba(255, 255, 255, 0.5); border-radius: 50%; top: 70%; left: 15%; animation: twinkle 2.5s ease-in-out infinite 0.5s;"></div>
              <div class="particle" style="position: absolute; width: 4px; height: 4px; background: rgba(255, 255, 255, 0.7); border-radius: 50%; top: 50%; right: 10%; animation: twinkle 3.5s ease-in-out infinite 2s;"></div>
              <div class="particle" style="position: absolute; width: 3px; height: 3px; background: rgba(255, 255, 255, 0.3); border-radius: 50%; bottom: 20%; left: 60%; animation: twinkle 4.5s ease-in-out infinite 1.5s;"></div>
            </div>
          </div>
          
          <!-- Hero Content -->
          <div style="position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div class="hero-badge" style="display: inline-block; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); padding: 8px 20px; border-radius: 50px; margin-bottom: 2rem; border: 1px solid rgba(255, 255, 255, 0.2); animation: slideInDown 1s ease-out;">
              <span style="font-size: 0.9rem; font-weight: 600;">✨ Trusted by 10,000+ Businesses Worldwide</span>
            </div>
            
            <h1 class="hero-title" style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.2; animation: slideInUp 1s ease-out 0.2s both;">
              ${heroTitle}
            </h1>
            
            <p class="hero-subtitle" style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; animation: slideInUp 1s ease-out 0.4s both;">
              ${heroSubtitle}
            </p>
            
            <div class="hero-stats" style="display: flex; justify-content: center; gap: 40px; margin-bottom: 3rem; flex-wrap: wrap; animation: slideInUp 1s ease-out 0.6s both;">
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">10K+</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Happy Clients</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">99.9%</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Uptime</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">24/7</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Support</div>
              </div>
            </div>
            
            <div class="hero-buttons" style="display: flex; gap: 20px; justify-content: center; align-items: center; flex-wrap: wrap; animation: slideInUp 1s ease-out 0.8s both;">
              <a href="${isEndUser ? `/${whiteLabel?.domainPath || 'dashboard'}/user` : (element.content?.ctaButton?.url || `/login?whitelabel_id=${whiteLabel?.id || ''}`)}" class="btn-primary-hero" style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 18px; border: 2px solid rgba(255, 255, 255, 0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;">
                <span style="position: relative; z-index: 2;">${isEndUser ? 'Back to Dashboard' : ctaButtonText}</span>
              </a>
              <a href="${element.content?.secondaryButton?.url || '#demo'}" class="btn-secondary-hero" style="background: transparent; color: white; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: all 0.4s ease;">
                ${element.content?.secondaryButton?.text || '📹 Watch Demo'}
              </a>
            </div>
            
            <!-- Trust Indicators -->
            <div class="trust-indicators" style="margin-top: 4rem; animation: slideInUp 1s ease-out 1s both;">
              <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 1.5rem;">Trusted by leading companies worldwide</p>
              <div style="display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; opacity: 0.6;">
                <div style="font-size: 1.5rem; font-weight: 600;">Microsoft</div>
                <div style="font-size: 1.5rem; font-weight: 600;">Google</div>
                <div style="font-size: 1.5rem; font-weight: 600;">Amazon</div>
                <div style="font-size: 1.5rem; font-weight: 600;">Apple</div>
              </div>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'features') {
      // SVG Icon Library
      const svgIcons = {
        rocket: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="url(#gradient1)"/><defs><linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6366f1"/><stop offset="100%" style="stop-color:#8b5cf6"/></linearGradient></defs></svg>`,
        shield: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17Z" fill="url(#gradient2)"/><defs><linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#10b981"/><stop offset="100%" style="stop-color:#059669"/></linearGradient></defs></svg>`,
        chart: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21H21V19H5V3H3ZM7 17H9V10H7V17ZM11 17H13V7H11V17ZM15 17H17V13H15V17Z" fill="url(#gradient3)"/><defs><linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f59e0b"/><stop offset="100%" style="stop-color:#d97706"/></linearGradient></defs></svg>`,
        users: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8S10.2 12 8 12 4 10.2 4 8 5.8 4 8 4ZM8 14C5.8 14 1 15.1 1 17.3V20H15V17.3C15 15.1 10.2 14 8 14ZM16 14C15.7 14 15.4 14 15.1 14.1C16.2 14.8 17 15.9 17 17.3V20H23V17.3C23 15.1 18.2 14 16 14Z" fill="url(#gradient4)"/><defs><linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3b82f6"/><stop offset="100%" style="stop-color:#1d4ed8"/></linearGradient></defs></svg>`,
        clock: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2ZM17 13H11V7H12.5V11.5H17V13Z" fill="url(#gradient5)"/><defs><linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ec4899"/><stop offset="100%" style="stop-color:#be185d"/></linearGradient></defs></svg>`,
        support: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 9H14V4H19V9Z" fill="url(#gradient6)"/><defs><linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b5cf6"/><stop offset="100%" style="stop-color:#7c3aed"/></linearGradient></defs></svg>`
      };

      const getFeatureIcon = (iconName: string) => {
        return svgIcons[iconName as keyof typeof svgIcons] || svgIcons.rocket;
      };

      const features = element.content?.features || [
        { title: 'Lightning Fast', description: 'Optimized performance for maximum speed', icon: 'rocket' },
        { title: 'Secure & Reliable', description: 'Enterprise-grade security and 99.9% uptime', icon: 'shield' },
        { title: 'Advanced Analytics', description: 'Detailed insights and reporting tools', icon: 'chart' },
        { title: 'Team Collaboration', description: 'Work together seamlessly with your team', icon: 'users' },
        { title: '24/7 Support', description: 'Round-the-clock customer support', icon: 'clock' },
        { title: 'Easy Integration', description: 'Simple setup with existing tools', icon: 'support' }
      ];

      const featuresHtml = features.map((feature: any, index: number) => `
        <div class="feature-card" style="background: white; padding: 40px 30px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); transition: all 0.4s ease; position: relative; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.1);" data-aos="fade-up" data-aos-delay="${index * 100}">
          <!-- Gradient overlay on hover -->
          <div class="card-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%); opacity: 0; transition: opacity 0.3s ease;"></div>
          
          <div class="icon-container" style="position: relative; z-index: 2; display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 20px; margin-bottom: 1.5rem; transition: transform 0.3s ease;">
            ${getFeatureIcon(feature.icon)}
          </div>
          
          <h3 style="position: relative; z-index: 2; font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; color: #1a202c; transition: color 0.3s ease;">${feature.title}</h3>
          <p style="position: relative; z-index: 2; color: #4a5568; line-height: 1.7; font-size: 1rem;">${feature.description}</p>
          
          <!-- Decorative elements -->
          <div class="card-decoration" style="position: absolute; top: -20px; right: -20px; width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; opacity: 0.1;"></div>
        </div>
      `).join('');
      
      return `
        <section id="features" style="padding: 120px 0; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%); position: relative;">
          <!-- Background decoration -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);"></div>
          
          <div style="position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div style="text-align: center; margin-bottom: 5rem;">
              <div class="section-badge" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 20px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
                ✨ Features
              </div>
              <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; color: #1a202c; background: linear-gradient(135deg, #1a202c 0%, #4a5568 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                ${element.content?.title || 'Why Choose Our Platform?'}
              </h2>
              <p style="font-size: 1.2rem; color: #4a5568; max-width: 700px; margin: 0 auto; line-height: 1.7;">
                ${element.content?.subtitle || 'Powerful features designed to accelerate your business growth and streamline your operations'}
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px;">
              ${featuresHtml}
            </div>
            
            <!-- Call to action -->
            <div style="text-align: center; margin-top: 5rem;">
              <a href="#pricing" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 18px 40px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 18px; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4); transition: all 0.3s ease;">
                🚀 Explore All Features
              </a>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'testimonials') {
      const testimonials = element.content?.testimonials || [];
      const testimonialsHtml = testimonials.map((testimonial: any, index: number) => `
        <div class="testimonial-card scroll-animate-scale" style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; position: relative; overflow: hidden; transition: all 0.3s ease;">
          <div class="card-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05)); opacity: 0; transition: opacity 0.3s ease;"></div>
          <div style="position: relative; z-index: 2;">
            <div style="font-size: 2rem; margin-bottom: 1rem; color: #fbbf24;">⭐⭐⭐⭐⭐</div>
            <p style="font-style: italic; margin-bottom: 1.5rem; color: #4a5568; line-height: 1.6; font-size: 1.1rem;">
              "${testimonial.text}"
            </p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
              ${testimonial.avatar ? 
                `<div class="avatar-container" style="position: relative; width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 3px solid #6366f1; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                   <img data-src="${testimonial.avatar}" alt="${testimonial.name}" class="lazy-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                 </div>` : 
                `<div class="avatar-placeholder" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.5rem; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                   ${testimonial.name.charAt(0)}
                 </div>`
              }
              <div>
                <div style="font-weight: 600; color: #1a202c; font-size: 1.1rem;">${testimonial.name}</div>
                <div style="color: #6b7280; font-size: 0.9rem;">${testimonial.position}</div>
                <div style="color: #6366f1; font-size: 0.8rem; margin-top: 2px;">★ Verified Customer</div>
              </div>
            </div>
          </div>
          <div class="testimonial-decoration" style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)); border-radius: 50%; opacity: 0.5;"></div>
        </div>
      `).join('');
      
      return `
        <section style="padding: 100px 0; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%); position: relative; overflow: hidden;">
          <!-- Clean background without dots pattern -->
          <div class="section-decoration" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(99, 102, 241, 0.02); opacity: 0.5;"></div>
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
            <div style="text-align: center; margin-bottom: 4rem;" class="scroll-animate">
              <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 20px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem;">
                💬 TESTIMONIALS
              </div>
              <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #1a202c; background: linear-gradient(135deg, #1a202c, #4a5568); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${element.content?.title || 'What Our Clients Say'}
              </h2>
              <p style="font-size: 1.1rem; color: #4a5568; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                ${element.content?.subtitle || 'Hear from businesses that have transformed their operations with our platform'}
              </p>
              <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 20px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px; color: #6366f1; font-weight: 600;">
                  <span style="font-size: 1.2rem;">⭐</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div style="width: 1px; height: 20px; background: #e2e8f0;"></div>
                <div style="display: flex; align-items: center; gap: 8px; color: #6366f1; font-weight: 600;">
                  <span style="font-size: 1.2rem;">👥</span>
                  <span>500+ Happy Clients</span>
                </div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
              ${testimonialsHtml}
            </div>
            <div style="text-align: center; margin-top: 3rem;" class="scroll-animate">
              <a href="#contact" class="btn-enhanced interactive-element" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 16px 32px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 16px; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
                💬 Share Your Story
              </a>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'affiliate') {
      return `
        <section id="affiliate" style="padding: 120px 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); position: relative; overflow: hidden;">
          <!-- Background Pattern -->
          <div style="position: absolute; inset: 0; opacity: 0.05; background-image: radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0); background-size: 40px 40px;"></div>
          
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 1;">
            <div class="fade-in-up" style="text-align: center; margin-bottom: 5rem;">
              <h2 style="font-size: 3rem; font-weight: 700; margin-bottom: 1.5rem; color: #1a202c; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                ${element.content?.title || 'Become an Affiliate'}
              </h2>
              <p style="font-size: 1.3rem; color: #4a5568; max-width: 700px; margin: 0 auto; line-height: 1.6;">
                ${element.content?.subtitle || 'Join our affiliate program and unlock powerful earning opportunities'}
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px; margin-bottom: 4rem;">
              ${(element.content?.features || []).map((feature, index) => `
                <div class="feature-card fade-in-up" style="background: white; padding: 40px 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); text-align: center; transition: all 0.3s ease; border: 1px solid rgba(99, 102, 241, 0.1); animation-delay: ${index * 0.1}s;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 60px rgba(99, 102, 241, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 40px rgba(0, 0, 0, 0.08)'">
                  <div style="font-size: 3rem; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
                    ${feature.icon || '⭐'}
                  </div>
                  <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #1a202c;">
                    ${feature.title || 'Feature'}
                  </h3>
                  <p style="color: #4a5568; line-height: 1.6; font-size: 1rem;">
                    ${feature.description || 'Feature description'}
                  </p>
                </div>
              `).join('')}
            </div>
            
            <!-- Call to Action -->
            <div class="fade-in-up" style="text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); padding: 60px 40px; border-radius: 30px; position: relative; overflow: hidden; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);">
              <!-- Animated Background -->
              <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%); animation: shimmer 3s ease-in-out infinite;"></div>
              
              <div style="position: relative; z-index: 1;">
                <h3 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  Ready to Start Earning?
                </h3>
                <p style="font-size: 1.2rem; color: rgba(255,255,255,0.9); margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                  Join thousands of successful affiliates who are already earning with our platform. Get started today and unlock your earning potential!
                </p>
                
                <a href="${element.content?.ctaButton?.url || '/login?role=affiliate'}" class="cta-button" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; padding: 20px 50px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 18px; display: inline-flex; align-items: center; gap: 15px; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" onmouseover="this.style.transform='translateY(-3px) scale(1.05)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.3)'; this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.2)'; this.style.background='rgba(255,255,255,0.2)'">
                  <span>${element.content?.ctaButton?.text || '🚀 Start Your Affiliate Journey'}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'contact') {
      return `
        <section id="contact" class="parallax-section" style="padding: 120px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; position: relative; overflow: hidden;">
          <!-- Clean parallax background without grid pattern -->
          <div class="parallax-bg" style="position: absolute; inset: 0; background: rgba(255, 255, 255, 0.05); opacity: 0.3; transform: translateZ(0);"></div>
          
          <!-- Floating Particles -->
          <div class="floating-particles" style="position: absolute; inset: 0; pointer-events: none;">
            <div class="particle" style="position: absolute; width: 4px; height: 4px; background: rgba(255,255,255,0.6); border-radius: 50%; top: 20%; left: 10%; animation: float 6s ease-in-out infinite;"></div>
            <div class="particle" style="position: absolute; width: 6px; height: 6px; background: rgba(255,255,255,0.4); border-radius: 50%; top: 60%; left: 80%; animation: float 8s ease-in-out infinite reverse;"></div>
            <div class="particle" style="position: absolute; width: 3px; height: 3px; background: rgba(255,255,255,0.7); border-radius: 50%; top: 80%; left: 20%; animation: float 7s ease-in-out infinite;"></div>
            <div class="particle" style="position: absolute; width: 5px; height: 5px; background: rgba(255,255,255,0.5); border-radius: 50%; top: 30%; left: 70%; animation: float 9s ease-in-out infinite reverse;"></div>
          </div>

          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 1;">
            <div class="fade-in-up" style="text-align: center; margin-bottom: 4rem;">
              <h2 style="font-size: 3rem; font-weight: 700; margin-bottom: 1rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ${element.content?.title || 'Get In Touch'}
              </h2>
              <p style="font-size: 1.2rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                ${element.content?.subtitle || 'Ready to transform your business? Contact us today for a personalized consultation'}
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 50px; align-items: center;">
              <!-- Contact Information Cards -->
              <div class="contact-info" style="display: grid; gap: 30px;">
                <div class="contact-card fade-in-left" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); text-align: center; transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                  <!-- Email SVG Icon -->
                  <div style="margin-bottom: 1.5rem;">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style="margin: 0 auto; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
                      <polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 style="font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; color: white;">Email Us</h3>
                  <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">${element.content?.email || 'contact@company.com'}</p>
                </div>
                
                <div class="contact-card fade-in-left" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); text-align: center; transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                  <!-- Phone SVG Icon -->
                  <div style="margin-bottom: 1.5rem;">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style="margin: 0 auto; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
                    </svg>
                  </div>
                  <h3 style="font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; color: white;">Call Us</h3>
                  <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">${element.content?.phone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
              
              <!-- CTA Section with Professional Image Placeholder -->
              <div class="cta-section fade-in-right" style="text-align: center;">
                <!-- Professional Team Image Placeholder -->
                <div class="image-placeholder" style="width: 100%; height: 300px; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); border-radius: 20px; margin-bottom: 2rem; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
                  <div class="image-skeleton" style="position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: shimmer 2s infinite;"></div>
                  <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.7);">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style="margin-bottom: 1rem; opacity: 0.6;">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                      <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <p style="font-size: 1rem; margin: 0;">Professional Team Ready to Help</p>
                  </div>
                </div>
                
                <h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Ready to Get Started?</h3>
                <p style="font-size: 1.1rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; line-height: 1.6;">Join thousands of satisfied customers who have transformed their business with our solutions.</p>
                
                <a href="${isEndUser ? `/${whiteLabel?.domainPath || 'dashboard'}/user` : (element.content?.ctaButton?.url || `/login?whitelabel_id=${whiteLabel?.id || ''}`)}" class="cta-button" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 20px 40px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 18px; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); transition: all 0.3s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-3px) scale(1.05)'; this.style.boxShadow='0 15px 40px rgba(99, 102, 241, 0.6)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 10px 30px rgba(99, 102, 241, 0.4)'">
                  <span style="position: relative; z-index: 1;">${isEndUser ? 'Back to Dashboard' : (element.content?.ctaButton?.text || '🚀 Start Your Journey')}</span>
                  <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%); opacity: 0; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'"></div>
                </a>
              </div>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'pricing') {
      if (clientPlans.length === 0) {
        return `
          <section id="pricing" style="padding: 100px 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
              <div style="text-align: center; margin-bottom: 4rem;">
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #1a202c;">
                  Choose Your Perfect Plan
                </h2>
                <p style="font-size: 1.1rem; color: #4a5568; max-width: 600px; margin: 0 auto;">
                  Flexible pricing options designed to grow with your business
                </p>
              </div>
              <div style="text-align: center; padding: 60px 40px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 4rem; margin-bottom: 2rem;">💼</div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #1a202c;">Custom Enterprise Solutions</h3>
                <p style="font-size: 1.1rem; color: #4a5568; margin-bottom: 2rem;">
                  Contact us for custom pricing options tailored to your business needs and scale.
                </p>
                <a href="#contact" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 16px 32px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 16px; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
                  📞 Get Custom Quote
                </a>
              </div>
            </div>
          </section>
        `;
      }
      
      const plansHtml = (clientPlans || []).map((plan, index) => {
        const price = plan.monthlyPrice || plan.monthly_price || plan.price;
        const displayPrice = price ? '$' + price : 'Contact for Pricing';
        const isPopular = index === 1 || plan.popular; // Make middle plan popular by default
        
        // Parse features safely
        let features = [];
        try {
          if (plan.features && typeof plan.features === 'string') {
            const parsed = JSON.parse(plan.features);
            if (Array.isArray(parsed)) {
              features = parsed.flat().filter(f => f && typeof f === 'string');
            }
          } else if (Array.isArray(plan.features)) {
            features = plan.features;
          }
        } catch (e) {
          console.log('Error parsing features for plan', plan.id, ':', e.message);
          features = [];
        }
        
        // Ensure features is always an array
        if (!Array.isArray(features)) {
          features = [];
        }
        
        return `
        <div style="background: white; border-radius: 16px; padding: 40px 30px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); text-align: center; position: relative; transform: ${isPopular ? 'scale(1.05)' : 'scale(1)'}; border: ${isPopular ? '3px solid #6366f1' : '1px solid #e5e7eb'}; transition: all 0.3s ease;">
          ${isPopular ? `
            <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: 600;">
              🔥 Most Popular
            </div>
          ` : ''}
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #1a202c;">${plan.name}</h3>
            <div style="font-size: 3rem; font-weight: 800; color: ${isPopular ? '#6366f1' : '#1a202c'}; margin-bottom: 0.5rem;">
              ${displayPrice}
            </div>
            ${price ? `<div style="color: #6b7280; font-size: 0.9rem;">per month</div>` : ''}
          </div>
          <p style="color: #4a5568; margin-bottom: 2rem; line-height: 1.6; min-height: 48px;">${plan.description || 'Professional solution for your business needs.'}</p>
          <div style="margin-bottom: 2rem;">
            ${features.length > 0 ? features.map((feature: string) => `
              <div style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 12px; padding-left: 20px;">
                <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
                <span style="color: #4a5568;">${feature}</span>
              </div>
            `).join('') : `
              <div style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 12px; padding-left: 20px;">
                <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
                <span style="color: #4a5568;">Full platform access</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 12px; padding-left: 20px;">
                <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
                <span style="color: #4a5568;">24/7 customer support</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 12px; padding-left: 20px;">
                <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
                <span style="color: #4a5568;">Advanced analytics</span>
              </div>
            `}
          </div>
          ${!isAuthenticated ? `
            <!-- User NOT logged in - Show "Join First" button -->
            <div style="margin-bottom: 1rem;">
              <div style="background: #fef3c7; border: 2px solid #fbbf24; border-radius: 12px; padding: 12px; margin-bottom: 12px;">
                <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0;">
                  🔐 Join First Then Purchase
                </p>
              </div>
              <a href="/login?whitelabel_id=${currentWhiteLabelId}" 
                 style="display: block; width: 100%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); color: white; padding: 16px 24px; border: none; border-radius: 50px; font-weight: 700; text-align: center; text-decoration: none; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
                🚀 Join Now
              </a>
            </div>
          ` : (!isEndUser ? `
            <!-- User logged in with non-end_user role - Show logout/re-login prompt -->
            <div style="margin-bottom: 1rem;">
              <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 12px; padding: 12px; margin-bottom: 12px;">
                <p style="color: #991b1b; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">
                  ⚠️ You already login on the system with other role
                </p>
                <p style="color: #7f1d1d; font-size: 12px; margin: 0;">
                  Please click on Continue and relogin clearly.
                </p>
              </div>
              <button onclick="handleDomainLogout()" 
                      style="width: 100%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 16px 24px; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);">
                🔄 Continue
              </button>
            </div>
          ` : `
            <!-- User authenticated as end_user - Normal purchase button -->
            <button onclick="navigateToCheckout('${plan.id}', '${plan.name}', '${price || 0}')" 
                    style="width: 100%; background: ${isPopular ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' : '#f8fafc'}; color: ${isPopular ? 'white' : '#6366f1'}; padding: 16px 24px; border: ${isPopular ? 'none' : '2px solid #6366f1'}; border-radius: 50px; font-weight: 700; cursor: pointer; font-size: 16px; transition: all 0.3s ease; box-shadow: ${isPopular ? '0 8px 25px rgba(99, 102, 241, 0.4)' : 'none'};">
              ${isPopular ? '🚀 Get Started Now' : 'Choose Plan'}
            </button>
          `)}
        </div>
      `;
      }).join('');
      
      return `
        <section id="pricing" style="padding: 100px 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div style="text-align: center; margin-bottom: 4rem;">
              <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #1a202c;">
                Choose Your Perfect Plan
              </h2>
              <p style="font-size: 1.1rem; color: #4a5568; max-width: 600px; margin: 0 auto;">
                Flexible pricing options designed to grow with your business
              </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; align-items: start;">
              ${plansHtml}
            </div>
            <div style="text-align: center; margin-top: 3rem;">
              <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 1rem;">
                
              </p>
              <p style="color: #6b7280; font-size: 0.9rem;">
                Need a custom solution? <a href="#contact" style="color: #6366f1; text-decoration: none; font-weight: 600;">Contact our sales team</a>
              </p>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'affiliate-signup') {
      // Only show affiliate signup section if domain owner is a white_label_client
      // Hide if domain owner is an end_user (they can't recruit affiliates)
      const shouldShowAffiliateButton = domainOwnerUser?.role === 'white_label_client';
      
      if (!shouldShowAffiliateButton) {
        // If domain owner is an end_user, don't render the affiliate signup section
        return '';
      }
      
      const features = element.content?.features || [
        "💰 Earn up to 30% commission on all referrals",
        "🚀 Access to exclusive marketing materials",
        "📊 Real-time dashboard with analytics",
        "🎯 Dedicated affiliate support team",
        "🔄 Monthly commission payouts"
      ];
      
      const featuresHtml = features.map(feature => `
        <div style="margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
          ${feature}
        </div>
      `).join('');
      
      return `
        <section id="affiliate-signup" style="padding: 100px 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-align: center;">
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem;">
              ${element.content?.title || 'Join Our Affiliate Program'}
            </h2>
            <p style="font-size: 1.25rem; margin-bottom: 3rem; opacity: 0.95;">
              ${element.content?.subtitle || `Partner with ${companyName} and earn commissions by promoting our services to your network`}
            </p>
            <div style="margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
              ${featuresHtml}
            </div>
            <button onclick="openAffiliateSignupModal()" 
                    style="background: white; color: #f59e0b; padding: 16px 32px; border: none; border-radius: 8px; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: all 0.3s ease;">
              ${element.content?.buttonText || 'Start as White Label Affiliate'}
            </button>
          </div>
        </section>
      `;
    } else if (element.type === 'footer') {
      const links = element.content?.links || [];
      const socialMedia = element.content?.socialMedia || [];
      
      const linksHtml = links.map((category: any) => {
        const items = category?.items || [];
        return `
          <div style="margin-bottom: 2rem;">
            <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: #1a202c;">${category?.category || ''}</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${items.map((item: any) => `
                <li style="margin-bottom: 8px;">
                  <a href="${item.url}" style="color: #6b7280; text-decoration: none; font-size: 0.9rem; transition: color 0.3s ease;">
                    ${item.text}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }).join('');
      
      const socialHtml = socialMedia.map((social: any) => `
        <a href="${social.url}" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #f3f4f6; border-radius: 50%; color: #6b7280; text-decoration: none; font-size: 1.2rem; transition: all 0.3s ease; margin-right: 12px;">
          ${social.icon}
        </a>
      `).join('');
      
      return `
        <footer style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 60px 0 30px;">
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 3rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                  <span style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ${element.content?.brand || companyName}
                  </span>
                </div>
                <p style="color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.9rem;">
                  ${element.content?.description || 'Empowering businesses with innovative solutions since 2024'}
                </p>
                <div style="display: flex; align-items: center;">
                  ${socialHtml}
                </div>
              </div>
              ${linksHtml}
            </div>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 2rem; display: flex; justify-content: between; align-items: center; flex-wrap: wrap; gap: 20px;">
              <div style="color: #6b7280; font-size: 0.9rem;">
                © ${new Date().getFullYear()} ${element.content?.brand || companyName}. All rights reserved.
              </div>
              <div style="display: flex; gap: 20px;">
                <a href="#privacy" style="color: #6b7280; text-decoration: none; font-size: 0.9rem;">Privacy Policy</a>
                <a href="#terms" style="color: #6b7280; text-decoration: none; font-size: 0.9rem;">Terms of Service</a>
                <a href="#cookies" style="color: #6b7280; text-decoration: none; font-size: 0.9rem;">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      `;
    }
    return '';
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${companyName} - Professional Solutions</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; overflow-x: hidden; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          /* Tablet styles */
          .container { padding: 0 20px; }
          
          /* Footer responsive for tablets */
          footer div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
          }
        }
        
        @media (max-width: 768px) {
          .container { padding: 0 16px; }
          
          /* Navigation responsive */
          nav { 
            padding: 12px 16px !important; 
            flex-wrap: wrap; 
            position: relative;
          }
          nav > div:last-child { 
            display: none; 
          }
          nav::after {
            content: "☰";
            font-size: 24px;
            color: #6366f1;
            cursor: pointer;
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
          }
          
          /* Hero section responsive */
          section[style*="min-height: 100vh"] h1 { 
            font-size: 2.5rem !important; 
            line-height: 1.1 !important;
          }
          section[style*="min-height: 100vh"] p { 
            font-size: 1.1rem !important; 
          }
          section[style*="min-height: 100vh"] > div > div { 
            flex-direction: column; 
            gap: 16px !important; 
          }
          section[style*="min-height: 100vh"] a { 
            padding: 16px 28px !important; 
            font-size: 16px !important; 
            width: 100%;
            text-align: center;
          }
          
          /* Features grid responsive */
          section div[style*="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"] { 
            grid-template-columns: 1fr !important; 
            gap: 20px !important; 
          }
          
          /* Pricing cards responsive */
          section#pricing div[style*="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))"] { 
            grid-template-columns: 1fr !important; 
            gap: 20px !important; 
          }
          section#pricing div[style*="transform: scale"] { 
            transform: scale(1) !important; 
          }
          
          /* Testimonials responsive */
          section div[style*="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Contact section responsive */
          section div[style*="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"] {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          
          /* Footer responsive */
          footer div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
          
          footer div[style*="display: flex; justify-content: between"] {
            flex-direction: column !important;
            text-align: center !important;
            gap: 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          /* Extra small screens */
          section[style*="min-height: 100vh"] h1 { 
            font-size: 2rem !important; 
          }
          section[style*="min-height: 100vh"] { 
            padding: 100px 0 60px !important; 
          }
          section { 
            padding: 60px 0 !important; 
          }
          
          /* Pricing cards on mobile */
          section#pricing div[style*="padding: 40px 30px"] { 
            padding: 30px 20px !important; 
          }
          
          /* Features cards on mobile */
          section div[style*="padding: 30px"] { 
            padding: 25px 20px !important; 
          }
          
          /* Typography adjustments */
          h2[style*="font-size: 2.5rem"] {
            font-size: 2rem !important;
          }
          
          h3[style*="font-size: 1.5rem"] {
            font-size: 1.3rem !important;
          }
        }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Animation keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Animation classes */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Hover effects and transitions */
        @media (hover: hover) {
          nav a:hover { 
            background-color: rgba(99, 102, 241, 0.1) !important; 
            transform: translateY(-2px);
          }
          
          section div[style*="box-shadow"]:hover { 
            transform: translateY(-8px) !important; 
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
          }
          
          button:hover, a[style*="background"]:hover { 
            transform: translateY(-3px) !important; 
            box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4) !important;
          }
          
          footer a:hover {
            color: #6366f1 !important;
            transform: translateX(5px);
          }
          
          /* Pricing card hover effects */
          section#pricing div[style*="border-radius: 16px"]:hover {
            transform: translateY(-10px) scale(1.02) !important;
            box-shadow: 0 25px 70px rgba(99, 102, 241, 0.2) !important;
          }
          
          /* Feature card hover effects */
          section div[style*="background: white"]:hover {
            transform: translateY(-8px) rotate(1deg) !important;
          }
        }
        
        /* Loading animation for images */
        img {
          transition: opacity 0.3s ease;
        }
        
        img:not([src]) {
          opacity: 0;
        }
        
        /* Smooth transitions for all interactive elements */
        *, *::before, *::after {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8, #7c3aed);
        }
        
        /* Modal Styles */
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        
        .modal.active {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .close-btn:hover {
          color: #333;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }
        
        .btn-primary {
          background: #667eea;
          color: white;
        }
        
        .btn-primary:hover {
          background: #5a67d8;
        }
        
        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }
        
        .btn-secondary:hover {
          background: #cbd5e0;
        }
        
        .plan-summary {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .plan-name {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .plan-price {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .plan-description {
          color: #4a5568;
          margin-bottom: 15px;
        }
        
        .security-note {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #22543d;
        }
        
        .btn-actions {
          display: flex;
          gap: 15px;
        }
        
        .btn-actions .btn {
          flex: 1;
        }
        
        .loading {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Shimmer Animation for Image Placeholders */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Skeleton Loading States */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .skeleton-text {
          height: 1rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }
        
        .skeleton-title {
          height: 1.5rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          width: 60%;
        }
        
        .skeleton-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
        
        .skeleton-card {
          padding: 1.5rem;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        /* Enhanced Image Loading Effects */
        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        
        .image-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s;
        }
        
        .image-container.loading::before {
          left: 100%;
        }
        
        .image-fade-in {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        
        .image-fade-in.loaded {
          opacity: 1;
        }
        
        /* Parallax Effects */
        .parallax-section {
          transform-style: preserve-3d;
        }
        
        .parallax-bg {
          will-change: transform;
        }
        
        .parallax-element {
          will-change: transform;
          transition: transform 0.1s ease-out;
        }
        
        /* Advanced Loading States */
        .content-loader {
          position: relative;
          overflow: hidden;
        }
        
        .content-loader::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shimmer 2s infinite;
        }
        
        /* Enhanced Hover States */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .hover-glow {
          position: relative;
          overflow: hidden;
        }
        
        .hover-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .hover-glow:hover::before {
          left: 100%;
        }
        
        /* Progressive Image Enhancement */
        .progressive-image {
          position: relative;
          overflow: hidden;
        }
        
        .progressive-image .placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.9rem;
        }
        
        .progressive-image .actual-image {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .progressive-image .actual-image.loaded {
          opacity: 1;
        }
        
        /* Advanced Scroll Indicators */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(99, 102, 241, 0.1);
          z-index: 1000;
        }
        
        .scroll-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
          width: 0%;
          transition: width 0.1s ease;
        }
        
        /* Advanced Scroll-Triggered Animations */
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-animate-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate-left.in-view {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-animate-right {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate-right.in-view {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-animate-scale {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate-scale.in-view {
          opacity: 1;
          transform: scale(1);
        }
        
        /* Enhanced Micro-Interactions */
        .interactive-element {
          position: relative;
          overflow: hidden;
        }
        
        .interactive-element::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          transition: all 0.6s ease;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
        }
        
        .interactive-element:hover::before {
          width: 300px;
          height: 300px;
        }
        
        /* Tooltip Styles */
        .tooltip {
          position: relative;
          display: inline-block;
        }
        
        .tooltip .tooltip-text {
          visibility: hidden;
          width: 200px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px 12px;
          position: absolute;
          z-index: 1000;
          bottom: 125%;
          left: 50%;
          margin-left: -100px;
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          transform: translateY(10px);
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .tooltip .tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
        
        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Parallax Effect */
        .parallax-element {
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* Image Loading Effects */
        .image-placeholder {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .lazy-image {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .lazy-image.loaded {
          opacity: 1;
        }
        
        /* Enhanced Button Effects */
        .btn-enhanced {
          position: relative;
          overflow: hidden;
          transform: perspective(1px) translateZ(0);
          transition: all 0.3s ease;
        }
        
        .btn-enhanced::before {
          content: '';
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          transform: scaleX(0);
          transform-origin: 0 50%;
          transition: transform 0.3s ease-out;
        }
        
        .btn-enhanced:hover::before {
          transform: scaleX(1);
        }
        
        .btn-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        /* Stagger Animation for Lists */
        .stagger-item {
          opacity: 0;
          transform: translateY(20px);
          animation: staggerIn 0.6s ease forwards;
        }
        
        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .stagger-item:nth-child(5) { animation-delay: 0.5s; }
        .stagger-item:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes staggerIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Floating Action Button */
        .fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .fab:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.6);
        }
        
        /* Progress Indicator */
        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.3s ease;
          z-index: 9999;
        }
        
        ${editMode ? `
        /* Edit Mode Styles */
        .editable-element {
          position: relative;
          cursor: pointer;
        }
        
        .editable-element:hover {
          outline: 2px dashed #6366f1;
          outline-offset: 2px;
        }
        
        .edit-overlay {
          position: absolute;
          top: -30px;
          left: 0;
          background: #6366f1;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
        }
        
        .editable-element:hover .edit-overlay {
          opacity: 1;
        }
        ` : ''}
      </style>
      
      ${editMode ? `
      <script>
        // Edit Mode JavaScript
        document.addEventListener('DOMContentLoaded', function() {
          // Add edit overlays to all text elements
          const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
          
          textElements.forEach(element => {
            // Skip if element is already processed or is inside a modal
            if (element.classList.contains('editable-element') || element.closest('.modal')) {
              return;
            }
            
            element.classList.add('editable-element');
            
            // Create edit overlay
            const overlay = document.createElement('div');
            overlay.className = 'edit-overlay';
            overlay.textContent = 'Click to edit';
            element.appendChild(overlay);
            
            // Add click handler
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              // Get element position for overlay placement
              const rect = element.getBoundingClientRect();
              const position = {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
              };
              
              // Send message to parent window (ModernFigmaBuilder)
              if (window.parent) {
                window.parent.postMessage({
                  type: 'ELEMENT_CLICKED',
                  elementType: 'text',
                  fieldName: element.tagName.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
                  currentValue: element.textContent.replace('Click to edit', '').trim(),
                  position: position
                }, '*');
              }
            });
          });
          
          // Listen for updates from parent window
          window.addEventListener('message', function(event) {
            if (event.data.type === 'ELEMENT_UPDATED') {
              // Find and update the element
              const elements = document.querySelectorAll('.editable-element');
              elements.forEach(el => {
                if (el.textContent.replace('Click to edit', '').trim() === event.data.oldValue) {
                  // Update text content while preserving the overlay
                  const overlay = el.querySelector('.edit-overlay');
                  el.textContent = event.data.newValue;
                  if (overlay) {
                    el.appendChild(overlay);
                  }
                }
              });
            }
          });
        });
      </script>
      ` : ''}
    </head>
    <body>
      ${elementsHtml}
      
      <!-- Checkout Modal -->
      <div id="checkoutModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Complete Your Purchase</h2>
            <button class="close-btn" onclick="closeCheckoutModal()">&times;</button>
          </div>
          
          <div class="plan-summary">
            <div class="plan-name" id="modalPlanName">Plan Name</div>
            <div class="plan-price" id="modalPlanPrice">$0.00</div>
            <div class="plan-description" id="modalPlanDescription">Professional solution for your business needs.</div>
          </div>
          
          <form id="checkoutForm">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="email" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" class="form-input" id="firstName" required>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" class="form-input" id="lastName" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Referral Code (Optional)</label>
              <input type="text" class="form-input" id="referralCode" placeholder="Enter referral code">
            </div>
            
            <div class="form-group">
              <label class="form-label">Name on Card</label>
              <input type="text" class="form-input" id="nameOnCard" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Card Number</label>
              <input type="text" class="form-input" id="cardNumber" placeholder="1234 5678 9012 3456" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Expiry Date</label>
                <input type="text" class="form-input" id="expiryDate" placeholder="MM/YY" maxlength="5" required>
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input type="text" class="form-input" id="cvv" placeholder="123" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Address</label>
              <input type="text" class="form-input" id="address" required>
            </div>
            
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">City</label>
                <input type="text" class="form-input" id="city" required>
              </div>
              <div class="form-group">
                <label class="form-label">State</label>
                <input type="text" class="form-input" id="state" required>
              </div>
              <div class="form-group">
                <label class="form-label">ZIP Code</label>
                <input type="text" class="form-input" id="zip" required>
              </div>
            </div>
            
            <div class="security-note">
              <span>🔒</span>
              <span>Your payment information is secure and encrypted</span>
            </div>
            
            <div class="btn-actions">
              <button type="button" class="btn btn-secondary" onclick="closeCheckoutModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" id="submitBtn">
                Complete Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Dashboard Access Buttons -->
      <div style="position: fixed; top: 20px; right: 20px; z-index: 999; display: flex; gap: 10px;">
        <button id="userButton" onclick="handleUserButtonClick()" 
                style="background: #3b82f6; color: white; padding: 12px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Start
        </button>
        ${domainOwnerUser?.role === 'white_label_client' ? `
        <button id="affiliateButton" onclick="handleAffiliateButtonClick()" 
                style="background: #10b981; color: white; padding: 12px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Start As Affiliate
        </button>
        ` : ''}
      </div>

      <!-- Affiliate modals removed - users now access both dashboards with same authentication -->
      
      <script>
        // Performance optimizations and advanced effects
        document.addEventListener('DOMContentLoaded', function() {
          // Initialize scroll progress bar
          const scrollProgress = document.createElement('div');
          scrollProgress.className = 'scroll-progress';
          scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
          document.body.appendChild(scrollProgress);
          
          const progressBar = scrollProgress.querySelector('.scroll-progress-bar');
          
          // Update progress bar on scroll
          window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
          });
          
          // Add floating action button with enhanced styling
          const fab = document.createElement('button');
          fab.className = 'fab tooltip hover-lift';
          fab.innerHTML = '↑<span class="tooltip-text">Back to Top</span>';
          fab.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
          document.body.appendChild(fab);
          
          // Show/hide FAB based on scroll position
          window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
              fab.style.opacity = '1';
              fab.style.transform = 'scale(1)';
            } else {
              fab.style.opacity = '0';
              fab.style.transform = 'scale(0.8)';
            }
          });
          
          // Enhanced scroll animations with stagger effect
          const scrollElements = document.querySelectorAll('section, .feature-card, .pricing-card, .testimonial-card, h1, h2, h3, p, .contact-card, .cta-section');
          const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  entry.target.classList.add('scroll-animate', 'in-view');
                }, index * 100); // Stagger animation
              }
            });
          }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          });
          
          scrollElements.forEach(el => {
            el.classList.add('scroll-animate');
            scrollObserver.observe(el);
          });
          
          // Advanced parallax effects
          const parallaxSections = document.querySelectorAll('.parallax-section');
          const parallaxElements = document.querySelectorAll('.parallax-bg, .parallax-element');
          
          function updateParallax() {
            const scrollTop = window.pageYOffset;
            
            parallaxSections.forEach(section => {
              const rect = section.getBoundingClientRect();
              const speed = 0.5;
              const yPos = -(scrollTop * speed);
              
              const bgElement = section.querySelector('.parallax-bg');
              if (bgElement && rect.bottom >= 0 && rect.top <= window.innerHeight) {
                bgElement.style.transform = \`translate3d(0, \${yPos}px, 0)\`;
              }
            });
            
            // Floating particles animation
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
              const speed = 0.2 + (index * 0.1);
              const yPos = scrollTop * speed;
              particle.style.transform = \`translateY(\${yPos}px)\`;
            });
          }
          
          // Throttled scroll handler for better performance
          let ticking = false;
          function requestTick() {
            if (!ticking) {
              requestAnimationFrame(updateParallax);
              ticking = true;
            }
          }
          
          window.addEventListener('scroll', () => {
            requestTick();
            ticking = false;
          });
          
          // Progressive image loading with placeholders
          const imageContainers = document.querySelectorAll('.image-placeholder, .progressive-image');
          const progressiveImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const container = entry.target;
                
                // Simulate image loading with skeleton effect
                setTimeout(() => {
                  container.classList.add('loaded');
                  
                  // Add shimmer effect
                  const skeleton = container.querySelector('.image-skeleton');
                  if (skeleton) {
                    skeleton.style.animation = 'shimmer 1.5s ease-in-out';
                  }
                }, Math.random() * 1000 + 500); // Random delay for realistic loading
                
                progressiveImageObserver.unobserve(container);
              }
            });
          }, { threshold: 0.1 });
          
          imageContainers.forEach(container => {
            progressiveImageObserver.observe(container);
          });
          
          // Enhanced hover effects for interactive elements
          const interactiveElements = document.querySelectorAll('.contact-card, .cta-button, .feature-card, .pricing-card');
          
          interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
              this.classList.add('hover-lift');
            });
            
            element.addEventListener('mouseleave', function() {
              this.classList.remove('hover-lift');
            });
          });
          
          // Skeleton loading simulation for dynamic content
          function createSkeletonLoader(container) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.innerHTML = \`
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text" style="width: 80%;"></div>
              <div class="skeleton skeleton-text" style="width: 60%;"></div>
            \`;
            return skeleton;
          }
          
          // Content loading states
          const contentLoaders = document.querySelectorAll('.content-loader');
          contentLoaders.forEach(loader => {
            loader.classList.add('skeleton');
            
            setTimeout(() => {
              loader.classList.remove('skeleton');
              loader.classList.add('loaded');
            }, Math.random() * 2000 + 1000);
          });
          
          // Enhanced button interactions
          const buttons = document.querySelectorAll('button, .btn, .cta-button');
          buttons.forEach(button => {
            button.addEventListener('click', function(e) {
              // Ripple effect
              const ripple = document.createElement('span');
              const rect = this.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height);
              const x = e.clientX - rect.left - size / 2;
              const y = e.clientY - rect.top - size / 2;
              
              ripple.style.cssText = \`
                position: absolute;
                width: \${size}px;
                height: \${size}px;
                left: \${x}px;
                top: \${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
              \`;
              
              this.style.position = 'relative';
              this.style.overflow = 'hidden';
              this.appendChild(ripple);
              
              setTimeout(() => {
                ripple.remove();
              }, 600);
            });
          });
          
          // Add ripple animation
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          \`;
          document.head.appendChild(style);
          
          // Parallax effect for hero section
          const heroSection = document.querySelector('section[style*="background"]');
          if (heroSection) {
            window.addEventListener('scroll', () => {
              const scrolled = window.pageYOffset;
              const rate = scrolled * -0.5;
              heroSection.style.transform = \`translateY(\${rate}px)\`;
            });
          }
          
          // Add interactive elements class to buttons and cards
          document.querySelectorAll('button, .feature-card, .pricing-card, a[style*="background"]').forEach(el => {
            el.classList.add('interactive-element');
          });
          
          // Enhanced button effects
          document.querySelectorAll('button, a[style*="background"]').forEach(btn => {
            btn.classList.add('btn-enhanced');
          });
          
          // Lazy load images with placeholder effect
          const images = document.querySelectorAll('img[data-src]');
          const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.style.width = img.style.width || '100%';
                placeholder.style.height = img.style.height || '200px';
                img.parentNode.insertBefore(placeholder, img);
                
                // Load actual image
                const actualImg = new Image();
                actualImg.onload = () => {
                  img.src = actualImg.src;
                  img.classList.add('lazy-image', 'loaded');
                  placeholder.remove();
                };
                actualImg.src = img.dataset.src;
                
                img.removeAttribute('data-src');
                observer.unobserve(img);
              }
            });
          });
          images.forEach(img => {
            img.classList.add('lazy-image');
            lazyImageObserver.observe(img);
          });
          
          // Add stagger animation to feature lists
          document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.classList.add('stagger-item');
            card.style.animationDelay = \`\${index * 0.1}s\`;
          });
          
          // Animate elements on scroll (legacy support)
          const animateElements = document.querySelectorAll('section > div, .pricing-card, .testimonial-card');
          const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }
            });
          }, { threshold: 0.1 });
          
          animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
          });
          
          // Smooth scroll for anchor links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          });
          
          // Enhanced loading states for buttons
          document.querySelectorAll('button, a[style*="background"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
              if (!this.classList.contains('loading') && !this.getAttribute('onclick')?.includes('navigateToCheckout')) {
                this.classList.add('loading');
                const originalText = this.textContent;
                const loadingSpinner = document.createElement('span');
                loadingSpinner.className = 'loading';
                this.innerHTML = '';
                this.appendChild(loadingSpinner);
                this.appendChild(document.createTextNode(' Loading...'));
                
                setTimeout(() => {
                  this.textContent = originalText;
                  this.classList.remove('loading');
                }, 2000);
              }
            });
          });
          
          // Add tooltips to interactive elements
          document.querySelectorAll('.feature-card h3').forEach(title => {
            title.classList.add('tooltip');
            const tooltipText = document.createElement('span');
            tooltipText.className = 'tooltip-text';
            tooltipText.textContent = 'Click to learn more about this feature';
            title.appendChild(tooltipText);
          });
          
          // Keyboard navigation support
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              closeCheckoutModal();
            }
          });
          
          // Add focus management for accessibility
          document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('focus', function() {
              this.style.outline = '2px solid #6366f1';
              this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
              this.style.outline = 'none';
            });
          });
        });
        
        // Define all functions in global scope for accessibility
        window.navigateToCheckout = function(planId, planName, planPrice) {
          console.log('navigateToCheckout called with:', { planId, planName, planPrice });
          console.log('Type of planPrice:', typeof planPrice, 'Value:', planPrice);
          
          // Show checkout modal
          const modal = document.getElementById('checkoutModal');
          modal.classList.add('active');
          
          // Update modal content
          document.getElementById('modalPlanName').textContent = planName;
          
          // Handle price display correctly
          let displayPrice = 'Contact for Pricing';
          const priceValue = parseFloat(planPrice);
          
          if (planPrice && planPrice !== 'null' && planPrice !== 'undefined' && planPrice !== '0' && !isNaN(priceValue) && priceValue > 0) {
            displayPrice = \`$\${priceValue}\`;
          } else if (planPrice === '0' || planPrice === 0 || priceValue === 0) {
            displayPrice = 'Free';
          }
          
          console.log('Display price set to:', displayPrice);
          document.getElementById('modalPlanPrice').textContent = displayPrice;
          document.getElementById('modalPlanDescription').textContent = planName + ' - Professional solution for your business needs.';
          
          // Store plan data for form submission
          window.currentPlan = {
            id: planId,
            name: planName,
            price: planPrice,
            monthlyPrice: planPrice // Store both for compatibility
          };
        };
        
        window.closeCheckoutModal = function() {
          const modal = document.getElementById('checkoutModal');
          modal.classList.remove('active');
        };
        
        // Affiliate modal functions removed - users now access dashboards directly
        
        window.formatCardNumber = function(input) {
          let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
          let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
          if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
          input.value = formattedValue;
        };
        
        window.formatExpiryDate = function(input) {
          // Remove all non-digits
          const v = input.value.replace(/\D/g, '');
          
          // Limit to 4 digits (MMYY)
          const limited = v.substring(0, 4);
          
          // Add slash after 2 digits
          if (limited.length >= 2) {
            input.value = limited.substring(0, 2) + '/' + limited.substring(2);
          } else {
            input.value = limited;
          }
        };
        
        window.openLoginModal = function() {
          console.log('Opening login modal...');
          // Implementation for login modal
        };
        
        window.openSignupModal = function() {
          console.log('Opening signup modal...');
          // Implementation for signup modal
        };
        
        window.continueAsGuest = function(planId, planName, planPrice) {
          console.log('Continuing as guest...');
          window.navigateToCheckout(planId, planName, planPrice);
        };
        
        window.navigateToSignup = function(intent = 'user') {
          // Store user intent for post-auth redirect
          sessionStorage.setItem('authIntent', intent);
          sessionStorage.setItem('authDomain', '${domainPath}');
          
          // Navigate to signup with white-label context
          const whiteLabelId = ${whiteLabel?.id || 'null'};
          const contextParam = whiteLabelId ? \`client_\${whiteLabelId}\` : 'domain';
          window.location.href = \`/auth?context=\${contextParam}\`;
        };
        
        window.handleUserButtonClick = function() {
          window.checkAuthStatus().then(user => {
            if (user) {
              // User is authenticated - go to user dashboard
              window.location.href = '/${domainPath}/user';
            } else {
              // User not authenticated - go to auth with user intent
              window.navigateToSignup('user');
            }
          });
        };
        
        window.handleAffiliateButtonClick = function() {
          window.checkAuthStatus().then(user => {
            if (user) {
              // User is authenticated - go to affiliate dashboard
              window.location.href = '/${domainPath}/affiliate';
            } else {
              // User not authenticated - go to auth with affiliate intent
              window.navigateToSignup('affiliate');
            }
          });
        };
        
        window.logout = function() {
          fetch('/api/logout', { method: 'POST' })
            .then(() => {
              window.location.reload();
            })
            .catch(console.error);
        };
        
        // Domain-specific logout and redirect
        window.handleDomainLogout = function() {
          const whiteLabelId = ${currentWhiteLabelId || 'null'};
          
          // Logout the user
          fetch('/api/logout', { method: 'POST' })
            .then(response => response.json())
            .then(() => {
              // Redirect to auth page with correct whitelabel_id
              window.location.href = \`/auth?whitelabel_id=\${whiteLabelId}\`;
            })
            .catch(err => {
              console.error('Domain logout error:', err);
              // Still redirect even if logout fails
              window.location.href = \`/auth?whitelabel_id=\${whiteLabelId}\`;
            });
        };
        
        // Authentication status check
        window.checkAuthStatus = function() {
          return fetch('/api/auth/user', { credentials: 'include' })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              return null;
            })
            .catch(() => null);
        };
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Domain landing page loaded successfully');
          
          // Initialize checkout modal functionality
          window.initializeCheckoutModal = function() {
            // This will be called by React app when it mounts
            console.log('Checkout modal functionality initialized');
          };
          
          // Setup modal functionality
          const modal = document.getElementById('checkoutModal');
          const checkoutForm = document.getElementById('checkoutForm');
          
          // Setup card number formatting
          document.getElementById('cardNumber').addEventListener('input', function(e) {
            window.formatCardNumber(e.target);
          });
          
          // Setup expiry date formatting
          document.getElementById('expiryDate').addEventListener('input', function(e) {
            window.formatExpiryDate(e.target);
          });
          
          // Affiliate form handlers removed - users now access dashboards directly
          
          // Setup form submission
          checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!window.currentPlan) {
              alert('No plan selected');
              return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;
            
            try {
              // Debug logging for window.currentPlan
              console.log('window.currentPlan:', window.currentPlan);
              
              // Check if currentPlan is available, if not use default values or get from modal
              let planId, amount;
              if (window.currentPlan && window.currentPlan.id) {
                planId = parseInt(window.currentPlan.id);
                amount = window.currentPlan.monthlyPrice;
              } else {
                // Fallback: try to get from modal elements or use default
                const modalPlanName = document.getElementById('modalPlanName');
                const modalPlanPrice = document.getElementById('modalPlanPrice');
                
                // Extract plan ID from URL or use a default (this should be set properly)
                const urlParams = new URLSearchParams(window.location.search);
                planId = parseInt(urlParams.get('planId')) || 1; // Default to plan 1
                
                // Extract amount from modal price display
                if (modalPlanPrice && modalPlanPrice.textContent) {
                  const priceText = modalPlanPrice.textContent.replace(/[^0-9.]/g, '');
                  amount = parseFloat(priceText) || 29.99; // Default price
                } else {
                  amount = 29.99; // Default price
                }
                
                console.log('Using fallback planId:', planId, 'amount:', amount);
              }
              
              // Get form data
              const formData = {
                planId: planId,
                amount: amount,
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                nameOnCard: document.getElementById('nameOnCard').value,
                cardNumber: document.getElementById('cardNumber').value.replace(/\\s/g, ''),
                expiryDate: document.getElementById('expiryDate').value,
                cvv: document.getElementById('cvv').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                referralCode: document.getElementById('referralCode').value.trim() || null
              };
              
              // Debug logging for form data
              console.log('Form data being sent:', formData);
              
              // Validate required fields
              const requiredFields = [
                { field: 'email', value: formData.email, label: 'Email' },
                { field: 'firstName', value: formData.firstName, label: 'First Name' },
                { field: 'lastName', value: formData.lastName, label: 'Last Name' },
                { field: 'nameOnCard', value: formData.nameOnCard, label: 'Name on Card' },
                { field: 'cardNumber', value: formData.cardNumber, label: 'Card Number' },
                { field: 'expiryDate', value: formData.expiryDate, label: 'Expiry Date' },
                { field: 'cvv', value: formData.cvv, label: 'CVV' },
                { field: 'address', value: formData.address, label: 'Address' },
                { field: 'city', value: formData.city, label: 'City' },
                { field: 'state', value: formData.state, label: 'State' },
                { field: 'zip', value: formData.zip, label: 'ZIP Code' }
              ];

              const missingFields = requiredFields.filter(field => !field.value || !field.value.trim());

              if (missingFields.length > 0) {
                alert('Missing required fields: ' + missingFields.map(f => f.label).join(', '));
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }

              // Validate and format expiry date (MM/YY format)
              const expiryRegex = /^(0[1-9]|1[0-2])\\\/([0-9]{2})$/;
              if (!expiryRegex.test(formData.expiryDate)) {
                alert('Please enter expiry date in MM/YY format (e.g., 12/25).');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }

              // Additional validation for card number (basic length check)
              if (formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
                alert('Please enter a valid card number.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }

              // Validate CVV length
              if (formData.cvv.length < 3 || formData.cvv.length > 4) {
                alert('Please enter a valid CVV (3-4 digits).');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }

              // Validate email format
              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }
              
              // Split name on card into first and last name
              const nameParts = formData.nameOnCard.split(' ');
              const firstName = nameParts[0] || '';
              const lastName = nameParts.slice(1).join(' ') || '';
              
              // Debug logging for name splitting
              console.log('Name on card:', formData.nameOnCard);
              console.log('Name parts:', nameParts);
              console.log('First name:', firstName);
              console.log('Last name:', lastName);
              
              // Prepare the request body
              const requestBody = {
                planId: formData.planId,
                amount: formData.amount,
                cardNumber: formData.cardNumber,
                expirationDate: formData.expiryDate.replace('/', ''), // Convert MM/YY to MMYY
                cvv: formData.cvv,
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                referralCode: formData.referralCode
              };
              
              // Additional validation for the converted expiry date
              if (requestBody.expirationDate.length !== 4) {
                alert('Invalid expiry date format. Please use MM/YY format.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }
              
              // Debug logging for request body
              console.log('Request body being sent to /api/confirm-nmi-payment:', requestBody);
              
              // Check for empty required fields in request body
              const requiredServerFields = ['planId', 'amount', 'cardNumber', 'expirationDate', 'cvv', 'firstName', 'lastName', 'email'];
              const emptyServerFields = requiredServerFields.filter(field => !requestBody[field] || requestBody[field].toString().trim() === '');
              if (emptyServerFields.length > 0) {
                console.error('Empty required fields in request body:', emptyServerFields);
                alert('Missing required fields: ' + emptyServerFields.join(', '));
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
              }
              
              // Process payment through NMI
              const paymentResponse = await fetch('/api/confirm-nmi-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
              });
              
              // Debug logging for response
              console.log('Payment response status:', paymentResponse.status);
              console.log('Payment response ok:', paymentResponse.ok);
              
              const result = await paymentResponse.json();
              console.log('Payment response body:', result);
              
              if (paymentResponse.ok && result.success) {
                alert('Purchase completed successfully!');
                window.closeCheckoutModal();
                
                // Reset form
                checkoutForm.reset();
              } else {
                throw new Error(result.error || 'Payment failed');
              }
            } catch (error) {
              console.error('Payment error:', error);
              alert('Payment failed: ' + (error.message || 'Please try again.'));
            } finally {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }
          });
          
          // Close modal when clicking outside
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              window.closeCheckoutModal();
            }
          });
          
          // Check authentication status and update button text
          window.checkAuthStatus().then(user => {
            if (user) {
              console.log('User authenticated:', user);
              // Update button text for authenticated users
              const userButton = document.getElementById('userButton');
              const affiliateButton = document.getElementById('affiliateButton');
              
              if (userButton) {
                userButton.textContent = 'User Dashboard';
              }
              if (affiliateButton) {
                affiliateButton.textContent = 'Affiliate Dashboard';
              }
            } else {
              console.log('User not authenticated');
              // Keep default text for unauthenticated users
              const userButton = document.getElementById('userButton');
              const affiliateButton = document.getElementById('affiliateButton');
              
              if (userButton) {
                userButton.textContent = 'Start';
              }
              if (affiliateButton) {
                affiliateButton.textContent = 'Start As Affiliate';
              }
            }
          });
        });
      </script>
    </body>
    </html>
  `;
}

  // ===== SUPER ADMIN AFFILIATE API ENDPOINTS =====

  // Get main site plans for Super Admin Affiliates (isMainSitePlan = true)
  app.get('/api/super-admin-affiliate/plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      // Get all plans where isMainSitePlan = true AND allowAffiliatePromotion = true
      const allPlans = await storage.getPlans();
      const affiliatePromotablePlans = allPlans.filter(plan => 
        plan.isMainSitePlan === true && plan.allowAffiliatePromotion === true
      );
      
      res.json(affiliatePromotablePlans);
    } catch (error) {
      console.error('Error fetching main site plans for Super Admin Affiliate:', error);
      res.status(500).json({ error: 'Failed to fetch main site plans' });
    }
  });

  // Toggle main site plan visibility for Super Admin Affiliates
  app.post('/api/super-admin-affiliate/plans/:id/toggle-visibility', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const { isVisible } = req.body;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      // Update plan visibility
      await storage.updateAffiliatePlanVisibility(parseInt(id), user.id, isVisible);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error toggling plan visibility:', error);
      res.status(500).json({ error: 'Failed to toggle plan visibility' });
    }
  });

  // Get Super Admin announcements only for Super Admin Affiliates
  app.get('/api/super-admin-affiliate/announcements', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      // Get all public announcements created by Super Admin users with userLiked status
      const superAdminAnnouncements = await storage.getSuperAdminAnnouncements(user.id);
      
      res.json(superAdminAnnouncements);
    } catch (error) {
      console.error('Error fetching Super Admin announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Like announcement for Super Admin Affiliates
  app.post('/api/super-admin-affiliate/announcements/:id/like', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      await storage.likeAnnouncement(parseInt(id), user.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error liking announcement:', error);
      res.status(500).json({ error: 'Failed to like announcement' });
    }
  });

  // Add comment to announcement for Super Admin Affiliates
  app.post('/api/super-admin-affiliate/announcements/:id/comment', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const { comment } = req.body;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      await storage.createAnnouncementComment({
        announcementId: parseInt(id),
        userId: user.id,
        content: comment,
        isActive: true
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // Get referrals for Super Admin Affiliates
  app.get('/api/super-admin-affiliate/referrals', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      // Get referrals by this Super Admin Affiliate from referral_commissions table
      const referrals = await storage.getReferralsByAffiliate(user.id);
      
      res.json(referrals);
    } catch (error) {
      console.error('Error fetching referrals for Super Admin Affiliate:', error);
      res.status(500).json({ error: 'Failed to fetch referrals' });
    }
  });

  // Get commission data for Super Admin Affiliates on main site plans
  app.get('/api/super-admin-affiliate/commissions', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      // Get commission data for main site plans only
      const allPlans = await storage.getPlans();
      const mainSitePlans = allPlans.filter(plan => plan.isMainSitePlan === true);
      
      // Get current user's referral code
      const currentUser = await storage.getUserById(user.id);
      const userReferralCode = currentUser?.referralCode;
      
      const commissionData = await Promise.all(
        mainSitePlans.map(async (plan) => {
          // Get commission data directly from referral_commissions table
          const commissions = await db
            .select()
            .from(referralCommissions)
            .where(
              and(
                eq(referralCommissions.affiliateId, user.id),
                eq(referralCommissions.planId, plan.id)
              )
            );

          const totalPurchases = commissions.length;
          const totalRevenue = commissions.reduce((sum, commission) => {
            return sum + parseFloat(commission.planAmount || '0');
          }, 0);
          const affiliateCommission = commissions.reduce((sum, commission) => {
            return sum + parseFloat(commission.commissionAmount || '0');
          }, 0);

          return {
            plan,
            metrics: {
              totalPurchases,
              totalRevenue,
              affiliateCommission
            }
          };
        })
      );
      
      res.json(commissionData);
    } catch (error) {
      console.error('Error fetching commission data for Super Admin Affiliate:', error);
      res.status(500).json({ error: 'Failed to fetch commission data' });
    }
  });

  // Super Admin Affiliate referral code management endpoints
  app.get('/api/super-admin-affiliate/referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      const currentUser = await storage.getUserById(user.id);
      res.json({ 
        referralCode: currentUser?.referralCode || null,
        hasReferralCode: !!currentUser?.referralCode 
      });
    } catch (error) {
      console.error('Error fetching referral code:', error);
      res.status(500).json({ error: 'Failed to fetch referral code' });
    }
  });

  app.put('/api/super-admin-affiliate/referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { referralCode } = req.body;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      if (!referralCode || referralCode.trim() === '') {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      // Clean referral code
      const cleanCode = referralCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (cleanCode.length < 3) {
        return res.status(400).json({ error: 'Referral code must be at least 3 characters' });
      }
      
      // Check availability
      const isAvailable = await storage.checkReferralCodeAvailability(cleanCode, user.id);
      
      if (!isAvailable) {
        return res.status(400).json({ 
          error: 'Referral code not available',
          status: 'unavailable' 
        });
      }
      
      // Update user referral code
      await storage.updateUserReferralCode(user.id, cleanCode);
      
      res.json({ 
        referralCode: cleanCode,
        status: 'updated',
        message: 'Referral code updated successfully' 
      });
    } catch (error) {
      console.error('Error updating referral code:', error);
      res.status(500).json({ error: 'Failed to update referral code' });
    }
  });

  app.post('/api/super-admin-affiliate/check-referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { referralCode } = req.body;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      const cleanCode = referralCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      const currentUser = await storage.getUserById(user.id);
      
      // Check if this is their current referral code
      if (currentUser?.referralCode && currentUser.referralCode.toLowerCase() === cleanCode) {
        return res.json({ 
          status: 'current',
          message: 'Your Current Referral Code' 
        });
      }
      
      // Check availability
      console.log('Checking availability for referral code:', cleanCode, 'excluding user:', user.id);
      const isAvailable = await storage.checkReferralCodeAvailability(cleanCode, user.id);
      console.log('Referral code availability result:', isAvailable);
      
      res.json({ 
        status: isAvailable ? 'available' : 'unavailable',
        message: isAvailable ? 'Available' : 'Not Available' 
      });
    } catch (error) {
      console.error('Error checking referral code:', error);
      res.status(500).json({ error: 'Failed to check referral code' });
    }
  });

  app.get('/api/super-admin-affiliate/referral-commissions', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      const commissions = await storage.getReferralCommissionsByAffiliate(user.id);
      const totals = await storage.getTotalReferralCommissions(user.id);
      
      res.json({
        commissions,
        totals
      });
    } catch (error) {
      console.error('Error fetching referral commissions:', error);
      res.status(500).json({ error: 'Failed to fetch referral commissions' });
    }
  });

  // ===== SUPER ADMIN AFFILIATE PAYMENT ACCOUNT ENDPOINTS =====

  // Get payment account for Super Admin Affiliate
  app.get('/api/super-admin-affiliate/payment-account', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      const paymentAccount = await storage.getPaymentAccount(user.id);
      res.json(paymentAccount);
    } catch (error) {
      console.error('Error fetching payment account:', error);
      res.status(500).json({ error: 'Failed to fetch payment account' });
    }
  });

  // Create payment account for Super Admin Affiliate
  app.post('/api/super-admin-affiliate/payment-account', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { bankName, accountOwnerName, accountNumber, accountType } = req.body;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }

      if (!bankName || !accountOwnerName || !accountNumber || !accountType) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if account already exists
      const existingAccount = await storage.getPaymentAccount(user.id);
      if (existingAccount) {
        return res.status(400).json({ error: 'Payment account already exists. Use update endpoint instead.' });
      }

      const newAccount = await storage.createPaymentAccount({
        userId: user.id,
        bankName,
        accountOwnerName,
        accountNumber,
        accountType
      });
      
      res.json(newAccount);
    } catch (error) {
      console.error('Error creating payment account:', error);
      res.status(500).json({ error: 'Failed to create payment account' });
    }
  });

  // Update payment account for Super Admin Affiliate
  app.put('/api/super-admin-affiliate/payment-account', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { bankName, accountOwnerName, accountNumber, accountType } = req.body;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }

      if (!bankName || !accountOwnerName || !accountNumber || !accountType) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const updatedAccount = await storage.updatePaymentAccount(user.id, {
        bankName,
        accountOwnerName,
        accountNumber,
        accountType
      });
      
      res.json(updatedAccount);
    } catch (error) {
      console.error('Error updating payment account:', error);
      res.status(500).json({ error: 'Failed to update payment account' });
    }
  });

  // Get payment history for Super Admin Affiliate
  app.get('/api/super-admin-affiliate/payment-history', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }
      
      const payments = await storage.getAffiliatePayments(user.id);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ error: 'Failed to fetch payment history' });
    }
  });

  // ===== WHITE LABEL AFFILIATE API ENDPOINTS =====

  // Get white label client's plans for White Label Affiliates (where allowAffiliatePromotion = true)
  app.get('/api/white-label-affiliate/plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      // White label affiliates use affiliateOfWhiteLabelId, not whiteLabelId
      const whiteLabelIdToUse = user.affiliateOfWhiteLabelId || user.whiteLabelId;
      
      if (!whiteLabelIdToUse) {
        return res.status(400).json({ error: 'No white label association found for this affiliate' });
      }
      
      // Get white label details
      const whiteLabel = await storage.getWhiteLabelById(whiteLabelIdToUse);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'Associated white label not found' });
      }
      
      // Get all plans created by the white label client where allowAffiliatePromotion = true
      const allPlans = await storage.getPlansByUser(whiteLabel.userId);
      const affiliatePromotablePlans = allPlans.filter(plan => 
        plan.allowAffiliatePromotion === true && plan.status === 'published'
      );
      
      res.json(affiliatePromotablePlans);
    } catch (error) {
      console.error('Error fetching white label plans for affiliate:', error);
      res.status(500).json({ error: 'Failed to fetch white label plans' });
    }
  });

  // Get white label announcements for White Label Affiliates
  app.get('/api/white-label-affiliate/announcements', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      // White label affiliates use affiliateOfWhiteLabelId, not whiteLabelId
      const whiteLabelIdToUse = user.affiliateOfWhiteLabelId || user.whiteLabelId;
      
      if (!whiteLabelIdToUse) {
        return res.status(400).json({ error: 'No white label association found for this affiliate' });
      }
      
      // Get white label details
      const whiteLabel = await storage.getWhiteLabelById(whiteLabelIdToUse);
      if (!whiteLabel) {
        return res.status(404).json({ error: 'Associated white label not found' });
      }
      
      // Get announcements with userLiked status
      const announcements = await storage.getAnnouncementsByWhiteLabelId(whiteLabel.id, user.id);
      
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching white label announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Like announcement for White Label Affiliates
  app.post('/api/white-label-affiliate/announcements/:id/like', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      await storage.likeAnnouncement(parseInt(id), user.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error liking announcement:', error);
      res.status(500).json({ error: 'Failed to like announcement' });
    }
  });

  // White Label Affiliate referral code management endpoints
  app.get('/api/white-label-affiliate/referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      const currentUser = await storage.getUserById(user.id);
      res.json({ 
        referralCode: currentUser?.referralCode || null,
        hasReferralCode: !!currentUser?.referralCode 
      });
    } catch (error) {
      console.error('Error fetching referral code:', error);
      res.status(500).json({ error: 'Failed to fetch referral code' });
    }
  });

  app.put('/api/white-label-affiliate/referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { referralCode } = req.body;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      if (!referralCode || referralCode.trim() === '') {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      // Clean referral code
      const cleanCode = referralCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check availability
      const isAvailable = await storage.checkReferralCodeAvailability(cleanCode, user.id);
      
      if (!isAvailable) {
        return res.status(400).json({ 
          error: 'Referral code not available',
          status: 'unavailable' 
        });
      }
      
      // Update user referral code
      await storage.updateUserReferralCode(user.id, cleanCode);
      
      res.json({ 
        referralCode: cleanCode,
        status: 'updated',
        message: 'Referral code updated successfully' 
      });
    } catch (error) {
      console.error('Error updating referral code:', error);
      res.status(500).json({ error: 'Failed to update referral code' });
    }
  });

  // Check referral code availability for White Label Affiliate
  app.post('/api/white-label-affiliate/check-referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { referralCode } = req.body;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      const cleanCode = referralCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      const currentUser = await storage.getUserById(user.id);
      
      // Check if this is their current referral code
      if (currentUser?.referralCode && currentUser.referralCode.toLowerCase() === cleanCode) {
        return res.json({ 
          status: 'current',
          message: 'Your Current Referral Code' 
        });
      }
      
      // Check availability
      console.log('Checking availability for referral code:', cleanCode, 'excluding user:', user.id);
      const isAvailable = await storage.checkReferralCodeAvailability(cleanCode, user.id);
      console.log('Referral code availability result:', isAvailable);
      
      res.json({ 
        status: isAvailable ? 'available' : 'unavailable',
        message: isAvailable ? 'Available' : 'Not Available' 
      });
    } catch (error) {
      console.error('Error checking referral code:', error);
      res.status(500).json({ error: 'Failed to check referral code' });
    }
  });

  // Save/update referral code for White Label Affiliate
  app.post('/api/white-label-affiliate/save-referral-code', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { referralCode } = req.body;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      const cleanCode = referralCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check availability
      const isAvailable = await storage.checkReferralCodeAvailability(cleanCode, user.id);
      
      if (!isAvailable) {
        return res.status(400).json({ 
          error: 'Referral code not available',
          status: 'unavailable' 
        });
      }
      
      // Update user referral code
      await storage.updateUserReferralCode(user.id, cleanCode);
      
      res.json({ 
        referralCode: cleanCode,
        status: 'updated',
        message: 'Referral code updated successfully' 
      });
    } catch (error) {
      console.error('Error updating referral code:', error);
      res.status(500).json({ error: 'Failed to update referral code' });
    }
  });

  // Get payment account for White Label Affiliate
  app.get('/api/white-label-affiliate/payment-account', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      const paymentAccount = await storage.getAffiliatePaymentAccount(user.id);
      res.json(paymentAccount);
    } catch (error) {
      console.error('Error fetching payment account:', error);
      res.status(500).json({ error: 'Failed to fetch payment account' });
    }
  });

  // Create payment account for White Label Affiliate
  app.post('/api/white-label-affiliate/payment-account', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { bankName, accountOwnerName, accountNumber, accountType } = req.body;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }

      if (!bankName || !accountOwnerName || !accountNumber || !accountType) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newAccount = await storage.createPaymentAccount({
        userId: user.id,
        bankName,
        accountOwnerName,
        accountNumber,
        accountType
      });
      
      res.json(newAccount);
    } catch (error) {
      console.error('Error creating payment account:', error);
      res.status(500).json({ error: 'Failed to create payment account' });
    }
  });

  // Update payment account for White Label Affiliate
  app.put('/api/white-label-affiliate/payment-account', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { bankName, accountOwnerName, accountNumber, accountType } = req.body;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }

      if (!bankName || !accountOwnerName || !accountNumber || !accountType) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const updatedAccount = await storage.updatePaymentAccount(user.id, {
        bankName,
        accountOwnerName,
        accountNumber,
        accountType
      });
      
      res.json(updatedAccount);
    } catch (error) {
      console.error('Error updating payment account:', error);
      res.status(500).json({ error: 'Failed to update payment account' });
    }
  });

  // Get payment history for White Label Affiliate
  app.get('/api/white-label-affiliate/payment-history', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      console.log(`💰 Fetching payment history for white_label_affiliate: ${user.id} (${user.email})`);
      const payments = await storage.getAffiliatePayments(user.id);
      console.log(`💰 Found ${payments.length} payments for affiliate ${user.id}:`, payments);
      
      // Also calculate total paid
      const totalPaid = await storage.getTotalPaidToAffiliate(user.id);
      console.log(`💰 Total paid to affiliate ${user.id}: $${totalPaid}`);
      
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ error: 'Failed to fetch payment history' });
    }
  });

  // Get commissions for White Label Affiliate
  app.get('/api/white-label-affiliate/commissions', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      // Get commissions for this affiliate
      const commissions = await storage.getAffiliateCommissions(user.id);
      res.json(commissions);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      res.status(500).json({ error: 'Failed to fetch commissions' });
    }
  });

  // Get referrals for White Label Affiliate
  app.get('/api/white-label-affiliate/referrals', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'white_label_affiliate') {
        return res.status(403).json({ error: 'Access denied. White Label Affiliate role required.' });
      }
      
      // Get user's referral code
      const currentUser = await storage.getUserById(user.id);
      if (!currentUser?.referralCode) {
        return res.json([]);
      }
      
      // Get all users referred by this affiliate
      const referrals = await storage.getUsersByReferralCode(currentUser.referralCode);
      res.json(referrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      res.status(500).json({ error: 'Failed to fetch referrals' });
    }
  });

  // ===== SUPER ADMIN AFFILIATE PAYMENT MANAGEMENT ENDPOINTS =====

  // Get affiliate payment summary for Super Admin and White Label Client (view all affiliates and their payment status)
  app.get('/api/affiliate-payment-summary', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || (user.role !== 'super_admin' && user.role !== 'super_admin_affiliate' && user.role !== 'white_label_client')) {
        return res.status(403).json({ error: 'Access denied. Super Admin, Super Admin Affiliate, or White Label Client role required.' });
      }
      
      const paymentSummary = await storage.getAffiliatePaymentSummary(user.id);
      res.json(paymentSummary);
    } catch (error) {
      console.error('Error fetching affiliate payment summary:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate payment summary' });
    }
  });

  // Get specific affiliate's payment account for making payments
  app.get('/api/affiliate-payment-account/:affiliateId', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { affiliateId } = req.params;
      
      console.log(`🎯 API Request: Get payment account for affiliate ${affiliateId} by user ${user.id} (${user.role})`);
      
      if (!user || (user.role !== 'super_admin' && user.role !== 'super_admin_affiliate' && user.role !== 'white_label_client')) {
        console.log(`❌ Access denied for user ${user?.id} with role ${user?.role}`);
        return res.status(403).json({ error: 'Access denied. Super Admin, Super Admin Affiliate, or White Label Client role required.' });
      }
      
      console.log(`✅ Access granted, calling storage.getAffiliatePaymentAccount(${affiliateId})`);
      const paymentAccount = await storage.getAffiliatePaymentAccount(affiliateId);
      console.log(`📤 API Response:`, paymentAccount);
      
      res.json(paymentAccount);
    } catch (error) {
      console.error('Error fetching affiliate payment account:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate payment account' });
    }
  });

  // Create payment record for an affiliate
  app.post('/api/affiliate-payment', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { affiliateId, amount, paymentMethod, transactionProofUrl, description } = req.body;
      
      console.log('💰 PAYMENT DEBUG - User:', user.role, user.id);
      console.log('💰 PAYMENT DEBUG - Request body:', JSON.stringify(req.body, null, 2));
      console.log('💰 PAYMENT DEBUG - transactionProofUrl:', transactionProofUrl);
      
      if (!user || (user.role !== 'super_admin' && user.role !== 'super_admin_affiliate' && user.role !== 'white_label_client')) {
        return res.status(403).json({ error: 'Access denied. Super Admin, Super Admin Affiliate, or White Label Client role required.' });
      }

      if (!affiliateId || !amount) {
        return res.status(400).json({ error: 'Affiliate ID and amount are required' });
      }

      // Fetch current affiliate bank details to store historically
      let bankDetails = null;
      try {
        bankDetails = await storage.getAffiliatePaymentAccount(affiliateId);
      } catch (error) {
        console.log('No bank details found for affiliate, proceeding without historical bank info');
      }

      const newPayment = await storage.createAffiliatePayment({
        affiliateId,
        paidBy: user.id, // Maps to paid_by column (required)
        amount: amount.toString(),
        paymentMethod: paymentMethod || 'bank_transfer',
        transactionProofUrl,
        description,
        status: 'completed',
        // Store current bank details for historical tracking (never changes)
        historicalBankName: bankDetails?.bankName || null,
        historicalAccountNumber: bankDetails?.accountNumber || null,
        historicalAccountOwnerName: bankDetails?.accountOwnerName || null,
        historicalAccountType: bankDetails?.accountType || null,
      });
      
      res.json(newPayment);
    } catch (error) {
      console.error('Error creating affiliate payment:', error);
      res.status(500).json({ error: 'Failed to create affiliate payment' });
    }
  });

  // Configure multer for payment proof uploads
  const uploadDir = path.join(process.cwd(), 'uploads', 'payment-proofs');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage_multer = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `payment-proof-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
      }
    }
  });

  // Upload payment proof image
  app.post('/api/upload-payment-proof', isAuthenticated, upload.single('proofImage'), async (req, res) => {
    try {
      const user = req.user;
      
      if (!user || (user.role !== 'super_admin' && user.role !== 'super_admin_affiliate' && user.role !== 'white_label_client')) {
        return res.status(403).json({ error: 'Access denied. Super Admin, Super Admin Affiliate, or White Label Client role required.' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No proof image uploaded' });
      }

      // Return the file URL that can be accessed via static file serving
      const imageUrl = `/uploads/payment-proofs/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      res.status(500).json({ error: 'Failed to upload payment proof' });
    }
  });

  // Get payment history for a specific affiliate
  app.get('/api/affiliate-payments/:affiliateId', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { affiliateId } = req.params;
      
      if (!user || (user.role !== 'super_admin' && user.role !== 'white_label_client')) {
        return res.status(403).json({ error: 'Access denied. Super Admin or White Label Client role required.' });
      }
      
      // If white_label_client, verify the affiliate belongs to them
      if (user.role === 'white_label_client') {
        const affiliate = await storage.getUserById(affiliateId);
        if (!affiliate || (affiliate.whiteLabelId !== user.whiteLabelId && affiliate.affiliateOfWhiteLabelId !== user.whiteLabelId)) {
          return res.status(403).json({ error: 'Access denied. You can only view your own affiliates\' payment history.' });
        }
      }
      
      const payments = await storage.getAffiliatePayments(affiliateId);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching affiliate payments:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate payments' });
    }
  });

  // ===== USER PROFILE & SECURITY ENDPOINTS =====

  // Update user password
  app.put('/api/auth/update-password', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { currentPassword, newPassword } = req.body;
      
      // Check if we're in impersonation mode - update impersonated user's password
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('PASSWORD-UPDATE DEBUG - Updating password for impersonated user:', targetUserId);
      }
      
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new passwords are required' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }
      
      // Get current user data from database
      const currentUser = await storage.getUserById(targetUserId);
      if (!currentUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // For users who signed up with Google OAuth, they don't have a password
      if (!currentUser.password) {
        return res.status(400).json({ 
          error: 'Password cannot be set for Google OAuth accounts. Please continue using Google sign-in.' 
        });
      }
      
      // Verify current password
      const { verifyPassword, hashPassword } = await import('./auth');
      const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update password in database
      await db
        .update(users)
        .set({ 
          password: hashedNewPassword,
          updatedAt: new Date()
        })
        .where(eq(users.id, targetUserId));
      
      console.log(`Password updated successfully for user ${targetUserId} (${currentUser.username})`);
      
      res.json({ 
        success: true, 
        message: 'Password updated successfully' 
      });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  });

  // Get user profile information
  app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - show impersonated user's profile
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('PROFILE DEBUG - Using impersonated user ID for profile:', targetUserId);
      }
      
      const fullUserData = await storage.getUserById(targetUserId);
      
      if (!fullUserData) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user profile data (excluding sensitive information)
      res.json({
        id: fullUserData.id,
        username: fullUserData.username,
        firstName: fullUserData.firstName,
        lastName: fullUserData.lastName,
        email: fullUserData.email,
        phone: fullUserData.phone,
        company: fullUserData.company,
        role: fullUserData.role,
        authProvider: fullUserData.authProvider,
        profileImageUrl: fullUserData.profileImageUrl,
        logoImageUrl: fullUserData.logoImageUrl,
        createdAt: fullUserData.createdAt,
        updatedAt: fullUserData.updatedAt
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  // Update user profile information
  app.put('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { firstName, lastName, email, phone, company, profileImageUrl } = req.body;
      
      // Check if we're in impersonation mode - update impersonated user's profile
      let targetUserId = user.id;
      let targetUser = user;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          targetUserId = impersonatedUser.id;
          targetUser = impersonatedUser;
          console.log('PROFILE-UPDATE DEBUG - Updating profile for impersonated user:', targetUserId);
        }
      }
      
      // Update user profile in database
      await db
        .update(users)
        .set({
          firstName: firstName || targetUser.firstName,
          lastName: lastName || targetUser.lastName,
          email: email || targetUser.email,
          phone: phone || targetUser.phone,
          company: company || targetUser.company,
          profileImageUrl: profileImageUrl || targetUser.profileImageUrl,
          updatedAt: new Date()
        })
        .where(eq(users.id, targetUserId));
      
      // Fetch the updated user data
      const [updatedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1);
      
      console.log(`Profile updated successfully for user ${targetUserId} (${updatedUser.username})`);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          company: updatedUser.company,
          role: updatedUser.role
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  });

  // User preferences routes
  app.get('/api/preferences', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if we're in impersonation mode - show impersonated user's preferences
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('PREFERENCES DEBUG - Using impersonated user ID for preferences:', targetUserId);
      }
      
      let preferences = await storage.getUserPreferences(targetUserId);
      
      // Create default preferences if none exist
      if (!preferences) {
        preferences = await storage.createUserPreferences({
          userId: targetUserId,
          theme: 'light',
          primaryColor: '#2563EB',
          secondaryColor: '#64748B',
          language: 'en',
          timezone: 'UTC',
          currency: 'USD',
          emailNotifications: true,
          marketingEmails: false,
        });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  });

  app.put('/api/preferences', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const updateData = insertUserPreferencesSchema.partial().parse(req.body);
      
      // Check if we're in impersonation mode - update impersonated user's preferences
      let targetUserId = user.id;
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        targetUserId = req.session.impersonatedUserId;
        console.log('PREFERENCES-UPDATE DEBUG - Updating preferences for impersonated user:', targetUserId);
      }
      
      // Check if preferences exist
      let preferences = await storage.getUserPreferences(targetUserId);
      
      if (!preferences) {
        // Create new preferences
        preferences = await storage.createUserPreferences({
          userId: targetUserId,
          ...updateData,
        });
      } else {
        // Update existing preferences
        preferences = await storage.updateUserPreferences(targetUserId, updateData);
      }
      
      res.json(preferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  // Profile image upload endpoint
  app.post('/api/objects/upload', isAuthenticated, async (req, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      const fs = await import('fs');
      
      // Ensure uploads directory exists
      const uploadsDir = './uploads/';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Configure multer for file upload
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          // Generate unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `profile_${uniqueSuffix}${ext}`);
        }
      });
      
      const upload = multer.default({ 
        storage,
        fileFilter: (req, file, cb) => {
          // Only allow image files
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed'));
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024 // 10MB limit
        }
      }).single('file');
      
      upload(req, res, async (err) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(500).json({ error: 'File upload failed: ' + err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Return the file URL for the frontend
        const fileUrl = `/api/files/${req.file.filename}`;
        
        // Update user's profile image URL in database
        try {
          // Check if we're in impersonation mode - use impersonated user's ID
          let targetUserId = req.user.id;
          if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
            targetUserId = req.session.impersonatedUserId;
            console.log('PROFILE-UPLOAD DEBUG - Using impersonated user ID for profile upload:', targetUserId);
          }

          await db
            .update(users)
            .set({
              profileImageUrl: fileUrl,
              updatedAt: new Date()
            })
            .where(eq(users.id, targetUserId));
          
          console.log(`Profile image updated for user ${targetUserId}: ${fileUrl}`);
        } catch (dbError) {
          console.error('Database update error:', dbError);
          // Still return success for file upload, but log the database error
        }
        
        res.json({ uploadURL: fileUrl, filename: req.file.filename });
      });
    } catch (error) {
      console.error('Error setting up file upload:', error);
      res.status(500).json({ error: 'Failed to setup file upload' });
    }
  });

  app.put('/api/preferences/logo', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { logoURL } = req.body;
      
      if (!logoURL) {
        return res.status(400).json({ error: 'logoURL is required' });
      }

      const objectStorageService = new ObjectStorageService();
      const logoPath = await objectStorageService.trySetObjectEntityAclPolicy(
        logoURL,
        {
          owner: user.id,
          visibility: "public", // Logo should be publicly accessible
        }
      );

      // Update user preferences with logo path
      await storage.updateUserPreferences(user.id, { logoUrl: logoPath });
      
      res.json({ logoPath });
    } catch (error) {
      console.error('Error setting user logo:', error);
      res.status(500).json({ error: 'Failed to set logo' });
    }
  });

  // ===== REAL ANALYTICS API ENDPOINTS =====
  // These endpoints provide REAL data from your actual users and purchases for the /analytics page
  
  // Revenue trend analytics - Real monthly revenue data from your $930.32 total
  app.get('/api/analytics/revenue-trend', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Get real purchase data from the last 12 months
      const purchases = await db.select({
        amount: purchaseHistory.amount,
        createdAt: purchaseHistory.createdAt
      })
      .from(purchaseHistory)
      .where(
        and(
          eq(purchaseHistory.status, 'completed'),
          user.role === 'super_admin' 
            ? undefined // Super admin sees all data
            : eq(purchaseHistory.whiteLabelId, 
                (await storage.getWhiteLabelByUserId(user.id))?.id || 0)
        )
      )
      .orderBy(purchaseHistory.createdAt);

      // Group by month and calculate totals
      const monthlyData = purchases.reduce((acc: any, purchase) => {
        const date = new Date(purchase.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthName, revenue: 0 };
        }
        acc[monthKey].revenue += parseFloat(purchase.amount || '0');
        return acc;
      }, {});

      const revenueData = Object.values(monthlyData).slice(-6); // Last 6 months
      res.json(revenueData);
    } catch (error) {
      console.error('Error fetching revenue trend:', error);
      res.status(500).json({ error: 'Failed to fetch revenue trend' });
    }
  });

  // Client distribution analytics - Real plan distribution from your 32 purchases
  app.get('/api/analytics/client-distribution', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      
      // Get real plan subscription data
      const planStats = await db.select({
        planName: plans.name,
        count: sql<number>`count(*)`
      })
      .from(subscriptions)
      .innerJoin(plans, eq(subscriptions.planId, plans.id))
      .where(
        and(
          eq(subscriptions.status, 'active'),
          user.role === 'super_admin' 
            ? undefined 
            : eq(subscriptions.whiteLabelId, 
                (await storage.getWhiteLabelByUserId(user.id))?.id || 0)
        )
      )
      .groupBy(plans.name);

      const distributionData = planStats.map((stat, index) => ({
        name: stat.planName,
        value: stat.count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
      }));

      res.json(distributionData);
    } catch (error) {
      console.error('Error fetching client distribution:', error);
      res.status(500).json({ error: 'Failed to fetch client distribution' });
    }
  });

  // Plan performance analytics - Real plan sales performance from your dashboard
  app.get('/api/analytics/plan-performance', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      console.log('📈 PLAN PERFORMANCE REQUEST - User ID:', user.id, 'Role:', user.role, 'Email:', user.email);
      
      // Get real plan performance data
      console.log('🔍 PLAN PERFORMANCE QUERY - Fetching plan sales data...');
      const planPerformance = await db.select({
        planName: plans.name,
        totalSales: sql<number>`count(${purchaseHistory.id})`,
        totalRevenue: sql<number>`sum(cast(${purchaseHistory.amount} as decimal))`
      })
      .from(plans)
      .leftJoin(purchaseHistory, 
        and(
          eq(plans.id, purchaseHistory.planId),
          eq(purchaseHistory.status, 'completed')
        )
      )
      .where(
        user.role === 'super_admin' 
          ? undefined 
          : eq(plans.createdBy, user.id)
      )
      .groupBy(plans.id, plans.name)
      .having(sql`count(${purchaseHistory.id}) > 0`); // Only plans with sales

      console.log('📊 PLAN PERFORMANCE RAW DATA - Found', planPerformance.length, 'plans with sales');
      
      // Log detailed plan performance data
      planPerformance.forEach((plan, index) => {
        console.log(`  Plan ${index + 1}: "${plan.planName}" - Sales: ${plan.totalSales}, Revenue: $${plan.totalRevenue}`);
      });

      const performanceData = planPerformance.map(plan => ({
        name: plan.planName,
        value: plan.totalSales,
        revenue: parseFloat(plan.totalRevenue?.toString() || '0')
      }));

      console.log('✅ PLAN PERFORMANCE RESULT - Returning performance data for', performanceData.length, 'plans');
      res.json(performanceData);
    } catch (error) {
      console.error('💥 PLAN PERFORMANCE ERROR:', error.message);
      console.error('🔍 PLAN PERFORMANCE STACK TRACE:', error.stack);
      res.status(500).json({ error: 'Failed to fetch plan performance' });
    }
  });

  // Background task to publish scheduled plans
  const publishScheduledPlans = async () => {
    try {
      const now = new Date();
      console.log('Checking for scheduled plans to publish at:', now.toISOString());
      const scheduledPlans = await storage.getScheduledPlansReadyToPublish(now);
      console.log(`Found ${scheduledPlans.length} plans ready to publish`);
      
      for (const plan of scheduledPlans) {
        console.log(`Publishing scheduled plan: ${plan.name} (ID: ${plan.id}) - scheduled for: ${plan.scheduledAt}`);
        await storage.updatePlan(plan.id, {
          status: 'published',
          isMainSitePlan: true,
          isActive: true,
          publishedAt: now
        });
        console.log(`✓ Auto-published scheduled plan: ${plan.name} (ID: ${plan.id})`);
      }
    } catch (error) {
      console.error('Error publishing scheduled plans:', error);
    }
  };

  // Run scheduled plan publisher every 30 seconds for testing (change to 5 minutes later)  
  setInterval(publishScheduledPlans, 30 * 1000);
  
  // Run once on startup
  publishScheduledPlans();

  // Add manual trigger endpoint for testing
  app.post('/api/trigger-scheduled-publish', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      console.log('Manual trigger for scheduled plan publishing');
      await publishScheduledPlans();
      res.json({ success: true, message: 'Scheduled plan publishing triggered' });
    } catch (error) {
      console.error('Error manually triggering scheduled publish:', error);
      res.status(500).json({ error: 'Failed to trigger scheduled publishing' });
    }
  });

  // Affiliate Commission API Endpoints
  
  // Get affiliate commissions for super admin affiliate
  app.get('/api/affiliate/commissions', isAuthenticated, async (req, res) => {
    try {
      if (req.user?.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }

      const commissions = await storage.getAffiliateCommissions(req.user.id);
      res.json(commissions);
    } catch (error) {
      console.error('Error fetching affiliate commissions:', error);
      res.status(500).json({ error: 'Failed to fetch commissions' });
    }
  });

  // Get affiliate statistics
  app.get('/api/affiliate/stats', isAuthenticated, async (req, res) => {
    try {
      if (req.user?.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }

      const stats = await storage.getAffiliateStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Get referral link performance
  app.get('/api/affiliate/referral-performance', isAuthenticated, async (req, res) => {
    try {
      if (req.user?.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }

      const performance = await storage.getReferralPerformance(req.user.id);
      res.json(performance);
    } catch (error) {
      console.error('Error fetching referral performance:', error);
      res.status(500).json({ error: 'Failed to fetch performance data' });
    }
  });

  // Update referral code
  app.post('/api/affiliate/update-referral-code', isAuthenticated, async (req, res) => {
    try {
      if (req.user?.role !== 'super_admin_affiliate') {
        return res.status(403).json({ error: 'Access denied. Super Admin Affiliate role required.' });
      }

      const { referralCode } = req.body;
      
      if (!referralCode || referralCode.trim() === '') {
        return res.status(400).json({ error: 'Referral code is required' });
      }

      // Check if referral code is already taken
      const existingUser = await storage.getUserByReferralCode(referralCode.trim());
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: 'Referral code already taken' });
      }

      await storage.updateUserReferralCode(req.user.id, referralCode.trim());
      res.json({ success: true, referralCode: referralCode.trim() });
    } catch (error) {
      console.error('Error updating referral code:', error);
      res.status(500).json({ error: 'Failed to update referral code' });
    }
  });

  // Track referral link click
  app.post('/api/track-referral-click', async (req, res) => {
    try {
      const { referralCode } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
      }

      // Find the affiliate who owns this referral code
      const affiliate = await storage.getUserByReferralCode(referralCode);
      if (!affiliate) {
        return res.status(404).json({ error: 'Invalid referral code' });
      }

      // Track the click
      await storage.trackReferralClick({
        affiliateId: affiliate.id,
        referralCode,
        ipAddress,
        userAgent
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking referral click:', error);
      res.status(500).json({ error: 'Failed to track click' });
    }
  });

  // ===== BUSINESS AUTHENTICATION ENDPOINTS =====

  // Business logo upload endpoint (for brand logos, not profile images)
  app.post('/api/upload/logo', upload.single('logo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No logo uploaded' });
      }

      // Ensure logos directory exists
      const logosDir = path.join(process.cwd(), 'uploads', 'logos');
      if (!fs.existsSync(logosDir)) {
        fs.mkdirSync(logosDir, { recursive: true });
      }

      // Move file to logos directory
      const originalPath = req.file.path;
      const logoPath = path.join(logosDir, req.file.filename);
      fs.renameSync(originalPath, logoPath);

      const logoUrl = `/uploads/logos/${req.file.filename}`;
      res.json({ logoUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({ error: 'Failed to upload logo' });
    }
  });

  // Brand logo upload endpoint (saves to white_labels table)
  app.post('/api/upload/brand-logo', isAuthenticated, async (req, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      const fs = await import('fs');
      
      // Ensure brand-logos directory exists
      const brandLogosDir = path.join(process.cwd(), 'uploads', 'brand-logos');
      if (!fs.existsSync(brandLogosDir)) {
        fs.mkdirSync(brandLogosDir, { recursive: true });
      }
      
      // Configure multer for file upload
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, brandLogosDir);
        },
        filename: (req, file, cb) => {
          // Generate unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `brand_logo_${uniqueSuffix}${ext}`);
        }
      });
      
      const upload = multer.default({ 
        storage,
        fileFilter: (req, file, cb) => {
          // Only allow image files
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed'));
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024 // 10MB limit
        }
      }).single('logo');
      
      upload(req, res, async (err) => {
        if (err) {
          console.error('Brand logo upload error:', err);
          return res.status(500).json({ error: 'File upload failed: ' + err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'No logo uploaded' });
        }

        const userId = (req.user as any)?.id;
        if (!userId) {
          return res.status(401).json({ error: 'Not authenticated' });
        }

        // Check if we're in impersonation mode - use impersonated user's ID
        let targetUserId = userId;
        if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
          targetUserId = req.session.impersonatedUserId;
          console.log('BRAND-LOGO-UPLOAD DEBUG - Using impersonated user ID for brand logo upload:', targetUserId);
        }

        const logoUrl = `/uploads/brand-logos/${req.file.filename}`;

        try {
          // Update the user's logo image URL in the users table
          await db
            .update(users)
            .set({ logoImageUrl: logoUrl })
            .where(eq(users.id, targetUserId));

          // Also update the white label's logo URL for backward compatibility
          const userWhiteLabel = await db
            .select()
            .from(whiteLabels)
            .where(eq(whiteLabels.userId, targetUserId))
            .limit(1);

          if (userWhiteLabel.length > 0) {
            await db
              .update(whiteLabels)
              .set({ logoUrl })
              .where(eq(whiteLabels.id, userWhiteLabel[0].id));
          }

          console.log(`Brand logo updated for user ${targetUserId}: ${logoUrl}`);
          res.json({ logoUrl });
        } catch (dbError) {
          console.error('Database update error:', dbError);
          res.status(500).json({ error: 'Failed to update logo in database' });
        }
      });
    } catch (error) {
      console.error('Error uploading brand logo:', error);
      res.status(500).json({ error: 'Failed to upload brand logo' });
    }
  });

  // Check username availability
  app.get('/api/check-username', async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) {
        return res.json({ available: false });
      }
      
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, username as string))
        .limit(1);
      
      res.json({ available: existingUser.length === 0 });
    } catch (error) {
      console.error('Error checking username:', error);
      res.json({ available: false });
    }
  });

  // Check domain path availability
  app.get('/api/check-domain', async (req, res) => {
    try {
      const { domainPath } = req.query;
      if (!domainPath) {
        return res.json({ available: false });
      }
      
      const existingDomain = await db
        .select()
        .from(whiteLabels)
        .where(eq(whiteLabels.domainPath, domainPath as string))
        .limit(1);
      
      res.json({ available: existingDomain.length === 0 });
    } catch (error) {
      console.error('Error checking domain:', error);
      res.json({ available: false });
    }
  });

  // Get available plans for business signup
  app.get('/api/business-plans', async (req, res) => {
    try {
      const businessPlans = await db
        .select()
        .from(plans)
        .where(eq(plans.status, 'published'))
        .orderBy(plans.monthlyPrice);
      
      res.json(businessPlans);
    } catch (error) {
      console.error('Error fetching business plans:', error);
      res.status(500).json({ error: 'Failed to fetch business plans' });
    }
  });

  // Auto-provision business platform (no auth required for signup flow)
  app.post('/api/business-auth/provision', async (req, res) => {
    try {
      const { businessInfo, brandingInfo, planSelection } = req.body;
      
      console.log('Provision request received:', { businessInfo: businessInfo?.businessName, brandingInfo: brandingInfo?.domainPath });

      // First, create the user account
      const hashedPassword = await bcrypt.hash(businessInfo.password, 10);
      
      const insertResult = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(), // Generate UUID for the id field
          username: businessInfo.username.toLowerCase(), // Ensure lowercase
          email: businessInfo.email.toLowerCase(), // Use actual email from form
          firstName: businessInfo.ownerFirstName,
          lastName: businessInfo.ownerLastName,
          password: hashedPassword,
          role: 'white_label_client',
        });

      // Fetch the created user
      const [newUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, businessInfo.username.toLowerCase()))
        .limit(1);

      console.log('User created:', newUser.id);

      // SEND WELCOME EMAIL TO NEW USER
      // Send welcome email after successful user creation (non-blocking)
      if (newUser.email) {
        setImmediate(async () => {
          try {
            const userName = newUser.firstName || newUser.username || 'Business Owner';
            await sendWelcomeEmail(newUser.email, userName, newUser.role);
            console.log(`BUSINESS SIGNUP WELCOME EMAIL SENT - Email sent to ${newUser.email} for user ${userName}`);
          } catch (emailError) {
            console.error('Error sending business signup welcome email:', emailError);
            // Don't fail user creation if email fails
          }
        });
      }

      // Check if domainPath already exists and make it unique if needed
      let finalDomainPath = brandingInfo.domainPath.toLowerCase();
      let counter = 1;
      
      while (true) {
        const [existingDomain] = await db
          .select()
          .from(whiteLabels)
          .where(eq(whiteLabels.domainPath, finalDomainPath))
          .limit(1);
        
        if (!existingDomain) break;
        
        finalDomainPath = `${brandingInfo.domainPath.toLowerCase()}-${counter}`;
        counter++;
      }

      console.log(`Using domain path: ${finalDomainPath} (original: ${brandingInfo.domainPath})`);

      // Create white-label business record (only using fields that exist in schema)
      const businessInsertResult = await db
        .insert(whiteLabels)
        .values({
          userId: newUser.id,
          businessName: businessInfo.businessName,
          domainPath: finalDomainPath, // Use the unique domain path
          logoUrl: brandingInfo.logoUrl || '',
          primaryColor: brandingInfo.primaryColor || '#2563EB',
          secondaryColor: brandingInfo.secondaryColor || '#64748B',
          isActive: true,
        });

      // Fetch the created white label business
      const newBusinessResult = await db
        .select()
        .from(whiteLabels)
        .where(eq(whiteLabels.userId, newUser.id))
        .limit(1);

      console.log('White label business creation result:', newBusinessResult);
      console.log('newBusinessResult length:', newBusinessResult.length);
      console.log('First item:', newBusinessResult?.[0]);
      
      const newBusiness = newBusinessResult[0];

      if (!newBusiness) {
        console.error('newBusinessResult is:', newBusinessResult);
        throw new Error('Failed to create white-label business record - no result returned');
      }

      console.log('Business created successfully:', newBusiness.id);

      // Update user with white label business ID
      await db
        .update(users)
        .set({ 
          whiteLabelId: newBusiness.id,
          updatedAt: new Date()
        })
        .where(eq(users.id, newUser.id));

      // Skip subscriptions and announcements for simplified setup
      console.log('Skipping subscription and announcement creation for simplified setup');

      // Auto-login the new user by setting up session
      await new Promise((resolve, reject) => {
        req.login({ id: newUser.id, username: newUser.username, role: 'white_label_client' }, (err) => {
          if (err) {
            console.error('Auto-login error:', err);
            reject(err);
          } else {
            console.log('Auto-login successful for user:', newUser.username);
            resolve(true);
          }
        });
      });

      res.json({ 
        success: true, 
        businessId: newBusiness.id,
        userId: newUser.id,
        domainPath: finalDomainPath, // Return the actual domain path used
        message: 'Business platform created successfully!'
      });
    } catch (error) {
      console.error('Error provisioning business:', error);
      res.status(500).json({ error: 'Failed to provision business platform' });
    }
  });

  // Get all businesses for admin dashboard
  app.get('/api/business-all', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;

      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const businesses = await db
        .select({
          id: whiteLabels.id,
          businessName: whiteLabels.businessName,
          industry: whiteLabels.industry,
          domainPath: whiteLabels.domainPath,
          ownerFirstName: whiteLabels.ownerFirstName,
          ownerLastName: whiteLabels.ownerLastName,
          ownerEmail: whiteLabels.ownerEmail,
          isActive: whiteLabels.isActive,
          createdAt: whiteLabels.createdAt,
        })
        .from(whiteLabels)
        .orderBy(desc(whiteLabels.createdAt));

      res.json(businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  });

  // Get business detail for admin
  app.get('/api/business-detail/:businessId', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const { businessId } = req.params;

      if (user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [business] = await db
        .select()
        .from(whiteLabels)
        .where(eq(whiteLabels.id, parseInt(businessId)));

      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get additional stats
      const userCount = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(eq(users.whiteLabelId, business.id));

      const monthlyRevenue = await db
        .select({ total: sql`coalesce(sum(${purchaseHistory.amount}), 0)` })
        .from(purchaseHistory)
        .innerJoin(users, eq(purchaseHistory.userId, users.id))
        .where(and(
          eq(users.whiteLabelId, business.id),
          sql`${purchaseHistory.createdAt} >= date_trunc('month', current_date)`
        ));

      const activePlans = await db
        .select({ count: sql`count(*)` })
        .from(plans)
        .where(and(
          eq(plans.userId, business.userId),
          eq(plans.status, 'published')
        ));

      const endUsers = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(and(
          eq(users.whiteLabelId, business.id),
          eq(users.role, 'end_user')
        ))
        .limit(10);

      res.json({
        ...business,
        userCount: parseInt(userCount[0]?.count || '0'),
        monthlyRevenue: parseFloat(monthlyRevenue[0]?.total || '0'),
        activePlans: parseInt(activePlans[0]?.count || '0'),
        endUsers,
        totalRevenue: 0,
        billingStatus: 'active',
        nextBillingDate: null,
        lastLogin: null,
      });
    } catch (error) {
      console.error('Error fetching business detail:', error);
      res.status(500).json({ error: 'Failed to fetch business detail' });
    }
  });

  // AI Generation Test endpoint (no auth for testing)
  app.post('/api/ai/test-generate', async (req, res) => {
    try {
      console.log('🧪 AI Test Generation Request:', req.body);
      const { type, prompt, tone, length, audience, keywords, language, industry, brand_voice } = req.body;
      
      if (!type || !prompt) {
        return res.status(400).json({ error: 'Type and prompt are required' });
      }

      const request = {
        type,
        prompt,
        tone,
        length,
        audience,
        keywords,
        language,
        industry,
        brand_voice
      };

      const result = await aiService.generateContent(request);
      console.log('✅ AI Test Generation Success');
      res.json(result);
    } catch (error: any) {
      console.error('❌ AI Test Generation Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Generation Endpoints
  app.post('/api/ai/generate', isAuthenticated, async (req, res) => {
    try {
      const { type, prompt, tone, length, audience, keywords } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const { aiService } = await import('./ai');
      
      const result = await aiService.generateContent({
        type: type || 'product_description',
        prompt,
        tone,
        length,
        audience,
        keywords
      });

      res.json(result);
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ error: 'Failed to generate content' });
    }
  });

  app.post('/api/ai/generate-product-content', isAuthenticated, async (req, res) => {
    try {
      const { type, prompt, productType } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const { aiService } = await import('./ai');
      
      const result = await aiService.generateProductContent({
        type: type || 'product_description',
        prompt,
        productType: productType || 'general'
      });

      res.json(result);
    } catch (error) {
      console.error('AI product content generation error:', error);
      res.status(500).json({ error: 'Failed to generate product content' });
    }
  });

  app.post('/api/ai/generate-landing-page', isAuthenticated, async (req, res) => {
    try {
      const { prompt, sections, userId } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const user = req.user as any;
      const actualUserId = userId || user?.id;

      const { aiService } = await import('./ai');
      
      const result = await aiService.generateLandingPage({
        prompt,
        sections: sections || ['hero', 'features', 'pricing'],
        userId: actualUserId
      });

      res.json(result);
    } catch (error) {
      console.error('AI landing page generation error:', error);
      res.status(500).json({ error: 'Failed to generate landing page' });
    }
  });

  app.post('/api/ai/recommendations', isAuthenticated, async (req, res) => {
    try {
      const { context, preferences, history } = req.body;
      const user = req.user as any;
      
      if (!user?.id) {
        return res.status(401).json({ error: 'User ID required' });
      }

      const { aiService } = await import('./ai');
      
      const result = await aiService.generateRecommendations({
        userId: user.id,
        context: context || 'plans',
        userRole: user.role || 'user',
        preferences,
        history
      });

      res.json({ recommendations: result });
    } catch (error) {
      console.error('AI recommendations error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  app.post('/api/ai/optimize-content', isAuthenticated, async (req, res) => {
    try {
      const { content, type, targetAudience } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const { aiService } = await import('./ai');
      
      const result = await aiService.optimizeContent({
        content,
        type: type || 'seo',
        targetAudience
      });

      res.json(result);
    } catch (error) {
      console.error('AI content optimization error:', error);
      res.status(500).json({ error: 'Failed to optimize content' });
    }
  });

  // Main AI Content Generation endpoint
  app.post('/api/ai/generate-content', isAuthenticated, async (req, res) => {
    try {
      const { type, prompt, tone, length, audience, keywords, language, industry, brand_voice } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const user = req.user as any;
      console.log(`🤖 AI Content Generation Request from user ${user?.id}: ${prompt}`);

      const { aiService } = await import('./ai');
      
      const result = await aiService.generateContent({
        type: type || 'product_description',
        prompt,
        tone: tone || 'professional',
        length: length || 'medium',
        audience,
        keywords: keywords || [],
        language: language || 'English',
        industry,
        brand_voice
      });

      console.log('✅ AI Content Generation Success');
      res.json(result);
    } catch (error: any) {
      console.error('❌ AI Content Generation Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
  });

  return server;
}

function generatePricingSection(clientPlans: any[]) {
  if (clientPlans.length === 0) {
    return `
      <section id="pricing" style="padding: 80px 0; background: #f8fafc;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <h2 style="text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; color: #1a202c;">
            Our Pricing Plans
          </h2>
          <div style="text-align: center; padding: 40px;">
            <p style="font-size: 1.1rem; color: #4a5568;">
              Contact us for custom pricing options tailored to your business needs.
            </p>
          </div>
        </div>
      </section>
    `;
  }
  
  const plansHtml = clientPlans.map(plan => {
    const price = plan.monthlyPrice || plan.monthly_price || plan.price;
    const displayPrice = price ? '$' + price : 'Contact for Pricing';
    
    return `
    <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #1a202c;">${plan.name}</h3>
      <div style="font-size: 2.5rem; font-weight: 700; color: #667eea; margin-bottom: 1rem;">
        ${displayPrice}
      </div>
      <p style="color: #4a5568; margin-bottom: 2rem;">${plan.description || 'Professional solution for your business needs.'}</p>
      <button onclick="navigateToCheckout('${plan.id}', '${plan.name}', '${price || 0}')" 
              style="width: 100%; background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
        Purchase Now
      </button>
    </div>
  `;
  }).join('');
  
  return `
    <section id="pricing" style="padding: 80px 0; background: #f8fafc;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
        <h2 style="text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; color: #1a202c;">
          Our Pricing Plans
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          ${plansHtml}
        </div>
      </div>
    </section>
  `;
}

