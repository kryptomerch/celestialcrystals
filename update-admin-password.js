const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    console.log('🔄 Updating admin password...');
    
    // Hash the new password
    const newPassword = await bcrypt.hash('9824444830', 12);
    
    // Update the admin user
    const updatedUser = await prisma.user.upsert({
      where: { email: 'dhruvaparik@gmail.com' },
      update: {
        password: newPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
      create: {
        email: 'dhruvaparik@gmail.com',
        password: newPassword,
        firstName: 'Dhruv',
        lastName: 'Admin',
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin password updated successfully!');
    console.log('📧 Email:', updatedUser.email);
    console.log('🔑 New Password: 9824444830');
    console.log('👤 Role:', updatedUser.role);
    
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
