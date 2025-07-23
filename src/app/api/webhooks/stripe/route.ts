import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Stripe webhook received:', event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
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
    // Here you would typically:
    // 1. Update order status in database
    // 2. Send confirmation email
    // 3. Update inventory
    // 4. Trigger fulfillment process

    // For now, just log the success
    console.log('Payment details:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    });

    // Send confirmation email (if email service is configured)
    if (paymentIntent.receipt_email) {
      console.log('📧 Would send confirmation email to:', paymentIntent.receipt_email);
      // TODO: Implement email sending logic
    }

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  try {
    // Handle failed payment
    console.log('Failed payment details:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      last_payment_error: paymentIntent.last_payment_error
    });

    // You might want to:
    // 1. Send failure notification email
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
