import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Stripe webhook functionality...');

    // Create a test payment intent to trigger webhook
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00 in cents
      currency: 'usd',
      metadata: {
        test: 'webhook_test',
        orderData: JSON.stringify({
          items: [{
            id: 'citrine-1',
            name: 'Test Citrine Bracelet',
            price: 10.00,
            quantity: 1
          }],
          subtotal: 10.00,
          total: 10.00,
          customerInfo: {
            email: 'webhook-test@example.com',
            firstName: 'Webhook',
            lastName: 'Test',
            address: '123 Test Street',
            city: 'Test City',
            state: 'CA',
            zipCode: '12345',
            country: 'US'
          }
        })
      }
    });

    console.log('✅ Test payment intent created:', paymentIntent.id);

    // Simulate payment success (this would normally trigger webhook)
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa', // Test card
      return_url: 'https://thecelestial.xyz/order-confirmation'
    });

    return NextResponse.json({
      success: true,
      message: 'Test payment intent created and confirmed',
      paymentIntentId: paymentIntent.id,
      status: confirmedPayment.status,
      webhookInstructions: {
        step1: 'Go to https://dashboard.stripe.com/webhooks',
        step2: 'Click "Add endpoint"',
        step3: 'URL: https://thecelestial.xyz/api/webhooks/stripe',
        step4: 'Events: payment_intent.succeeded, checkout.session.completed',
        step5: 'Copy the webhook secret and update .env file'
      }
    });

  } catch (error) {
    console.error('❌ Webhook test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Webhook test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe Webhook Test Endpoint',
    instructions: {
      step1: 'POST to this endpoint to create a test payment',
      step2: 'Configure webhook in Stripe dashboard',
      step3: 'URL: https://thecelestial.xyz/api/webhooks/stripe',
      step4: 'Events: payment_intent.succeeded, checkout.session.completed'
    },
    webhookStatus: {
      endpoint: 'https://thecelestial.xyz/api/webhooks/stripe',
      secret: process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing'
    }
  });
}
