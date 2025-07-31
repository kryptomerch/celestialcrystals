import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find the order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber },
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
                image: true
              }
            }
          }
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format the response
    const orderStatus = {
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      items: order.items.map(item => ({
        name: item.crystal.name,
        quantity: item.quantity,
        price: item.price,
        image: item.crystal.image
      })),
      total: order.totalAmount,
      subtotal: order.subtotal,
      shipping: order.shippingAmount,
      tax: order.taxAmount,
      discount: order.discountAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      shippedAt: order.shippedAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString(),
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress ? {
        address: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        province: order.shippingAddress.state,
        postalCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country
      } : null,
      statusHistory: order.statusHistory.map(history => ({
        status: history.status,
        note: history.note,
        createdAt: history.createdAt.toISOString()
      }))
    };

    return NextResponse.json({
      success: true,
      order: orderStatus
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
