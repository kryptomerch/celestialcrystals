import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🔐 Creating test user for local development...');

  const email = 'admin@celestialcrystals.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      return;
    }

    // Create test user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: new Date(),
        newsletterSubscribed: true,
        marketingEmails: true,
      }
    });

    console.log('✅ Test user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${user.role}`);
    console.log('');
    console.log('🚀 You can now login at: http://localhost:3000/auth/signin');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
