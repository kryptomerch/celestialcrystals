import { NextRequest, NextResponse } from 'next/server';

// Fallback AI responses when DeepSeek API is not available
const fallbackResponses = {
  blog_generation: {
    title: "Crystal Healing: A Complete Guide to Spiritual Wellness",
    content: `# Crystal Healing: A Complete Guide to Spiritual Wellness

## Introduction
Crystal healing is an ancient practice that harnesses the natural energy of crystals to promote physical, emotional, and spiritual well-being. Each crystal carries unique vibrational frequencies that can help balance and align your energy centers.

## Popular Healing Crystals

### Amethyst - The Stone of Spiritual Wisdom
Amethyst is renowned for its ability to enhance spiritual awareness and promote inner peace. This beautiful purple crystal helps:
- Calm the mind and reduce stress
- Enhance meditation and spiritual practices
- Protect against negative energies
- Improve sleep quality and dream recall

### Rose Quartz - The Love Stone
Known as the stone of unconditional love, Rose Quartz opens the heart chakra and promotes:
- Self-love and acceptance
- Emotional healing and forgiveness
- Attracting love and relationships
- Compassion and empathy

### Clear Quartz - The Master Healer
Clear Quartz is the most versatile healing crystal, known for:
- Amplifying energy and intentions
- Cleansing and purifying other crystals
- Enhancing clarity and focus
- Supporting overall healing and balance

## How to Use Crystals

### Meditation
Hold your chosen crystal during meditation to enhance your practice and connect with its energy.

### Jewelry
Wearing crystal jewelry keeps the healing energy close to your body throughout the day.

### Home Placement
Place crystals in your living space to create a harmonious and positive environment.

## Conclusion
Crystal healing offers a natural and gentle way to support your wellness journey. Start with one or two crystals that resonate with you and gradually build your collection as you explore this fascinating practice.`,
    excerpt: "Discover the ancient art of crystal healing and learn how these powerful stones can enhance your spiritual wellness and daily life.",
    tags: ["crystal healing", "spiritual wellness", "meditation", "energy healing", "holistic health"],
    category: "Crystal Healing"
  },

  product_description: `This exquisite crystal bracelet is carefully crafted with premium quality stones, each selected for their unique healing properties and natural beauty. 

**Healing Properties:**
- Promotes emotional balance and inner peace
- Enhances spiritual awareness and intuition
- Provides protection against negative energies
- Supports physical and emotional healing

**Quality & Craftsmanship:**
Each bracelet is handcrafted with attention to detail, featuring genuine crystals that have been cleansed and energized. The elastic cord ensures a comfortable fit for most wrist sizes.

**Care Instructions:**
To maintain your bracelet's energy, cleanse it regularly under running water or place it on a selenite charging plate overnight.

**Why Choose This Crystal:**
This powerful stone has been used for centuries by healers and spiritual practitioners. Its gentle yet effective energy makes it perfect for both beginners and experienced crystal enthusiasts.

Add this beautiful piece to your crystal collection and experience the transformative power of natural healing energy.`,

  email_content: {
    subject: "Welcome to Celestial Crystals - Your Spiritual Journey Begins",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6B46C1;">Welcome to Celestial Crystals! ✨</h2>
      
      <p>Dear Crystal Enthusiast,</p>
      
      <p>Thank you for joining our spiritual community! We're thrilled to have you on this journey of healing, growth, and transformation.</p>
      
      <h3 style="color: #6B46C1;">What's Next?</h3>
      <ul>
        <li>🔮 Explore our curated collection of healing crystals</li>
        <li>📚 Read our blog for crystal wisdom and spiritual insights</li>
        <li>💎 Discover which crystals align with your energy</li>
        <li>🌟 Join our community of like-minded souls</li>
      </ul>
      
      <h3 style="color: #6B46C1;">Crystal Care Tips</h3>
      <p>Remember to cleanse your new crystals before first use. You can:</p>
      <ul>
        <li>Rinse them under running water</li>
        <li>Place them in moonlight overnight</li>
        <li>Use sage or palo santo smoke</li>
      </ul>
      
      <p>Wishing you love, light, and crystal magic!</p>
      
      <p>With gratitude,<br>
      The Celestial Crystals Team</p>
    </div>`
  },

  general_chat: [
    "Crystal healing is a beautiful practice that can enhance your spiritual journey. Each crystal has unique properties that can support different aspects of your life.",
    "I'd be happy to help you learn about crystals! What specific area are you interested in - healing properties, meditation, or choosing the right crystal for you?",
    "Crystals work by resonating with your body's natural energy field. They can help balance your chakras, promote healing, and enhance your spiritual practices.",
    "For beginners, I recommend starting with Clear Quartz (the master healer), Amethyst (for spiritual growth), and Rose Quartz (for love and emotional healing).",
    "The best way to choose a crystal is to trust your intuition. You'll often feel drawn to the crystals that can help you most at any given time."
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { message, type = 'general_chat' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let response: any;

    switch (type) {
      case 'blog_generation':
        response = fallbackResponses.blog_generation;
        break;

      case 'product_description':
        response = { description: fallbackResponses.product_description };
        break;

      case 'email_content':
        response = fallbackResponses.email_content;
        break;

      case 'general_chat':
      default:
        const randomIndex = Math.floor(Math.random() * fallbackResponses.general_chat.length);
        response = fallbackResponses.general_chat[randomIndex];
        break;
    }

    return NextResponse.json({
      success: true,
      response,
      type,
      note: "This is a fallback response. Configure DEEPSEEK_API_KEY for AI-generated content."
    });

  } catch (error) {
    console.error('Fallback AI error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Fallback AI Chat API is active',
    note: 'This provides pre-written responses when DeepSeek API is not configured',
    availableTypes: [
      'general_chat',
      'blog_generation', 
      'product_description',
      'email_content'
    ]
  });
}
