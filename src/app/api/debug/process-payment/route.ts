import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();
    
    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Processing payment intent:', paymentIntentId);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    console.log('💰 Payment Intent Details:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    });

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({
        success: false,
        error: 'Payment has not succeeded yet',
        status: paymentIntent.status
      });
    }

    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id }
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: 'Order already exists',
        order: existingOrder
      });
    }

    // Get order data from metadata
    const metadata = paymentIntent.metadata;
    let orderData = null;
    
    // Try to parse order data from metadata
    if (metadata.orderData) {
      try {
        orderData = JSON.parse(metadata.orderData);
      } catch (error) {
        console.error('Failed to parse order data from metadata:', error);
      }
    }

    // Check for chunked data
    if (!orderData && metadata.orderDataChunks) {
      try {
        const chunkCount = parseInt(metadata.orderDataChunks);
        let orderDataString = '';
        
        for (let i = 0; i < chunkCount; i++) {
          const chunk = metadata[`orderData_${i}`];
          if (chunk) {
            orderDataString += chunk;
          }
        }
        
        if (orderDataString) {
          orderData = JSON.parse(orderDataString);
        }
      } catch (error) {
        console.error('Failed to parse chunked order data:', error);
      }
    }

    if (!orderData) {
      return NextResponse.json({
        success: false,
        error: 'No order data found in payment intent metadata',
        metadata: metadata
      });
    }

    console.log('📦 Order Data:', orderData);

    // Create or find user
    let userId = metadata.userId;
    if (!userId) {
      const existingUser = await prisma.user.findUnique({
        where: { email: orderData.customerInfo.email }
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: orderData.customerInfo.email,
            firstName: orderData.customerInfo.firstName,
            lastName: orderData.customerInfo.lastName
          }
        });
        userId = newUser.id;
      }
    }

    // Create shipping address
    const shippingAddress = await prisma.shippingAddress.create({
      data: {
        firstName: orderData.customerInfo.firstName,
        lastName: orderData.customerInfo.lastName,
        address: orderData.customerInfo.address,
        city: orderData.customerInfo.city,
        province: orderData.customerInfo.province,
        postalCode: orderData.customerInfo.postalCode,
        country: orderData.customerInfo.country || 'CA'
      }
    });

    // Generate order number
    const orderNumber = 'CC' + Date.now().toString().slice(-8).toUpperCase();

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PROCESSING',
        subtotal: orderData.subtotal || 0,
        discountAmount: orderData.discountAmount || 0,
        shippingAmount: orderData.shipping || 0,
        taxAmount: orderData.tax || 0,
        totalAmount: paymentIntent.amount / 100,
        discountCode: orderData.discountCode,
        paymentMethod: 'stripe',
        paymentStatus: 'PAID',
        paymentIntentId: paymentIntent.id,
        shippingAddressId: shippingAddress.id
      }
    });

    // Create order items
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            crystalId: item.id,
            quantity: item.quantity,
            price: item.price
          }
        });
      }
    }

    // Create order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PROCESSING',
        note: 'Order created manually from payment intent'
      }
    });

    console.log('✅ Order created successfully:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully from payment intent',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentIntentId: paymentIntent.id
      }
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
