import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Create a new Prisma client with explicit connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6h1jKNvgDCVE@ep-divine-sunset-ad5sal24-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin authorization
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const adminEmails = ['kryptomerch.io@gmail.com', 'dhruvaparik@gmail.com'];
    const isAdmin = adminEmails.includes(session.user.email.toLowerCase()) ||
      session.user.role === 'ADMIN';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('🔧 Setting up real inventory database...');

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Your actual 21 crystal bracelets inventory
    const realInventory = [
      // Triple Protection Bracelets (15 pieces)
      { name: 'Triple Protection Bracelet - Black Tourmaline', quantity: 15, price: 29.99 },

      // Money Magnet Bracelets (25 pieces)
      { name: 'Money Magnet Bracelet - Citrine & Pyrite', quantity: 25, price: 34.99 },

      // Lava 7 Chakra Bracelets (20 pieces)
      { name: 'Lava 7 Chakra Bracelet - Complete Set', quantity: 20, price: 39.99 },

      // Additional Crystal Bracelets
      { name: 'Clear Quartz Healing Bracelet', quantity: 12, price: 24.99 },
      { name: 'Amethyst Spiritual Bracelet', quantity: 18, price: 32.99 },
      { name: 'Rose Quartz Love Bracelet', quantity: 22, price: 27.99 },
      { name: 'Tiger Eye Protection Bracelet', quantity: 16, price: 31.99 },
      { name: 'Hematite Grounding Bracelet', quantity: 14, price: 26.99 },
      { name: 'Amazonite Calming Bracelet', quantity: 19, price: 33.99 },
      { name: 'Labradorite Transformation Bracelet', quantity: 13, price: 36.99 },
      { name: 'Moonstone Intuition Bracelet', quantity: 17, price: 35.99 },
      { name: 'Garnet Energy Bracelet', quantity: 11, price: 30.99 },
      { name: 'Aventurine Luck Bracelet', quantity: 21, price: 28.99 },
      { name: 'Obsidian Shield Bracelet', quantity: 15, price: 29.99 },
      { name: 'Fluorite Focus Bracelet', quantity: 18, price: 32.99 },
      { name: 'Carnelian Confidence Bracelet', quantity: 16, price: 31.99 },
      { name: 'Sodalite Communication Bracelet', quantity: 14, price: 30.99 },
      { name: 'Malachite Healing Bracelet', quantity: 12, price: 37.99 },
      { name: 'Turquoise Wisdom Bracelet', quantity: 20, price: 34.99 },
      { name: 'Jade Prosperity Bracelet', quantity: 17, price: 33.99 },
      { name: 'Prehnite Peace Bracelet', quantity: 13, price: 35.99 },
    ];

    // Clear existing crystals and add real inventory
    await prisma.crystal.deleteMany({});
    console.log('🗑️ Cleared existing crystal inventory');

    const createdProducts = [];

    // Add your real crystal inventory
    for (const item of realInventory) {
      const slug = item.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const product = await prisma.crystal.create({
        data: {
          name: item.name,
          description: `Beautiful ${item.name.toLowerCase()} crafted for healing and spiritual growth. Each bracelet is carefully selected for its unique energy and properties.`,
          price: item.price,
          category: 'Bracelets',
          chakra: getChakraForCrystal(item.name),
          element: getElementForCrystal(item.name),
          hardness: '6-7',
          origin: 'Various',
          rarity: 'Premium',
          slug,
          stockQuantity: item.quantity,
          lowStockThreshold: 5,
          isActive: true,
          isFeatured: ['Triple Protection', 'Money Magnet', 'Lava 7 Chakra'].some(featured =>
            item.name.includes(featured)
          ),
          properties: JSON.stringify(getPropertiesForCrystal(item.name)),
          colors: JSON.stringify(getColorsForCrystal(item.name)),
          zodiacSigns: JSON.stringify(['All']),
          birthMonths: JSON.stringify(['All']),
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
    }

    // Get final counts
    const totalCrystals = await prisma.crystal.count();
    const totalStock = await prisma.crystal.aggregate({
      _sum: { stockQuantity: true }
    });

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

// Helper functions
function getChakraForCrystal(name: string): string {
  if (name.includes('7 Chakra')) return 'All Chakras';
  if (name.includes('Amethyst')) return 'Crown';
  if (name.includes('Rose Quartz')) return 'Heart';
  if (name.includes('Citrine')) return 'Solar Plexus';
  if (name.includes('Clear Quartz')) return 'Crown';
  if (name.includes('Black Tourmaline') || name.includes('Hematite')) return 'Root';
  if (name.includes('Tiger Eye')) return 'Solar Plexus';
  if (name.includes('Moonstone')) return 'Third Eye';
  return 'Multiple';
}

function getElementForCrystal(name: string): string {
  if (name.includes('Lava')) return 'Fire';
  if (name.includes('Moonstone') || name.includes('Rose Quartz')) return 'Water';
  if (name.includes('Amethyst') || name.includes('Clear Quartz')) return 'Air';
  return 'Earth';
}

function getPropertiesForCrystal(name: string): string[] {
  if (name.includes('Protection')) return ['Protection', 'Grounding', 'Shield'];
  if (name.includes('Money') || name.includes('Citrine')) return ['Abundance', 'Prosperity', 'Manifestation'];
  if (name.includes('7 Chakra')) return ['Balance', 'Alignment', 'Energy Flow'];
  if (name.includes('Love') || name.includes('Rose Quartz')) return ['Love', 'Compassion', 'Emotional Healing'];
  if (name.includes('Healing')) return ['Healing', 'Purification', 'Clarity'];
  return ['Energy', 'Balance', 'Spiritual Growth'];
}

function getColorsForCrystal(name: string): string[] {
  if (name.includes('Black')) return ['Black'];
  if (name.includes('Clear')) return ['Clear', 'White'];
  if (name.includes('Rose')) return ['Pink', 'Rose'];
  if (name.includes('Amethyst')) return ['Purple', 'Violet'];
  if (name.includes('Citrine')) return ['Yellow', 'Golden'];
  if (name.includes('7 Chakra')) return ['Multi-colored', 'Rainbow'];
  return ['Natural', 'Mixed'];
}
