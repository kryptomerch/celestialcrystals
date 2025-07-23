import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send a simple test email
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default domain for testing
      to: 'test@example.com',
      subject: 'Test Email from Celestial Crystals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">🔮 Celestial Crystals Test Email</h1>
          <p>This is a test email to verify the email system is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key Status:</strong> ✅ Configured</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.data?.id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Email test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyConfigured: !!process.env.RESEND_API_KEY,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">🔮 Celestial Crystals</h1>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message}
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This email was sent from Celestial Crystals test system.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.data?.id,
      to,
      subject,
    });

  } catch (error) {
    console.error('Email send error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
