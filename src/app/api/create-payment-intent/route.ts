import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

    const { amount, currency = 'usd', metadata = {}, orderData } = await request.json();

    // Prepare metadata for Stripe (limit to essential info due to 500 char limit per value)
    const stripeMetadata = {
      ...metadata,
      // Store only essential order info (Stripe metadata values must be strings and under 500 chars)
      order_total: orderData?.total?.toString() || amount.toString(),
      order_items_count: orderData?.items?.length?.toString() || '0',
      customer_email: orderData?.customerInfo?.email || '',
      // Store first item name as sample (truncated to fit limit)
      first_item: orderData?.items?.[0]?.name?.substring(0, 100) || '',
      source: 'celestial-crystals-checkout'
    };

    // Remove undefined/empty values and ensure all values are under 500 chars
    Object.keys(stripeMetadata).forEach(key => {
      if (!stripeMetadata[key] || stripeMetadata[key] === 'undefined') {
        delete stripeMetadata[key];
      } else if (stripeMetadata[key].length > 500) {
        stripeMetadata[key] = stripeMetadata[key].substring(0, 497) + '...';
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

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
