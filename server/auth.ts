import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express, RequestHandler } from "express";
import { db } from "./db";
import { users, whiteLabels, landingPages } from "@shared/schema";
import { eq, and, like } from "drizzle-orm";
import { generateId } from "lucia";
import { storage } from "./storage";
import { sendWelcomeEmail } from "./emailService";
import memorystore from "memorystore";

// Session configuration using in-memory store (works reliably on Replit)
const MemoryStore = memorystore(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use in-memory session store for reliability
  const sessionStore = new MemoryStore({
    checkPeriod: 86400000 // Prune expired entries every 24h
  });
  
  console.log('✅ In-memory session store initialized');
  // In production, cookies marked secure require HTTPS. When running locally
  // with `npm start` over HTTP, using `secure: true` prevents the browser from
  // setting the session cookie which makes login appear to "not persist".
  // To support local production testing, allow opting into secure cookies via env.
  const isProd = process.env.NODE_ENV === "production";
  const useSecureCookies = isProd && process.env.SESSION_COOKIE_SECURE === 'true';
  const sameSite: "lax" | "none" = useSecureCookies ? "none" : "lax";

  return session({
    secret: process.env.SESSION_SECRET || "your-secret-key-here",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite,
      maxAge: sessionTtl,
    },
  });
}

// User authentication helpers
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function findUserByUsername(username: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
}

export async function findUserByGoogleId(googleId: string) {
  const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
  return user;
}

export async function findUserByEmailOrUsername(emailOrUsername: string) {
  try {
    const input = emailOrUsername.trim();
    
    // First try to find by email (case-insensitive)
    if (input.includes('@')) {
      const [userByEmail] = await db.select().from(users).where(eq(users.email, input.toLowerCase()));
      if (userByEmail) return userByEmail;
    }
    
    // Then try to find by username (case-insensitive)
    const [userByUsername] = await db.select().from(users).where(eq(users.username, input.toLowerCase()));
    return userByUsername;
  } catch (error) {
    console.error("Error finding user by email or username:", error);
    return null;
  }
}

// Helper function to create white-label record for end_user roles
async function createEndUserWhiteLabelRecord(userId: string, userData: {
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
}) {
  try {
    console.log(`Creating white-label record for end_user: ${userData.username}`);
    
    // Generate business name from user data
    const businessName = `${userData.firstName} ${userData.lastName}`.trim() || userData.username;
    const cleanBusinessName = businessName.charAt(0).toUpperCase() + businessName.slice(1) + ' Business';
    
    // Generate domain path from username, ensuring it's unique
    let baseDomainPath = userData.username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
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
    
    // Create white-label record using storage method (includes automatic default landing page)
    const whiteLabelRecord = await storage.createWhiteLabel({
      userId: userId,
      businessName: cleanBusinessName,
      domainPath: domainPath,
      isActive: true,
    });
    
    // AUTOMATICALLY CREATE DOMAIN SESSION FOR THE NEW END_USER
    // This ensures they can immediately access domain management features
    try {
      // Generate a unique session ID for the domain session
      const domainSessionId = generateId(32);
      
      await storage.createDomainUserSession(userId, domainPath, domainSessionId);
      
      console.log(`Created domain session for ${userData.username}: domain "${domainPath}", session ID ${domainSessionId}`);
    } catch (error) {
      console.error('Error creating domain session for end_user:', error);
      // Don't fail white-label creation if domain session creation fails
    }
    
    console.log(`Created white-label record for ${userData.username}: domain "${domainPath}", ID ${whiteLabelRecord.id}`);
    return whiteLabelRecord;
  } catch (error) {
    console.error('Error creating white-label record for end_user:', error);
    // Don't fail user creation if white-label creation fails
    return null;
  }
}

