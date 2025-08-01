import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (user) {
      // Generate reset token with embedded user info and expiry
      const tokenData = {
        userId: user.id,
        email: user.email,
        exp: Date.now() + 3600000 // 1 hour from now
      };

      // Create a simple encoded token (in production, use JWT or similar)
      const resetToken = Buffer.from(JSON.stringify(tokenData)).toString('base64url');

      // Send password reset email
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev', // Use Resend's verified domain
          to: email,
          subject: 'Reset Your Celestial Crystals Password',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🔮 Celestial Crystals</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
                <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                
                <p>Hello ${user.firstName || 'Crystal Enthusiast'},</p>
                
                <p>We received a request to reset your password for your Celestial Crystals account. If you didn't make this request, you can safely ignore this email.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 25px; 
                            font-weight: bold; 
                            display: inline-block;
                            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                    Reset My Password
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  This link will expire in 1 hour for security reasons.
                </p>
                
                <p style="color: #666; font-size: 14px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #666; font-size: 12px; text-align: center;">
                  This email was sent by Celestial Crystals<br>
                  If you have any questions, please contact us at support@thecelestial.xyz
                </p>
              </div>
            </body>
            </html>
          `
        });

        console.log('✅ Password reset email sent to:', email);
      } catch (emailError) {
        console.error('❌ Failed to send password reset email:', emailError);
        // Don't fail the request if email fails - user might still be able to reset via other means
      }
    }

    // Always return success message (security best practice)
    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
