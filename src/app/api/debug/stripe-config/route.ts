import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const stripeConfig = {
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      webhookSecretValue: process.env.STRIPE_WEBHOOK_SECRET,
      publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...',
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...',
      nextAuthUrl: process.env.NEXTAUTH_URL,
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhooks/stripe`,
      isWebhookSecretPlaceholder: process.env.STRIPE_WEBHOOK_SECRET === 'whsec_placeholder'
    };

    console.log('🔍 Stripe Configuration Check:', stripeConfig);

    return NextResponse.json({
      success: true,
      config: stripeConfig,
      message: 'Stripe configuration status',
      issues: [
        ...(stripeConfig.isWebhookSecretPlaceholder ? ['⚠️ Webhook secret is placeholder - webhooks will fail'] : []),
        ...(!stripeConfig.hasPublishableKey ? ['❌ Missing publishable key'] : []),
        ...(!stripeConfig.hasSecretKey ? ['❌ Missing secret key'] : []),
        ...(!stripeConfig.hasWebhookSecret ? ['❌ Missing webhook secret'] : [])
      ]
    });

  } catch (error) {
    console.error('❌ Stripe config check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check Stripe configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
