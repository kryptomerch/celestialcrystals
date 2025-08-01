import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the order with all related data
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id // Ensure user can only access their own orders
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        shippingAddress: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            phone: true
          }
        },
        items: {
          include: {
            crystal: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true
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
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      subtotal: order.subtotal,
      shippingAmount: order.shippingAmount,
      taxAmount: order.taxAmount,
      discountAmount: order.discountAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt.toISOString(),
      shippedAt: order.shippedAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString(),
      user: {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName || '',
        lastName: order.user.lastName || ''
      },
      shippingAddress: order.shippingAddress ? {
        id: order.shippingAddress.id,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        company: order.shippingAddress.company,
        address1: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone
      } : null,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        crystal: {
          id: item.crystal.id,
          name: item.crystal.name,
          image: item.crystal.image,
          price: item.crystal.price
        }
      })),
      statusHistory: order.statusHistory.map(history => ({
        id: history.id,
        status: history.status,
        note: history.note,
        createdAt: history.createdAt.toISOString(),
        createdBy: history.createdBy
      }))
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder
    });

  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
