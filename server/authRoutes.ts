import type { Express } from "express";
import passport from "passport";
import crypto from "crypto";
import multer from "multer";
import { 
  hashPassword, 
  findUserByUsername, 
  createUser,
  isAuthenticated 
} from "./auth";
import { storage } from "./storage";
import { loginSchema, signupSchema, checkUsernameSchema, forgotPasswordSchema, resetPasswordSchema } from "@shared/schema";
import { db } from "./db";
import { users, whiteLabels, passwordResetTokens } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { sendVerificationEmail, generateVerificationCode, sendLoginNotification } from "./emailService";
import { sendPasswordResetEmail } from "./passwordResetEmailService";
import { VerificationStorage } from "./verificationStorage";
import { PasswordResetStorage } from "./passwordResetStorage";
import { extractLoginMetadata } from "./deviceDetection";

export function registerAuthRoutes(app: Express) {
  
  // Configure multer for affiliate signup file uploads
  const upload = multer();
  
  // Check username availability
  app.post("/api/auth/check-username", async (req, res) => {
    try {
      const { username, context } = req.body;
      
      // Force lowercase for all usernames
      const lowercaseUsername = username.toLowerCase();
      
      const existingUser = await findUserByUsername(lowercaseUsername);
      
      if (existingUser) {
        return res.json({
          available: false,
          existingRole: existingUser.role,
          message: `Username already taken. Please try a different username.`
        });
      }
      
      res.json({
        available: true,
        message: "Username is available"
      });
    } catch (error: any) {
      console.error("Username check error:", error);
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // Check email availability
  app.post("/api/auth/check-email", async (req, res) => {
    try {
      const { email } = req.body;
      
      // Force lowercase for all emails
      const lowercaseEmail = email.toLowerCase();
      
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, lowercaseEmail))
        .limit(1);
      
      if (existingUser) {
        return res.json({
          available: false,
          existingRole: existingUser.role,
          message: `Email already taken. Please try a different email.`
        });
      }
      
      res.json({
        available: true,
        message: "Email is available"
      });
    } catch (error: any) {
      console.error("Email check error:", error);
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // Send verification code to email
  app.post("/api/auth/send-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Valid email address is required" });
      }
      
      const lowercaseEmail = email.toLowerCase();
      
      // Check if email already has a pending verification (rate limiting)
      const resendCheck = VerificationStorage.canResend(lowercaseEmail);
      if (!resendCheck.canResend) {
        return res.status(429).json({ 
          error: `Verification code was recently sent. Please wait ${resendCheck.waitTime} seconds before requesting another one.`,
          canResend: false,
          waitTime: resendCheck.waitTime
        });
      }
      
      // Generate and store verification code
      const code = generateVerificationCode();
      VerificationStorage.store(lowercaseEmail, code);
      
      // Send verification email
      const emailSent = await sendVerificationEmail(lowercaseEmail, code);
      
      if (!emailSent) {
        VerificationStorage.remove(lowercaseEmail);
        return res.status(500).json({ error: "Failed to send verification email. Please try again." });
      }
      
      res.json({ 
        success: true,
        message: "Verification code sent to your email address",
        email: lowercaseEmail 
      });
      
    } catch (error: any) {
      console.error("Send verification error:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Verify email code
  app.post("/api/auth/verify-code", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: "Email and verification code are required" });
      }
      
      const lowercaseEmail = email.toLowerCase();
      const result = VerificationStorage.verify(lowercaseEmail, code.toString());
      
      if (result.valid) {
        res.json({ 
          success: true,
          verified: true,
          message: result.message 
        });
      } else {
        res.status(400).json({ 
          success: false,
          verified: false,
          message: result.message,
          attempts: result.attempts 
        });
      }
      
    } catch (error: any) {
      console.error("Verify code error:", error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // Demo login endpoint for demo users
  app.post("/api/auth/demo-login", async (req, res) => {
    try {
      const { email, role } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Log the user in
      req.logIn(user, async (err) => {
        if (err) {
          console.error("Demo login session error:", err);
          return res.status(500).json({ error: "Session error" });
        }
        
        // Create user session for tracking
        try {
          const sessionToken = req.sessionID;
          const userWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
          const whiteLabelId = userWhiteLabel?.id || null;
          
          await storage.createUserSession({
            userId: user.id,
            whiteLabelId: whiteLabelId,
            sessionToken: sessionToken,
            isActive: true,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            lastActiveAt: new Date(),
            createdAt: new Date()
          });
          
          console.log(`Demo login successful for user: ${user.email}`);
        } catch (sessionError) {
          console.error("Error creating demo login session:", sessionError);
        }
        
        res.json({ 
          success: true,
          user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
        });
      });
      
    } catch (error: any) {
      console.error("Demo login error:", error);
      res.status(500).json({ error: "Demo login failed" });
    }
  });

  // Local login
  app.post("/api/auth/login", (req, res, next) => {
    console.log("📥 LOGIN REQUEST - Body:", JSON.stringify({ username: req.body.username, password: req.body.password?.length ? `[${req.body.password.length} chars]` : 'missing', whitelabel_id: req.body.whitelabel_id }));
    
    // Store or clear whitelabel_id in session (for domain-specific login tracking)
    if (req.body.whitelabel_id) {
      (req.session as any).pendingWhiteLabelId = req.body.whitelabel_id;
      console.log(`✅ Stored pendingWhiteLabelId in session: ${req.body.whitelabel_id}`);
    } else {
      // Clear any stale pendingWhiteLabelId if not provided in current request
      delete (req.session as any).pendingWhiteLabelId;
      console.log(`🧹 Cleared pendingWhiteLabelId - not in request body`);
    }
    
    // Validate input
    try {
      const validatedData = loginSchema.parse(req.body);
      console.log("✅ SCHEMA VALIDATION PASSED -", { username: validatedData.username, passwordLength: validatedData.password.length });
    } catch (error: any) {
      console.log("❌ SCHEMA VALIDATION FAILED -", error.errors);
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }

    console.log("🔄 CALLING passport.authenticate('local')...");
    passport.authenticate("local", (err: any, user: any, info: any) => {
      console.log("📞 PASSPORT CALLBACK - err:", !!err, "user:", !!user, "info:", info);
      
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      
      if (!user) {
        console.log("❌ PASSPORT RETURNED NO USER - Info message:", info?.message);
        return res.status(401).json({ 
          error: info?.message || "Invalid credentials" 
        });
      }

      req.logIn(user, async (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ error: "Session error" });
        }
        
        // TRACK LOGIN DOMAIN - Store which whitelabel_id the user logged in through
        // Check if there's a pending whitelabel_id from the auth page
        const pendingWhiteLabelId = (req.session as any).pendingWhiteLabelId;
        if (pendingWhiteLabelId) {
          (req.session as any).login_whitelabel_id = parseInt(pendingWhiteLabelId);
          console.log(`✅ LOCAL LOGIN - Stored login_whitelabel_id: ${pendingWhiteLabelId} for user ${user.id}`);
          // Clear pendingWhiteLabelId to prevent stale values
          delete (req.session as any).pendingWhiteLabelId;
        }
        
        // LOG LOGIN ACTIVITY AND CREATE USER SESSION - Critical for login tracking
        try {
          // Create or update user session for last active tracking
          const sessionToken = req.sessionID;
          
          // Get user's white label ID for activity logging
          const userWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
          const whiteLabelId = userWhiteLabel?.id || null;
          
          // Create user session for login tracking
          await storage.createUserSession({
            userId: user.id,
            whiteLabelId: whiteLabelId,
            sessionToken: sessionToken,
            isActive: true,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            lastActiveAt: new Date(),
            createdAt: new Date()
          });
          
          if (userWhiteLabel) {
            if (user.role === 'end_user') {
              // Create login activity for end-users
              await storage.createEndUserActivity({
                userId: user.id,
                whiteLabelId: userWhiteLabel.id,
                activityType: 'login',
                description: `${user.firstName || user.username} logged in`,
                metadata: {
                  ipAddress: req.ip,
                  userAgent: req.get('User-Agent'),
                  loginMethod: 'local'
                }
              });
              console.log(`LOGIN TRACKED - End-user ${user.id} login activity created for white-label ${userWhiteLabel.id}`);
            } else if (user.role === 'white_label_client') {
              // CRITICAL FIX: Create login activity for white-label clients too
              // White-label clients logging into their own dashboard should be tracked as end-user activities for their own domain
              await storage.createEndUserActivity({
                userId: user.id,
                whiteLabelId: userWhiteLabel.id,
                activityType: 'login',
                description: `${user.firstName || user.username} (owner) logged in`,
                metadata: {
                  ipAddress: req.ip,
                  userAgent: req.get('User-Agent'),
                  loginMethod: 'local',
                  ownerLogin: true
                }
              });
              console.log(`LOGIN TRACKED - White-label client ${user.id} login activity created for their own white-label ${userWhiteLabel.id}`);
            }
          } else {
            // Create general activity for other user types (super admin, etc.)
            await storage.createActivity({
              userId: user.id,
              type: 'user_login',
              description: `${user.firstName || user.username} (${user.role}) logged in`,
              metadata: {
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                loginMethod: 'local'
              }
            });
            console.log(`LOGIN TRACKED - General user ${user.id} login activity created`);
          }
          
          console.log(`USER SESSION CREATED - User ${user.id} session ${sessionToken} recorded`);
        } catch (activityError) {
          console.error('Error creating login activity or session:', activityError);
          // Don't fail login if activity creation fails - just log and continue
        }
        
        // Send successful response
        try {
          res.json({ 
            success: true, 
            user: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            }
          });
        } catch (responseError) {
          console.error('Error sending login response:', responseError);
          // Response may have already been sent
        }
        
        // Send login notification email asynchronously (non-blocking)
        // Extract basic info synchronously, then fire-and-forget the async email
        const userAgent = req.get('User-Agent') || '';
        const clientIP = req.ip || req.connection.remoteAddress || 'Unknown IP';
        const userName = user.firstName || user.username || 'User';
        
        // Fire-and-forget async notification (don't await)
        setImmediate(async () => {
          try {
            const loginMetadata = await extractLoginMetadata(req);
            
            // Transform the loginMetadata to the expected format for email
            const emailMetadata = {
              deviceInfo: `${loginMetadata.device.browser} ${loginMetadata.device.browserVersion} on ${loginMetadata.device.os}`,
              location: `${loginMetadata.location.city}, ${loginMetadata.location.country}`,
              ipAddress: loginMetadata.location.ip,
              timestamp: loginMetadata.timestamp.toLocaleString()
            };
            
            const emailSent = await sendLoginNotification(user.email, userName, emailMetadata);
            
            if (emailSent) {
              console.log(`LOGIN NOTIFICATION SENT - Email sent to ${user.email} for user ${user.id}`);
            } else {
              console.warn(`LOGIN NOTIFICATION FAILED - Could not send email to ${user.email} for user ${user.id}`);
            }
          } catch (notificationError) {
            console.error('Error sending login notification:', notificationError);
            // This is fire-and-forget, so we just log the error
          }
        });
      });
    })(req, res, next);
  });

  // Helper function to determine role based on context
  const determineUserRole = async (context: string, requestedRole: string, req: any) => {
    try {
      if (context === 'affiliate' || requestedRole === 'super_admin_affiliate') {
        return 'super_admin_affiliate';
      }

      // Check if context is a white-label client ID (format: client_X)
      if (context && context.startsWith('client_')) {
        const whiteLabelId = parseInt(context.replace('client_', ''));
        
        // Verify this white-label client exists
        const [whiteLabelEntry] = await db
          .select({
            id: whiteLabels.id,
            userId: whiteLabels.userId,
            businessName: whiteLabels.businessName,
            domainPath: whiteLabels.domainPath
          })
          .from(whiteLabels)
          .where(eq(whiteLabels.id, whiteLabelId));

        if (whiteLabelEntry) {
          console.log(`Assigning end-user to white-label client: ${whiteLabelEntry.businessName} (ID: ${whiteLabelId})`);
          return {
            role: 'end_user',
            whitelabelClientId: whiteLabelEntry.userId,
            whiteLabelId: whiteLabelEntry.id
          };
        }
      }

      // For domain-based context, find the domain owner
      const host = req.get('host');
      const domain = host?.split('.')[0]; // Extract subdomain
      
      if (domain && domain !== 'localhost' && !domain.includes('replit')) {
        // Look up white-label client by domain
        const [whiteLabelEntry] = await db
          .select({
            userId: users.id,
            whiteLabelId: whiteLabels.id
          })
          .from(whiteLabels)
          .innerJoin(users, eq(whiteLabels.userId, users.id))
          .where(eq(whiteLabels.domainPath, domain));

        if (whiteLabelEntry) {
          return {
            role: 'end_user',
            whitelabelClientId: whiteLabelEntry.userId,
            whiteLabelId: whiteLabelEntry.whiteLabelId
          };
        }
      }

      // Default fallback
      return 'white_label_client';
    } catch (error) {
      console.error("Error in determineUserRole:", error);
      return 'white_label_client'; // Safe fallback
    }
  };

  // Local signup
  app.post("/api/auth/signup", upload.single('profileImage'), async (req, res) => {
    try {
      const { firstName, lastName, username, password, email, verificationCode, role: requestedRole, context, whitelabel_id } = req.body;
      
      // Verify the email code first
      if (!email || !verificationCode) {
        return res.status(400).json({ error: "Email and verification code are required" });
      }

      const lowercaseEmail = email.toLowerCase();
      console.log('Local Signup - Verifying code for email:', lowercaseEmail);
      console.log('Local Signup - Verification code:', verificationCode);
      
      const verificationResult = VerificationStorage.verify(lowercaseEmail, verificationCode.toString());
      console.log('Local Signup - Verification result:', verificationResult);
      
      if (!verificationResult.valid) {
        return res.status(400).json({ 
          success: false,
          verified: false,
          message: verificationResult.message || 'Incorrect verification code',
          attempts: verificationResult.attempts 
        });
      }
      
      // Check if username already exists (using lowercase)
      const lowercaseUsername = username.toLowerCase();
      const existingUser = await findUserByUsername(lowercaseUsername);
      if (existingUser) {
        return res.status(400).json({ 
          error: `Username already taken. Please try a different username.`
        });
      }

      // Determine actual role based on context
      let actualRole = 'end_user'; // Default for regular signup
      let whitelabelClientId = null;
      let whiteLabelId = null;
      
      // If whitelabel_id is provided, this is a whitelabel end user
      if (whitelabel_id) {
        const parsedWhiteLabelId = parseInt(whitelabel_id);
        console.log(`Local Signup - Processing whitelabel_id: ${whitelabel_id} (parsed: ${parsedWhiteLabelId})`);
        
        // Verify this white-label client exists
        const [whiteLabelEntry] = await db
          .select({
            id: whiteLabels.id,
            userId: whiteLabels.userId,
            businessName: whiteLabels.businessName,
            domainPath: whiteLabels.domainPath
          })
          .from(whiteLabels)
          .where(eq(whiteLabels.id, parsedWhiteLabelId));

        if (whiteLabelEntry) {
          console.log(`Local Signup - Assigning end-user to white-label client: ${whiteLabelEntry.businessName} (ID: ${parsedWhiteLabelId})`);
          actualRole = 'end_user';
          whitelabelClientId = whiteLabelEntry.userId;
          whiteLabelId = whiteLabelEntry.id;
        } else {
          console.log(`Local Signup - Warning: whitelabel_id ${parsedWhiteLabelId} not found, proceeding as regular end_user`);
        }
      } else {
        // Try the original role determination for backward compatibility
        const roleResult = await determineUserRole(context, requestedRole, req);
        actualRole = typeof roleResult === 'string' ? roleResult : roleResult.role;
        whitelabelClientId = typeof roleResult === 'object' ? roleResult.whitelabelClientId : null;
        whiteLabelId = typeof roleResult === 'object' ? roleResult.whiteLabelId : null;
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Prepare user data based on role
      const userData: any = {
        username: lowercaseUsername,
        firstName,
        lastName,
        email: lowercaseEmail,
        password: hashedPassword,
        role: actualRole,
        authProvider: "local"
      };

      // Store whitelabel_id in correct column based on role
      if (actualRole === 'affiliate' || actualRole === 'super_admin_affiliate') {
        // For affiliates, store in affiliateOfWhiteLabelId
        if (whiteLabelId) {
          userData.affiliateOfWhiteLabelId = whiteLabelId;
          console.log(`Local Signup - Storing whiteLabelId ${whiteLabelId} in affiliateOfWhiteLabelId for affiliate`);
        }
      } else if (actualRole === 'end_user') {
        // For end users, store in userOfWhiteLabelId
        if (whiteLabelId) {
          userData.userOfWhiteLabelId = whiteLabelId;
          console.log(`Local Signup - Storing whiteLabelId ${whiteLabelId} in userOfWhiteLabelId for end user`);
        }
      } else {
        // For other roles (white_label_client, etc.), store in whiteLabelId if available
        userData.whiteLabelId = whiteLabelId;
      }

      // Create user with lowercase username
      const newUser = await createUser(userData);

      // Auto-login the user
      req.logIn(newUser, (err) => {
        if (err) {
          console.error("Auto-login error:", err);
          return res.status(500).json({ error: "Account created but login failed" });
        }
        
        res.json({ 
          success: true, 
          user: {
            id: newUser.id,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
          }
        });
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ 
        error: error.message || "Failed to create account",
        details: error.message
      });
    }
  });

  // White Label Affiliate signup with email verification
  app.post("/api/auth/signup-white-label-affiliate", upload.single('profileImage'), async (req, res) => {
    try {
      console.log('=== WHITE LABEL AFFILIATE SIGNUP DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const { firstName, lastName, username, password, email, referralUrl, verificationCode, role, whiteLabelId } = req.body;
      const profileImageFile = req.file;
      
      console.log('Extracted fields:');
      console.log('- firstName:', firstName);
      console.log('- lastName:', lastName);
      console.log('- username:', username);
      console.log('- email:', email);
      console.log('- whiteLabelId:', whiteLabelId);
      console.log('- verificationCode:', verificationCode);
      
      // Verify required fields
      if (!email || !verificationCode) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ error: "Email and verification code are required" });
      }

      if (!whiteLabelId) {
        console.log('❌ Missing whiteLabelId');
        return res.status(400).json({ error: "White label ID is required" });
      }

      const lowercaseEmail = email.toLowerCase();
      console.log('Attempting to verify code for email:', lowercaseEmail);
      
      const verificationResult = VerificationStorage.verify(lowercaseEmail, verificationCode.toString());
      console.log('Verification result:', verificationResult);
      
      if (!verificationResult.valid) {
        return res.status(400).json({ 
          success: false,
          verified: false,
          message: verificationResult.message,
          attempts: verificationResult.attempts 
        });
      }
      
      // Check if username already exists (using lowercase)
      const lowercaseUsername = username.toLowerCase();
      const existingUser = await findUserByUsername(lowercaseUsername);
      if (existingUser) {
        return res.status(400).json({ 
          error: `Username already taken. Please try a different username.`
        });
      }

      // Check if email already exists
      const [existingEmailUser] = await db.select().from(users).where(eq(users.email, lowercaseEmail));
      if (existingEmailUser) {
        return res.status(400).json({ 
          error: `Email already registered. Please use a different email.`
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate referral code for the white label affiliate
      const baseName = firstName || username || 'wlaffiliate';
      const referralCode = await storage.generateUniqueReferralCode(baseName);

      // Handle profile image upload if provided
      let profileImagePath = null;
      if (profileImageFile) {
        profileImagePath = `/uploads/${profileImageFile.filename}`;
      }

      // Create user with white_label_affiliate role
      const newUser = await createUser({
        username: lowercaseUsername,
        firstName,
        lastName,
        email: lowercaseEmail,
        password: hashedPassword,
        role: 'white_label_affiliate',
        authProvider: "local",
        referralCode,
        referralUrl: referralUrl || null,
        profileImage: profileImagePath,
        whiteLabelId: parseInt(whiteLabelId),
        affiliateOfWhiteLabelId: parseInt(whiteLabelId) // Track which white label the affiliate signed up through
      });

      console.log('✅ White Label Affiliate created successfully:', {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        whiteLabelId: newUser.whiteLabelId
      });

      // Auto-login the user
      req.logIn(newUser, (err) => {
        if (err) {
          console.error("Auto-login error:", err);
          return res.status(500).json({ error: "Account created but login failed" });
        }
        
        res.json({ 
          success: true, 
          user: {
            id: newUser.id,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            referralCode: newUser.referralCode,
            referralUrl: newUser.referralUrl,
            profileImage: newUser.profileImage,
            whiteLabelId: newUser.whiteLabelId
          }
        });
      });

    } catch (error: any) {
      console.error("White Label Affiliate signup error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ 
        error: error.message || "Failed to create white label affiliate account",
        details: error.message
      });
    }
  });

  // Affiliate signup with email verification
  app.post("/api/auth/signup-affiliate", upload.single('profileImage'), async (req, res) => {
    try {
      console.log('=== AFFILIATE SIGNUP DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('Request headers content-type:', req.headers['content-type']);
      console.log('All request headers:', req.headers);
      
      const { firstName, lastName, username, password, email, referralUrl, verificationCode, role, domainPath, whiteLabelId } = req.body;
      const profileImageFile = req.file;
      
      console.log('Extracted fields:');
      console.log('- firstName:', firstName);
      console.log('- lastName:', lastName);
      console.log('- username:', username);
      console.log('- email:', email);
      console.log('- role:', role);
      console.log('- whiteLabelId:', whiteLabelId);
      console.log('- whiteLabelId type:', typeof whiteLabelId);
      console.log('- verificationCode:', verificationCode);
      console.log('- verificationCode type:', typeof verificationCode);
      console.log('- verificationCode length:', verificationCode?.length);
      
      // Verify the email code first
      if (!email || !verificationCode) {
        console.log('❌ Missing required fields:');
        console.log('- email present:', !!email);
        console.log('- verificationCode present:', !!verificationCode);
        return res.status(400).json({ error: "Email and verification code are required" });
      }

      const lowercaseEmail = email.toLowerCase();
      console.log('Attempting to verify code for email:', lowercaseEmail);
      console.log('Code to verify:', verificationCode);
      
      // Debug: Check verification process
      console.log('=== VERIFICATION STORAGE DEBUG ===');
      console.log('About to verify code for email:', lowercaseEmail);
      console.log('Input verification code:', verificationCode);
      console.log('Input code type:', typeof verificationCode);
      
      const verificationResult = VerificationStorage.verify(lowercaseEmail, verificationCode.toString());
      console.log('Verification result:', verificationResult);
      
      if (!verificationResult.valid) {
        return res.status(400).json({ 
          success: false,
          verified: false,
          message: verificationResult.message,
          attempts: verificationResult.attempts 
        });
      }
      
      // Check if username already exists (using lowercase)
      const lowercaseUsername = username.toLowerCase();
      const existingUser = await findUserByUsername(lowercaseUsername);
      if (existingUser) {
        return res.status(400).json({ 
          error: `Username already taken. Please try a different username.`
        });
      }

      // Check if email already exists
      const [existingEmailUser] = await db.select().from(users).where(eq(users.email, lowercaseEmail));
      if (existingEmailUser) {
        return res.status(400).json({ 
          error: `Email already registered. Please use a different email.`
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate referral code for the affiliate
      const baseName = firstName || username || 'affiliate';
      const referralCode = await storage.generateUniqueReferralCode(baseName);

      // Handle profile image upload if provided
      let profileImagePath = null;
      if (profileImageFile) {
        profileImagePath = `/uploads/${profileImageFile.filename}`;
      }

      // Determine role - use from request body or default to super_admin_affiliate
      const userRole = role && role.toLowerCase() === 'end-user' ? 'end_user' : 'super_admin_affiliate';

      // Prepare user data
      const userData: any = {
        username: lowercaseUsername,
        firstName,
        lastName,
        email: lowercaseEmail,
        password: hashedPassword,
        role: userRole,
        authProvider: "local",
        referralCode,
        referralUrl: referralUrl || null,
        profileImage: profileImagePath
      };

      // Set whiteLabelId based on role and availability
      if (whiteLabelId) {
        const parsedWhiteLabelId = parseInt(whiteLabelId);
        if (userRole === 'end_user') {
          // For end users, set userOfWhiteLabelId
          userData.userOfWhiteLabelId = parsedWhiteLabelId;
          console.log(`Setting userOfWhiteLabelId to ${parsedWhiteLabelId} for end user`);
        } else {
          // For affiliates, set affiliateOfWhiteLabelId
          userData.affiliateOfWhiteLabelId = parsedWhiteLabelId;
          console.log(`Setting affiliateOfWhiteLabelId to ${parsedWhiteLabelId} for affiliate`);
        }
      }

      // Create user with specified role
      const newUser = await createUser(userData);

      // Auto-login the user
      req.logIn(newUser, (err) => {
        if (err) {
          console.error("Auto-login error:", err);
          return res.status(500).json({ error: "Account created but login failed" });
        }
        
        res.json({ 
          success: true, 
          user: {
            id: newUser.id,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            referralCode: newUser.referralCode,
            referralUrl: newUser.referralUrl,
            profileImage: newUser.profileImage
          }
        });
      });

    } catch (error: any) {
      console.error("Affiliate signup error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ 
        error: error.message || "Failed to create affiliate account",
        details: error.message
      });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", (req, res, next) => {
    // Store role, context, and whitelabel_id in session for signup
    if (req.query.role) {
      (req.session as any).pendingRole = req.query.role as string;
    }
    if (req.query.context) {
      (req.session as any).pendingContext = req.query.context as string;
    }
    if (req.query.whitelabel_id) {
      (req.session as any).pendingWhiteLabelId = req.query.whitelabel_id as string;
    }
    
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })(req, res, next);
  });

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login?error=google_auth_failed" }),
    async (req, res) => {
      // Handle successful authentication
      const user = req.user as any;
      
      // TRACK LOGIN DOMAIN - Store which whitelabel_id the user logged in through
      const pendingWhiteLabelId = (req.session as any).pendingWhiteLabelId;
      if (pendingWhiteLabelId) {
        (req.session as any).login_whitelabel_id = parseInt(pendingWhiteLabelId);
        console.log(`✅ GOOGLE OAuth - Stored login_whitelabel_id: ${pendingWhiteLabelId} for user ${user.id}`);
        // Clear pendingWhiteLabelId to prevent stale values (will be deleted again later, but safe to do now)
        delete (req.session as any).pendingWhiteLabelId;
      }
      
      // If this was a signup with specific context, update the user role
      const pendingRole = (req.session as any).pendingRole;
      const pendingContext = (req.session as any).pendingContext;
      
      if (pendingRole && pendingRole !== "white_label_client") {
        try {
          const roleResult = await determineUserRole(pendingContext, pendingRole, req);
          const actualRole = typeof roleResult === 'string' ? roleResult : roleResult.role;
          const whiteLabelId = typeof roleResult === 'object' ? roleResult.whiteLabelId : null;

          // Prepare update data
          const updateData: any = { 
            role: actualRole
          };

          // Store whitelabel_id in correct column based on role
          if (actualRole === 'affiliate' || actualRole === 'super_admin_affiliate') {
            // For affiliates, store in affiliateOfWhiteLabelId
            if (pendingWhiteLabelId) {
              updateData.affiliateOfWhiteLabelId = parseInt(pendingWhiteLabelId);
              console.log(`Storing whitelabel_id ${pendingWhiteLabelId} in affiliateOfWhiteLabelId for affiliate`);
            }
          } else if (actualRole === 'end_user') {
            // For end users, store in whiteLabelId
            updateData.whiteLabelId = whiteLabelId;
          }

          // Generate referral code for Super Admin Affiliates
          if (actualRole === 'super_admin_affiliate') {
            const baseName = user.firstName || user.email?.split('@')[0] || user.username || 'affiliate';
            updateData.referralCode = await storage.generateUniqueReferralCode(baseName);
            console.log(`Generated referral code for Google OAuth Super Admin Affiliate: ${updateData.referralCode}`);
          }

          await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, user.id));
          
          // Update the user object in session
          user.role = actualRole;
          if (updateData.referralCode) {
            user.referralCode = updateData.referralCode;
          }
          // Update correct whitelabel field in session
          if (actualRole === 'affiliate' || actualRole === 'super_admin_affiliate') {
            user.affiliateOfWhiteLabelId = updateData.affiliateOfWhiteLabelId;
          } else if (actualRole === 'end_user') {
            user.whiteLabelId = updateData.whiteLabelId;
          }
          
          // AUTOMATIC WHITE-LABEL RECORD CREATION FOR END_USERS
          // If role was updated to end_user, create white-label record for them
          if (actualRole === 'end_user') {
            try {
              console.log(`Creating white-label record for Google OAuth end_user: ${user.username}`);
              
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
              
              // Import storage to use createWhiteLabel method
              const { storage } = await import('./storage');
              
              // Create white-label record using storage method (includes automatic default landing page)
              const whiteLabelRecord = await storage.createWhiteLabel({
                userId: user.id,
                businessName: cleanBusinessName,
                domainPath,
                isActive: true,
              });
              
              // AUTOMATICALLY CREATE DOMAIN SESSION FOR THE NEW END_USER
              // This ensures they can immediately access domain management features
              try {
                const { generateId } = await import('lucia');
                const domainSessionId = generateId(32);
                
                await storage.createDomainUserSession(user.id, domainPath, domainSessionId);
                
                console.log(`Created domain session for Google OAuth ${user.username}: domain "${domainPath}", session ID ${domainSessionId}`);
              } catch (error) {
                console.error('Error creating domain session for Google OAuth end_user:', error);
                // Don't fail the OAuth flow if domain session creation fails
              }
              
              console.log(`Created white-label record for Google OAuth ${user.username}: domain "${domainPath}", ID ${whiteLabelRecord.id}`);
            } catch (error) {
              console.error('Error creating white-label record for Google OAuth end_user:', error);
              // Don't fail the OAuth flow if white-label creation fails
            }
          }
        } catch (error) {
          console.error("Failed to update user role:", error);
        }
        
        delete (req.session as any).pendingRole;
        delete (req.session as any).pendingContext;
      }
      
      // LOG LOGIN ACTIVITY AND CREATE USER SESSION FOR GOOGLE OAUTH - Critical for login tracking
      try {
        // Create or update user session for last active tracking
        const sessionToken = req.sessionID;
        
        // Get user's white label ID for activity logging
        const userWhiteLabel = await storage.getWhiteLabelByUserId(user.id);
        const whiteLabelId = userWhiteLabel?.id || null;
        
        // Create user session for login tracking
        await storage.createUserSession({
          userId: user.id,
          whiteLabelId: whiteLabelId,
          sessionToken: sessionToken,
          isActive: true,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          lastActiveAt: new Date(),
          createdAt: new Date()
        });
        
        if (userWhiteLabel) {
          if (user.role === 'end_user') {
            // Create login activity for end-users
            await storage.createEndUserActivity({
              userId: user.id,
              whiteLabelId: userWhiteLabel.id,
              activityType: 'login',
              description: `${user.firstName || user.username} logged in via Google`,
              metadata: {
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                loginMethod: 'google_oauth'
              }
            });
            console.log(`LOGIN TRACKED - Google OAuth end-user ${user.id} login activity created for white-label ${userWhiteLabel.id}`);
          } else if (user.role === 'white_label_client') {
            // CRITICAL FIX: Create login activity for white-label clients too
            // White-label clients logging into their own dashboard should be tracked as end-user activities for their own domain
            await storage.createEndUserActivity({
              userId: user.id,
              whiteLabelId: userWhiteLabel.id,
              activityType: 'login',
              description: `${user.firstName || user.username} (owner) logged in via Google`,
              metadata: {
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                loginMethod: 'google_oauth',
                ownerLogin: true
              }
            });
            console.log(`LOGIN TRACKED - Google OAuth white-label client ${user.id} login activity created for their own white-label ${userWhiteLabel.id}`);
          }
        } else {
          // Create general activity for other user types (super admin, etc.)
          await storage.createActivity({
            userId: user.id,
            type: 'user_login',
            description: `${user.firstName || user.username} (${user.role}) logged in via Google`,
            metadata: {
              ipAddress: req.ip,
              userAgent: req.get('User-Agent'),
              loginMethod: 'google_oauth'
            }
          });
          console.log(`LOGIN TRACKED - Google OAuth general user ${user.id} login activity created`);
        }
        
        console.log(`USER SESSION CREATED - Google OAuth user ${user.id} session ${sessionToken} recorded`);
      } catch (activityError) {
        console.error('Error creating Google OAuth login activity or session:', activityError);
        // Don't fail login if activity creation fails
      }
      
      // Handle affiliate role redirect
      if (pendingRole === 'affiliate' || user.role === 'affiliate') {
        try {
          // Create affiliate record if it doesn't exist
          const existingAffiliate = await storage.getAffiliateByUserId(user.id);
          if (!existingAffiliate) {
            await storage.createAffiliate({
              userId: user.id,
              affiliateType: 'white_label_affiliate',
              commissionRate: '10.0',
              isActive: true,
              parentId: pendingWhiteLabelId ? parseInt(pendingWhiteLabelId) : null
            });
            console.log(`Created affiliate record for user ${user.id} with whitelabel_id ${pendingWhiteLabelId}`);
          }
          
          // Determine redirect path based on whitelabel_id
          let redirectPath = "/shoot/affiliate"; // Default fallback
          if (pendingWhiteLabelId) {
            try {
              const whiteLabel = await storage.getWhiteLabelById(parseInt(pendingWhiteLabelId));
              if (whiteLabel && whiteLabel.domainPath) {
                redirectPath = `/${whiteLabel.domainPath}/affiliate`;
                console.log(`Redirecting affiliate to white label domain: ${redirectPath}`);
              }
            } catch (error) {
              console.error('Error getting white label for affiliate redirect:', error);
            }
          }
          
          // Clear pending data
          delete (req.session as any).pendingRole;
          delete (req.session as any).pendingWhiteLabelId;
          
          // Redirect to affiliate dashboard with correct domain path
          return res.redirect(redirectPath);
        } catch (error) {
          console.error('Error creating affiliate record:', error);
          // Continue with normal flow if affiliate creation fails
        }
      }
      
      // Handle whitelabel_id redirect if present (and not already handled by affiliate flow)
      if (pendingWhiteLabelId) {
        try {
          const whiteLabel = await storage.getWhiteLabelById(parseInt(pendingWhiteLabelId));
          if (whiteLabel && whiteLabel.domainPath) {
            // Clear the pending whitelabel_id
            delete (req.session as any).pendingWhiteLabelId;
            // Redirect to the white-label domain path
            return res.redirect(`/${whiteLabel.domainPath}/user`);
          }
        } catch (error) {
          console.error('Error processing whitelabel_id redirect:', error);
        }
        // Clear the pending whitelabel_id even if there was an error
        delete (req.session as any).pendingWhiteLabelId;
      }
      
      // Default redirect to home page
      res.redirect("/");
    }
  );

  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      let user = req.user as any;
      
      // Check for impersonation
      if (req.session?.isImpersonating && req.session?.impersonatedUserId) {
        console.log(`Returning impersonated user ${req.session.impersonatedUserId} instead of admin ${user.id}`);
        
        // Get the impersonated user data from storage
        const impersonatedUser = await storage.getUserById(req.session.impersonatedUserId);
        if (impersonatedUser) {
          user = impersonatedUser;
          // Add impersonation info for frontend detection
          user.isImpersonating = true;
          user.originalAdminId = req.session.originalAdminId;
          user.originalAdminRole = req.session.originalAdminRole;
        }
      }
      
      const responseData = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        authProvider: user.authProvider,
        isImpersonating: user.isImpersonating || false,
        originalAdminId: user.originalAdminId,
        originalAdminRole: user.originalAdminRole
      };
      
      console.log('🔍 Auth endpoint response data:', JSON.stringify(responseData, null, 2));
      console.log('📞 Phone field specifically:', user.phone);
      
      res.json(responseData);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  // Forgot Password - Secure password reset with rate limiting and hashed tokens
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      // Validate input with proper Zod schema
      const validationResult = forgotPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid input",
          details: validationResult.error.errors.map(e => e.message)
        });
      }
      
      const { email } = validationResult.data;
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Check rate limiting (per-email and per-IP)
      const rateLimitCheck = PasswordResetStorage.canRequestReset(email, clientIp);
      if (!rateLimitCheck.allowed) {
        console.log(`Password reset rate limited: ${rateLimitCheck.reason} (email: ${email}, ip: ${clientIp})`);
        return res.status(429).json({ 
          error: rateLimitCheck.reason,
          waitTime: rateLimitCheck.emailWaitTime || rateLimitCheck.ipWaitTime
        });
      }
      
      // Record the reset request for rate limiting
      PasswordResetStorage.recordResetRequest(email, clientIp);
      
      // Find user by email (case-insensitive, already normalized by Zod)
      const [user] = await db
        .select()
        .from(users)
        .where(sql`lower(email) = ${email}`)
        .limit(1);
      
      // Always return success to prevent email enumeration
      // Even if user doesn't exist, we return success
      if (!user) {
        console.log(`Password reset requested for non-existent email: ${email}`);
        return res.json({ 
          success: true, 
          message: "If an account with that email exists, we've sent password reset instructions." 
        });
      }
      
      // Generate secure token and hash for database storage
      const { token, hashedToken } = PasswordResetStorage.generateSecureToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration
      
      // Delete any existing reset tokens for this user (cleanup)
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, user.id));
      
      // Insert new reset token (store hash, not plaintext)
      await db
        .insert(passwordResetTokens)
        .values({
          userId: user.id,
          hashedToken,
          expiresAt: expiresAt.toISOString()
        });
      
      // Send password reset email with secure base URL (prevents host header injection)
      const baseUrl = PasswordResetStorage.getSecureBaseUrl();
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;
      const success = await sendPasswordResetEmail(user.email, user.username, resetUrl);
      
      if (!success) {
        console.error(`Failed to send password reset email to ${user.email}`);
        // Still return success to prevent enumeration, but log the error
      } else {
        console.log(`Password reset email sent successfully to ${user.email}`);
      }
      
      res.json({ 
        success: true, 
        message: "If an account with that email exists, we've sent password reset instructions." 
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "An error occurred. Please try again." });
    }
  });

  // Reset Password - Secure password reset with atomic operations and session invalidation
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      // Validate input with proper Zod schema
      const validationResult = resetPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid input",
          details: validationResult.error.errors.map(e => e.message)
        });
      }
      
      const { token, newPassword } = validationResult.data;
      
      // Hash the token for database lookup (tokens are stored as hashes)
      const hashedToken = PasswordResetStorage.hashToken(token);
      
      // Find and verify reset token using hashed token
      const [resetRecord] = await db
        .select({
          userId: passwordResetTokens.userId,
          expiresAt: passwordResetTokens.expiresAt,
          used: passwordResetTokens.used
        })
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.hashedToken, hashedToken))
        .limit(1);
      
      if (!resetRecord) {
        console.log(`Password reset attempted with invalid token: ${token.substring(0, 8)}...`);
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      
      // Check if token is already used
      if (resetRecord.used) {
        console.log(`Password reset attempted with already used token for user: ${resetRecord.userId}`);
        return res.status(400).json({ error: "Reset token has already been used. Please request a new one." });
      }
      
      // Check if token is expired
      if (new Date() > new Date(resetRecord.expiresAt)) {
        console.log(`Password reset attempted with expired token for user: ${resetRecord.userId}`);
        // Clean up expired token
        await db
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.hashedToken, hashedToken));
        return res.status(400).json({ error: "Reset token has expired. Please request a new one." });
      }
      
      // Get user information for session invalidation
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          username: users.username
        })
        .from(users)
        .where(eq(users.id, resetRecord.userId))
        .limit(1);
      
      if (!user) {
        console.log(`Password reset attempted for non-existent user: ${resetRecord.userId}`);
        return res.status(400).json({ error: "Invalid reset token" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user's password
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, resetRecord.userId));
      
      // Mark token as used (instead of deleting for audit trail)
      await db
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.hashedToken, hashedToken));
      
      // INVALIDATE ALL ACTIVE SESSIONS for this user (security best practice)
      try {
        // Clear all user sessions to force re-login with new password
        await storage.invalidateAllUserSessions(resetRecord.userId);
        console.log(`All sessions invalidated for user ${resetRecord.userId} after password reset`);
      } catch (sessionError) {
        console.error(`Error invalidating sessions for user ${resetRecord.userId}:`, sessionError);
        // Don't fail password reset if session invalidation fails
      }
      
      // Clear rate limiting for successful password reset
      PasswordResetStorage.clearEmailRateLimit(user.email);
      
      console.log(`Password reset successful for user ${user.username} (${user.email})`);
      
      res.json({ 
        success: true, 
        message: "Password has been reset successfully. Please log in with your new password." 
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "An error occurred. Please try again." });
    }
  });

  // Logout (POST) - For AJAX requests
  app.post("/api/auth/logout", (req, res) => {
    console.log("POST logout initiated for user:", req.user ? (req.user as any).username : "anonymous");
    
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid');
      
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).json({ error: "Session cleanup failed" });
        }
        
        console.log("User logged out successfully");
        res.json({ success: true, message: "Logout successful" });
      });
    });
  });

  // Logout (GET) - For direct browser navigation (compatibility)
  app.get("/api/logout", (req, res) => {
    console.log("GET logout initiated for user:", req.user ? (req.user as any).username : "anonymous");
    
    // Get returnTo parameter from query string
    const returnTo = req.query.returnTo as string;
    let redirectUrl = "/login"; // default fallback
    
    if (returnTo) {
      try {
        // Decode and validate the returnTo URL
        const decodedReturnTo = decodeURIComponent(returnTo);
        // Ensure it's a valid URL for this origin or a relative path
        if (decodedReturnTo.startsWith('/') || decodedReturnTo.startsWith(req.protocol + '://' + req.get('host'))) {
          redirectUrl = decodedReturnTo;
        }
      } catch (error) {
        console.error("Error processing returnTo parameter:", error);
      }
    }
    
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.redirect("/login?error=logout_failed");
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid');
      
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        
        console.log("User logged out successfully via GET, redirecting to:", redirectUrl);
        res.redirect(redirectUrl);
      });
    });
  });

  // Legacy route for compatibility
  app.get("/api/login", (req, res) => {
    res.redirect("/login");
  });
}