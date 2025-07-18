import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';

export async function POST(request: NextRequest) {
  try {
    const { firstName, email } = await request.json();

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'First name and email are required' },
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

    const discountCode = EmailAutomationService.generateDiscountCode('WELCOME');
    
    const success = await EmailAutomationService.sendWelcomeEmail({
      firstName,
      email,
      discountCode,
    });

    if (success) {
      return NextResponse.json({
        message: 'Welcome email sent successfully',
        discountCode,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
