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

    // Store order data in a temporary database record and reference it by ID
    // This avoids Stripe's 500-character metadata limit
    let orderDataId = null;
    if (orderData) {
      try {
        // Store order data temporarily (we'll use this in the webhook)
        const tempOrderData = {
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          data: orderData,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        // Store in a simple JSON file or database (for now, we'll pass essential data only)
        orderDataId = tempOrderData.id;

        // Store in global variable temporarily (in production, use Redis or database)
        global.tempOrderData = global.tempOrderData || {};
        global.tempOrderData[orderDataId] = tempOrderData;

        console.log('Stored temporary order data with ID:', orderDataId);
      } catch (error) {
        console.error('Failed to store order data:', error);
      }
    }

    // Prepare metadata for Stripe (essential info only)
    const stripeMetadata = {
      ...metadata,
      order_data_id: orderDataId || '',
      order_total: amount.toString(),
      customer_email: orderData?.customerInfo?.email || '',
      source: 'celestial-crystals-checkout'
    };

    // Remove undefined/empty values
    Object.keys(stripeMetadata).forEach(key => {
      if (!stripeMetadata[key] || stripeMetadata[key] === 'undefined') {
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
