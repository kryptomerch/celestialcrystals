import { createEmailTemplate, htmlToText } from '../email';

export interface DiscountVoucherData {
  firstName: string;
  discountCode: string;
  discountPercentage: number;
  expiryDate: string;
  reason: 'birthday' | 'loyalty' | 'winback' | 'seasonal' | 'first-time';
  minOrderAmount?: number;
}

export function generateDiscountVoucherEmail(data: DiscountVoucherData) {
  const { title, subtitle, description } = getDiscountContent(data.reason, data.discountPercentage);
  
  const content = `
    <h1>${title} ✨</h1>
    
    <p>Dear ${data.firstName},</p>
    
    <p>${subtitle}</p>
    
    <div class="highlight" style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; border: none;">
      <h2 style="color: white; margin: 0 0 10px 0; font-size: 32px;">${data.discountPercentage}% OFF</h2>
      <p style="color: white; margin: 0 0 15px 0; font-size: 18px;">Your Exclusive Discount Code</p>
      <div style="background: white; color: #333; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 15px 0;">
        ${data.discountCode}
      </div>
      <p style="color: white; margin: 0; font-size: 14px;">Valid until ${data.expiryDate}</p>
      ${data.minOrderAmount ? `<p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Minimum order: $${data.minOrderAmount}</p>` : ''}
    </div>
    
    <p>${description}</p>
    
    <h3>✨ Perfect Time to Explore</h3>
    <ul>
      <li><strong>New Arrivals:</strong> Fresh crystals with powerful healing properties</li>
      <li><strong>Bestsellers:</strong> Customer favorites for love, protection, and abundance</li>
      <li><strong>Crystal Sets:</strong> Curated collections for specific intentions</li>
      <li><strong>Rare Finds:</strong> Unique stones for the serious collector</li>
    </ul>
    
    ${getSeasonalRecommendations(data.reason)}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXTAUTH_URL}/crystals" class="button" style="font-size: 18px; padding: 15px 30px;">Shop Now & Save ${data.discountPercentage}%</a>
    </div>
    
    <h3>🎁 Why Our Customers Love Us</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
      <div>
        <h4>⭐ Authentic Quality</h4>
        <p>Every crystal is hand-selected and verified for authenticity</p>
      </div>
      <div>
        <h4>🚚 Fast Shipping</h4>
        <p>Free shipping on orders over $50, delivered with care</p>
      </div>
      <div>
        <h4>💝 Expert Guidance</h4>
        <p>Detailed information and personalized recommendations</p>
      </div>
      <div>
        <h4>🌟 Satisfaction Guaranteed</h4>
        <p>30-day return policy for your peace of mind</p>
      </div>
    </div>
    
    <div class="highlight">
      <h3>💡 Crystal Tip</h3>
      <p>When you receive your new crystals, take a moment to cleanse them and set your intentions. This helps align their energy with your personal goals and desires.</p>
    </div>
    
    <p>Don't wait too long - this exclusive offer expires on ${data.expiryDate}. Treat yourself to the healing power of crystals today!</p>
    
    <p>With love and crystal blessings,<br>
    The Celestial Crystals Team</p>
    
    <p><small>Use code <strong>${data.discountCode}</strong> at checkout. Cannot be combined with other offers. ${data.minOrderAmount ? `Minimum order $${data.minOrderAmount}.` : ''} Valid until ${data.expiryDate}.</small></p>
  `;

  const html = createEmailTemplate(content, title);
  const text = htmlToText(content);

  return {
    subject: `🎁 ${data.discountPercentage}% OFF Just for You, ${data.firstName}! (Code: ${data.discountCode})`,
    html,
    text,
  };
}

function getDiscountContent(reason: string, percentage: number) {
  const contents = {
    birthday: {
      title: `Happy Birthday, Crystal Soul! 🎂`,
      subtitle: `It's your special day, and we want to celebrate with you! As a gift, enjoy ${percentage}% off your next crystal purchase.`,
      description: `Birthdays are perfect for setting new intentions and welcoming fresh energy into your life. What better way to celebrate than with crystals that support your journey ahead?`
    },
    loyalty: {
      title: `Thank You for Your Loyalty! 🙏`,
      subtitle: `You're one of our most valued customers, and we want to show our appreciation with an exclusive ${percentage}% discount.`,
      description: `Your continued trust in Celestial Crystals means the world to us. This special offer is our way of saying thank you for being part of our crystal family.`
    },
    winback: {
      title: `We Miss You! Come Back to Your Crystal Journey 💎`,
      subtitle: `It's been a while since your last visit, and we'd love to welcome you back with ${percentage}% off your next order.`,
      description: `Your crystal journey doesn't have to pause. Whether you're looking to expand your collection or find new stones for your current path, we're here to support you.`
    },
    seasonal: {
      title: `Seasonal Crystal Sale! 🌟`,
      subtitle: `Embrace the energy of the season with ${percentage}% off our entire collection.`,
      description: `Each season brings unique energies and opportunities for growth. Discover crystals that align with this time of year and support your seasonal intentions.`
    },
    'first-time': {
      title: `Welcome! Your First-Time Buyer Discount 🎁`,
      subtitle: `Thank you for choosing Celestial Crystals! Enjoy ${percentage}% off your first purchase.`,
      description: `Starting your crystal journey is exciting! This discount helps you explore our collection and find the perfect stones to begin your healing and manifestation practice.`
    }
  };

  return contents[reason as keyof typeof contents] || contents['first-time'];
}

function getSeasonalRecommendations(reason: string): string {
  const currentMonth = new Date().getMonth();
  
  if (currentMonth >= 2 && currentMonth <= 4) { // Spring
    return `
      <h3>🌸 Spring Energy Crystals</h3>
      <p>Perfect for new beginnings and growth:</p>
      <ul>
        <li><strong>Green Aventurine</strong> - For new opportunities and luck</li>
        <li><strong>Rose Quartz</strong> - For self-love and emotional healing</li>
        <li><strong>Clear Quartz</strong> - For clarity and amplifying intentions</li>
      </ul>
    `;
  } else if (currentMonth >= 5 && currentMonth <= 7) { // Summer
    return `
      <h3>☀️ Summer Vitality Crystals</h3>
      <p>Embrace the vibrant energy of summer:</p>
      <ul>
        <li><strong>Citrine</strong> - For joy, abundance, and solar energy</li>
        <li><strong>Carnelian</strong> - For confidence and creative expression</li>
        <li><strong>Sunstone</strong> - For optimism and personal power</li>
      </ul>
    `;
  } else if (currentMonth >= 8 && currentMonth <= 10) { // Fall
    return `
      <h3>🍂 Autumn Grounding Crystals</h3>
      <p>Perfect for harvest energy and preparation:</p>
      <ul>
        <li><strong>Smoky Quartz</strong> - For grounding and protection</li>
        <li><strong>Tiger's Eye</strong> - For focus and determination</li>
        <li><strong>Garnet</strong> - For strength and perseverance</li>
      </ul>
    `;
  } else { // Winter
    return `
      <h3>❄️ Winter Reflection Crystals</h3>
      <p>Ideal for introspection and inner wisdom:</p>
      <ul>
        <li><strong>Amethyst</strong> - For spiritual growth and intuition</li>
        <li><strong>Labradorite</strong> - For transformation and magic</li>
        <li><strong>Black Tourmaline</strong> - For protection and grounding</li>
      </ul>
    `;
  }
}
