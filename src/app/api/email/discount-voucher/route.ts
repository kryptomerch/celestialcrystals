import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';
import { DiscountVoucherData } from '@/lib/email-templates/discount-voucher';

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      firstName,
      discountPercentage = 15,
      reason = 'loyalty',
      minOrderAmount
    } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    if (discountPercentage < 5 || discountPercentage > 50) {
      return NextResponse.json(
        { error: 'Discount percentage must be between 5% and 50%' },
        { status: 400 }
      );
    }

    const discountCode = EmailAutomationService.generateDiscountCode(
      reason === 'birthday' ? 'BDAY' :
        reason === 'winback' ? 'BACK' :
          reason === 'seasonal' ? 'SEASON' : 'SAVE'
    );

    // Set expiry date based on reason
    const expiryDays = reason === 'birthday' ? 14 :
      reason === 'winback' ? 30 :
        reason === 'seasonal' ? 7 : 14;

    const expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const voucherData: DiscountVoucherData = {
      firstName,
      discountCode,
      discountPercentage,
      expiryDate: expiryDate.toLocaleDateString(),
      reason: reason as DiscountVoucherData['reason'],
      minOrderAmount,
    };

    const success = await EmailAutomationService.sendDiscountVoucherEmail(voucherData, email);

    if (success) {
      return NextResponse.json({
        message: 'Discount voucher email sent successfully',
        discountCode,
        expiryDate: expiryDate.toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send discount voucher email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Discount voucher API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send birthday discounts (admin endpoint)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, query database for users with birthdays today
    const birthdayUsers: { email: string; firstName: string; birthDate: string }[] = [
      // Example structure:
      // { email: 'user@example.com', firstName: 'John', birthDate: '1990-01-15' }
    ];

    let successCount = 0;
    let failureCount = 0;

    for (const user of birthdayUsers) {
      try {
        const discountCode = EmailAutomationService.generateDiscountCode('BDAY');
        const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        const voucherData: DiscountVoucherData = {
          firstName: user.firstName,
          discountCode,
          discountPercentage: 20,
          expiryDate: expiryDate.toLocaleDateString(),
          reason: 'birthday',
        };

        const success = await EmailAutomationService.sendDiscountVoucherEmail(voucherData, user.email);
        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        console.error(`Failed to send birthday discount to ${user.email}:`, error);
        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Birthday discount batch completed',
      successCount,
      failureCount,
      totalUsers: birthdayUsers.length,
    });
  } catch (error) {
    console.error('Birthday discount batch API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
