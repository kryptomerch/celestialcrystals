import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6h1jKNvgDCVE@ep-divine-sunset-ad5sal24-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

// GET - Show current prices for testing
export async function GET() {
  try {
    const crystals = await prisma.crystal.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      message: 'Current crystal prices',
      crystals,
      usage: {
        updatePrice: 'POST to this endpoint with { "crystalId": "id", "newPrice": 0.01 }',
        updateAllToTestPrices: 'POST with { "action": "setTestPrices" }'
      }
    });

  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Update prices for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crystalId, newPrice, action } = body;

    // Option 1: Update single crystal price
    if (crystalId && newPrice !== undefined) {
      const updatedCrystal = await prisma.crystal.update({
        where: { id: crystalId },
        data: { 
          price: parseFloat(newPrice),
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: `Updated ${updatedCrystal.name} price to $${newPrice}`,
        crystal: {
          id: updatedCrystal.id,
          name: updatedCrystal.name,
          oldPrice: 'N/A',
          newPrice: updatedCrystal.price
        }
      });
    }

    // Option 2: Set all crystals to test prices (0.01, 0.02, 0.03, etc.)
    if (action === 'setTestPrices') {
      const crystals = await prisma.crystal.findMany({
        select: { id: true, name: true, price: true },
        orderBy: { name: 'asc' }
      });

      const updates = [];
      for (let i = 0; i < crystals.length; i++) {
        const testPrice = (i + 1) * 0.01; // 0.01, 0.02, 0.03, etc.
        
        const updated = await prisma.crystal.update({
          where: { id: crystals[i].id },
          data: { 
            price: testPrice,
            updatedAt: new Date()
          }
        });

        updates.push({
          name: updated.name,
          oldPrice: crystals[i].price,
          newPrice: testPrice
        });
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${updates.length} crystal prices to test values`,
        updates
      });
    }

    // Option 3: Reset all prices to original values
    if (action === 'resetPrices') {
      const originalPrices = [
        { name: 'Triple Protection Bracelet - Tiger Eye, Black Obsidian & Hematite', price: 35 },
        { name: 'Blue Aquamarine Bracelet', price: 45 },
        { name: 'Lava 7 Chakra Bracelet', price: 42 },
        { name: 'Tiger Eye Bracelet', price: 32 },
        { name: 'Howlite Bracelet', price: 28 },
        { name: 'Rhodochrosite Bracelet', price: 48 },
        { name: 'Citrine Bracelet', price: 38 },
        { name: 'Tree Agate Bracelet', price: 30 },
        { name: 'Rose Amethyst Clear Quartz Bracelet', price: 44 },
        { name: 'Turquoise Bracelet', price: 40 },
        { name: 'Green Jade Bracelet', price: 36 },
        { name: 'Green Aquamarine Bracelet', price: 46 },
        { name: 'Moonstone Bracelet', price: 42 },
        { name: 'Blue Apatite Bracelet', price: 34 },
        { name: 'Rose Quartz Bracelet', price: 32 },
        { name: 'Lapis Lazuli Bracelet', price: 38 },
        { name: 'Selenite Bracelet', price: 26 },
        { name: 'Magnetic Hematite Bracelet', price: 24 },
        { name: 'Money Magnet Bracelet - Citrine & Pyrite', price: 45 },
        { name: 'Amethyst Bracelet', price: 34 },
        { name: 'Dalmatian Jasper Bracelet', price: 28 }
      ];

      const updates = [];
      for (const original of originalPrices) {
        try {
          const updated = await prisma.crystal.updateMany({
            where: { name: original.name },
            data: { 
              price: original.price,
              updatedAt: new Date()
            }
          });

          if (updated.count > 0) {
            updates.push({
              name: original.name,
              newPrice: original.price,
              status: 'updated'
            });
          }
        } catch (error) {
          updates.push({
            name: original.name,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Reset prices for ${updates.filter(u => u.status === 'updated').length} crystals`,
        updates
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request. Provide crystalId + newPrice, or action: "setTestPrices" or "resetPrices"'
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
