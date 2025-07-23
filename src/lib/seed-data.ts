import { prisma } from '@/lib/prisma';
import { crystalDatabase } from '@/data/crystals';

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // 1. Initialize crystals in database
    for (const crystal of crystalDatabase.slice(0, 10)) { // Just first 10 for demo
      await prisma.crystal.upsert({
        where: { id: crystal.id },
        update: {},
        create: {
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
          stockQuantity: Math.floor(Math.random() * 50) + 10,
          isActive: true
        }
      });
    }

    // 2. Create admin users first
    const adminUsers = [
      { firstName: 'Dhruv', lastName: 'Parik', email: 'dhruvaparik@gmail.com', role: 'ADMIN' },
      { firstName: 'Krypto', lastName: 'Merch', email: 'kryptomerch.io@gmail.com', role: 'ADMIN' }
    ];

    for (const adminData of adminUsers) {
      await prisma.user.upsert({
        where: { email: adminData.email },
        update: { role: 'ADMIN' }, // Ensure they're admin
        create: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          role: adminData.role,
          emailVerified: new Date(),
          createdAt: new Date()
        }
      });
    }

    // 3. Create sample users
    const sampleUsers = [
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' },
      { firstName: 'Michael', lastName: 'Chen', email: 'michael@example.com' },
      { firstName: 'Emma', lastName: 'Davis', email: 'emma@example.com' },
      { firstName: 'James', lastName: 'Wilson', email: 'james@example.com' },
      { firstName: 'Lisa', lastName: 'Anderson', email: 'lisa@example.com' }
    ];

    for (const userData of sampleUsers) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          emailVerified: new Date(),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
        }
      });
    }

    // 4. Create sample orders
    const users = await prisma.user.findMany({ take: 5 });
    const crystals = await prisma.crystal.findMany({ take: 10 });

    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const crystal = crystals[Math.floor(Math.random() * crystals.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const totalAmount = crystal.price * quantity;

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-2024-${String(i + 1).padStart(3, '0')}`,
          userId: user.id,
          subtotal: totalAmount * 0.85, // Assuming some discount/tax calculation
          shippingAmount: 10,
          taxAmount: totalAmount * 0.13,
          totalAmount,
          paymentMethod: 'STRIPE',
          status: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'][Math.floor(Math.random() * 5)],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      });

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          crystalId: crystal.id,
          quantity,
          price: crystal.price
        }
      });
    }

    // 5. Create sample reviews
    for (let i = 0; i < 25; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const crystal = crystals[Math.floor(Math.random() * crystals.length)];

      await prisma.review.create({
        data: {
          userId: user.id,
          crystalId: crystal.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
          title: `Great ${crystal.name}!`,
          comment: `I love my ${crystal.name}. The quality is excellent and it arrived quickly.`,
          isVerified: true,
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // 6. Create sample analytics events
    const events = ['page_view', 'crystal_view', 'add_to_cart', 'purchase', 'blog_view'];
    const pages = ['/', '/crystals', '/blog', '/categories', '/birthdate-guide'];

    for (let i = 0; i < 100; i++) {
      const event = events[Math.floor(Math.random() * events.length)];
      const page = pages[Math.floor(Math.random() * pages.length)];
      const user = Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)] : null;

      await prisma.analytics.create({
        data: {
          event,
          page,
          userId: user?.id,
          sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
          data: event === 'crystal_view' ? { crystalId: crystals[Math.floor(Math.random() * crystals.length)].id } : {},
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // 7. Create sample blog posts
    const blogPosts = [
      {
        title: 'The Complete Guide to Lava 7 Chakra Bracelets',
        slug: 'lava-7-chakra-complete-guide',
        content: 'Discover the powerful healing properties of Lava 7 Chakra bracelets...',
        excerpt: 'Learn about the seven chakras and how lava stone can help balance your energy centers.',
        category: 'Chakra Healing',
        tags: ['chakra', 'lava stone', 'healing', 'energy']
      },
      {
        title: 'Turquoise: The Ultimate Healing Stone Guide',
        slug: 'turquoise-healing-properties-guide',
        content: 'Turquoise has been revered for centuries as a powerful healing stone...',
        excerpt: 'Explore the ancient wisdom and modern applications of turquoise healing.',
        category: 'Crystal Properties',
        tags: ['turquoise', 'healing', 'protection', 'communication']
      }
    ];

    for (const post of blogPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          author: 'Crystal Expert',
          status: 'published',
          category: post.category,
          tags: post.tags,
          isAIGenerated: false,
          views: Math.floor(Math.random() * 1000) + 100,
          readingTime: Math.floor(Math.random() * 10) + 5,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    console.log('✅ Database seeded successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
