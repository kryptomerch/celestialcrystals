import { NextRequest, NextResponse } from 'next/server';
import { AutoDiscountService } from '@/lib/auto-discount';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check for available discounts for this email
    const discount = await AutoDiscountService.checkUserDiscounts(email);

    if (discount) {
      return NextResponse.json({
        success: true,
        discount: {
          code: discount.code,
          percentage: discount.percentage,
          reason: discount.reason,
          expiryDate: discount.expiryDate,
        },
        message: `${discount.reason} - ${discount.percentage}% off applied!`,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No available discounts for this email',
    });

  } catch (error) {
    console.error('Auto-discount API error:', error);
    return NextResponse.json(
      { error: 'Failed to check for discounts' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get all available discounts for this email
    const discounts = await AutoDiscountService.getUserAvailableDiscounts(email);

    return NextResponse.json({
      success: true,
      discounts,
      count: discounts.length,
    });

  } catch (error) {
    console.error('Get discounts API error:', error);
    return NextResponse.json(
      { error: 'Failed to get discounts' },
      { status: 500 }
    );
  }
}
