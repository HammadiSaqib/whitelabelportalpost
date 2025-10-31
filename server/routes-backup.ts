import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./ai-backup";
import { generateDefaultBuilderElements } from "./defaultLandingPage";

// Authentication middleware
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Global announcements (public)
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      const publicAnnouncements = announcements.filter(a => a.isPublic);
      res.json(publicAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Create announcement (authenticated)
  app.post('/api/announcements', isAuthenticated, async (req, res) => {
    try {
      const { title, content, isPublic } = req.body;
      const user = req.user;
      
      if (!user || (user.role !== 'super_admin' && user.role !== 'super_admin_affiliate')) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const announcement = await storage.createAnnouncement({
        title,
        content,
        isPublic: isPublic || false,
        authorId: user.id,
        authorName: user.username || user.email
      });

      res.json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ error: 'Failed to create announcement' });
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

  // Domain route handler - clean paths without /domain/ prefix
  app.get('/:domainPath', async (req, res, next) => {
    try {
      const { domainPath } = req.params;
      
      // Skip if this looks like an API route, Vite dev server file, static file, or main app route
      if (domainPath.startsWith('api') || 
          domainPath.startsWith('src') ||
          domainPath.startsWith('@') ||
          domainPath.startsWith('node_modules') ||
          domainPath.includes('.') || 
          domainPath === 'favicon.ico' ||
          domainPath === 'robots.txt' ||
          domainPath === 'sitemap.xml' ||
          domainPath === 'login' ||
          domainPath === 'signup' ||
          domainPath === 'auth' ||
          domainPath === 'reset-password' ||
          domainPath === 'dashboard' ||
          domainPath === 'super-admin-login' ||
          domainPath === 'super-admin' ||
          domainPath === 'white-label' ||
          domainPath === 'affiliate' ||
          domainPath === 'white-label-affiliate' ||
          domainPath === 'clients' ||
          domainPath === 'plans' ||
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
          domainPath === 'analytics' ||
          domainPath === 'notifications' ||
          domainPath === 'profile' ||
          domainPath === 'billing' ||
          domainPath === 'support' ||
          domainPath === 'help' ||
          domainPath === 'admin' ||
          domainPath === 'pricing' ||
          domainPath === 'become-affiliate' ||
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

      // First check if this domain path belongs to a white label client
      const whiteLabel = await storage.getWhiteLabelByDomainPath(domainPath);
      
      let landingPage = null;
      
      if (whiteLabel) {
        // If white label has a custom default landing page, use it
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
      } else {
        // No white label found for this domain path, try direct lookup
        landingPage = await storage.getLandingPageByDomainPath(domainPath);
      }
      
      // If no landing page exists for this domain path, show not found
      if (!landingPage) {
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
      const userId = landingPage.userId;
      let clientPlans = [];
     
      // Use existing whiteLabel if available, otherwise find by userId
      let currentWhiteLabel = whiteLabel;
      if (!currentWhiteLabel) {
        try {
          // Find the white-label account for this user
          const whiteLabels = await storage.getWhiteLabels();
          currentWhiteLabel = whiteLabels.find(wl => wl.userId === userId);
        } catch (error) {
          console.error('Error finding white label:', error);
        }
      }
      
      try {
        // Get actual plans created by this user
        const plans = await storage.getPlansByUser(userId);
        clientPlans = plans || [];
        
        // If no user-created plans, also check for plans associated with their white label
        if (clientPlans.length === 0 && currentWhiteLabel) {
          const allPlans = await storage.getPlans();
          const whiteLabelPlans = allPlans.filter(plan => (plan as any).whiteLabelId === currentWhiteLabel.id);
          clientPlans = whiteLabelPlans;
        }
      } catch (error) {
        console.error('Error fetching client plans:', error);
      }

      // Generate HTML content
      const htmlContent = generateLandingPageHTML(landingPage, clientPlans, currentWhiteLabel);
      
      return res.send(htmlContent);
    } catch (error: any) {
      console.error('Error serving domain page:', error);
      res.status(500).send('Internal server error');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateLandingPageHTML(landingPage: any, clientPlans: any[], whiteLabel: any) {
  const elements = landingPage.elements || [];
  const companyName = whiteLabel?.businessName || 'Our Company';
  
  const elementsHtml = elements.map((element: any) => {
    if (element.type === 'hero') {
      return `
        <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0; text-align: center;">
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1.5rem;">
              ${element.content?.title || `Transform Your Business ${companyName}`}
            </h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
              ${element.content?.subtitle || `${companyName} helps businesses grow with cutting-edge strategies and proven results.`}
            </p>
            <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
              <a href="#pricing" style="background: #ffffff; color: #667eea; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.1rem;">
                View Our Plans
              </a>
              <button onclick="navigateToSignup()" style="background: transparent; color: #ffffff; border: 2px solid #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; cursor: pointer;">
                Get Started Free
              </button>
            </div>
          </div>
        </section>
      `;
    } else if (element.type === 'pricing') {
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
      
      const plansHtml = clientPlans.map(plan => `
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
          <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #1a202c;">${plan.name}</h3>
          <div style="font-size: 2.5rem; font-weight: 700; color: #667eea; margin-bottom: 1rem;">
            ${plan.price ? `$${plan.price}` : 'Contact for Pricing'}
          </div>
          <p style="color: #4a5568; margin-bottom: 2rem;">${plan.description || 'Professional solution for your business needs.'}</p>
          <button onclick="navigateToCheckout('${plan.id}', '${plan.name}', '${plan.price || 0}')" 
                  style="width: 100%; background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Purchase Now
          </button>
        </div>
      `).join('');
      
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
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      </style>
    </head>
    <body>
      ${elementsHtml}
      
      <script>
        function navigateToCheckout(planId, planName, planPrice) {
          // Navigate to checkout page with plan details and white-label context
          const whiteLabelId = ${whiteLabel?.id || 'null'};
          const contextParam = whiteLabelId ? \`&context=client_\${whiteLabelId}\` : '';
          window.location.href = \`/pricing?plan=\${planId}&name=\${encodeURIComponent(planName)}&price=\${planPrice}\${contextParam}\`;
        }
        
        function navigateToSignup() {
          // Navigate to signup with white-label context
          const whiteLabelId = ${whiteLabel?.id || 'null'};
          const contextParam = whiteLabelId ? \`client_\${whiteLabelId}\` : '';
          window.location.href = \`/auth?context=\${contextParam}\`;
        }
      </script>
    </body>
    </html>
  `;
}