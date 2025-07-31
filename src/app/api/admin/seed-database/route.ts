import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Check if user is admin
    const adminEmails = ['kryptomerch.io@gmail.com', 'dhruvaparik@gmail.com'];
    const isAdmin = adminEmails.includes(session.user.email.toLowerCase()) ||
      session.user.role === 'ADMIN';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('🌱 Starting database seeding with real data...');

    // Check current database state
    const existingUsers = await prisma.user.count();
    const existingCrystals = await prisma.crystal.count();
    const existingOrders = await prisma.order.count();

    console.log(`📊 Current database state: Users: ${existingUsers}, Crystals: ${existingCrystals}, Orders: ${existingOrders}`);

    // Create admin user if not exists
    const adminUser = await prisma.user.upsert({
      where: { email: 'kryptomerch.io@gmail.com' },
      update: { role: 'ADMIN' },
      create: {
        email: 'kryptomerch.io@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        newsletterSubscribed: true,
        marketingEmails: true,
      },
    });

    // Create crystals
    const crystals = [
      {
        name: 'Clear Quartz Bracelet',
        description: 'A beautiful clear quartz bracelet for amplifying energy and clarity.',
        price: 39.99,
        category: 'Bracelets',
        chakra: 'Crown',
        element: 'Spirit',
        hardness: '7',
        origin: 'Brazil',
        rarity: 'Common',
        properties: JSON.stringify(['Amplification', 'Clarity', 'Healing']),
        colors: JSON.stringify(['Clear', 'White']),
        zodiacSigns: JSON.stringify(['All']),
        birthMonths: JSON.stringify(['April']),
        slug: 'clear-quartz-bracelet',
        stockQuantity: 25,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Amethyst Cluster',
        description: 'Natural amethyst cluster perfect for meditation and spiritual growth.',
        price: 89.99,
        category: 'Clusters',
        chakra: 'Third Eye',
        element: 'Air',
        hardness: '7',
        origin: 'Uruguay',
        rarity: 'Common',
        properties: JSON.stringify(['Spiritual Growth', 'Protection', 'Intuition']),
        colors: JSON.stringify(['Purple', 'Violet']),
        zodiacSigns: JSON.stringify(['Pisces', 'Virgo', 'Aquarius']),
        birthMonths: JSON.stringify(['February']),
        slug: 'amethyst-cluster',
        stockQuantity: 15,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Rose Quartz Heart',
        description: 'Heart-shaped rose quartz for love, compassion, and emotional healing.',
        price: 24.99,
        category: 'Hearts',
        chakra: 'Heart',
        element: 'Water',
        hardness: '7',
        origin: 'Madagascar',
        rarity: 'Common',
        properties: JSON.stringify(['Love', 'Compassion', 'Emotional Healing']),
        colors: JSON.stringify(['Pink', 'Rose']),
        zodiacSigns: JSON.stringify(['Taurus', 'Libra']),
        birthMonths: JSON.stringify(['January']),
        slug: 'rose-quartz-heart',
        stockQuantity: 30,
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Black Tourmaline',
        description: 'Powerful protection stone that shields against negative energy.',
        price: 34.99,
        category: 'Raw Stones',
        chakra: 'Root',
        element: 'Earth',
        hardness: '7-7.5',
        origin: 'Brazil',
        rarity: 'Common',
        properties: JSON.stringify(['Protection', 'Grounding', 'EMF Shield']),
        colors: JSON.stringify(['Black']),
        zodiacSigns: JSON.stringify(['Capricorn']),
        birthMonths: JSON.stringify(['October']),
        slug: 'black-tourmaline',
        stockQuantity: 20,
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Citrine Point',
        description: 'Natural citrine point for abundance, prosperity, and manifestation.',
        price: 45.99,
        category: 'Points',
        chakra: 'Solar Plexus',
        element: 'Fire',
        hardness: '7',
        origin: 'Brazil',
        rarity: 'Uncommon',
        properties: JSON.stringify(['Abundance', 'Manifestation', 'Joy']),
        colors: JSON.stringify(['Yellow', 'Golden']),
        zodiacSigns: JSON.stringify(['Gemini', 'Aries', 'Libra', 'Leo']),
        birthMonths: JSON.stringify(['November']),
        slug: 'citrine-point',
        stockQuantity: 12,
        isActive: true,
        isFeatured: true,
      },
    ];

    const createdCrystals = [];
    for (const crystal of crystals) {
      const existingCrystal = await prisma.crystal.findUnique({
        where: { slug: crystal.slug }
      });

      if (!existingCrystal) {
        const newCrystal = await prisma.crystal.create({
          data: crystal
        });
        createdCrystals.push(newCrystal);
      } else {
        createdCrystals.push(existingCrystal);
      }
    }

    // Create test customers
    const customers = [
      {
        email: 'sarah.johnson@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'CUSTOMER',
      },
      {
        email: 'michael.chen@example.com',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'CUSTOMER',
      },
      {
        email: 'emma.wilson@example.com',
        firstName: 'Emma',
        lastName: 'Wilson',
        role: 'CUSTOMER',
      },
    ];

    const createdCustomers = [];
    for (const customer of customers) {
      const existingCustomer = await prisma.user.findUnique({
        where: { email: customer.email }
      });

      if (!existingCustomer) {
        const newCustomer = await prisma.user.create({
          data: customer
        });
        createdCustomers.push(newCustomer);
      } else {
        createdCustomers.push(existingCustomer);
      }
    }

    // Create some sample orders
    if (createdCustomers.length > 0 && createdCrystals.length > 0) {
      const sampleOrders = [
        {
          orderNumber: 'CC-2024-001',
          userId: createdCustomers[0].id,
          status: 'COMPLETED',
          subtotal: 79.98,
          shippingAmount: 10.00,
          taxAmount: 7.20,
          totalAmount: 97.18,
          paymentMethod: 'stripe',
          paymentStatus: 'PAID',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          orderNumber: 'CC-2024-002',
          userId: createdCustomers[1].id,
          status: 'PROCESSING',
          subtotal: 89.99,
          shippingAmount: 10.00,
          taxAmount: 9.00,
          totalAmount: 108.99,
          paymentMethod: 'stripe',
          paymentStatus: 'PAID',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          orderNumber: 'CC-2024-003',
          userId: createdCustomers[2].id,
          status: 'SHIPPED',
          subtotal: 24.99,
          shippingAmount: 10.00,
          taxAmount: 3.15,
          totalAmount: 38.14,
          paymentMethod: 'paypal',
          paymentStatus: 'PAID',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      ];

      for (const orderData of sampleOrders) {
        const existingOrder = await prisma.order.findUnique({
          where: { orderNumber: orderData.orderNumber }
        });

        if (!existingOrder) {
          const order = await prisma.order.create({
            data: orderData
          });

          // Add order items
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              crystalId: createdCrystals[0].id,
              quantity: 2,
              price: createdCrystals[0].price,
            }
          });
        }
      }
    }

    // Get final counts
    const finalUsers = await prisma.user.count();
    const finalCrystals = await prisma.crystal.count();
    const finalOrders = await prisma.order.count();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with real data!',
      data: {
        users: finalUsers,
        crystals: finalCrystals,
        orders: finalOrders,
        createdCrystals: createdCrystals.length,
        createdCustomers: createdCustomers.length,
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
