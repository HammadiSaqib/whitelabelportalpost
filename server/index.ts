// Load environment variables FIRST - before any other imports
import './env';

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Removed old Replit Auth - using custom auth system

const app = express();

// Enhanced body parsing with size limits to prevent server overload
app.use(express.json({ 
  limit: '50mb', // Increased limit for file uploads
  verify: (req, res, buf) => {
    // Add request validation - allow empty bodies for certain endpoints
    if (buf && buf.length === 0) {
      // Allow empty bodies for impersonation and other endpoints that don't require body data
      const allowEmptyBodyPaths = [
        '/api/admin/impersonate/',
        '/api/admin/stop-impersonation',
        '/api/auth/logout',
        '/api/auth/me'
      ];
      
      const isAllowedEmptyBody = allowEmptyBodyPaths.some(path => req.url?.includes(path));
      
      if (!isAllowedEmptyBody) {
        throw new Error('Request body cannot be empty');
      }
    }
  }
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: '50mb',
  parameterLimit: 1000 // Limit number of parameters
}));

// Request timeout middleware
app.use((req, res, next) => {
  // Set timeout for all requests (5 minutes for uploads, 30 seconds for others)
  const timeout = req.path.includes('/upload') || req.method === 'POST' ? 300000 : 30000;
  
  req.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: 'Request timeout' });
    }
  });
  
  res.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: 'Response timeout' });
    }
  });
  
  next();
});

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Custom authentication is now handled in routes
    
    const server = await registerRoutes(app);

    // Enhanced global error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      let message = err.message || "Internal Server Error";

      // Log detailed error information
      console.error('=== ERROR DETAILS ===');
      console.error('Path:', req.path);
      console.error('Method:', req.method);
      console.error('Status:', status);
      console.error('Message:', message);
      console.error('Stack:', err.stack);
      console.error('Body:', req.body);
      console.error('Query:', req.query);
      console.error('Params:', req.params);
      console.error('==================');

      // Handle specific error types
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File too large. Maximum size is 50MB.';
        return res.status(413).json({ error: message });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'Unexpected file field in upload.';
        return res.status(400).json({ error: message });
      }
      
      if (err.type === 'entity.parse.failed') {
        message = 'Invalid JSON in request body.';
        return res.status(400).json({ error: message });
      }
      
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        message = 'Database connection lost. Please try again.';
        return res.status(503).json({ error: message });
      }
      
      if (err.code === 'ER_DUP_ENTRY') {
        message = 'Duplicate entry. This record already exists.';
        return res.status(409).json({ error: message });
      }

      // Sanitize error message for production
      if (process.env.NODE_ENV === 'production') {
        if (status >= 500) {
          message = 'Internal server error. Please try again later.';
        }
      }

      log(`Error: ${message}`);
      
      // Check if response has already been sent
      if (!res.headersSent) {
        res.status(status).json({ 
          error: message,
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit the process, just log the error
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Don't exit the process immediately, allow graceful shutdown
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use port 5000 for Replit (only non-firewalled port)
    const port = Number(process.env.PORT) || 5000;
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Failed to start server: ${errorMessage}`);
    console.error('Server startup error:', error);
    process.exit(1);
  }
})();
