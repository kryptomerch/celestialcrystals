import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';

export async function POST(request: NextRequest) {
  try {
    const { email = 'test@example.com', firstName = 'Test User' } = await request.json();

    console.log('🧪 Testing welcome email functionality...');
    console.log('Environment check:', {
      resendKey: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
      fromEmail: process.env.FROM_EMAIL || 'Not set'
    });

    // Generate discount code
    const discountCode = EmailAutomationService.generateDiscountCode('WELCOME');
    console.log('Generated discount code:', discountCode);

    // Send welcome email
    const success = await EmailAutomationService.sendWelcomeEmail({
      firstName,
      email,
      discountCode
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Welcome email sent successfully!',
        details: {
          email,
          firstName,
          discountCode,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send welcome email',
        details: {
          email,
          firstName,
          discountCode
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Welcome email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Welcome email test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Welcome email test endpoint',
    usage: 'POST with { "email": "test@example.com", "firstName": "Test User" }',
    environment: {
      resendKey: process.env.RESEND_API_KEY ? 'Configured' : 'Missing',
      fromEmail: process.env.FROM_EMAIL || 'Not configured'
    }
  });
}
