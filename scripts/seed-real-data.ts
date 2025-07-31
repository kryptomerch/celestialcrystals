import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with real data...');

  try {
    // First, let's check what data already exists
    const existingUsers = await prisma.user.count();
    const existingCrystals = await prisma.crystal.count();
    const existingOrders = await prisma.order.count();
    
    console.log(`📊 Current database state:`);
    console.log(`   Users: ${existingUsers}`);
    console.log(`   Crystals: ${existingCrystals}`);
    console.log(`   Orders: ${existingOrders}`);

    // Create admin user if not exists
    const adminUser = await prisma.user.upsert({
      where: { email: 'kryptomerch.io@gmail.com' },
      update: {},
      create: {
        email: 'kryptomerch.io@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        newsletterSubscribed: true,
        marketingEmails: true,
      },
    });

    console.log('✅ Admin user created/updated');

    // Create some real crystal products if they don't exist
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

    // Create crystals
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
        console.log(`✅ Created crystal: ${crystal.name}`);
      } else {
        createdCrystals.push(existingCrystal);
        console.log(`⏭️  Crystal already exists: ${crystal.name}`);
      }
    }

    // Create some test customers
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
        console.log(`✅ Created customer: ${customer.firstName} ${customer.lastName}`);
      } else {
        createdCustomers.push(existingCustomer);
        console.log(`⏭️  Customer already exists: ${customer.firstName} ${customer.lastName}`);
      }
    }

    console.log(`\n📊 Database seeding completed!`);
    console.log(`   Total crystals: ${createdCrystals.length}`);
    console.log(`   Total customers: ${createdCustomers.length}`);
    
    // Show final counts
    const finalUsers = await prisma.user.count();
    const finalCrystals = await prisma.crystal.count();
    const finalOrders = await prisma.order.count();
    
    console.log(`\n📈 Final database state:`);
    console.log(`   Users: ${finalUsers}`);
    console.log(`   Crystals: ${finalCrystals}`);
    console.log(`   Orders: ${finalOrders}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
