import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';
import { OrderConfirmationData } from '@/lib/email-templates/order-confirmation';

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderConfirmationData = await request.json();

    // Validate required fields
    if (!orderData.orderNumber || !orderData.email || !orderData.customerName) {
      return NextResponse.json(
        { error: 'Order number, email, and customer name are required' },
        { status: 400 }
      );
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Add estimated delivery date if not provided
    if (!orderData.estimatedDelivery) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
      orderData.estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const success = await EmailAutomationService.sendOrderConfirmationEmail(orderData);

    if (success) {
      return NextResponse.json({
        message: 'Order confirmation email sent successfully',
        orderNumber: orderData.orderNumber,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send order confirmation email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Order confirmation email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
