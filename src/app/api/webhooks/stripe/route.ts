import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NotificationService } from '@/lib/notification-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Stripe webhook called at:', new Date().toISOString());

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    // Log to debug endpoint
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/debug/webhook-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'stripe_webhook_received',
          timestamp: new Date().toISOString(),
          hasSignature: !!signature,
          bodyLength: body.length
        })
      });
    } catch (logError) {
      console.log('Failed to log webhook call:', logError);
    }

    // In development, allow bypassing signature verification if webhook secret is placeholder
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isPlaceholderSecret = webhookSecret === 'whsec_placeholder';

    let event: Stripe.Event;

    if (isDevelopment && isPlaceholderSecret) {
      console.log('⚠️ Development mode: Bypassing webhook signature verification');
      try {
        event = JSON.parse(body);
        console.log('📝 Parsed webhook event without signature verification');
      } catch (parseErr) {
        console.error('Failed to parse webhook body:', parseErr);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
      }
    } else {
      // Production mode: Verify signature
      if (!signature) {
        console.error('No Stripe signature found');
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
      }

      if (!webhookSecret || isPlaceholderSecret) {
        console.error('Stripe webhook secret not configured properly');
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
      }

      // Verify the webhook signature
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    console.log('✅ Stripe webhook received:', event.type);
    console.log('Event data:', JSON.stringify(event.data, null, 2));

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Processing payment_intent.succeeded for:', paymentIntent.id);
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Payment succeeded:', paymentIntent.id);

  try {
    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id }
    });

    if (existingOrder) {
      console.log('Order already exists for payment intent:', paymentIntent.id);
      // Update payment status if needed
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          paymentStatus: 'PAID',
          status: 'PROCESSING'
        }
      });
      return;
    }

    // Get order data from payment intent metadata
    const metadata = paymentIntent.metadata;
    console.log('Payment metadata:', metadata);

    // Try to get order data from metadata
    let orderData = null;

    // Check if we have chunked data
    if (metadata.orderDataChunks) {
      try {
        const chunkCount = parseInt(metadata.orderDataChunks);
        let orderDataString = '';

        // Reconstruct the order data from chunks
        for (let i = 0; i < chunkCount; i++) {
          const chunk = metadata[`orderData_${i}`];
          if (chunk) {
            orderDataString += chunk;
          }
        }

        if (orderDataString) {
          orderData = JSON.parse(orderDataString);
          console.log('Retrieved order data from chunked metadata:', orderData);
        }
      } catch (error) {
        console.error('Failed to parse chunked order data from metadata:', error);
      }
    }

    // Fallback: try to parse from single metadata field
    if (!orderData && metadata.orderData) {
      try {
        orderData = JSON.parse(metadata.orderData);
        console.log('Retrieved order data from metadata:', orderData);
      } catch (error) {
        console.error('Failed to parse order data from metadata:', error);
      }
    }

    // If we still don't have order data, create a minimal order
    if (!orderData) {
      console.warn('No order data found, creating minimal order from payment intent');
      orderData = {
        items: [{
          id: 'unknown',
          name: 'Crystal Order',
          price: paymentIntent.amount / 100,
          quantity: 1
        }],
        subtotal: paymentIntent.amount / 100,
        total: paymentIntent.amount / 100,
        customerInfo: {
          email: metadata.customer_email || 'unknown@example.com',
          firstName: 'Unknown',
          lastName: 'Customer'
        }
      };
    }

    console.log('Creating order from payment:', orderData);

    // Generate order number
    const orderNumber = 'CC' + Date.now().toString().slice(-8).toUpperCase();

    // Create or find user (for guest checkout, create a user)
    let userId = metadata.userId;
    if (!userId) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: orderData.customerInfo.email }
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user
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
    const shippingAddress = await prisma.address.create({
      data: {
        userId: userId,
        firstName: orderData.customerInfo.firstName,
        lastName: orderData.customerInfo.lastName,
        address1: orderData.customerInfo.address,
        city: orderData.customerInfo.city,
        state: orderData.customerInfo.province || orderData.customerInfo.state || '',
        zipCode: orderData.customerInfo.postalCode || orderData.customerInfo.zipCode || '',
        country: orderData.customerInfo.country || 'US',
        isDefault: false
      }
    });

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
        totalAmount: paymentIntent.amount / 100, // Convert from cents
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

        // Update inventory
        await prisma.crystal.update({
          where: { id: item.id },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // Create order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PROCESSING',
        note: 'Order created from successful Stripe payment'
      }
    });

    console.log('✅ Order created successfully:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount
    });

    // Create admin notifications
    await NotificationService.notifyPaymentSuccess(
      order.orderNumber,
      order.totalAmount,
      orderData.customerInfo.email
    );

    await NotificationService.notifyOrderCreated(
      order.orderNumber,
      `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
      orderData.items.length,
      order.totalAmount
    );

    // Send confirmation email
    const customerEmail = paymentIntent.receipt_email || orderData.customerInfo.email;
    if (customerEmail) {
      try {
        console.log('📧 Sending confirmation email to:', customerEmail);

        const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/email/order-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: order.orderNumber,
            customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            email: customerEmail,
            items: orderData.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              properties: item.properties || [],
            })),
            subtotal: orderData.subtotal || 0,
            shipping: orderData.shipping || 0,
            tax: orderData.tax || 0,
            total: order.totalAmount,
            paymentMethod: 'stripe',
            shippingAddress: {
              firstName: orderData.customerInfo.firstName,
              lastName: orderData.customerInfo.lastName,
              address: orderData.customerInfo.address,
              city: orderData.customerInfo.city,
              province: orderData.customerInfo.province || orderData.customerInfo.state || '',
              postalCode: orderData.customerInfo.postalCode || orderData.customerInfo.zipCode || '',
              country: orderData.customerInfo.country || 'US',
            },
            shippingMethod: orderData.shippingRate ? {
              service: orderData.shippingRate.service,
              serviceName: orderData.shippingRate.serviceName,
              price: orderData.shippingRate.price,
              deliveryDays: orderData.shippingRate.deliveryDays,
            } : null,
            estimatedDelivery,
          }),
        });

        if (emailResponse.ok) {
          console.log('✅ Order confirmation email sent successfully');
        } else {
          console.error('❌ Failed to send order confirmation email');
        }
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
      }
    }

  } catch (error) {
    console.error('Error handling payment success:', error);
    console.error('Error details:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);

  try {
    // Handle failed payment
    const failureDetails = {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      last_payment_error: paymentIntent.last_payment_error
    };

    console.log('Failed payment details:', failureDetails);

    // Create admin notification for payment failure
    const errorMessage = paymentIntent.last_payment_error?.message || 'Unknown error';
    await NotificationService.notifyPaymentFailed(
      paymentIntent.id,
      paymentIntent.amount / 100,
      errorMessage
    );

    // You might want to:
    // 1. Send failure notification email to customer
    // 2. Log the failure for analytics
    // 3. Retry payment if appropriate

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Checkout completed:', session.id);

  try {
    // Handle completed checkout session
    console.log('Checkout details:', {
      id: session.id,
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status
    });

    // You might want to:
    // 1. Create order record
    // 2. Send order confirmation
    // 3. Update customer records

  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Stripe webhook endpoint active',
    timestamp: new Date().toISOString(),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Configured ✅' : 'Missing ❌'
  });
}
