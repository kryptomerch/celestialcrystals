import { createEmailTemplate, htmlToText } from '../email';

export interface NewsletterData {
  firstName: string;
  weekNumber: number;
  featuredCrystal: {
    name: string;
    description: string;
    properties: string[];
    price: number;
    url: string;
  };
  moonPhase: string;
  crystalTip: string;
  specialOffer?: {
    title: string;
    description: string;
    code: string;
    discount: string;
    expiryDate: string;
  };
}

export function generateNewsletterEmail(data: NewsletterData) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  
  const content = `
    <h1>Your Weekly Crystal Wisdom ✨</h1>
    
    <p>Hello ${data.firstName},</p>
    
    <p>Welcome to week ${data.weekNumber} of your crystal journey! This week, we're exploring the powerful energies of ${data.featuredCrystal.name} and sharing insights to enhance your spiritual practice.</p>
    
    <div class="highlight">
      <h3>🌟 Crystal of the Week: ${data.featuredCrystal.name}</h3>
      <p>${data.featuredCrystal.description}</p>
      <p><strong>Key Properties:</strong> ${data.featuredCrystal.properties.join(', ')}</p>
      <p><strong>Special Price:</strong> ${formatPrice(data.featuredCrystal.price)}</p>
      <a href="${data.featuredCrystal.url}" class="button">Explore ${data.featuredCrystal.name}</a>
    </div>
    
    <h3>🌙 This Week's Moon Phase: ${data.moonPhase}</h3>
    <p>The current moon phase brings unique energies that can enhance your crystal work. Here's how to align your practice:</p>
    
    ${getMoonPhaseGuidance(data.moonPhase)}
    
    <h3>💎 Crystal Tip of the Week</h3>
    <div class="highlight">
      <p>${data.crystalTip}</p>
    </div>
    
    ${data.specialOffer ? `
    <h3>🎁 Exclusive Offer for You</h3>
    <div class="highlight">
      <h4>${data.specialOffer.title}</h4>
      <p>${data.specialOffer.description}</p>
      <p><strong>Use code: ${data.specialOffer.code}</strong> for ${data.specialOffer.discount} off</p>
      <p><em>Valid until ${data.specialOffer.expiryDate}</em></p>
      <a href="${process.env.NEXTAUTH_URL}/crystals" class="button">Shop Now</a>
    </div>
    ` : ''}
    
    <h3>📚 Crystal Knowledge Corner</h3>
    <p>Did you know that crystals have been used for healing and spiritual practices for over 6,000 years? Ancient civilizations like the Egyptians, Greeks, and Chinese all recognized the powerful properties of these natural wonders.</p>
    
    <h3>🧘 Weekly Meditation Practice</h3>
    <p>Try this simple crystal meditation this week:</p>
    <ol>
      <li>Hold your favorite crystal in your hands</li>
      <li>Close your eyes and take three deep breaths</li>
      <li>Set an intention for what you'd like to manifest</li>
      <li>Visualize the crystal's energy flowing through you</li>
      <li>Sit in this energy for 5-10 minutes</li>
    </ol>
    
    <h3>🌟 Customer Spotlight</h3>
    <p><em>"I've been using my Rose Quartz from Celestial Crystals for self-love work, and the transformation has been incredible. Thank you for helping me find the perfect stone!"</em> - Sarah M.</p>
    
    <a href="${process.env.NEXTAUTH_URL}/crystals" class="button">Explore Our Collection</a>
    <a href="${process.env.NEXTAUTH_URL}/crystal-care" class="button" style="background-color: #666; margin-left: 10px;">Crystal Care Guide</a>
    
    <p>Thank you for being part of our crystal community. Your journey of growth and healing inspires us every day.</p>
    
    <p>With love and light,<br>
    The Celestial Crystals Team</p>
    
    <p><small>P.S. Have a crystal question? Simply reply to this email - we love hearing from you!</small></p>
  `;

  const html = createEmailTemplate(content, 'Your Weekly Crystal Wisdom');
  const text = htmlToText(content);

  return {
    subject: `✨ Week ${data.weekNumber}: ${data.featuredCrystal.name} & ${data.moonPhase} Energy`,
    html,
    text,
  };
}

function getMoonPhaseGuidance(moonPhase: string): string {
  const guidance = {
    'New Moon': `
      <p>The New Moon is perfect for setting intentions and beginning new crystal practices. This is an ideal time to:</p>
      <ul>
        <li>Cleanse and charge your crystals</li>
        <li>Set new goals and intentions</li>
        <li>Start a new crystal meditation routine</li>
      </ul>
    `,
    'Waxing Moon': `
      <p>The Waxing Moon supports growth and manifestation. Use this energy to:</p>
      <ul>
        <li>Focus on abundance and prosperity crystals</li>
        <li>Work on personal growth and development</li>
        <li>Amplify your crystal's manifesting power</li>
      </ul>
    `,
    'Full Moon': `
      <p>The Full Moon brings powerful energy for charging crystals and releasing what no longer serves you:</p>
      <ul>
        <li>Place crystals under moonlight to charge</li>
        <li>Practice gratitude and release ceremonies</li>
        <li>Use protective stones for emotional balance</li>
      </ul>
    `,
    'Waning Moon': `
      <p>The Waning Moon is ideal for releasing, cleansing, and letting go:</p>
      <ul>
        <li>Cleanse crystals of negative energy</li>
        <li>Release old patterns and habits</li>
        <li>Focus on grounding and protective stones</li>
      </ul>
    `,
  };

  return guidance[moonPhase as keyof typeof guidance] || guidance['New Moon'];
}
