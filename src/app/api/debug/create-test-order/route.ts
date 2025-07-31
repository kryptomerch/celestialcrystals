import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Creating test order...');

    // Create a test user first
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'Customer'
      }
    });

    // Create shipping address
    const shippingAddress = await prisma.shippingAddress.create({
      data: {
        firstName: 'Test',
        lastName: 'Customer',
        address: '123 Test Street',
        city: 'Test City',
        province: 'ON',
        postalCode: 'K1A 0A6',
        country: 'CA'
      }
    });

    // Generate order number
    const orderNumber = 'CC' + Date.now().toString().slice(-8).toUpperCase();

    // Create the test order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: testUser.id,
        status: 'PROCESSING',
        subtotal: 44.00,
        discountAmount: 0,
        shippingAmount: 12.99,
        taxAmount: 7.41,
        totalAmount: 64.40,
        discountCode: null,
        paymentMethod: 'stripe',
        paymentStatus: 'PAID',
        paymentIntentId: `pi_test_${Date.now()}`,
        shippingAddressId: shippingAddress.id
      }
    });

    // Get a crystal to add as order item
    const crystal = await prisma.crystal.findFirst();
    
    if (crystal) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          crystalId: crystal.id,
          quantity: 1,
          price: 44.00
        }
      });
    }

    // Create order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PROCESSING',
        note: 'Test order created for debugging'
      }
    });

    console.log('✅ Test order created successfully:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount
    });

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create test order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
