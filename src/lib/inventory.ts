import { prisma } from '@/lib/prisma';
import { crystalDatabase } from '@/data/crystals';

// Initialize inventory for all crystals
export async function initializeInventory() {
  try {
    for (const crystal of crystalDatabase) {
      // Check if inventory already exists
      const existing = await prisma.crystal.findUnique({
        where: { id: crystal.id }
      });

      if (!existing) {
        // Create crystal record
        await prisma.crystal.create({
          data: {
            id: crystal.id,
            name: crystal.name,
            description: crystal.description,
            price: crystal.price,
            category: crystal.category,
            colors: JSON.stringify(crystal.colors),
            properties: JSON.stringify(crystal.properties),
            chakra: crystal.chakra,
            zodiacSigns: JSON.stringify(crystal.zodiacSigns),
            birthMonths: JSON.stringify(crystal.birthMonths),
            element: crystal.element,
            hardness: crystal.hardness,
            origin: crystal.origin,
            rarity: crystal.rarity,
            image: crystal.image,
            images: JSON.stringify(crystal.images || []),
            slug: crystal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            stockQuantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
            isActive: true
          }
        });
      }
    }

    console.log('Inventory initialized successfully');
  } catch (error) {
    console.error('Error initializing inventory:', error);
  }
}

// Get inventory data for admin
export async function getInventoryData() {
  try {
    const crystals = await prisma.crystal.findMany({
      orderBy: { name: 'asc' }
    });

    const totalProducts = crystals.length;
    const totalStock = crystals.reduce((sum, crystal) => sum + crystal.stockQuantity, 0);
    const lowStockItems = crystals.filter(crystal => crystal.stockQuantity <= 5).length;
    const outOfStockItems = crystals.filter(crystal => crystal.stockQuantity === 0).length;

    return {
      overview: {
        totalProducts,
        totalStock,
        lowStockItems,
        outOfStockItems
      },
      crystals: crystals.map(crystal => ({
        id: crystal.id,
        name: crystal.name,
        stock: crystal.stockQuantity,
        price: crystal.price,
        category: crystal.category,
        isActive: crystal.isActive,
        lastUpdated: crystal.updatedAt
      }))
    };
  } catch (error) {
    console.error('Error getting inventory data:', error);
    return {
      overview: {
        totalProducts: 0,
        totalStock: 0,
        lowStockItems: 0,
        outOfStockItems: 0
      },
      crystals: []
    };
  }
}

// Update crystal stock
export async function updateCrystalStock(crystalId: string, newStock: number, reason?: string) {
  try {
    const crystal = await prisma.crystal.findUnique({
      where: { id: crystalId }
    });

    if (!crystal) {
      throw new Error('Crystal not found');
    }

    const previousStock = crystal.stockQuantity;

    // Update stock
    const updated = await prisma.crystal.update({
      where: { id: crystalId },
      data: { stockQuantity: newStock }
    });

    // Log the inventory change
    await prisma.inventoryLog.create({
      data: {
        crystalId,
        type: newStock > previousStock ? 'RESTOCK' : 'ADJUSTMENT',
        quantity: newStock - previousStock,
        previousQty: previousStock,
        newQty: newStock,
        reason: reason || 'Manual adjustment'
      }
    });

    return updated;
  } catch (error) {
    console.error('Error updating crystal stock:', error);
    throw error;
  }
}

// Process sale (reduce stock)
export async function processSale(crystalId: string, quantity: number, orderId?: string) {
  try {
    const crystal = await prisma.crystal.findUnique({
      where: { id: crystalId }
    });

    if (!crystal) {
      throw new Error('Crystal not found');
    }

    if (crystal.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const newStock = crystal.stockQuantity - quantity;

    // Update stock
    const updated = await prisma.crystal.update({
      where: { id: crystalId },
      data: { stockQuantity: newStock }
    });

    // Log the sale
    await prisma.inventoryLog.create({
      data: {
        crystalId,
        type: 'SALE',
        quantity: -quantity,
        previousQty: crystal.stockQuantity,
        newQty: newStock,
        reason: 'Sale',
        reference: orderId
      }
    });

    return updated;
  } catch (error) {
    console.error('Error processing sale:', error);
    throw error;
  }
}

// Get low stock alerts
export async function getLowStockAlerts() {
  try {
    const lowStockCrystals = await prisma.crystal.findMany({
      where: {
        stockQuantity: { lte: 5 },
        isActive: true
      },
      orderBy: { stockQuantity: 'asc' }
    });

    return lowStockCrystals.map(crystal => ({
      id: crystal.id,
      name: crystal.name,
      stock: crystal.stockQuantity,
      price: crystal.price,
      category: crystal.category
    }));
  } catch (error) {
    console.error('Error getting low stock alerts:', error);
    return [];
  }
}

// Get inventory logs
export async function getInventoryLogs(crystalId?: string, limit: number = 50) {
  try {
    const logs = await prisma.inventoryLog.findMany({
      where: crystalId ? { crystalId } : undefined,
      include: {
        crystal: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return logs.map(log => ({
      id: log.id,
      crystalId: log.crystalId,
      crystalName: log.crystal.name,
      type: log.type,
      quantity: log.quantity,
      previousQty: log.previousQty,
      newQty: log.newQty,
      reason: log.reason,
      reference: log.reference,
      createdAt: log.createdAt
    }));
  } catch (error) {
    console.error('Error getting inventory logs:', error);
    return [];
  }
}
