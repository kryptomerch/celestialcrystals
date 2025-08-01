import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  console.log('🧪 DEBUG: Webhook test endpoint called');
  console.log('🧪 DEBUG: Timestamp:', new Date().toISOString());
  console.log('🧪 DEBUG: URL:', request.url);
  console.log('🧪 DEBUG: Method:', request.method);

  try {
    const body = await request.text();
    const headersList = await headers();
    const allHeaders = Object.fromEntries(headersList.entries());

    console.log('🧪 DEBUG: Body length:', body.length);
    console.log('🧪 DEBUG: Headers:', allHeaders);
    console.log('🧪 DEBUG: Body preview:', body.substring(0, 200));

    // Log everything to our debug endpoint
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/debug/webhook-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'webhook_debug_test',
          timestamp: new Date().toISOString(),
          url: request.url,
          method: request.method,
          bodyLength: body.length,
          headers: allHeaders,
          bodyPreview: body.substring(0, 200)
        })
      });
    } catch (logError) {
      console.error('Failed to log debug info:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Debug webhook received',
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      hasStripeSignature: !!allHeaders['stripe-signature']
    });

  } catch (error) {
    console.error('Debug webhook error:', error);
    return NextResponse.json(
      { error: 'Debug webhook failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook debug endpoint active',
    timestamp: new Date().toISOString(),
    instructions: 'POST to this endpoint to test webhook delivery'
  });
}
