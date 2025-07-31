import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Default test values for GET request
  const amount = 4599;
  const customerEmail = 'test@celestialcrystals.com';

  return simulatePayment(amount, customerEmail);
}

async function simulatePayment(amount: number, customerEmail: string) {
  try {

    // Create a mock Stripe payment_intent.succeeded event
    const mockPaymentIntent = {
      id: `pi_test_${Date.now()}`,
      object: 'payment_intent',
      amount: amount, // in cents
      currency: 'usd',
      status: 'succeeded',
      receipt_email: customerEmail,
      metadata: {
        source: 'test-simulation',
        orderData: JSON.stringify({
          items: [
            {
              id: 'crystal-1',
              name: 'Test Crystal',
              price: 25.99,
              quantity: 1,
              properties: ['Healing', 'Protection']
            },
            {
              id: 'crystal-2',
              name: 'Another Test Crystal',
              price: 19.00,
              quantity: 1,
              properties: ['Love', 'Energy']
            }
          ],
          subtotal: 44.99,
          discountAmount: 0,
          shipping: 0,
          tax: 0,
          total: amount / 100,
          customerInfo: {
            firstName: 'Test',
            lastName: 'Customer',
            email: customerEmail,
            address: '123 Test Street',
            city: 'Test City',
            province: 'Test Province',
            postalCode: '12345',
            country: 'US'
          },
          shippingRate: {
            service: 'standard',
            serviceName: 'Standard Shipping',
            price: 0,
            deliveryDays: 5
          }
        })
      }
    };

    const mockWebhookEvent = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: mockPaymentIntent
      },
      created: Math.floor(Date.now() / 1000)
    };

    console.log('🧪 Simulating Stripe webhook with mock payment:', {
      paymentIntentId: mockPaymentIntent.id,
      amount: amount / 100,
      customerEmail
    });

    // Send the mock webhook to our webhook handler
    const webhookResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
      },
      body: JSON.stringify(mockWebhookEvent)
    });

    const webhookResult = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Mock payment webhook sent successfully',
      mockPayment: {
        paymentIntentId: mockPaymentIntent.id,
        amount: amount / 100,
        customerEmail,
        status: 'succeeded'
      },
      webhookResponse: {
        status: webhookResponse.status,
        result: webhookResult
      },
      instructions: [
        '1. Check /admin/orders for the new order',
        '2. Check /admin/notifications for payment notifications',
        '3. Check your email for order confirmation',
        '4. Use /api/debug/orders to see database status'
      ]
    });

  } catch (error) {
    console.error('❌ Mock payment simulation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to simulate payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount = 4599, customerEmail = 'test@example.com' } = await request.json();
    return simulatePayment(amount, customerEmail);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
