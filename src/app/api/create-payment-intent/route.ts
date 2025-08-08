import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
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

    // Prepare metadata for Stripe with essential order data
    // We'll store the full order data as a JSON string in metadata
    // and split it across multiple metadata fields if needed
    const stripeMetadata = {
      ...metadata,
      order_total: amount.toString(),
      customer_email: orderData?.customerInfo?.email || '',
      source: 'celestial-crystals-checkout'
    };

    // Store order data in metadata (split if too large)
    if (orderData) {
      try {
        const orderDataString = JSON.stringify(orderData);

        // If order data is small enough, store directly
        if (orderDataString.length <= 500) {
          stripeMetadata.orderData = orderDataString;
        } else {
          // Split large order data across multiple metadata fields
          const chunkSize = 500;
          const chunks = [];
          for (let i = 0; i < orderDataString.length; i += chunkSize) {
            chunks.push(orderDataString.substring(i, i + chunkSize));
          }

          stripeMetadata.orderDataChunks = chunks.length.toString();
          chunks.forEach((chunk, index) => {
            stripeMetadata[`orderData_${index}`] = chunk;
          });
        }

        console.log('Stored order data in Stripe metadata');
      } catch (error) {
        console.error('Failed to store order data:', error);
      }
    }

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
