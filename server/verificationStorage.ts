// In-memory storage for verification codes
interface VerificationEntry {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
  sentAt: number; // When the code was last sent
}

const verificationCodes = new Map<string, VerificationEntry>();

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of verificationCodes.entries()) {
    if (entry.expiresAt < now) {
      verificationCodes.delete(key);
    }
  }
}, 5 * 60 * 1000);

export class VerificationStorage {
  // Store verification code for an email (15-minute expiration)
  static store(email: string, code: string): string {
    const key = email.toLowerCase();
    const now = Date.now();
    const expiresAt = now + (15 * 60 * 1000); // 15 minutes
    
    verificationCodes.set(key, {
      code,
      email: key,
      expiresAt,
      attempts: 0,
      sentAt: now
    });
    
    console.log(`Verification code stored for ${key}, expires at ${new Date(expiresAt)}`);
    return key;
  }

  // Verify code for an email
  static verify(email: string, inputCode: string): { valid: boolean; message: string; attempts: number } {
    const key = email.toLowerCase();
    console.log(`🔍 VERIFY DEBUG - Looking for verification entry for: ${key}`);
    const entry = verificationCodes.get(key);
    
    if (!entry) {
      console.log(`❌ VERIFY DEBUG - No entry found for: ${key}`);
      console.log(`📋 VERIFY DEBUG - Available keys:`, Array.from(verificationCodes.keys()));
      return { valid: false, message: "No verification code found. Please request a new one.", attempts: 0 };
    }
    
    console.log(`✅ VERIFY DEBUG - Found entry for: ${key}`);
    console.log(`📝 VERIFY DEBUG - Stored code: "${entry.code}" (type: ${typeof entry.code})`);
    console.log(`📝 VERIFY DEBUG - Input code: "${inputCode}" (type: ${typeof inputCode})`);
    console.log(`⏰ VERIFY DEBUG - Expires at: ${new Date(entry.expiresAt)}`);
    console.log(`⏰ VERIFY DEBUG - Current time: ${new Date()}`);
    console.log(`🔢 VERIFY DEBUG - Current attempts: ${entry.attempts}`);
    
    // Check if expired
    if (entry.expiresAt < Date.now()) {
      console.log(`⏰ VERIFY DEBUG - Code has expired`);
      verificationCodes.delete(key);
      return { valid: false, message: "Verification code has expired. Please request a new one.", attempts: entry.attempts };
    }
    
    // Increment attempts
    entry.attempts++;
    console.log(`🔢 VERIFY DEBUG - Incremented attempts to: ${entry.attempts}`);
    
    // Check if too many attempts
    if (entry.attempts > 5) {
      console.log(`❌ VERIFY DEBUG - Too many attempts (${entry.attempts})`);
      verificationCodes.delete(key);
      return { valid: false, message: "Too many incorrect attempts. Please request a new verification code.", attempts: entry.attempts };
    }
    
    // Check code
    const codesMatch = entry.code === inputCode;
    console.log(`🔍 VERIFY DEBUG - Codes match (===): ${codesMatch}`);
    console.log(`🔍 VERIFY DEBUG - Loose comparison (==): ${entry.code == inputCode}`);
    
    if (codesMatch) {
      console.log(`✅ VERIFY DEBUG - Verification successful! Removing entry.`);
      verificationCodes.delete(key); // Remove after successful verification
      return { valid: true, message: "Email verified successfully!", attempts: entry.attempts };
    } else {
      console.log(`❌ VERIFY DEBUG - Verification failed. ${5 - entry.attempts} attempts remaining.`);
      return { valid: false, message: `Incorrect verification code. ${5 - entry.attempts} attempts remaining.`, attempts: entry.attempts };
    }
  }
  
  // Check if email has a pending verification
  static hasPendingVerification(email: string): boolean {
    const key = email.toLowerCase();
    const entry = verificationCodes.get(key);
    return entry !== undefined && entry.expiresAt > Date.now();
  }
  
  // Check if resend is allowed (90-second cooldown)
  static canResend(email: string): { canResend: boolean; waitTime?: number } {
    const key = email.toLowerCase();
    const entry = verificationCodes.get(key);
    
    if (!entry || entry.expiresAt <= Date.now()) {
      return { canResend: true };
    }
    
    const now = Date.now();
    const resendCooldown = 90 * 1000; // 90 seconds
    const timeSinceLastSent = now - entry.sentAt;
    
    if (timeSinceLastSent >= resendCooldown) {
      return { canResend: true };
    }
    
    const waitTime = Math.ceil((resendCooldown - timeSinceLastSent) / 1000);
    return { canResend: false, waitTime };
  }
  
  // Remove verification code (cleanup)
  static remove(email: string): void {
    const key = email.toLowerCase();
    verificationCodes.delete(key);
  }
}