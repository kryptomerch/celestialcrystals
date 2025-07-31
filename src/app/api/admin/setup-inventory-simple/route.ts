import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a new Prisma client with explicit connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6h1jKNvgDCVE@ep-divine-sunset-ad5sal24-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

// GET method for testing in browser
export async function GET() {
  return NextResponse.json({
    message: 'Inventory Setup API',
    usage: 'Send POST request to this endpoint to setup your 21 crystal bracelets',
    method: 'POST',
    endpoint: '/api/admin/setup-inventory-simple'
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Setting up real inventory database...');
    console.log('Environment check:', {
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing',
      nodeEnv: process.env.NODE_ENV
    });

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');

      // Test a simple query
      const testCount = await prisma.user.count();
      console.log(`📊 Current users in database: ${testCount}`);

    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
          databaseUrl: process.env.DATABASE_URL ? 'Environment variable set' : 'Missing DATABASE_URL'
        },
        { status: 500 }
      );
    }

    // Your ACTUAL 21 different crystal bracelets with correct quantities
    const realInventory = [
      // 1. Triple Protection Bracelets (15 pieces)
      {
        id: 'triple-protection-1',
        name: 'Triple Protection Bracelet - Tiger Eye, Black Obsidian & Hematite',
        description: 'A powerful combination of three protective stones that create a shield against negative energies while promoting courage, confidence, and grounding.',
        quantity: 15,
        price: 35,
        category: 'Protection',
        chakra: 'Root',
        element: 'Earth',
        rarity: 'Common',
        properties: ['Protection', 'Grounding', 'Courage', 'Confidence', 'Stability'],
        colors: ['Golden', 'Black', 'Metallic Gray'],
        image: '/images/TRIPLE PROTECTION /TP1.png',
        images: [
          '/images/TRIPLE PROTECTION /TP1.png',
          '/images/TRIPLE PROTECTION /TP2.png',
          '/images/TRIPLE PROTECTION /TP3.png',
          '/images/TRIPLE PROTECTION /TP4.png'
        ]
      },

      // 2. Blue Aquamarine Bracelets (5 pieces)
      {
        id: 'blue-aquamarine-1',
        name: 'Blue Aquamarine Bracelet',
        description: 'Known as the stone of courage and communication, this beautiful blue crystal enhances clarity of thought and promotes peaceful energy.',
        quantity: 5,
        price: 45,
        category: 'Communication',
        chakra: 'Throat',
        element: 'Water',
        rarity: 'Uncommon',
        properties: ['Communication', 'Courage', 'Tranquility', 'Emotional Healing', 'Clarity'],
        colors: ['Light Blue', 'Blue-Green', 'Teal'],
        image: '/images/crystals/AQUAMARINE/AQ1.png',
        images: [
          '/images/crystals/AQUAMARINE/AQ1.png',
          '/images/crystals/AQUAMARINE/AQ2.png',
          '/images/crystals/AQUAMARINE/AQ3.png',
          '/images/crystals/AQUAMARINE/AQ4.png'
        ]
      },

      // 3. Lava 7 Chakra Bracelets (20 pieces)
      {
        id: 'lava-chakra-1',
        name: 'Lava 7 Chakra Bracelet',
        description: 'A complete chakra healing bracelet featuring lava stone and seven chakra crystals to balance and align all energy centers in your body.',
        quantity: 20,
        price: 42,
        category: 'Chakra Healing',
        chakra: 'All Chakras',
        element: 'Fire',
        rarity: 'Common',
        properties: ['Balance', 'Alignment', 'Energy Flow', 'Grounding', 'Healing'],
        colors: ['Multi-colored', 'Black', 'Rainbow'],
        image: '/images/crystals/7 CHAKRA/LV1.png',
        images: [
          '/images/crystals/7 CHAKRA/LV1.png',
          '/images/crystals/7 CHAKRA/LV2.png',
          '/images/crystals/7 CHAKRA/LV3.png',
          '/images/crystals/7 CHAKRA/LV4.png'
        ]
      },

      // 4. Tiger Eye Bracelets (5 pieces)
      {
        id: 'tiger-eye-1',
        name: 'Tiger Eye Bracelet',
        quantity: 5,
        price: 32,
        category: 'Protection',
        chakra: 'Solar Plexus',
        element: 'Earth',
        properties: ['Protection', 'Grounding', 'Confidence', 'Mental Clarity', 'Courage'],
        colors: ['Golden', 'Brown', 'Black'],
        image: '/images/crystals/TIGER EYE/TG1.png',
        images: [
          '/images/crystals/TIGER EYE/TG1.png',
          '/images/crystals/TIGER EYE/TG2.png',
          '/images/crystals/TIGER EYE/TG3.png',
          '/images/crystals/TIGER EYE/TG4.png'
        ]
      },

      // 5. Howlite Bracelets (5 pieces)
      {
        id: 'howlite-1',
        name: 'Howlite Bracelet',
        quantity: 5,
        price: 28,
        category: 'Calming',
        chakra: 'Crown',
        element: 'Air',
        properties: ['Calming', 'Patience', 'Stress Relief', 'Sleep', 'Awareness'],
        colors: ['White', 'Gray'],
        image: '/images/crystals/HOWLITE/HW1.png',
        images: [
          '/images/crystals/HOWLITE/HW1.png',
          '/images/crystals/HOWLITE/HW2.png',
          '/images/crystals/HOWLITE/HW3.png',
          '/images/crystals/HOWLITE/HW4.png'
        ]
      },

      // 6. Rhodochrosite Bracelets (5 pieces)
      {
        id: 'rhodochrosite-1',
        name: 'Rhodochrosite Bracelet',
        quantity: 5,
        price: 48,
        category: 'Love',
        chakra: 'Heart',
        element: 'Fire',
        properties: ['Self Love', 'Emotional Healing', 'Compassion', 'Joy', 'Creativity'],
        colors: ['Pink', 'Rose', 'Red'],
        image: '/images/crystals/RHODOCHROSITE/RH1.png',
        images: [
          '/images/crystals/RHODOCHROSITE/RH1.png',
          '/images/crystals/RHODOCHROSITE/RH2.png',
          '/images/crystals/RHODOCHROSITE/RH3.png',
          '/images/crystals/RHODOCHROSITE/RH4.png'
        ]
      },

      // 7. Citrine Bracelets (10 pieces)
      {
        id: 'citrine-1',
        name: 'Citrine Bracelet',
        quantity: 10,
        price: 38,
        category: 'Abundance',
        chakra: 'Solar Plexus',
        element: 'Fire',
        properties: ['Abundance', 'Prosperity', 'Success', 'Confidence', 'Creativity'],
        colors: ['Yellow', 'Golden', 'Orange'],
        image: '/images/crystals/CITRINE/CI1.png',
        images: [
          '/images/crystals/CITRINE/CI1.png',
          '/images/crystals/CITRINE/CI2.png',
          '/images/crystals/CITRINE/CI3.png',
          '/images/crystals/CITRINE/CI4.png'
        ]
      },

      // 8. Tree Agate Bracelets (5 pieces)
      {
        id: 'tree-agate-1',
        name: 'Tree Agate Bracelet',
        quantity: 5,
        price: 30,
        category: 'Grounding',
        chakra: 'Heart',
        element: 'Earth',
        properties: ['Grounding', 'Nature Connection', 'Growth', 'Stability', 'Inner Peace'],
        colors: ['Green', 'White', 'Clear'],
        image: '/images/crystals/TREE AGATE/TG1.png',
        images: [
          '/images/crystals/TREE AGATE/TG1.png',
          '/images/crystals/TREE AGATE/TG2.png',
          '/images/crystals/TREE AGATE/TG3.png',
          '/images/crystals/TREE AGATE/TG4.png'
        ]
      },

      // 9. Rose Amethyst Clear Quartz Bracelet (5 pieces)
      {
        id: 'rose-amethyst-quartz-1',
        name: 'Rose Amethyst Clear Quartz Bracelet',
        quantity: 5,
        price: 44,
        category: 'Healing',
        chakra: 'Heart',
        element: 'Air',
        properties: ['Love', 'Healing', 'Clarity', 'Amplification', 'Emotional Balance'],
        colors: ['Pink', 'Purple', 'Clear'],
        image: '/images/ROSE AMETHYST CLEAR/RA1.png',
        images: [
          '/images/ROSE AMETHYST CLEAR/RA1.png',
          '/images/ROSE AMETHYST CLEAR/RA2.png',
          '/images/ROSE AMETHYST CLEAR/RA3.png',
          '/images/ROSE AMETHYST CLEAR/RA4.png'
        ]
      },

      // 10. Turquoise Bracelets (5 pieces)
      {
        id: 'turquoise-1',
        name: 'Turquoise Bracelet',
        quantity: 5,
        price: 40,
        category: 'Communication',
        chakra: 'Throat',
        element: 'Earth',
        properties: ['Protection', 'Communication', 'Wisdom', 'Healing', 'Travel Protection'],
        colors: ['Turquoise', 'Blue-Green', 'Blue'],
        image: '/images/crystals/TURQUOISE/TU1.png',
        images: [
          '/images/crystals/TURQUOISE/TU1.png',
          '/images/crystals/TURQUOISE/TU2.png',
          '/images/crystals/TURQUOISE/TU3.png',
          '/images/crystals/TURQUOISE/TU4.png'
        ]
      },

      // 11. Green Jade Bracelets (5 pieces)
      {
        id: 'green-jade-1',
        name: 'Green Jade Bracelet',
        quantity: 5,
        price: 36,
        category: 'Prosperity',
        chakra: 'Heart',
        element: 'Earth',
        properties: ['Prosperity', 'Luck', 'Harmony', 'Protection', 'Wisdom'],
        colors: ['Green', 'Dark Green'],
        image: '/images/crystals/GREEN JADE/GJ1.png',
        images: [
          '/images/crystals/GREEN JADE/GJ1.png',
          '/images/crystals/GREEN JADE/GJ2.png',
          '/images/crystals/GREEN JADE/GJ3.png',
          '/images/crystals/GREEN JADE/GJ4.png'
        ]
      },

      // 12. Green Aquamarine Bracelets (5 pieces)
      {
        id: 'green-aquamarine-1',
        name: 'Green Aquamarine Bracelet',
        quantity: 5,
        price: 46,
        category: 'Communication',
        chakra: 'Heart',
        element: 'Water',
        properties: ['Communication', 'Emotional Healing', 'Courage', 'Clarity', 'Tranquility'],
        colors: ['Green', 'Blue-Green', 'Mint'],
        image: '/images/crystals/GREEN AQUAMARINE/GW1.png',
        images: [
          '/images/crystals/GREEN AQUAMARINE/GW1.png',
          '/images/crystals/GREEN AQUAMARINE/GW2.png',
          '/images/crystals/GREEN AQUAMARINE/GW3.png',
          '/images/crystals/GREEN AQUAMARINE/GW4.png'
        ]
      },

      // 13. Moonstone Bracelets (12 pieces)
      {
        id: 'moonstone-1',
        name: 'Moonstone Bracelet',
        quantity: 12,
        price: 42,
        category: 'Intuition',
        chakra: 'Third Eye',
        element: 'Water',
        properties: ['Intuition', 'Feminine Energy', 'New Beginnings', 'Emotional Balance', 'Cycles'],
        colors: ['White', 'Cream', 'Gray', 'Peach'],
        image: '/images/crystals/MOONSTONE/MO1.png',
        images: [
          '/images/crystals/MOONSTONE/MO1.png',
          '/images/crystals/MOONSTONE/MO2.png',
          '/images/crystals/MOONSTONE/MO3.png',
          '/images/crystals/MOONSTONE/MO4.png'
        ]
      },

      // 14. Blue Apatite Bracelets (9 pieces)
      {
        id: 'blue-apatite-1',
        name: 'Blue Apatite Bracelet',
        quantity: 9,
        price: 34,
        category: 'Communication',
        chakra: 'Throat',
        element: 'Air',
        properties: ['Communication', 'Motivation', 'Learning', 'Clarity', 'Inspiration'],
        colors: ['Blue', 'Teal', 'Blue-Green'],
        image: '/images/crystals/BLUE APATITE/BA1.png',
        images: [
          '/images/crystals/BLUE APATITE/BA1.png',
          '/images/crystals/BLUE APATITE/BA2.png',
          '/images/crystals/BLUE APATITE/BA3.png',
          '/images/crystals/BLUE APATITE/BA4.png'
        ]
      },

      // 15. Rose Bracelets (8 pieces)
      {
        id: 'rose-quartz-1',
        name: 'Rose Quartz Bracelet',
        quantity: 8,
        price: 32,
        category: 'Love',
        chakra: 'Heart',
        element: 'Earth',
        properties: ['Love', 'Self Love', 'Emotional Healing', 'Compassion', 'Forgiveness'],
        colors: ['Pink', 'Rose', 'Light Pink'],
        image: '/images/crystals/ROSE/ro1.png',
        images: [
          '/images/crystals/ROSE/ro1.png',
          '/images/crystals/ROSE/RO2.png',
          '/images/crystals/ROSE/RO3.png',
          '/images/crystals/ROSE/RO4.png'
        ]
      },

      // 16. Lapis Bracelets (5 pieces)
      {
        id: 'lapis-lazuli-1',
        name: 'Lapis Lazuli Bracelet',
        quantity: 5,
        price: 38,
        category: 'Wisdom',
        chakra: 'Third Eye',
        element: 'Air',
        properties: ['Wisdom', 'Truth', 'Communication', 'Inner Vision', 'Royalty'],
        colors: ['Deep Blue', 'Gold Flecks'],
        image: '/images/crystals/LAPIS LAZULI/LL1.png',
        images: [
          '/images/crystals/LAPIS LAZULI/LL1.png',
          '/images/crystals/LAPIS LAZULI/LL2.png',
          '/images/crystals/LAPIS LAZULI/LL3.png',
          '/images/crystals/LAPIS LAZULI/LL4.png'
        ]
      },

      // 17. Selenite Bracelets (5 pieces)
      {
        id: 'selenite-1',
        name: 'Selenite Bracelet',
        quantity: 5,
        price: 26,
        category: 'Cleansing',
        chakra: 'Crown',
        element: 'Air',
        properties: ['Cleansing', 'Purification', 'High Vibration', 'Clarity', 'Divine Connection'],
        colors: ['White', 'Clear', 'Translucent'],
        image: '/images/crystals/SELENITE/SL1.png',
        images: [
          '/images/crystals/SELENITE/SL1.png',
          '/images/crystals/SELENITE/SL2.png',
          '/images/crystals/SELENITE/SL3.png',
          '/images/crystals/SELENITE/SL4.png'
        ]
      },

      // 18. Magnet Bracelet (5 pieces)
      {
        id: 'magnetic-hematite-1',
        name: 'Magnetic Hematite Bracelet',
        quantity: 5,
        price: 24,
        category: 'Grounding',
        chakra: 'Root',
        element: 'Earth',
        properties: ['Grounding', 'Protection', 'Focus', 'Strength', 'Magnetic Healing'],
        colors: ['Black', 'Metallic', 'Silver'],
        image: '/images/crystals/HEALTH MAGNET BRACELET/HM1.png',
        images: [
          '/images/crystals/HEALTH MAGNET BRACELET/HM1.png',
          '/images/crystals/HEALTH MAGNET BRACELET/HM2.png',
          '/images/crystals/HEALTH MAGNET BRACELET/HM3.png',
          '/images/crystals/HEALTH MAGNET BRACELET/HM4.png'
        ]
      },

      // 19. Money Magnet Bracelet (25 pieces)
      {
        id: 'money-magnet-1',
        name: 'Money Magnet Bracelet - Citrine & Pyrite',
        quantity: 25,
        price: 45,
        category: 'Abundance',
        chakra: 'Solar Plexus',
        element: 'Fire',
        properties: ['Abundance', 'Wealth', 'Prosperity', 'Success', 'Manifestation'],
        colors: ['Golden', 'Yellow', 'Metallic'],
        image: '/images/MONEY MAGNET/MM1.png',
        images: [
          '/images/MONEY MAGNET/MM1.png',
          '/images/MONEY MAGNET/MM2.png',
          '/images/MONEY MAGNET/MM3.png',
          '/images/MONEY MAGNET/MM4.png'
        ]
      },

      // 20. Amethyst Bracelet (10 pieces)
      {
        id: 'amethyst-1',
        name: 'Amethyst Bracelet',
        quantity: 10,
        price: 34,
        category: 'Spiritual Protection',
        chakra: 'Third Eye',
        element: 'Air',
        properties: ['Spiritual Protection', 'Intuition', 'Clarity', 'Purification', 'Calm'],
        colors: ['Purple', 'Violet', 'Deep Purple'],
        image: '/images/crystals/AMETHYST/AM1.png',
        images: [
          '/images/crystals/AMETHYST/AM1.png',
          '/images/crystals/AMETHYST/AM2.png',
          '/images/crystals/AMETHYST/AM3.png',
          '/images/crystals/AMETHYST/AM4.png'
        ]
      },

      // 21. Dalmatian Bracelets (5 pieces)
      {
        id: 'dalmatian-jasper-1',
        name: 'Dalmatian Jasper Bracelet',
        quantity: 5,
        price: 28,
        category: 'Joy',
        chakra: 'Root',
        element: 'Earth',
        properties: ['Joy', 'Playfulness', 'Loyalty', 'Protection', 'Grounding'],
        colors: ['White', 'Black Spots', 'Cream'],
        image: '/images/crystals/DALMATIAN/DM1.png',
        images: [
          '/images/crystals/DALMATIAN/DM1.png',
          '/images/crystals/DALMATIAN/DM2.png',
          '/images/crystals/DALMATIAN/DM3.png',
          '/images/crystals/DALMATIAN/DM4.png'
        ]
      }
    ];

    console.log(`📦 Setting up ${realInventory.length} crystal bracelets...`);

    // Clear existing crystals first
    try {
      const deleteResult = await prisma.crystal.deleteMany({});
      console.log(`🗑️ Cleared ${deleteResult.count} existing crystals`);
    } catch (deleteError) {
      console.error('Error clearing crystals:', deleteError);
      return NextResponse.json(
        { error: 'Failed to clear existing inventory', details: deleteError instanceof Error ? deleteError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    const createdProducts = [];

    // Add your real crystal inventory one by one
    for (let i = 0; i < realInventory.length; i++) {
      const item = realInventory[i];

      try {
        const slug = item.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const product = await prisma.crystal.create({
          data: {
            id: item.id,
            name: item.name,
            description: `Beautiful ${item.name.toLowerCase()} crafted for healing and spiritual growth. Each bracelet is carefully selected for its unique energy and properties.`,
            price: item.price,
            category: item.category,
            chakra: item.chakra,
            element: item.element,
            hardness: '6-7',
            origin: 'Various',
            rarity: 'Premium',
            slug,
            stockQuantity: item.quantity,
            lowStockThreshold: 5,
            isActive: true,
            isFeatured: ['Triple Protection', 'Citrine', 'Lava 7 Chakra'].some(featured =>
              item.name.includes(featured)
            ),
            properties: JSON.stringify(item.properties),
            colors: JSON.stringify(item.colors),
            zodiacSigns: JSON.stringify(['All']),
            birthMonths: JSON.stringify(['All']),
            image: item.image,
            images: JSON.stringify(item.images || [item.image]),
            metaTitle: `${item.name} - Celestial Crystals`,
            metaDescription: `Shop authentic ${item.name.toLowerCase()} at Celestial Crystals. Premium quality healing crystals for spiritual growth and energy work.`,
            keywords: JSON.stringify([
              'crystal bracelet',
              'healing crystals',
              'spiritual jewelry',
              'energy bracelet',
              item.name.split(' ')[0].toLowerCase()
            ]),
          }
        });

        createdProducts.push(product);
        console.log(`✅ Added: ${item.name} (${item.quantity} in stock)`);

      } catch (createError) {
        console.error(`❌ Failed to create ${item.name}:`, createError);
        return NextResponse.json(
          { error: `Failed to create product: ${item.name}`, details: createError instanceof Error ? createError.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    // Get final counts
    const totalCrystals = await prisma.crystal.count();
    const totalStock = await prisma.crystal.aggregate({
      _sum: { stockQuantity: true }
    });

    console.log('🎉 Inventory setup complete!');

    return NextResponse.json({
      success: true,
      message: 'Real inventory setup complete!',
      data: {
        totalProducts: totalCrystals,
        totalStock: totalStock._sum.stockQuantity,
        createdProducts: createdProducts.length,
        priceRange: '$24.99 - $39.99',
        featuredProducts: createdProducts.filter(p => p.isFeatured).length,
      }
    });

  } catch (error) {
    console.error('Error setting up inventory:', error);
    return NextResponse.json(
      { error: 'Failed to setup inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


