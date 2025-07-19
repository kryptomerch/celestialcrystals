import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create crystals based on your actual inventory
  const crystals = [
    {
      name: 'Tiger Eye Bracelet',
      slug: 'tiger-eye-bracelet',
      description: 'Powerful Tiger Eye bracelet for courage, confidence, and protection. Known as the stone of courage and personal power.',
      price: 34.99,
      category: 'Protection',
      chakra: 'Solar Plexus',
      element: 'Fire',
      hardness: '7',
      origin: 'South Africa',
      rarity: 'Common',
      image: '/images/crystals/TIGER EYE/TG1.png',
      images: JSON.stringify(['/images/crystals/TIGER EYE/TG1.png', '/images/crystals/TIGER EYE/TG2.png', '/images/crystals/TIGER EYE/TG3.png', '/images/crystals/TIGER EYE/TG4.png']),
      properties: JSON.stringify(['Courage', 'Confidence', 'Protection', 'Grounding']),
      colors: JSON.stringify(['Golden Brown', 'Yellow', 'Brown']),
      zodiacSigns: JSON.stringify(['Leo', 'Capricorn']),
      birthMonths: JSON.stringify([8, 12]),
      keywords: JSON.stringify(['courage', 'confidence', 'protection']),
      stockQuantity: 15,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Aquamarine Bracelet',
      slug: 'aquamarine-bracelet',
      description: 'Serene blue Aquamarine bracelet for clarity, communication, and emotional balance. The stone of courage and serenity.',
      price: 39.99,
      category: 'Communication',
      chakra: 'Throat',
      element: 'Water',
      hardness: '7.5',
      origin: 'Brazil',
      rarity: 'Uncommon',
      image: '/images/crystals/AQUAMARINE/AQ 1.png',
      images: JSON.stringify(['/images/crystals/AQUAMARINE/AQ 1.png', '/images/crystals/AQUAMARINE/AQ 2.png', '/images/crystals/AQUAMARINE/AQ 3.png', '/images/crystals/AQUAMARINE/AQ 4.png']),
      properties: JSON.stringify(['Clarity', 'Communication', 'Courage', 'Serenity']),
      colors: JSON.stringify(['Light Blue', 'Sea Blue', 'Pale Blue']),
      zodiacSigns: JSON.stringify(['Pisces', 'Aquarius', 'Gemini']),
      birthMonths: JSON.stringify([3, 11]),
      keywords: JSON.stringify(['clarity', 'communication', 'serenity']),
      stockQuantity: 12,
      lowStockThreshold: 3,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Citrine Bracelet',
      slug: 'citrine-bracelet',
      description: 'Bright golden Citrine bracelet for abundance, manifestation, and joy. Known as the "Merchant\'s Stone" for attracting wealth.',
      price: 44.99,
      category: 'Abundance',
      chakra: 'Solar Plexus',
      element: 'Fire',
      hardness: '7',
      origin: 'Brazil',
      rarity: 'Uncommon',
      image: '/images/crystals/CITRINE/CI1.png',
      images: JSON.stringify(['/images/crystals/CITRINE/CI1.png', '/images/crystals/CITRINE/CI2.png', '/images/crystals/CITRINE/CI3.png', '/images/crystals/CITRINE/CI4.png']),
      properties: JSON.stringify(['Abundance', 'Manifestation', 'Joy', 'Confidence']),
      colors: JSON.stringify(['Golden Yellow', 'Amber', 'Light Yellow']),
      zodiacSigns: JSON.stringify(['Gemini', 'Aries', 'Leo']),
      birthMonths: JSON.stringify([11, 3]),
      keywords: JSON.stringify(['abundance', 'wealth', 'manifestation']),
      stockQuantity: 8,
      lowStockThreshold: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Green Jade Bracelet',
      slug: 'green-jade-bracelet',
      description: 'Beautiful Green Jade bracelet for prosperity, harmony, and good fortune. The stone of eternal youth and wisdom.',
      price: 49.99,
      category: 'Prosperity',
      chakra: 'Heart',
      element: 'Earth',
      hardness: '6.5',
      origin: 'Myanmar',
      rarity: 'Uncommon',
      image: '/images/crystals/GREEN JADE/GJ1.png',
      images: JSON.stringify(['/images/crystals/GREEN JADE/GJ1.png', '/images/crystals/GREEN JADE/GJ2.png']),
      properties: JSON.stringify(['Prosperity', 'Harmony', 'Good Fortune', 'Wisdom']),
      colors: JSON.stringify(['Green', 'Emerald Green']),
      zodiacSigns: JSON.stringify(['Taurus', 'Libra', 'Virgo']),
      birthMonths: JSON.stringify([5, 9]),
      keywords: JSON.stringify(['prosperity', 'harmony', 'fortune']),
      stockQuantity: 6,
      lowStockThreshold: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Turquoise Bracelet',
      slug: 'turquoise-bracelet',
      description: 'Sacred Turquoise bracelet for protection, healing, and spiritual connection. A stone of ancient wisdom and truth.',
      price: 54.99,
      category: 'Spiritual',
      chakra: 'Throat',
      element: 'Earth',
      hardness: '6',
      origin: 'Arizona',
      rarity: 'Rare',
      image: '/images/crystals/TURQUOISE/TU1.png',
      images: JSON.stringify(['/images/crystals/TURQUOISE/TU1.png', '/images/crystals/TURQUOISE/TU2.png', '/images/crystals/TURQUOISE/TU3.png', '/images/crystals/TURQUOISE/TU4.png', '/images/crystals/TURQUOISE/TU5.png']),
      properties: JSON.stringify(['Protection', 'Healing', 'Truth', 'Wisdom']),
      colors: JSON.stringify(['Turquoise Blue', 'Sky Blue', 'Blue-Green']),
      zodiacSigns: JSON.stringify(['Sagittarius', 'Pisces', 'Scorpio']),
      birthMonths: JSON.stringify([12, 3]),
      keywords: JSON.stringify(['protection', 'truth', 'wisdom']),
      stockQuantity: 4,
      lowStockThreshold: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Rhodochrosite Bracelet',
      slug: 'rhodochrosite-bracelet',
      description: 'Beautiful pink Rhodochrosite bracelet for love, compassion, and emotional healing. The stone of the compassionate heart.',
      price: 59.99,
      category: 'Love',
      chakra: 'Heart',
      element: 'Fire',
      hardness: '4',
      origin: 'Argentina',
      rarity: 'Rare',
      image: '/images/crystals/RHODOCHROSITE/RW1.png',
      images: JSON.stringify(['/images/crystals/RHODOCHROSITE/RW1.png', '/images/crystals/RHODOCHROSITE/RW2.png', '/images/crystals/RHODOCHROSITE/RW3.png', '/images/crystals/RHODOCHROSITE/RW4.png', '/images/crystals/RHODOCHROSITE/RW5.png']),
      properties: JSON.stringify(['Love', 'Compassion', 'Emotional Healing', 'Self-Love']),
      colors: JSON.stringify(['Pink', 'Rose Pink', 'Deep Pink']),
      zodiacSigns: JSON.stringify(['Leo', 'Scorpio']),
      birthMonths: JSON.stringify([8, 10]),
      keywords: JSON.stringify(['love', 'compassion', 'healing']),
      stockQuantity: 3,
      lowStockThreshold: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Howlite Bracelet',
      slug: 'howlite-bracelet',
      description: 'Calming white Howlite bracelet for peace, patience, and stress relief. Perfect for meditation and sleep.',
      price: 29.99,
      category: 'Calming',
      chakra: 'Crown',
      element: 'Air',
      hardness: '3.5',
      origin: 'Canada',
      rarity: 'Common',
      image: '/images/crystals/HOWLITE/HW2.png',
      images: JSON.stringify(['/images/crystals/HOWLITE/HW2.png', '/images/crystals/HOWLITE/HW3.png', '/images/crystals/HOWLITE/HW4.png']),
      properties: JSON.stringify(['Calming', 'Patience', 'Stress Relief', 'Sleep']),
      colors: JSON.stringify(['White', 'Cream', 'Gray']),
      zodiacSigns: JSON.stringify(['Gemini', 'Virgo']),
      birthMonths: JSON.stringify([5, 8]),
      keywords: JSON.stringify(['calm', 'peace', 'sleep']),
      stockQuantity: 10,
      lowStockThreshold: 3,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Tree Agate Bracelet',
      slug: 'tree-agate-bracelet',
      description: 'Grounding Tree Agate bracelet for stability, growth, and connection to nature. Promotes inner peace and strength.',
      price: 34.99,
      category: 'Grounding',
      chakra: 'Root',
      element: 'Earth',
      hardness: '7',
      origin: 'India',
      rarity: 'Common',
      image: '/images/crystals/TREE AGATE/TG1.png',
      images: JSON.stringify(['/images/crystals/TREE AGATE/TG1.png', '/images/crystals/TREE AGATE/TG2.png', '/images/crystals/TREE AGATE/TG3.png', '/images/crystals/TREE AGATE/TG4.png']),
      properties: JSON.stringify(['Grounding', 'Stability', 'Growth', 'Inner Peace']),
      colors: JSON.stringify(['White', 'Green', 'Moss Green']),
      zodiacSigns: JSON.stringify(['Virgo', 'Gemini']),
      birthMonths: JSON.stringify([8, 5]),
      keywords: JSON.stringify(['grounding', 'stability', 'nature']),
      stockQuantity: 7,
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
  const tigerEyeCrystal = await prisma.crystal.findFirst({ where: { slug: 'tiger-eye-bracelet' } })
  const aquamarineCrystal = await prisma.crystal.findFirst({ where: { slug: 'aquamarine-bracelet' } })

  if (tigerEyeCrystal) {
    await prisma.review.create({
      data: {
        userId: adminUser.id,
        crystalId: tigerEyeCrystal.id,
        rating: 5,
        title: 'Amazing quality!',
        comment: 'This Tiger Eye bracelet exceeded my expectations. The energy is incredible and it looks beautiful.',
        isVerified: true,
        isApproved: true,
      }
    })
  }

  if (aquamarineCrystal) {
    await prisma.review.create({
      data: {
        userId: adminUser.id,
        crystalId: aquamarineCrystal.id,
        rating: 5,
        title: 'Perfect for clarity work',
        comment: 'I wear this every day during my meditation practice. The calming energy is exactly what I needed.',
        isVerified: true,
        isApproved: true,
      }
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
