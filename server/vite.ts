import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    console.log(`🔍 VITE DEBUG - req.originalUrl: ${req.originalUrl}`);
    // Decode URL to handle encoded characters like %3F (?)
    const url = decodeURIComponent(req.originalUrl);
    console.log(`🔍 VITE MIDDLEWARE - Processing request (decoded): ${url}`);

    // Skip API routes - let them be handled by the API endpoints
    if (url.startsWith('/api/')) {
      console.log(`🔍 VITE DEBUG - Skipping API route: ${url}`);
      return next();
    }

    // Skip domain paths that should be handled by custom domain routes
    // Check if this looks like a domain path (single path segment, no file extension)
    // But exclude standard app routes like /auth, /dashboard, etc.
    const urlPath = url.split('?')[0]; // Remove query parameters for path analysis
    const pathSegments = urlPath.split('/').filter(segment => segment.length > 0);
    console.log(`🔍 VITE DEBUG - Path segments for ${url}:`, pathSegments);
    
    // Standard app routes that should be handled by React Router
    const standardAppRoutes = [
      'auth', 'dashboard', 'profile', 'settings', 'admin', 'plans', 'billing', 'pricing', 
      'become-affiliate', 'white-label', 'contact', 'reset-password', 'subscriptions', 
      'clients', 'affiliates', 'analytics', 'products', 'categories', 'integrations', 
      'ai-content', 'landing-builder', 'referrals', 'affiliate-commissions', 'links', 
      'news', 'announcements', 'announcements-simple', 'affiliate-dashboard', 
      'business-auth', 'business-signup', 'commission-rules', 'system-settings', 
      'impersonate', 'tracking', 'reports', 'end-users', 'my-affiliates', 
      'portal-settings', 'preview', 'performance', 'browse', 'downloads', 'courses', 
      'favorites', 'library', 'notifications', 'support', 'purchase-success', 
      'login', 'signup'
    ];
    
    if (pathSegments.length === 1 && 
        !pathSegments[0].includes('.') && 
        !standardAppRoutes.includes(pathSegments[0])) {
      console.log(`🔍 VITE DEBUG - Skipping domain path: ${url}, letting custom route handle it`);
      return next();
    }

    console.log(`🔍 VITE DEBUG - Serving HTML template for: ${url}`);

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
