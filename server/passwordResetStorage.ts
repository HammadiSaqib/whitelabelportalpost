// Secure password reset rate limiting and session management
import crypto from "crypto";

// Rate limiting for password reset requests
interface PasswordResetEntry {
  email: string;
  attempts: number;
  lastRequestAt: number;
  ipAddress: string;
}

// Store both email and IP-based rate limiting
const passwordResetAttempts = new Map<string, PasswordResetEntry>();
const ipRequestCounts = new Map<string, { count: number; lastRequest: number }>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const emailCooldown = 5 * 60 * 1000; // 5 minutes for email
  const ipCooldown = 15 * 60 * 1000; // 15 minutes for IP

  // Clean up email-based rate limiting
  for (const [key, entry] of passwordResetAttempts.entries()) {
    if (now - entry.lastRequestAt > emailCooldown) {
      passwordResetAttempts.delete(key);
    }
  }

  // Clean up IP-based rate limiting
  for (const [key, entry] of ipRequestCounts.entries()) {
    if (now - entry.lastRequest > ipCooldown) {
      ipRequestCounts.delete(key);
    }
  }
}, 10 * 60 * 1000);

export class PasswordResetStorage {
  // Generate a secure token and return both plaintext and hash
  static generateSecureToken(): { token: string; hashedToken: string } {
    const token = crypto.randomBytes(32).toString('hex'); // 64 character hex string
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }

  // Hash a token for database lookup
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Check if password reset request is allowed (rate limiting)
  static canRequestReset(email: string, ipAddress: string): { 
    allowed: boolean; 
    reason?: string; 
    waitTime?: number;
    emailWaitTime?: number;
    ipWaitTime?: number;
  } {
    const emailKey = email.toLowerCase();
    const now = Date.now();
    
    // Email-based rate limiting: 3 requests per 5 minutes
    const emailEntry = passwordResetAttempts.get(emailKey);
    const emailCooldown = 5 * 60 * 1000; // 5 minutes
    const maxEmailAttempts = 3;

    if (emailEntry) {
      const timeSinceLastRequest = now - emailEntry.lastRequestAt;
      
      if (timeSinceLastRequest < emailCooldown) {
        if (emailEntry.attempts >= maxEmailAttempts) {
          const emailWaitTime = Math.ceil((emailCooldown - timeSinceLastRequest) / 1000);
          return {
            allowed: false,
            reason: `Too many password reset requests for this email. Please wait ${emailWaitTime} seconds before trying again.`,
            emailWaitTime
          };
        }
      } else {
        // Reset attempts after cooldown period
        emailEntry.attempts = 0;
        emailEntry.lastRequestAt = now;
      }
    }

    // IP-based rate limiting: 10 requests per 15 minutes
    const ipEntry = ipRequestCounts.get(ipAddress);
    const ipCooldown = 15 * 60 * 1000; // 15 minutes
    const maxIpAttempts = 10;

    if (ipEntry) {
      const timeSinceLastIpRequest = now - ipEntry.lastRequest;
      
      if (timeSinceLastIpRequest < ipCooldown) {
        if (ipEntry.count >= maxIpAttempts) {
          const ipWaitTime = Math.ceil((ipCooldown - timeSinceLastIpRequest) / 1000);
          return {
            allowed: false,
            reason: `Too many password reset requests from this IP address. Please wait ${ipWaitTime} seconds before trying again.`,
            ipWaitTime
          };
        }
      } else {
        // Reset count after cooldown period
        ipEntry.count = 0;
        ipEntry.lastRequest = now;
      }
    }

    return { allowed: true };
  }

  // Record a password reset request
  static recordResetRequest(email: string, ipAddress: string): void {
    const emailKey = email.toLowerCase();
    const now = Date.now();

    // Update email-based tracking
    const emailEntry = passwordResetAttempts.get(emailKey);
    if (emailEntry) {
      emailEntry.attempts++;
      emailEntry.lastRequestAt = now;
      emailEntry.ipAddress = ipAddress;
    } else {
      passwordResetAttempts.set(emailKey, {
        email: emailKey,
        attempts: 1,
        lastRequestAt: now,
        ipAddress
      });
    }

    // Update IP-based tracking
    const ipEntry = ipRequestCounts.get(ipAddress);
    if (ipEntry) {
      ipEntry.count++;
      ipEntry.lastRequest = now;
    } else {
      ipRequestCounts.set(ipAddress, {
        count: 1,
        lastRequest: now
      });
    }

    console.log(`Password reset request recorded: email=${emailKey}, ip=${ipAddress}, emailAttempts=${passwordResetAttempts.get(emailKey)?.attempts}, ipCount=${ipRequestCounts.get(ipAddress)?.count}`);
  }

  // Clear rate limiting for an email (useful after successful password reset)
  static clearEmailRateLimit(email: string): void {
    const emailKey = email.toLowerCase();
    passwordResetAttempts.delete(emailKey);
    console.log(`Password reset rate limit cleared for email: ${emailKey}`);
  }

  // Get secure base URL for password reset links (prevents host header injection)
  static getSecureBaseUrl(): string {
    // Use environment variable for production, fallback for development with Replit domain
    let baseUrl = process.env.BASE_URL || process.env.VITE_APP_URL;
    
    // Production domain fallback
    if (!baseUrl) {
      baseUrl = 'http://whitelabelportal.com';
    }
    
    // Ensure the URL doesn't end with a slash
    return baseUrl.replace(/\/+$/, '');
  }
}