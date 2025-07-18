import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample crystals
  const crystals = [
    {
      name: 'Amethyst Bracelet',
      slug: 'amethyst-bracelet',
      description: 'Beautiful purple amethyst bracelet for spiritual growth and inner peace. Known as the stone of spirituality and contentment.',
      price: 29.99,
      category: 'Healing',
      chakra: 'Crown',
      element: 'Air',
      hardness: '7',
      origin: 'Brazil',
      rarity: 'Common',
      image: '/images/amethyst-bracelet.jpg',
      images: JSON.stringify(['/images/amethyst-1.jpg', '/images/amethyst-2.jpg']),
      properties: JSON.stringify(['Spiritual Growth', 'Calming', 'Protection', 'Intuition']),
      colors: JSON.stringify(['Purple', 'Violet']),
      zodiacSigns: JSON.stringify(['Pisces', 'Virgo', 'Aquarius']),
      birthMonths: JSON.stringify([2, 6]),
      keywords: JSON.stringify(['peace', 'spirituality', 'meditation']),
      stockQuantity: 15,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Rose Quartz Bracelet',
      slug: 'rose-quartz-bracelet',
      description: 'Gentle pink rose quartz bracelet for love and emotional healing. The ultimate stone of unconditional love.',
      price: 24.99,
      category: 'Love',
      chakra: 'Heart',
      element: 'Water',
      hardness: '7',
      origin: 'Madagascar',
      rarity: 'Common',
      image: '/images/rose-quartz-bracelet.jpg',
      images: JSON.stringify(['/images/rose-quartz-1.jpg', '/images/rose-quartz-2.jpg']),
      properties: JSON.stringify(['Love', 'Emotional Healing', 'Self-Love', 'Compassion']),
      colors: JSON.stringify(['Pink', 'Rose']),
      zodiacSigns: JSON.stringify(['Taurus', 'Libra']),
      birthMonths: JSON.stringify([1, 10]),
      keywords: JSON.stringify(['love', 'heart', 'relationships']),
      stockQuantity: 20,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Clear Quartz Bracelet',
      slug: 'clear-quartz-bracelet',
      description: 'Pure clear quartz bracelet known as the "Master Healer". Amplifies energy and brings clarity to the mind.',
      price: 19.99,
      category: 'Healing',
      chakra: 'Crown',
      element: 'All',
      hardness: '7',
      origin: 'Arkansas',
      rarity: 'Common',
      image: '/images/clear-quartz-bracelet.jpg',
      images: JSON.stringify(['/images/clear-quartz-1.jpg', '/images/clear-quartz-2.jpg']),
      properties: JSON.stringify(['Amplification', 'Clarity', 'Healing', 'Energy']),
      colors: JSON.stringify(['Clear', 'White']),
      zodiacSigns: JSON.stringify(['All']),
      birthMonths: JSON.stringify([4]),
      keywords: JSON.stringify(['clarity', 'amplification', 'master healer']),
      stockQuantity: 25,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Black Tourmaline Bracelet',
      slug: 'black-tourmaline-bracelet',
      description: 'Powerful black tourmaline bracelet for protection and grounding. Shields against negative energy.',
      price: 34.99,
      category: 'Protection',
      chakra: 'Root',
      element: 'Earth',
      hardness: '7.5',
      origin: 'Brazil',
      rarity: 'Common',
      image: '/images/black-tourmaline-bracelet.jpg',
      images: JSON.stringify(['/images/black-tourmaline-1.jpg', '/images/black-tourmaline-2.jpg']),
      properties: JSON.stringify(['Protection', 'Grounding', 'EMF Shield', 'Purification']),
      colors: JSON.stringify(['Black']),
      zodiacSigns: JSON.stringify(['Capricorn', 'Scorpio']),
      birthMonths: JSON.stringify([10, 12]),
      keywords: JSON.stringify(['protection', 'grounding', 'shield']),
      stockQuantity: 12,
      lowStockThreshold: 3,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Citrine Bracelet',
      slug: 'citrine-bracelet',
      description: 'Bright citrine bracelet for abundance and manifestation. Known as the "Merchant\'s Stone" for attracting wealth.',
      price: 39.99,
      category: 'Abundance',
      chakra: 'Solar Plexus',
      element: 'Fire',
      hardness: '7',
      origin: 'Brazil',
      rarity: 'Uncommon',
      image: '/images/citrine-bracelet.jpg',
      images: JSON.stringify(['/images/citrine-1.jpg', '/images/citrine-2.jpg']),
      properties: JSON.stringify(['Abundance', 'Manifestation', 'Confidence', 'Joy']),
      colors: JSON.stringify(['Yellow', 'Golden']),
      zodiacSigns: JSON.stringify(['Gemini', 'Aries', 'Libra']),
      birthMonths: JSON.stringify([11]),
      keywords: JSON.stringify(['abundance', 'wealth', 'manifestation']),
      stockQuantity: 8,
      lowStockThreshold: 3,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Lapis Lazuli Bracelet',
      slug: 'lapis-lazuli-bracelet',
      description: 'Royal blue lapis lazuli bracelet for wisdom and truth. Enhances intellectual ability and stimulates desire for knowledge.',
      price: 44.99,
      category: 'Wisdom',
      chakra: 'Throat',
      element: 'Water',
      hardness: '5.5',
      origin: 'Afghanistan',
      rarity: 'Uncommon',
      image: '/images/lapis-lazuli-bracelet.jpg',
      images: JSON.stringify(['/images/lapis-lazuli-1.jpg', '/images/lapis-lazuli-2.jpg']),
      properties: JSON.stringify(['Wisdom', 'Truth', 'Communication', 'Intuition']),
      colors: JSON.stringify(['Blue', 'Royal Blue']),
      zodiacSigns: JSON.stringify(['Sagittarius', 'Libra']),
      birthMonths: JSON.stringify([9, 12]),
      keywords: JSON.stringify(['wisdom', 'truth', 'communication']),
      stockQuantity: 6,
      lowStockThreshold: 2,
      isActive: true,
      isFeatured: false,
    }
  ]

  // Create crystals
  for (const crystal of crystals) {
    await prisma.crystal.create({
      data: crystal
    })
  }

  console.log('✅ Created sample crystals')

  // Create a sample admin user (you can sign in with Google OAuth)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@celestialcrystals.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: new Date(),
      newsletterSubscribed: true,
      marketingEmails: true,
    }
  })

  console.log('✅ Created admin user')

  // Create some sample reviews
  const reviews = [
    {
      userId: adminUser.id,
      crystalId: (await prisma.crystal.findFirst({ where: { slug: 'amethyst-bracelet' } }))?.id!,
      rating: 5,
      title: 'Amazing quality!',
      comment: 'This amethyst bracelet exceeded my expectations. The energy is incredible and it looks beautiful.',
      isVerified: true,
      isApproved: true,
    },
    {
      userId: adminUser.id,
      crystalId: (await prisma.crystal.findFirst({ where: { slug: 'rose-quartz-bracelet' } }))?.id!,
      rating: 5,
      title: 'Perfect for self-love work',
      comment: 'I wear this every day during my meditation practice. The gentle energy is exactly what I needed.',
      isVerified: true,
      isApproved: true,
    }
  ]

  for (const review of reviews) {
    await prisma.review.create({
      data: review
    })
  }

  console.log('✅ Created sample reviews')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
