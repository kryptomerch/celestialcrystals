import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, source } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: 'Email already subscribed to newsletter' },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        await prisma.emailSubscriber.update({
          where: { email: email.toLowerCase() },
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Newsletter subscription reactivated successfully!'
        });
      }
    }

    // Create new subscriber
    const subscriber = await prisma.emailSubscriber.create({
      data: {
        email: email.toLowerCase(),
        firstName: firstName || null,
        lastName: lastName || null,
        isActive: true,
        newsletter: true,
        promotions: true,
        productUpdates: true,
        source: source || 'website',
        subscribedAt: new Date(),
      }
    });

    // Send welcome email
    try {
      await resend.emails.send({
        from: 'Celestial Crystals <welcome@thecelestial.xyz>',
        to: [email],
        subject: '🌟 Welcome to Celestial Crystals Newsletter!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Celestial Crystals Newsletter</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
              }
              .welcome-text {
                font-size: 24px;
                color: #4a5568;
                margin-bottom: 20px;
              }
              .content {
                margin-bottom: 30px;
              }
              .feature {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding: 15px;
                background: #f7fafc;
                border-radius: 10px;
                border-left: 4px solid #667eea;
              }
              .feature-icon {
                font-size: 24px;
                margin-right: 15px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #718096;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">✨ Celestial Crystals ✨</div>
                <h1 class="welcome-text">Welcome to Our Newsletter!</h1>
              </div>

              <div class="content">
                <p>Dear Crystal Enthusiast,</p>
                
                <p>Thank you for subscribing to the <strong>Celestial Crystals Newsletter</strong>! You're now part of our cosmic community of crystal lovers and spiritual seekers.</p>

                <div class="feature">
                  <span class="feature-icon">📧</span>
                  <div>
                    <strong>Weekly Crystal Wisdom</strong><br>
                    Receive weekly insights about crystal properties, healing techniques, and spiritual practices.
                  </div>
                </div>

                <div class="feature">
                  <span class="feature-icon">🎁</span>
                  <div>
                    <strong>Exclusive Offers</strong><br>
                    Get early access to new arrivals, special discounts, and subscriber-only promotions.
                  </div>
                </div>

                <div class="feature">
                  <span class="feature-icon">🌙</span>
                  <div>
                    <strong>Moon Phase Updates</strong><br>
                    Learn how to work with lunar cycles and crystal energy for manifestation and healing.
                  </div>
                </div>

                <div style="text-align: center;">
                  <a href="https://thecelestial.xyz/crystals" class="cta-button">
                    🛍️ Shop Crystal Collection
                  </a>
                </div>

                <p>What to expect in your weekly newsletters:</p>
                <ul>
                  <li>🔮 <strong>Crystal Spotlight</strong> - Featured crystal of the week</li>
                  <li>📚 <strong>Healing Guides</strong> - Step-by-step crystal healing tutorials</li>
                  <li>🌟 <strong>New Arrivals</strong> - First look at our latest crystal bracelets</li>
                  <li>💫 <strong>Spiritual Tips</strong> - Meditation and energy work practices</li>
                </ul>

                <p>We're excited to share this spiritual journey with you!</p>

                <p>With love and light,<br>
                <strong>The Celestial Crystals Team</strong> 🌟</p>
              </div>

              <div class="footer">
                <p>
                  Celestial Crystals<br>
                  Your Spiritual Wellness Partner<br>
                  <a href="https://thecelestial.xyz" style="color: #667eea;">thecelestial.xyz</a>
                </p>
                
                <p style="font-size: 12px; margin-top: 20px;">
                  You're receiving this email because you subscribed to our newsletter.<br>
                  <a href="https://thecelestial.xyz/unsubscribe?email=${encodeURIComponent(email)}" style="color: #718096;">Unsubscribe</a> | 
                  <a href="https://thecelestial.xyz/newsletter/preferences" style="color: #718096;">Update Preferences</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`✅ Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    // Log the subscription
    await prisma.emailLog.create({
      data: {
        subscriberId: subscriber.id,
        email: subscriber.email,
        subject: 'Newsletter Subscription Welcome',
        template: 'welcome_newsletter',
        status: 'SENT',
        provider: 'resend',
        sentAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      }
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter subscription API endpoint',
    usage: 'POST /api/newsletter/subscribe with { "email": "user@example.com", "firstName": "Name" }'
  });
}
