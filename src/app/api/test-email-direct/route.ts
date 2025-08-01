import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Testing email service directly...');
    console.log('📧 Target email:', email);
    console.log('🔑 Resend API Key:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
    console.log('📨 From email:', process.env.FROM_EMAIL || 'noreply@thecelestial.xyz');

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'Resend API key not configured',
        details: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          apiKeyValue: process.env.RESEND_API_KEY ? 'Set but may be invalid' : 'Not set',
          fromEmail: process.env.FROM_EMAIL || 'noreply@thecelestial.xyz'
        }
      }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('📤 Attempting to send test email...');

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@thecelestial.xyz',
      to: email,
      subject: 'Test Email from Celestial Crystals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔮 Test Email</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Email System Test</h2>
            
            <p>This is a test email to verify that the Celestial Crystals email system is working correctly.</p>
            
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent at: ${new Date().toISOString()}</li>
              <li>From: ${process.env.FROM_EMAIL || 'noreply@thecelestial.xyz'}</li>
              <li>To: ${email}</li>
              <li>Service: Resend API</li>
            </ul>
            
            <p>If you received this email, the email system is working correctly!</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              This is a test email from Celestial Crystals<br>
              Sent on ${new Date().toLocaleDateString()}
            </p>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        emailId: result.data?.id,
        from: process.env.FROM_EMAIL || 'noreply@thecelestial.xyz',
        to: email,
        timestamp: new Date().toISOString(),
        resendResponse: result
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'noreply@thecelestial.xyz'
      }
    }, { status: 500 });
  }
}
