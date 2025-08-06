import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { orderId, reason, note } = await request.json();

    if (!orderId || !reason) {
      return NextResponse.json({
        error: 'Order ID and cancellation reason are required'
      }, { status: 400 });
    }

    // Validate cancellation reason
    const validReasons = [
      'out_of_stock',
      'customer_request',
      'payment_failed',
      'fraud_detected',
      'duplicate_order',
      'address_issue',
      'other'
    ];

    if (!validReasons.includes(reason)) {
      return NextResponse.json({
        error: 'Invalid cancellation reason'
      }, { status: 400 });
    }

    // Check if order exists and can be cancelled
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            crystal: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order can be cancelled (not already shipped/delivered/cancelled)
    if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
      return NextResponse.json({
        error: `Cannot cancel order with status: ${order.status}`
      }, { status: 400 });
    }

    // Update order status to cancelled
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order
      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: 'admin',
          cancellationReason: reason,
          cancellationNote: note || null,
          paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : order.paymentStatus
        }
      });

      // Add status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: orderId,
          status: 'CANCELLED',
          note: `Cancelled by admin. Reason: ${reason}${note ? `. Note: ${note}` : ''}`
        }
      });

      // If out of stock, restore inventory
      if (reason === 'out_of_stock') {
        for (const item of order.items) {
          await tx.crystal.update({
            where: { id: item.crystalId },
            data: {
              stockQuantity: {
                increment: item.quantity
              }
            }
          });
        }
      }

      return cancelledOrder;
    });

    // TODO: Send cancellation email to customer
    // TODO: Process refund if payment was already captured

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        cancelledAt: updatedOrder.cancelledAt,
        cancellationReason: updatedOrder.cancellationReason,
        cancellationNote: updatedOrder.cancellationNote
      }
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
