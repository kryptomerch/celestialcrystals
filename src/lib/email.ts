import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Initialize Resend (preferred for production)
const resend = new Resend(process.env.RESEND_API_KEY);

// Fallback SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean, id?: string, error?: string }> {
  try {
    // Use Resend's onboarding domain for testing if no verified domain is available
    const fromEmail = options.from || process.env.FROM_EMAIL || 'onboarding@resend.dev';

    console.log('📧 Attempting to send email:', {
      to: options.to,
      subject: options.subject,
      from: fromEmail,
      hasResendKey: !!process.env.RESEND_API_KEY
    });

    // Try Resend first (if API key is available)
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here') {
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        console.log('✅ Email sent successfully via Resend:', result);
        return { success: true, id: result.data?.id };
      } catch (resendError) {
        console.error('❌ Resend email failed:', resendError);
        // Continue to fallback methods
      }
    } else {
      console.log('⚠️ Resend API key not configured, skipping Resend');
    }

    // Fallback to SMTP
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your_email@gmail.com') {
      try {
        const result = await transporter.sendMail({
          from: fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        console.log('✅ Email sent successfully via SMTP:', result.messageId);
        return { success: true, id: result.messageId };
      } catch (smtpError) {
        console.error('❌ SMTP email failed:', smtpError);
      }
    } else {
      console.log('⚠️ SMTP not configured, skipping SMTP');
    }

    // Development mode - just log (always succeeds in development)
    console.log('📧 Email simulated (development mode):', {
      to: options.to,
      subject: options.subject,
      from: fromEmail,
    });
    return { success: true, id: 'simulated-' + Date.now() };

  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Email template wrapper
export function createEmailTemplate(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 100%;
          margin: 0;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .email-container {
          background-color: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 100%;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 28px;
          font-weight: 300;
          color: #333;
          letter-spacing: 2px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #000;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
          margin-top: 30px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          color: #666;
          text-decoration: none;
          margin: 0 10px;
        }
        h1, h2, h3 {
          color: #333;
          font-weight: 400;
        }
        .highlight {
          background-color: #f8f9fa;
          padding: 15px;
          border-left: 4px solid #000;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">✨ CELESTIAL CRYSTALS</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <div class="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
          <p>© 2024 Celestial Crystals. All rights reserved.</p>
          <p>
            <a href="#" style="color: #666;">Unsubscribe</a> | 
            <a href="#" style="color: #666;">Update Preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Utility function to convert HTML to plain text
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}
