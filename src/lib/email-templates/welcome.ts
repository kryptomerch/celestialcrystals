import { createEmailTemplate, htmlToText } from '../email';

export interface WelcomeEmailData {
  firstName: string;
  email: string;
  discountCode?: string;
}

export function generateWelcomeEmail(data: WelcomeEmailData) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://celestialcrystals-q988pv327-dhruvs-projects-a0ca240a.vercel.app';

  const content = `
    <div class="celestial-header" style="text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; margin: -40px -40px 30px -40px;">
      <div style="color: white; font-size: 32px; font-weight: 300; letter-spacing: 3px; margin-bottom: 10px;">
        ✨ CELESTIAL CRYSTALS ✨
      </div>
      <div style="color: #a0a0ff; font-size: 16px; letter-spacing: 1px;">
        Your Journey to Inner Peace Begins
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${baseUrl}/images/crystals/welcome-banner.jpg" alt="Beautiful Crystal Collection" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    </div>

    <h1 style="color: #1a1a2e; text-align: center; font-size: 28px; margin-bottom: 20px;">
      Welcome to Your Crystal Journey, ${data.firstName}! 🌟
    </h1>

    <p style="font-size: 16px; line-height: 1.8; color: #444; text-align: center; margin-bottom: 30px;">
      Thank you for joining the Celestial Crystals family. We're thrilled to have you on this magical journey of healing, growth, and positive energy.
    </p>

    <div class="discount-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);">
      <h3 style="margin: 0 0 15px 0; font-size: 22px;">🎁 Welcome Gift: 15% Off Your First Order</h3>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 15px 0;">
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin-bottom: 5px;">
          ${data.discountCode || 'WELCOME15'}
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Valid for 30 days from signup
        </div>
      </div>
      <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">
        Use this code at checkout to receive 15% off your first purchase
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
      <div style="text-align: center; padding: 20px; background: #f8f9ff; border-radius: 8px;">
        <div style="font-size: 32px; margin-bottom: 10px;">💎</div>
        <h4 style="color: #1a1a2e; margin: 0 0 10px 0;">Authentic Crystals</h4>
        <p style="color: #666; font-size: 14px; margin: 0;">Each stone is carefully sourced and authenticated for quality</p>
      </div>
      <div style="text-align: center; padding: 20px; background: #f8f9ff; border-radius: 8px;">
        <div style="font-size: 32px; margin-bottom: 10px;">🔮</div>
        <h4 style="color: #1a1a2e; margin: 0 0 10px 0;">Personalized Guidance</h4>
        <p style="color: #666; font-size: 14px; margin: 0;">Find crystals based on your birthdate and spiritual needs</p>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <h3 style="color: #1a1a2e; margin-bottom: 20px;">Start Your Crystal Journey</h3>
      <p style="color: #666; margin-bottom: 25px;">Not sure where to begin? Explore our collection or find your perfect crystal match.</p>

      <div style="margin: 20px 0;">
        <a href="${baseUrl}/crystals" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 500; margin: 5px 10px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          ✨ Explore Collection
        </a>
        <a href="${baseUrl}/" style="display: inline-block; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 500; margin: 5px 10px; box-shadow: 0 4px 15px rgba(26, 26, 46, 0.3);">
          🔍 Find My Match
        </a>
      </div>
    </div>

    <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; margin: 30px 0;">
      <h3 style="color: #1a1a2e; text-align: center; margin-bottom: 20px;">🌙 Crystal Care Essentials</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🌕</div>
          <strong>Cleanse Regularly</strong>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">Use sage, moonlight, or running water</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
          <strong>Set Intentions</strong>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">Focus your energy and goals</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🏠</div>
          <strong>Safe Storage</strong>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">Keep in a clean, sacred space</p>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; color: white;">
      <h3 style="margin: 0 0 15px 0;">We're Here for You ✨</h3>
      <p style="margin: 0 0 20px 0; opacity: 0.9;">
        Questions about crystals, their properties, or your order? Our crystal experts are here to guide you.
      </p>
      <a href="mailto:support@thecelestial.xyz" style="color: #a0a0ff; text-decoration: none; font-weight: 500;">
        support@thecelestial.xyz
      </a>
    </div>

    <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
      <p style="color: #666; font-style: italic; margin-bottom: 10px;">
        "The universe is not only stranger than we imagine, it is stranger than we can imagine." ✨
      </p>
      <p style="color: #1a1a2e; font-weight: 500;">
        With love and light,<br>
        The Celestial Crystals Team 🌟
      </p>
    </div>
  `;

  const html = createEmailTemplate(content, 'Welcome to Celestial Crystals');
  const text = htmlToText(content);

  return {
    subject: `✨ Welcome to Celestial Crystals, ${data.firstName}! Your 15% Welcome Gift Awaits 🎁`,
    html,
    text,
  };
}
