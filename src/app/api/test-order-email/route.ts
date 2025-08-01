import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { orderId, email } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        shippingAddress: true,
        items: {
          include: {
            crystal: {
              select: {
                name: true,
                properties: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Use provided email or order email
    const targetEmail = email || order.user.email;

    if (!targetEmail) {
      return NextResponse.json(
        { error: 'No email address available' },
        { status: 400 }
      );
    }

    // Prepare order data for email
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const orderData = {
      orderNumber: order.orderNumber,
      customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Valued Customer',
      email: targetEmail,
      items: order.items.map(item => ({
        id: item.id,
        name: item.crystal.name,
        price: item.price,
        quantity: item.quantity,
        properties: JSON.parse(item.crystal.properties || '[]').slice(0, 2)
      })),
      subtotal: order.subtotal || 0,
      shipping: order.shippingAmount || 0,
      tax: order.taxAmount || 0,
      total: order.totalAmount,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress ? {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        address: order.shippingAddress.address1,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country
      } : {
        address: 'Address not available',
        city: 'City',
        state: 'State',
        zipCode: '00000',
        country: 'US'
      },
      estimatedDelivery
    };

    console.log('🧪 Testing order confirmation email with data:', {
      orderNumber: orderData.orderNumber,
      email: orderData.email,
      itemCount: orderData.items.length,
      total: orderData.total,
      hasShippingAddress: !!order.shippingAddress
    });

    // Send the email
    const success = await EmailAutomationService.sendOrderConfirmationEmail(orderData);

    if (success) {
      return NextResponse.json({
        message: 'Test order confirmation email sent successfully',
        orderNumber: order.orderNumber,
        email: targetEmail,
        orderData: orderData
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test order confirmation email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test order email error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