export async function createUser(userData: {
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
  email?: string;
  role: string;
  googleId?: string;
  authProvider: "local" | "google";
  profileImageUrl?: string;
  whiteLabelId?: number | null;
  affiliateOfWhiteLabelId?: number | null;
}) {
  const userId = generateId(15);
  
  try {
    // Prepare user data with generated ID
    const userDataWithId: any = {
      id: userId,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      email: userData.email,
      role: userData.role as any,
      googleId: userData.googleId,
      authProvider: userData.authProvider,
      profileImageUrl: userData.profileImageUrl,
      whiteLabelId: userData.whiteLabelId,
    };

    // Add affiliateOfWhiteLabelId if provided
    if (userData.affiliateOfWhiteLabelId !== undefined) {
      userDataWithId.affiliateOfWhiteLabelId = userData.affiliateOfWhiteLabelId;
    }

    // Auto-generate referral code for Super Admin Affiliates
    if (userData.role === 'super_admin_affiliate') {
      const baseName = userData.firstName || userData.email?.split('@')[0] || userData.username || 'affiliate';
      userDataWithId.referralCode = await storage.generateUniqueReferralCode(baseName);
      console.log(`Generated referral code for Super Admin Affiliate: ${userDataWithId.referralCode}`);
    }

    await db
      .insert(users)
      .values(userDataWithId);
    
    // Fetch the created user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    // AUTOMATIC WHITE-LABEL RECORD CREATION FOR END_USERS
    // Create white-label record automatically for all end_user roles
    if (userData.role === 'end_user') {
      await createEndUserWhiteLabelRecord(userId, userData);
    }
    
    // SEND WELCOME EMAIL TO NEW USER
    // Send welcome email after successful user creation
    if (userData.email) {
      try {
        const userName = userData.firstName || userData.username || 'New User';
        await sendWelcomeEmail(userData.email, userName, userData.role);
        console.log(`Welcome email sent to ${userData.email} for user ${userName}`);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail user creation if email fails
      }
    }
    
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  console.log("Auth check - isAuthenticated:", req.isAuthenticated(), "user:", (req.user as any)?.id, "sessionID:", req.sessionID);
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

// Setup authentication
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy (username/password/email)
  passport.use(new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        console.log(`🔐 Login attempt - Username/Email: ${username}`);
        
        // Find user by email or username
        const user = await findUserByEmailOrUsername(username);
        
        if (!user) {
          console.log(`❌ Login failed - User not found for: ${username}`);
          return done(null, false, { message: "Invalid credentials" });
        }

        console.log(`✅ User found - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);

        if (!user.password) {
          console.log(`❌ Login failed - User has no password: ${user.id}`);
          return done(null, false, { message: "Invalid credentials" });
        }

        console.log(`🔑 Checking password for user: ${user.id}`);
        const isValidPassword = await verifyPassword(password, user.password);
        
        if (!isValidPassword) {
          console.log(`❌ Login failed - Invalid password for user: ${user.id}`);
          return done(null, false, { message: "Invalid credentials" });
        }

        console.log(`✅ Login successful - User: ${user.id} (${user.email})`);
        return done(null, user);
      } catch (error) {
        console.error(`❌ Login error:`, error);
        return done(error);
      }
    }
  ));

  // Google OAuth strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/api/auth/google/callback`
        : "http://localhost:5000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth callback - Profile:", profile.id, profile.emails?.[0]?.value);
        
        // Check if user already exists with this Google ID
        let user = await findUserByGoogleId(profile.id);
        
        if (user) {
          console.log("Existing Google user found:", user.username);
          
          // Send login notification for existing Google users
          setImmediate(async () => {
            try {
              const { sendLoginNotification } = await import('./emailService');
              const userName = user.firstName || user.username || 'User';
              
              // Create simplified metadata for Google OAuth login
              const emailMetadata = {
                deviceInfo: 'Google OAuth Login',
                location: 'Location not available (OAuth)',
                ipAddress: 'IP not available (OAuth)',
                timestamp: new Date().toLocaleString()
              };
              
              if (user.email) {
                const emailSent = await sendLoginNotification(user.email, userName, emailMetadata);
                
                if (emailSent) {
                  console.log(`GOOGLE LOGIN NOTIFICATION SENT - Email sent to ${user.email} for user ${user.id}`);
                } else {
                  console.warn(`GOOGLE LOGIN NOTIFICATION FAILED - Could not send email to ${user.email}`);
                }
              }
            } catch (notificationError) {
              console.error('Error sending Google login notification:', notificationError);
            }
          });
          
          return done(null, user);
        }

        // Check if user exists with same email but different auth provider
        if (profile.emails && profile.emails[0]) {
          const [existingUser] = await db.select().from(users).where(eq(users.email, profile.emails[0].value));
          if (existingUser && existingUser.authProvider === "local") {
            return done(null, false, { 
              message: `Account with email ${profile.emails[0].value} already exists. Please sign in with username and password.` 
            });
          }
        }

        // Generate username from email
        const email = profile.emails?.[0]?.value || "";
        const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
        let username = baseUsername;
        let counter = 1;

        // Ensure username is unique
        while (await findUserByUsername(username)) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        // Create new user with default role (will be updated later if needed)
        console.log("Creating new Google user with username:", username);
        const newUser = await createUser({
          username,
          firstName: profile.name?.givenName || "User",
          lastName: profile.name?.familyName || "",
          email: profile.emails?.[0]?.value,
          role: "white_label_client", // Default role, will be updated based on context
          googleId: profile.id,
          authProvider: "google",
          profileImageUrl: profile.photos?.[0]?.value,
        });

        // Send login notification for new Google users  
        setImmediate(async () => {
          try {
            const { sendLoginNotification } = await import('./emailService');
            const userName = newUser.firstName || newUser.username || 'User';
            
            // Create simplified metadata for Google OAuth login
            const emailMetadata = {
              deviceInfo: 'Google OAuth Login (New Account)',
              location: 'Location not available (OAuth)',
              ipAddress: 'IP not available (OAuth)',
              timestamp: new Date().toLocaleString()
            };
            
            if (newUser.email) {
              const emailSent = await sendLoginNotification(newUser.email, userName, emailMetadata);
              
              if (emailSent) {
                console.log(`GOOGLE NEW USER LOGIN NOTIFICATION SENT - Email sent to ${newUser.email} for user ${newUser.id}`);
              } else {
                console.warn(`GOOGLE NEW USER LOGIN NOTIFICATION FAILED - Could not send email to ${newUser.email}`);
              }
            }
          } catch (notificationError) {
            console.error('Error sending Google new user login notification:', notificationError);
          }
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }));
  }

  // Passport session serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
