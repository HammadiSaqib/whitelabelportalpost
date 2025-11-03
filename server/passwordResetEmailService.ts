import { sendEmail, escapeHtml } from "./emailService";

// Send password reset email
export async function sendPasswordResetEmail(email: string, username: string, resetUrl: string): Promise<boolean> {
  const safeEmail = escapeHtml(email);
  const safeUsername = escapeHtml(username);
  const safeResetUrl = escapeHtml(resetUrl);
  
  const subject = "🔐 Password Reset Request - WhiteLabel Portal";
  
  const text = `
Password Reset Request

Hello ${username},

You requested a password reset for your WhiteLabel Portal account (${email}).

To reset your password, click the link below or copy it into your browser:
${resetUrl}

This link will expire in 1 hour for security purposes.

If you didn't request this password reset, please ignore this email. Your account remains secure.

Questions? Reply to this email or contact our support team.

Best regards,
WhiteLabel Portal Team
  `.trim();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 150px; height: auto; margin-bottom: 20px;" />
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    🔐 Password Reset Request
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                    Secure your account with a new password
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <!-- Greeting -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                        Hello ${safeUsername}! 👋
                    </h2>
                    <p style="color: #6b7280; margin: 0; font-size: 16px;">
                        We received a password reset request for your account <strong>${safeEmail}</strong>
                    </p>
                </div>
                
                <!-- Reset Button -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${safeResetUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                              color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; 
                              font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;
                              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                        🔓 Reset My Password
                    </a>
                </div>
                
                <!-- Alternative Link -->
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <p style="color: #4b5563; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                        Can't click the button? Copy and paste this link:
                    </p>
                    <div style="background: white; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; word-break: break-all;">
                        <a href="${safeResetUrl}" style="color: #2563eb; text-decoration: none; font-size: 14px; font-family: monospace;">
                            ${safeResetUrl}
                        </a>
                    </div>
                </div>
                
                <!-- Security Notice -->
                <div style="background: #fef3cd; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                    <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        🛡️ Security Notice
                    </h4>
                    <ul style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                        <li>This reset link expires in <strong>1 hour</strong> for security</li>
                        <li>If you didn't request this, you can safely ignore this email</li>
                        <li>Your current password remains unchanged until you complete the reset</li>
                    </ul>
                </div>
                
                <!-- Support Info -->
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 8px 8px 0;">
                    <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        💬 Need Help?
                    </h4>
                    <p style="color: #166534; margin: 0; font-size: 14px; line-height: 1.5;">
                        If you're having trouble or didn't request this reset, please contact our support team by replying to this email.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="cid:logo" alt="WhiteLabel Portal" style="max-width: 120px; height: auto; opacity: 0.8;" />
                </div>
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    WhiteLabel Portal - Password Reset Request
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    Secure account management for ${safeUsername}
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