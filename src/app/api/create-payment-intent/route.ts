import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', metadata = {}, orderData } = await request.json();

    // Prepare metadata for Stripe
    const stripeMetadata = {
      ...metadata,
      // Store order data as JSON string (Stripe metadata values must be strings)
      orderData: orderData ? JSON.stringify(orderData) : undefined
    };

    // Remove undefined values
    Object.keys(stripeMetadata).forEach(key => {
      if (stripeMetadata[key] === undefined) {
        delete stripeMetadata[key];
      }
    });

    console.log('Creating payment intent with metadata:', stripeMetadata);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: stripeMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
