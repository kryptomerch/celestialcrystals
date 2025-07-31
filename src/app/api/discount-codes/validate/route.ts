import { NextRequest, NextResponse } from 'next/server';

interface DiscountCode {
  code: string;
  percentage: number;
  isValid: boolean;
  message?: string;
  expiryDate?: string;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  type?: string;
  freeShipping?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // In a real app, this would query your database
    // For now, we'll validate against predefined patterns and codes
    const discountCode = await validateDiscountCode(normalizedCode);

    return NextResponse.json(discountCode);
  } catch (error) {
    console.error('Discount code validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function validateDiscountCode(code: string): Promise<DiscountCode> {
  // Static discount codes (in production, these would be in your database)
  const staticCodes: Record<string, DiscountCode> = {
    'WELCOME15': {
      code: 'WELCOME15',
      percentage: 15,
      isValid: true,
      message: '15% welcome discount applied!',
      expiryDate: '2024-12-31',
    },
    'WELCOME10': {
      code: 'WELCOME10',
      percentage: 10,
      isValid: true,
      message: '10% welcome discount applied!',
      expiryDate: '2024-12-31',
    },
    'BDAY20': {
      code: 'BDAY20',
      percentage: 20,
      isValid: true,
      message: '20% birthday discount applied!',
      expiryDate: '2024-12-31',
    },
    'SAVE25': {
      code: 'SAVE25',
      percentage: 25,
      isValid: true,
      message: '25% discount applied!',
      expiryDate: '2024-12-31',
      minOrderAmount: 50,
    },
    'FREEDELIVERY': {
      code: 'FREEDELIVERY',
      percentage: 0,
      isValid: true,
      message: 'Free delivery applied!',
      expiryDate: '2025-12-31',
      type: 'FREE_SHIPPING',
      freeShipping: true,
    },
    'WEEKLY10': {
      code: 'WEEKLY10',
      percentage: 10,
      isValid: true,
      message: '10% weekly discount applied!',
      expiryDate: '2024-12-31',
    },
    'SEASON15': {
      code: 'SEASON15',
      percentage: 15,
      isValid: true,
      message: '15% seasonal discount applied!',
      expiryDate: '2024-12-31',
    },
  };

  // Check static codes first
  if (staticCodes[code]) {
    const discountCode = staticCodes[code];

    // Check if expired
    if (discountCode.expiryDate && new Date() > new Date(discountCode.expiryDate)) {
      return {
        code,
        percentage: 0,
        isValid: false,
        message: 'This discount code has expired',
      };
    }

    return discountCode;
  }

  // Pattern-based validation for generated codes
  const patterns = [
    { regex: /^WELCOME\w{4,6}$/, percentage: 15, message: '15% welcome discount applied!' },
    { regex: /^BDAY\w{3,9}$/, percentage: 20, message: '20% birthday discount applied!' },
    { regex: /^SAVE\w{3,9}$/, percentage: 15, message: '15% discount applied!' },
    { regex: /^WEEKLY\w{3,9}$/, percentage: 10, message: '10% weekly discount applied!' },
    { regex: /^SEASON\w{3,9}$/, percentage: 15, message: '15% seasonal discount applied!' },
    { regex: /^BACK\w{3,9}$/, percentage: 25, message: '25% welcome back discount applied!', minOrderAmount: 50 },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(code)) {
      return {
        code,
        percentage: pattern.percentage,
        isValid: true,
        message: pattern.message,
        minOrderAmount: pattern.minOrderAmount,
      };
    }
  }

  // Code not found
  return {
    code,
    percentage: 0,
    isValid: false,
    message: 'Invalid discount code',
  };
}

// Admin endpoint to create discount codes
export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      code,
      percentage,
      expiryDate,
      minOrderAmount,
      usageLimit,
    } = await request.json();

    if (!code || !percentage) {
      return NextResponse.json(
        { error: 'Code and percentage are required' },
        { status: 400 }
      );
    }

    // In a real app, save to database
    const discountCode: DiscountCode = {
      code: code.toUpperCase(),
      percentage,
      isValid: true,
      expiryDate,
      minOrderAmount,
      usageLimit,
      usedCount: 0,
      message: `${percentage}% discount applied!`,
    };

    console.log('Created discount code:', discountCode);

    return NextResponse.json({
      message: 'Discount code created successfully',
      discountCode,
    });
  } catch (error) {
    console.error('Error creating discount code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Admin endpoint to list all discount codes
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

    // In a real app, fetch from database
    const discountCodes = [
      { code: 'WELCOME15', percentage: 15, isValid: true, usedCount: 45 },
      { code: 'BDAY20', percentage: 20, isValid: true, usedCount: 12 },
      { code: 'SAVE25', percentage: 25, isValid: true, usedCount: 8 },
      // Add more codes from database
    ];

    return NextResponse.json({ discountCodes });
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
