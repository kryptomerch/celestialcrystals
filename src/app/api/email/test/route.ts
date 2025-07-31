import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EmailAutomationService } from '@/lib/email-automation';

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { template, data } = await request.json();

    // Send test email based on template type
    switch (template) {
      case 'welcome':
        await EmailAutomationService.sendWelcomeEmail({
          firstName: data.firstName,
          email: session.user.email, // Send to current user
          discountCode: 'WELCOME15'
        });
        break;

      case 'weekly-1':
      case 'weekly-2':
      case 'weekly-3':
      case 'weekly-4':
        // For now, we'll send a welcome email as a test
        await EmailAutomationService.sendWelcomeEmail({
          firstName: data.firstName,
          email: session.user.email,
          discountCode: 'WEEKLY15'
        });
        break;

      default:
        await EmailAutomationService.sendWelcomeEmail({
          firstName: data.firstName,
          email: session.user.email,
          discountCode: 'TEST15'
        });
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${session.user.email}`
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
