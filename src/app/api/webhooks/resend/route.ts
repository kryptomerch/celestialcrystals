import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Resend webhook event types
interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.delivery_delayed' | 'email.complained' | 'email.bounced' | 'email.clicked' | 'email.opened'
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    created_at: string
    html?: string
    text?: string
    tags?: { name: string; value: string }[]
    // Event-specific data
    click?: {
      ipAddress: string
      link: string
      timestamp: string
      userAgent: string
    }
    open?: {
      ipAddress: string
      timestamp: string
      userAgent: string
    }
    bounce?: {
      bounceType: string
      timestamp: string
    }
    complaint?: {
      complaintType: string
      timestamp: string
    }
  }
}

// Verify webhook signature (if you set up signing secret)
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

// Map Resend event types to EmailLog status
function mapEventTypeToStatus(eventType: string): string {
  switch (eventType) {
    case 'email.sent':
      return 'SENT'
    case 'email.delivered':
      return 'DELIVERED'
    case 'email.bounced':
      return 'BOUNCED'
    case 'email.complained':
      return 'COMPLAINED'
    case 'email.opened':
      return 'OPENED'
    case 'email.clicked':
      return 'CLICKED'
    case 'email.delivery_delayed':
      return 'DELAYED'
    default:
      return 'UNKNOWN'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('resend-signature')

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(body, signature, webhookSecret)) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event: ResendWebhookEvent = JSON.parse(body)
    console.log('Resend webhook received:', event.type, event.data.email_id)

    // Store email event in database using existing EmailLog model
    await prisma.emailLog.create({
      data: {
        email: event.data.to[0] || '',
        subject: event.data.subject,
        template: 'webhook_event',
        status: mapEventTypeToStatus(event.type),
        provider: 'resend',
        providerId: event.data.email_id,
        errorMessage: event.type.includes('bounced') || event.type.includes('complained')
          ? JSON.stringify(event.data)
          : null,
      }
    })

    // Handle specific event types
    switch (event.type) {
      case 'email.delivered':
        console.log(`✅ Email delivered: ${event.data.email_id} to ${event.data.to[0]}`)
        // Update user's email status or send confirmation
        break

      case 'email.bounced':
        console.log(`❌ Email bounced: ${event.data.email_id} to ${event.data.to[0]}`)
        // Mark email as invalid, remove from mailing list
        await handleEmailBounce(event.data.to[0], event.data.bounce)
        break

      case 'email.complained':
        console.log(`⚠️ Spam complaint: ${event.data.email_id} from ${event.data.to[0]}`)
        // Remove from mailing list immediately
        await handleSpamComplaint(event.data.to[0])
        break

      case 'email.opened':
        console.log(`👀 Email opened: ${event.data.email_id} by ${event.data.to[0]}`)
        // Track engagement
        break

      case 'email.clicked':
        console.log(`🔗 Email clicked: ${event.data.email_id} by ${event.data.to[0]}`)
        // Track engagement and conversion
        break

      case 'email.sent':
        console.log(`📤 Email sent: ${event.data.email_id} to ${event.data.to[0]}`)
        break

      case 'email.delivery_delayed':
        console.log(`⏳ Email delayed: ${event.data.email_id} to ${event.data.to[0]}`)
        break
    }

    return NextResponse.json({ success: true, processed: event.type })

  } catch (error) {
    console.error('Resend webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle email bounces
async function handleEmailBounce(email: string, bounceData: any) {
  try {
    // Mark email as invalid in email subscribers
    await prisma.emailSubscriber.updateMany({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      }
    })

    // Mark user email as invalid if exists
    await prisma.user.updateMany({
      where: { email },
      data: { emailVerified: null } // Mark as unverified
    })

    console.log(`Email marked as invalid due to bounce: ${email}`)
  } catch (error) {
    console.error('Failed to handle email bounce:', error)
  }
}

// Handle spam complaints
async function handleSpamComplaint(email: string) {
  try {
    // Immediately unsubscribe from all emails
    await prisma.emailSubscriber.updateMany({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      }
    })

    console.log(`Email unsubscribed due to spam complaint: ${email}`)
  } catch (error) {
    console.error('Failed to handle spam complaint:', error)
  }
}

// GET endpoint for webhook verification (some services require this)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Resend webhook endpoint active',
    timestamp: new Date().toISOString()
  })
}
