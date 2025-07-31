import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Create the FREEDELIVERY discount code in the database
    const discountCode = await prisma.discountCode.create({
      data: {
        code: 'FREEDELIVERY',
        percentage: 0,
        isValid: true,
        expiryDate: new Date('2025-12-31'),
        reason: 'free_shipping',
        description: 'Free delivery on all orders',
        type: 'FREE_SHIPPING',
        isActive: true,
        usageLimit: 1000, // Allow 1000 uses
        usageCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'FREEDELIVERY discount code created successfully',
      discountCode: {
        id: discountCode.id,
        code: discountCode.code,
        percentage: discountCode.percentage,
        type: discountCode.type,
        expiryDate: discountCode.expiryDate,
        usageLimit: discountCode.usageLimit,
      }
    });

  } catch (error) {
    console.error('Error creating discount code:', error);
    
    // Check if code already exists
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({
        success: false,
        error: 'Discount code FREEDELIVERY already exists',
        message: 'The discount code is already available for use'
      });
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create discount code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
