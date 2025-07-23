import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe keys are configured
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!publishableKey || !secretKey) {
      return NextResponse.json({
        success: false,
        error: 'Stripe keys not configured',
        details: {
          publishableKey: publishableKey ? 'Set' : 'Missing',
          secretKey: secretKey ? 'Set' : 'Missing'
        }
      }, { status: 500 });
    }

    // Initialize Stripe
    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-06-30.basil',
    });

    // Test creating a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2999, // $29.99 in cents
      currency: 'usd',
      metadata: {
        test: 'true',
        source: 'stripe-test-endpoint'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Test retrieving account info
    const account = await stripe.accounts.retrieve();

    return NextResponse.json({
      success: true,
      message: 'Stripe integration is working correctly!',
      tests: {
        paymentIntentCreated: true,
        paymentIntentId: paymentIntent.id,
        accountId: account.id,
        accountCountry: account.country,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      },
      configuration: {
        publishableKey: publishableKey ? 'Set ✅' : 'Missing ❌',
        secretKey: secretKey ? 'Set ✅' : 'Missing ❌',
        webhookEndpoint: '/api/webhooks/stripe',
        testMode: secretKey?.startsWith('sk_test_') ? 'Yes ✅' : 'Live Mode ⚠️'
      }
    });

  } catch (error) {
    console.error('Stripe test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Stripe test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      configuration: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
        secretKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing'
      }
    }, { status: 500 });
  }
}
