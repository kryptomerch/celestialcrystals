import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: 'Celestial Crystals <welcome@thecelestial.xyz>',
      to: [email],
      subject: '🌟 Welcome to Celestial Crystals - Your Spiritual Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Celestial Crystals</title>
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
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #667eea;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ Celestial Crystals ✨</div>
              <h1 class="welcome-text">Welcome to Your Spiritual Journey!</h1>
            </div>

            <div class="content">
              <p>Dear Crystal Enthusiast,</p>
              
              <p>Welcome to <strong>Celestial Crystals</strong> - your gateway to the mystical world of healing crystals and spiritual wellness! We're absolutely thrilled to have you join our cosmic community.</p>

              <div class="feature">
                <span class="feature-icon">🔮</span>
                <div>
                  <strong>Premium Crystal Collection</strong><br>
                  Discover our carefully curated selection of authentic healing crystals, each chosen for their unique energy and beauty.
                </div>
              </div>

              <div class="feature">
                <span class="feature-icon">📚</span>
                <div>
                  <strong>Educational Resources</strong><br>
                  Learn about crystal properties, healing techniques, and spiritual practices through our comprehensive guides.
                </div>
              </div>

              <div class="feature">
                <span class="feature-icon">🌟</span>
                <div>
                  <strong>Personalized Recommendations</strong><br>
                  Get crystal suggestions tailored to your specific needs and spiritual goals.
                </div>
              </div>

              <div class="feature">
                <span class="feature-icon">💌</span>
                <div>
                  <strong>Exclusive Content</strong><br>
                  Receive weekly newsletters with crystal wisdom, meditation guides, and special offers.
                </div>
              </div>

              <div style="text-align: center;">
                <a href="https://thecelestial.xyz/crystals" class="cta-button">
                  🛍️ Explore Our Crystal Collection
                </a>
              </div>

              <p>As a welcome gift, here's what you can expect from us:</p>
              <ul>
                <li>🎁 <strong>10% off your first order</strong> with code: <code style="background: #f7fafc; padding: 2px 8px; border-radius: 4px; color: #667eea; font-weight: bold;">WELCOME10</code></li>
                <li>📖 Free access to our Crystal Healing Guide</li>
                <li>🌙 Monthly moon phase crystal recommendations</li>
                <li>✨ Exclusive member-only content and early access to new arrivals</li>
              </ul>

              <p>Whether you're just beginning your crystal journey or you're a seasoned collector, we're here to support your spiritual growth and help you find the perfect crystals for your needs.</p>

              <p>Feel free to reach out to us anytime at <a href="mailto:support@thecelestial.xyz" style="color: #667eea;">support@thecelestial.xyz</a> - we love connecting with our crystal family!</p>

              <p>With love and light,<br>
              <strong>The Celestial Crystals Team</strong> 🌟</p>
            </div>

            <div class="footer">
              <div class="social-links">
                <a href="https://instagram.com/celestialcrystals">📱 Instagram</a>
                <a href="https://facebook.com/celestialcrystals">📘 Facebook</a>
                <a href="https://twitter.com/celestialcrystals">🐦 Twitter</a>
              </div>
              
              <p>
                Celestial Crystals<br>
                Your Spiritual Wellness Partner<br>
                <a href="https://thecelestial.xyz" style="color: #667eea;">thecelestial.xyz</a>
              </p>
              
              <p style="font-size: 12px; margin-top: 20px;">
                You're receiving this email because you signed up for Celestial Crystals.<br>
                <a href="#" style="color: #718096;">Unsubscribe</a> | 
                <a href="#" style="color: #718096;">Update Preferences</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully!',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Welcome email API endpoint. Use POST to send emails.',
    usage: 'POST /api/test-welcome-email with { "email": "recipient@example.com" }'
  });
}
