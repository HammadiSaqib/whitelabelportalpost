import nodemailer from 'nodemailer';
import { LoginMetadata, formatDeviceInfo, formatLocationInfo } from './deviceDetection';
import { db } from './db';
import { whiteLabels } from '../shared/schema';
import { eq } from 'drizzle-orm';

// HTML escape function to prevent HTML injection attacks
export function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe == null) {
    return '';
  }
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("EMAIL_USER or EMAIL_PASS environment variables not set - email functionality disabled");
}

// Default Gmail transporter with SSL configuration (Super Admin)
const defaultTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || 'teamwhitelabelportal@gmail.com',
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Enable debug output
  logger: true, // Enable logging
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Create transporter for white-label client
async function createWhiteLabelTransporter(whiteLabelId: number) {
  try {
    const whiteLabelData = await db.select().from(whiteLabels).where(eq(whiteLabels.id, whiteLabelId)).limit(1);
    
    if (whiteLabelData.length === 0) {
      console.log(`White label ${whiteLabelId} not found, using default transporter`);
      return defaultTransporter;
    }

    const emailSettings = whiteLabelData[0].emailSettings;
    
    // If no custom SMTP settings or useCustomSmtp is false, use super admin settings
    if (!emailSettings || !emailSettings.useCustomSmtp) {
      console.log(`Using super admin email settings for white label ${whiteLabelId}`);
      return defaultTransporter;
    }

    // Create custom transporter for white-label client
    console.log(`Creating custom email transporter for white label ${whiteLabelId}`);
    return nodemailer.createTransport({
      host: emailSettings.smtpHost || 'smtp.gmail.com',
      port: emailSettings.smtpPort || 465,
      secure: emailSettings.smtpSecure !== false, // default to true
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass
      },
      debug: true,
      logger: true,
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error(`Error creating white label transporter for ${whiteLabelId}:`, error);
    return defaultTransporter;
  }
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  whiteLabelId?: number; // Optional white label ID for custom email settings
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Cannot send email: EMAIL_USER or EMAIL_PASS not configured');
    return false;
  }

  try {
    // Get appropriate transporter based on white label settings
    const transporter = params.whiteLabelId 
      ? await createWhiteLabelTransporter(params.whiteLabelId)
      : defaultTransporter;

    // Get white label email settings for from address
    let fromEmail = params.from;
    let fromName = "WhiteLabel Portal";
    
    if (params.whiteLabelId) {
      try {
        const whiteLabelData = await db.select().from(whiteLabels).where(eq(whiteLabels.id, params.whiteLabelId)).limit(1);
        if (whiteLabelData.length > 0) {
          const emailSettings = whiteLabelData[0].emailSettings;
          if (emailSettings && emailSettings.useCustomSmtp) {
            fromEmail = emailSettings.fromEmail || params.from;
            fromName = emailSettings.fromName || whiteLabelData[0].businessName || "WhiteLabel Portal";
          } else {
            // Use super admin settings but with white label business name
            fromEmail = process.env.EMAIL_USER || 'teamwhitelabelportal@gmail.com';
            fromName = whiteLabelData[0].businessName || "WhiteLabel Portal";
          }
        }
      } catch (error) {
        console.error('Error getting white label email settings:', error);
      }
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments: [
        {
          filename: 'whitelabel-portal-logo.png',
          path: 'client/public/whitelabel-portal-logo.png',
          cid: 'logo' // Referenced as cid:logo in HTML
        }
      ]
    });
    console.log(`Email sent successfully to ${params.to} - Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const subject = "🔐 Email Verification - WhiteLabel Portal";
  const text = `Your verification code is: ${code}. This code expires in 15 minutes.`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Email Verification
                </h1>
                <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                    Secure your business platform access
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                        Welcome to WhiteLabel Portal! 🎉
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        Thank you for joining our business platform. To complete your registration, 
                        please verify your email address using the code below.
                    </p>
                </div>
                
                <!-- Verification Code Box -->
                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                        Your Verification Code
                    </p>
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin: 15px 0;">
                        <span style="font-size: 32px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${escapeHtml(code)}
                        </span>
                    </div>
                    <p style="color: #ef4444; margin: 15px 0 0 0; font-size: 14px; font-weight: 500;">
                        ⏰ Expires in 15 minutes
                    </p>
                </div>
                
                <!-- Instructions -->
                <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 6px; margin: 30px 0;">
                    <h3 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        📋 Next Steps:
                    </h3>
                    <ol style="color: #075985; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li>Enter the verification code above in the registration form</li>
                        <li>Complete your business profile setup</li>
                        <li>Start building your white-label business platform</li>
                    </ol>
                </div>
                
                <!-- Security Notice -->
                <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
                    <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.5;">
                        🔒 <strong>Security Notice:</strong> If you didn't request this verification, 
                        please ignore this email. This code will expire automatically.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Business Platform Creation
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Empowering businesses with scalable white-label solutions
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        © 2025 WhiteLabel Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html,
    whiteLabelId: undefined
  });
}

// Send purchase confirmation email to the purchaser
export async function sendPurchaseConfirmationEmail(
  email: string, 
  userName: string, 
  planName: string, 
  planCost: string, 
  purchaseDate: Date
): Promise<boolean> {
  const subject = `✅ You Have Successfully Purchased $${planCost} ${planName}`;
  const safeUserName = escapeHtml(userName);
  const safePlanName = escapeHtml(planName);
  const safePlanCost = escapeHtml(planCost);
  
  const purchaseTime = purchaseDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const text = `Purchase Confirmation: You have successfully purchased ${planName} for $${planCost} on ${purchaseTime}. Thank you for your business!`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Purchase Confirmed! ✅
                </h1>
                <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">
                    Thank you for your purchase
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                        Hello ${safeUserName}! 🎉
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        Your purchase has been successfully processed! Below are your purchase details.
                    </p>
                </div>
                
                <!-- Purchase Details Box -->
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 30px; margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="display: inline-block; background: #10b981; color: white; padding: 12px 20px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                            💳 Purchase Details
                        </div>
                    </div>
                    
                    <div style="background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Plan Name</strong>
                            <div style="color: #1f2937; font-size: 18px; font-weight: 700; margin-top: 5px;">${safePlanName}</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">💰 Amount Paid</strong>
                            <div style="color: #10b981; font-size: 24px; font-weight: 700; margin-top: 5px;">$${safePlanCost}</div>
                        </div>
                        
                        <div style="margin-bottom: 0;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📅 Purchase Date</strong>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600; margin-top: 5px;">${purchaseTime}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Support Info -->
                <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        💬 Need Help?
                    </h4>
                    <p style="color: #075985; margin: 0; font-size: 14px; line-height: 1.5;">
                        If you have any questions about your purchase or need assistance getting started, 
                        our support team is ready to help. We're committed to your success!
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Purchase Confirmation
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Thank you for choosing our platform
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        © 2025 WhiteLabel Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html,
    whiteLabelId
  });
}

// Send user invitation email (for end users)
export async function sendUserInvitation(
  email: string,
  firstName: string,
  lastName: string,
  inviterName: string,
  inviterWhiteLabelId?: number
): Promise<boolean> {
  console.log('DEBUG - sendUserInvitation called with:', {
    email,
    firstName,
    lastName,
    inviterName,
    inviterWhiteLabelId,
    inviterWhiteLabelIdType: typeof inviterWhiteLabelId
  });

  const subject = `🎉 You're Invited to Join ${inviterName}'s Platform!`;
  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeInviterName = escapeHtml(inviterName);
  
  // Create the invitation URL with the inviter's white label ID
  const invitationUrl = inviterWhiteLabelId 
    ? `https://whitelabelportal.com/login?whitelabel_id=${inviterWhiteLabelId}`
    : `https://whitelabelportal.com/login`;
  
  console.log('DEBUG - Generated invitation URL:', invitationUrl);
  
  const text = `Hello ${firstName} ${lastName}, You have been invited by ${inviterName} to join their platform. Get started now and discover all the amazing features waiting for you!`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're Invited!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="Platform" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    You're Invited! 🎉
                </h1>
                <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">
                    Join ${safeInviterName}'s platform
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Hello ${safeFirstName} ${safeLastName}!
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        <strong>${safeInviterName}</strong> has invited you to join their platform. Get started now and discover all the amazing features waiting for you!
                    </p>
                </div>
                
                <!-- Call to Action -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                        Get Started Now →
                    </a>
                </div>
                
                <!-- Features -->
                <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; margin: 30px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">
                        What's waiting for you:
                    </h3>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; flex-shrink: 0;"></div>
                            <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">
                                Instant access to premium features
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; flex-shrink: 0;"></div>
                            <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">
                                Personalized user experience
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; flex-shrink: 0;"></div>
                            <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">
                                Direct support from ${safeInviterName}
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; flex-shrink: 0;"></div>
                            <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">
                                Easy setup - no technical knowledge required
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Getting Started Section -->
                <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
                    <h4 style="color: #059669; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        🚀 Ready to Get Started?
                    </h4>
                    <p style="color: #059669; margin: 0; font-size: 14px; line-height: 1.5;">
                        Click the "Get Started Now" button above to create your account and begin your journey with ${safeInviterName}'s platform!
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="Platform" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    Personal Invitation from ${safeInviterName}
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Join thousands of users already enjoying the platform
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        This invitation was sent by ${safeInviterName}. If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html
  });
}

