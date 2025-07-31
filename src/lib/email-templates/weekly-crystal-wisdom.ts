import { createEmailTemplate, htmlToText } from '../email';

export interface WeeklyCrystalWisdomData {
  firstName: string;
  email: string;
  weekNumber: number;
}

export function generateWeeklyCrystalWisdomEmail(data: WeeklyCrystalWisdomData) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002';

  const weeklyContent = [
    {
      title: "Crystal Cleansing & Charging Rituals",
      crystal: "Clear Quartz",
      image: "clear-quartz-cleansing.jpg",
      content: `
        <h2 style="color: #4a5568; font-size: 24px; margin-bottom: 20px;">🌙 Weekly Crystal Wisdom: Cleansing & Charging</h2>
        
        <div style="background: linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">Featured Crystal: Clear Quartz - The Master Healer</h3>
          <p style="color: #4a5568; line-height: 1.6;">
            Clear Quartz amplifies energy and thought, as well as the effect of other crystals. It absorbs, stores, releases and regulates energy.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">✨ This Week's Ritual: Full Moon Cleansing</h3>
          <ul style="color: #4a5568; line-height: 1.8; padding-left: 20px;">
            <li>Place your crystals under moonlight for 4-6 hours</li>
            <li>Set intentions while holding your Clear Quartz</li>
            <li>Visualize white light cleansing negative energy</li>
            <li>Store in a sacred space until next use</li>
          </ul>
        </div>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4299e1;">
          <p style="color: #2d3748; font-style: italic; margin: 0;">
            "Crystals are living beings at the beginning of creation." - Nikola Tesla
          </p>
        </div>
      `
    },
    {
      title: "Chakra Balancing with Crystals",
      crystal: "Amethyst",
      image: "amethyst-chakra.jpg",
      content: `
        <h2 style="color: #4a5568; font-size: 24px; margin-bottom: 20px;">🔮 Weekly Crystal Wisdom: Chakra Balancing</h2>
        
        <div style="background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">Featured Crystal: Amethyst - Crown Chakra Activator</h3>
          <p style="color: #4a5568; line-height: 1.6;">
            Amethyst is a powerful and protective stone that enhances spiritual awareness and promotes inner peace and healing.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">🧘‍♀️ This Week's Practice: Crown Chakra Meditation</h3>
          <ul style="color: #4a5568; line-height: 1.8; padding-left: 20px;">
            <li>Hold Amethyst at the top of your head during meditation</li>
            <li>Visualize violet light flowing through your crown</li>
            <li>Repeat: "I am connected to divine wisdom"</li>
            <li>Practice for 10-15 minutes daily</li>
          </ul>
        </div>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #9f7aea;">
          <p style="color: #2d3748; font-style: italic; margin: 0;">
            "The crown chakra is your connection to the universe and divine consciousness."
          </p>
        </div>
      `
    },
    {
      title: "Crystal Grids for Manifestation",
      crystal: "Citrine",
      image: "citrine-grid.jpg",
      content: `
        <h2 style="color: #4a5568; font-size: 24px; margin-bottom: 20px;">⭐ Weekly Crystal Wisdom: Manifestation Grids</h2>
        
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fefcbf 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">Featured Crystal: Citrine - The Merchant's Stone</h3>
          <p style="color: #4a5568; line-height: 1.6;">
            Citrine attracts wealth, prosperity, and success. It imparts joy, wonder, delight and enthusiasm.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">💰 This Week's Grid: Abundance Manifestation</h3>
          <ul style="color: #4a5568; line-height: 1.8; padding-left: 20px;">
            <li>Place Citrine in the center of your grid</li>
            <li>Surround with 6 Clear Quartz points facing inward</li>
            <li>Write your financial goals on paper beneath</li>
            <li>Activate with intention and gratitude</li>
          </ul>
        </div>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #f6ad55;">
          <p style="color: #2d3748; font-style: italic; margin: 0;">
            "Abundance is not something we acquire. It is something we tune into." - Wayne Dyer
          </p>
        </div>
      `
    },
    {
      title: "Protection & Grounding Crystals",
      crystal: "Black Tourmaline",
      image: "black-tourmaline-protection.jpg",
      content: `
        <h2 style="color: #4a5568; font-size: 24px; margin-bottom: 20px;">🛡️ Weekly Crystal Wisdom: Protection & Grounding</h2>
        
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">Featured Crystal: Black Tourmaline - The Protector</h3>
          <p style="color: #4a5568; line-height: 1.6;">
            Black Tourmaline repels and blocks negative energies and psychic attacks. It grounds energy and increases physical vitality.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">🌍 This Week's Practice: Grounding Meditation</h3>
          <ul style="color: #4a5568; line-height: 1.8; padding-left: 20px;">
            <li>Hold Black Tourmaline in your left hand</li>
            <li>Visualize roots growing from your feet into the earth</li>
            <li>Feel the crystal absorbing negative energy</li>
            <li>End with gratitude for protection received</li>
          </ul>
        </div>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4a5568;">
          <p style="color: #2d3748; font-style: italic; margin: 0;">
            "Grounding is not about being stuck. It's about being present and stable in your power."
          </p>
        </div>
      `
    }
  ];

  const currentWeek = weeklyContent[(data.weekNumber - 1) % 4];

  const htmlContent = `
    <div class="celestial-header" style="text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; margin: -40px -40px 30px -40px;">
      <div style="color: white; font-size: 32px; font-weight: 300; letter-spacing: 3px; margin-bottom: 10px;">
        ✨ CELESTIAL CRYSTALS ✨
      </div>
      <div style="color: #a0a0ff; font-size: 16px; letter-spacing: 1px;">
        Weekly Crystal Wisdom - Week ${data.weekNumber}
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${baseUrl}/images/crystals/${currentWeek.image}" alt="${currentWeek.crystal}" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    </div>

    <h1 style="color: #1a1a2e; text-align: center; font-size: 28px; margin-bottom: 20px;">
      Hello ${data.firstName}! 🌟
    </h1>

    ${currentWeek.content}

    <div style="text-align: center; margin: 40px 0;">
      <a href="${baseUrl}/crystals" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
        Explore Our Crystal Collection
      </a>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
      <h3 style="color: #2d3748; margin-bottom: 15px;">🎁 Special Offer This Week</h3>
      <p style="color: #4a5568; margin-bottom: 15px;">Get 15% off all ${currentWeek.crystal} products</p>
      <p style="color: #667eea; font-weight: 600; font-size: 18px;">Use code: WISDOM15</p>
    </div>

    <div style="text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; margin-top: 40px; color: #718096; font-size: 14px;">
      <p>With crystal blessings,<br>The Celestial Crystals Team</p>
      <p style="margin-top: 15px;">
        <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">Visit Our Website</a> | 
        <a href="${baseUrl}/profile" style="color: #667eea; text-decoration: none;">Update Preferences</a>
      </p>
    </div>
  `;

  const html = createEmailTemplate(htmlContent, currentWeek.title);

  return {
    subject: `${currentWeek.title} - Week ${data.weekNumber} Crystal Wisdom`,
    html,
    text: htmlToText(htmlContent)
  };
}
