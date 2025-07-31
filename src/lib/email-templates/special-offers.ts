import { createEmailTemplate, htmlToText } from '../email';

export interface SpecialOffersData {
  firstName: string;
  email: string;
  offerType: 'flash-sale' | 'new-arrivals' | 'seasonal' | 'birthday';
}

export function generateSpecialOffersEmail(data: SpecialOffersData) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002';

  const offers = {
    'flash-sale': {
      title: "⚡ 48-Hour Flash Sale",
      subtitle: "Limited Time Crystal Magic",
      discount: "30% OFF",
      code: "FLASH30",
      urgency: "Only 48 hours left!",
      products: [
        { name: "Amethyst Cluster", price: "$45", salePrice: "$31.50", image: "amethyst-cluster.jpg" },
        { name: "Rose Quartz Heart", price: "$25", salePrice: "$17.50", image: "rose-quartz-heart.jpg" },
        { name: "Clear Quartz Point", price: "$35", salePrice: "$24.50", image: "clear-quartz-point.jpg" }
      ],
      content: `
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px;">⚡ FLASH SALE ALERT ⚡</h2>
          <p style="margin: 10px 0 0 0; font-size: 18px;">30% OFF Everything - 48 Hours Only!</p>
        </div>
      `
    },
    'new-arrivals': {
      title: "✨ New Crystal Arrivals",
      subtitle: "Fresh Energy, New Possibilities",
      discount: "20% OFF",
      code: "NEWARRIVAL20",
      urgency: "Be the first to experience their energy",
      products: [
        { name: "Labradorite Palm Stone", price: "$40", salePrice: "$32", image: "labradorite-palm.jpg" },
        { name: "Moonstone Bracelet", price: "$55", salePrice: "$44", image: "moonstone-bracelet.jpg" },
        { name: "Selenite Tower", price: "$30", salePrice: "$24", image: "selenite-tower.jpg" }
      ],
      content: `
        <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px;">✨ NEW ARRIVALS ✨</h2>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Fresh crystals with powerful new energy</p>
        </div>
      `
    },
    'seasonal': {
      title: "🍂 Autumn Crystal Collection",
      subtitle: "Grounding Energy for the Season",
      discount: "25% OFF",
      code: "AUTUMN25",
      urgency: "Perfect for seasonal transitions",
      products: [
        { name: "Smoky Quartz Cluster", price: "$50", salePrice: "$37.50", image: "smoky-quartz-cluster.jpg" },
        { name: "Tiger's Eye Bracelet", price: "$35", salePrice: "$26.25", image: "tigers-eye-bracelet.jpg" },
        { name: "Carnelian Tumbled Set", price: "$28", salePrice: "$21", image: "carnelian-set.jpg" }
      ],
      content: `
        <div style="background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px;">🍂 AUTUMN COLLECTION 🍂</h2>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Grounding crystals for seasonal balance</p>
        </div>
      `
    },
    'birthday': {
      title: "🎂 Happy Birthday Crystal Blessing",
      subtitle: "A Special Gift Just for You",
      discount: "Birthday 40% OFF",
      code: "BIRTHDAY40",
      urgency: "Valid for 7 days from your birthday",
      products: [
        { name: "Birthstone Collection", price: "$60", salePrice: "$36", image: "birthstone-collection.jpg" },
        { name: "Personal Power Set", price: "$45", salePrice: "$27", image: "power-crystal-set.jpg" },
        { name: "Chakra Balancing Kit", price: "$75", salePrice: "$45", image: "chakra-kit.jpg" }
      ],
      content: `
        <div style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px;">🎂 HAPPY BIRTHDAY! 🎂</h2>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Your special crystal blessing awaits</p>
        </div>
      `
    }
  };

  const currentOffer = offers[data.offerType];

  const htmlContent = `
    <div class="celestial-header" style="text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; margin: -40px -40px 30px -40px;">
      <div style="color: white; font-size: 32px; font-weight: 300; letter-spacing: 3px; margin-bottom: 10px;">
        ✨ CELESTIAL CRYSTALS ✨
      </div>
      <div style="color: #a0a0ff; font-size: 16px; letter-spacing: 1px;">
        ${currentOffer.subtitle}
      </div>
    </div>

    <h1 style="color: #1a1a2e; text-align: center; font-size: 28px; margin-bottom: 20px;">
      Hello ${data.firstName}! 🌟
    </h1>

    ${currentOffer.content}

    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 40px; border-radius: 50px; font-size: 24px; font-weight: bold; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);">
        ${currentOffer.discount}
      </div>
      <p style="color: #4a5568; margin: 15px 0 5px 0; font-size: 18px;">Use code:</p>
      <p style="color: #667eea; font-weight: 700; font-size: 24px; margin: 0; letter-spacing: 2px;">${currentOffer.code}</p>
      <p style="color: #e53e3e; font-weight: 600; margin: 10px 0 0 0;">${currentOffer.urgency}</p>
    </div>

    <div style="margin: 40px 0;">
      <h3 style="color: #2d3748; text-align: center; margin-bottom: 25px;">Featured Products</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        ${currentOffer.products.map(product => `
          <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 200px;">
            <img src="${baseUrl}/images/crystals/${product.image}" alt="${product.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" />
            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px;">${product.name}</h4>
            <p style="color: #718096; text-decoration: line-through; margin: 0; font-size: 14px;">${product.price}</p>
            <p style="color: #e53e3e; font-weight: bold; margin: 5px 0 0 0; font-size: 18px;">${product.salePrice}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${baseUrl}/crystals" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 18px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
        Shop Now & Save ${currentOffer.discount}
      </a>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
      <h3 style="color: #2d3748; margin-bottom: 15px;">💎 Why Choose Our Crystals?</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-top: 20px;">
        <div style="text-align: center; max-width: 150px;">
          <div style="font-size: 24px; margin-bottom: 10px;">🌟</div>
          <p style="color: #4a5568; margin: 0; font-size: 14px;">Ethically Sourced</p>
        </div>
        <div style="text-align: center; max-width: 150px;">
          <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
          <p style="color: #4a5568; margin: 0; font-size: 14px;">Energy Cleansed</p>
        </div>
        <div style="text-align: center; max-width: 150px;">
          <div style="font-size: 24px; margin-bottom: 10px;">📦</div>
          <p style="color: #4a5568; margin: 0; font-size: 14px;">Fast Shipping</p>
        </div>
      </div>
    </div>

    <div style="text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; margin-top: 40px; color: #718096; font-size: 14px;">
      <p>Sending you crystal blessings,<br>The Celestial Crystals Team</p>
      <p style="margin-top: 15px;">
        <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">Visit Our Website</a> | 
        <a href="${baseUrl}/profile" style="color: #667eea; text-decoration: none;">Update Preferences</a>
      </p>
    </div>
  `;

  const html = createEmailTemplate(htmlContent, currentOffer.title);

  return {
    subject: `${currentOffer.title} - ${currentOffer.discount} Off Everything!`,
    html,
    text: htmlToText(htmlContent)
  };
}