// Send purchase notification email to the plan owner
export async function sendPlanOwnerNotificationEmail(
  email: string, 
  ownerName: string, 
  purchaserName: string,
  planName: string, 
  planCost: string, 
  purchaseDate: Date
): Promise<boolean> {
  const subject = `💰 Your Plan "$${planCost} ${planName}" Successfully Got Purchased`;
  const safeOwnerName = escapeHtml(ownerName);
  const safePurchaserName = escapeHtml(purchaserName);
  const safePlanName = escapeHtml(planName);
  const safePlanCost = escapeHtml(planCost);
  
  const purchaseTime = purchaseDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const text = `Great news! Your plan "${planName}" ($${planCost}) was just purchased by ${purchaserName} on ${purchaseTime}. Congratulations on your sale!`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plan Sale Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Congratulations! 💰
                </h1>
                <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">
                    You just made a sale!
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                        Hello ${safeOwnerName}! 🎉
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        Great news! One of your plans has just been purchased. Here are the details of your sale.
                    </p>
                </div>
                
                <!-- Sale Details Box -->
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 30px; margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="display: inline-block; background: #f59e0b; color: white; padding: 12px 20px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                            📊 Sale Details
                        </div>
                    </div>
                    
                    <div style="background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Plan Sold</strong>
                            <div style="color: #1f2937; font-size: 18px; font-weight: 700; margin-top: 5px;">${safePlanName}</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">💰 Sale Amount</strong>
                            <div style="color: #f59e0b; font-size: 24px; font-weight: 700; margin-top: 5px;">$${safePlanCost}</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Purchased By</strong>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600; margin-top: 5px;">${safePurchaserName}</div>
                        </div>
                        
                        <div style="margin-bottom: 0;">
                            <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📅 Sale Date</strong>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600; margin-top: 5px;">${purchaseTime}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Success Tips -->
                <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        🚀 Keep the Momentum Going!
                    </h4>
                    <p style="color: #075985; margin: 0; font-size: 14px; line-height: 1.5;">
                        Congratulations on this sale! Consider creating more valuable plans, optimizing your marketing, 
                        and engaging with your customers to drive even more growth for your business.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Sales Notification
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Helping you track your business success
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        © 2025 WhiteLabel Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html
  });
}

