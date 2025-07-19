import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with simple test...')

  // Create one test crystal
  const testCrystal = await prisma.crystal.create({
    data: {
      name: 'Tiger Eye Bracelet',
      slug: 'tiger-eye-bracelet-test',
      description: 'Test crystal with real image',
      price: 34.99,
      category: 'Protection',
      chakra: 'Solar Plexus',
      element: 'Fire',
      hardness: '7',
      origin: 'South Africa',
      rarity: 'Common',
      image: '/images/crystals/TIGER_EYE/TG1.png',
      images: JSON.stringify(['/images/crystals/TIGER_EYE/TG1.png', '/images/crystals/TIGER_EYE/TG2.png']),
      properties: JSON.stringify(['Courage', 'Confidence', 'Protection']),
      colors: JSON.stringify(['Golden Brown', 'Yellow']),
      zodiacSigns: JSON.stringify(['Leo', 'Capricorn']),
      birthMonths: JSON.stringify([8, 12]),
      keywords: JSON.stringify(['courage', 'confidence', 'protection']),
      stockQuantity: 15,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
    }
  })

  console.log('✅ Created test crystal:', testCrystal.name)

  // Create admin user
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
  console.log('🎉 Simple seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
