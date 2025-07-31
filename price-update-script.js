// Price Update Script for Celestial Crystals
// Run this with: node price-update-script.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePrices() {
  try {
    console.log('🔧 Starting price updates...');

    // Example 1: Update specific product
    const updatedTripleProtection = await prisma.crystal.update({
      where: { id: 'triple-protection-1' },
      data: { 
        price: 39.99,
        updatedAt: new Date()
      }
    });
    console.log(`✅ Updated ${updatedTripleProtection.name} to $${updatedTripleProtection.price}`);

    // Example 2: Update multiple products by category
    const updatedProtectionBracelets = await prisma.crystal.updateMany({
      where: { category: 'Protection' },
      data: { 
        price: 35.99,
        updatedAt: new Date()
      }
    });
    console.log(`✅ Updated ${updatedProtectionBracelets.count} Protection bracelets to $35.99`);

    // Example 3: Bulk price update with different prices
    const priceUpdates = [
      { id: 'money-magnet-1', price: 44.99 },
      { id: 'lava-chakra-1', price: 47.99 },
      { id: 'blue-aquamarine-1', price: 49.99 }
    ];

    for (const update of priceUpdates) {
      await prisma.crystal.update({
        where: { id: update.id },
        data: { 
          price: update.price,
          updatedAt: new Date()
        }
      });
      console.log(`✅ Updated crystal ${update.id} to $${update.price}`);
    }

    // Example 4: Apply percentage increase to all products
    const allCrystals = await prisma.crystal.findMany({
      select: { id: true, name: true, price: true }
    });

    for (const crystal of allCrystals) {
      const newPrice = Math.round(crystal.price * 1.10 * 100) / 100; // 10% increase
      await prisma.crystal.update({
        where: { id: crystal.id },
        data: { 
          price: newPrice,
          updatedAt: new Date()
        }
      });
      console.log(`✅ Increased ${crystal.name} from $${crystal.price} to $${newPrice}`);
    }

    console.log('🎉 All price updates completed!');

  } catch (error) {
    console.error('❌ Error updating prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the updates
updatePrices();