// Send welcome email for new signups
export async function sendWelcomeEmail(email: string, userName: string, userRole: string, whiteLabelId?: number): Promise<boolean> {
  const subject = "🎉 Welcome to WhiteLabel Portal - Your Business Platform Awaits!";
  const safeUserName = escapeHtml(userName);
  const safeUserRole = escapeHtml(userRole);
  
  const text = `Welcome to WhiteLabel Portal! Thank you for joining our business platform, ${userName}. We're excited to help you build and grow your business with our comprehensive white-label solutions.`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WhiteLabel Portal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Welcome Aboard! 🎉
                </h1>
                <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">
                    Your business platform journey starts here
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Hello ${safeUserName}!
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        Thank you for joining WhiteLabel Portal as a <strong>${safeUserRole}</strong>. We're thrilled to have you as part of our business community!
                    </p>
                </div>
                
                <!-- Key Benefits -->
                <div style="background: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">
                        🚀 What You Can Do Now
                    </h3>
                    <div style="space-y: 15px;">
                        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                            <div style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px; font-weight: bold; flex-shrink: 0;">✓</div>
                            <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.5;">
                                <strong>Access Your Dashboard:</strong> Explore your personalized business control center
                            </p>
                        </div>
                        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                            <div style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px; font-weight: bold; flex-shrink: 0;">✓</div>
                            <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.5;">
                                <strong>Build Your Presence:</strong> Create custom landing pages and manage your business
                            </p>
                        </div>
                        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                            <div style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px; font-weight: bold; flex-shrink: 0;">✓</div>
                            <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.5;">
                                <strong>Grow Your Network:</strong> Connect with affiliates and expand your reach
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Call to Action -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://whitelabelportal.com/" 
                       style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                        Get Started Now →
                    </a>
                </div>
                
                <!-- Support Info -->
                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0;">
                    <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        💡 Need Help Getting Started?
                    </h4>
                    <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">
                        Our support team is here to help! Feel free to reach out if you have any questions or need assistance setting up your account.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Welcome Message
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Building the future of business together
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        © 2025 WhiteLabel Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html
  });
}

// Send login notification email for security alerts
export async function sendLoginNotification(
  email: string, 
  userName: string, 
  loginMetadata: {
    deviceInfo: string;
    location: string;
    ipAddress: string;
    timestamp: string;
  }
): Promise<boolean> {
  const subject = "🔒 Security Alert: New Login Detected - WhiteLabel Portal";
  const safeUserName = escapeHtml(userName);
  const safeDeviceInfo = escapeHtml(loginMetadata.deviceInfo);
  const safeLocation = escapeHtml(loginMetadata.location);
  const safeIpAddress = escapeHtml(loginMetadata.ipAddress);
  const safeTimestamp = escapeHtml(loginMetadata.timestamp);
  
  const text = `Security Alert: A new login was detected on your WhiteLabel Portal account. Device: ${loginMetadata.deviceInfo}, Location: ${loginMetadata.location}, Time: ${loginMetadata.timestamp}. If this wasn't you, please secure your account immediately.`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Security Alert - WhiteLabel Portal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    🔒 Security Alert
                </h1>
                <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">
                    New login detected on your account
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">
                        Hello ${safeUserName}
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        We detected a new login to your WhiteLabel Portal account. If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.
                    </p>
                </div>
                
                <!-- Login Details -->
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                    <h3 style="color: #dc2626; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                        📱 Login Details
                    </h3>
                    <div style="space-y: 12px;">
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #374151; font-size: 14px;">Time:</strong>
                            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${safeTimestamp}</span>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #374151; font-size: 14px;">Device:</strong>
                            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${safeDeviceInfo}</span>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #374151; font-size: 14px;">Location:</strong>
                            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${safeLocation}</span>
                        </div>
                        <div style="margin-bottom: 0;">
                            <strong style="color: #374151; font-size: 14px;">IP Address:</strong>
                            <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">${safeIpAddress}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Security Actions -->
                <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                    <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                        🛡️ Wasn't you? Secure your account now
                    </h4>
                    <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Change your password immediately</li>
                        <li style="margin-bottom: 8px;">Review your account activity</li>
                        <li style="margin-bottom: 0;">Contact our support team if needed</li>
                    </ul>
                </div>
                
                <!-- Call to Action -->
                <div style="text-align: center;">
                    <a href="https://whitelabelportal.com/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                        Review Account Activity →
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Security Notification
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Keeping your account secure is our priority
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        © 2025 WhiteLabel Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html
  });
}


// Send white-label invitation email
export async function sendWhiteLabelInvitation(
  email: string,
  firstName: string,
  lastName: string,
  businessName: string,
  inviterName: string,
  whiteLabelId?: number
): Promise<boolean> {
  const subject = `🚀 You're Invited to Join WhiteLabel Portal - ${businessName}`;
  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeBusinessName = escapeHtml(businessName);
  const safeInviterName = escapeHtml(inviterName);
  
  const text = `Hello ${firstName} ${lastName}, You have been invited by ${inviterName} to join WhiteLabel Portal as a white-label partner for ${businessName}. Start building your business platform today with our comprehensive white-label solutions.`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WhiteLabel Portal Invitation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    You're Invited! 🚀
                </h1>
                <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">
                    Join the future of business platforms
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Hello ${safeFirstName} ${safeLastName}!
                    </h2>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.6;">
                        <strong>${safeInviterName}</strong> has invited you to join <strong>WhiteLabel Portal</strong> as a white-label partner for <strong>${safeBusinessName}</strong>.
                    </p>
                </div>
                
                <!-- Call to Action -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://whitelabelportal.com/white-label" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 18px 36px; border-radius: 8px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                        Get Started Now →
                    </a>
                    <p style="color: #6b7280; margin: 15px 0 0 0; font-size: 14px;">
                        Click above to begin your white-label journey
                    </p>
                </div>
                
                <!-- Features Highlight -->
                <div style="background: #f9fafb; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">
                        🔥 What You Get Access To
                    </h3>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #10b981; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">🏢</div>
                            <p style="color: #374151; margin: 0; font-size: 15px;">
                                <strong>Custom Business Platform:</strong> Fully branded with your business identity
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #10b981; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">📊</div>
                            <p style="color: #374151; margin: 0; font-size: 15px;">
                                <strong>Analytics Dashboard:</strong> Track performance, users, and revenue in real-time
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #10b981; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">💳</div>
                            <p style="color: #374151; margin: 0; font-size: 15px;">
                                <strong>Payment Processing:</strong> Secure transactions and subscription management
                            </p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: #10b981; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">🌐</div>
                            <p style="color: #374151; margin: 0; font-size: 15px;">
                                <strong>Landing Page Builder:</strong> Drag-and-drop builder with professional templates
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Support Info -->
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 8px 8px 0;">
                    <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        💬 Questions? We're Here to Help!
                    </h4>
                    <p style="color: #166534; margin: 0; font-size: 14px; line-height: 1.5;">
                        Our team is ready to support your success. Reply to this email or contact us anytime for assistance with getting started.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Business Platform Invitation
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Invited by ${safeInviterName} • Building the future of business together
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                    <p style="color: #6b7280; margin: 0; font-size: 11px;">
                        © 2025 WhiteLabel Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    from: 'info@whitelabelportal.com',
    subject,
    text,
    html
  });
}
