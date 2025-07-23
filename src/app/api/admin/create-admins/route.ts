import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Hash the password
    const password = '9824444830';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin users
    const adminUsers = [
      { firstName: 'Dhruv', lastName: 'Parik', email: 'dhruvaparik@gmail.com', role: 'ADMIN' },
      { firstName: 'Krypto', lastName: 'Merch', email: 'kryptomerch.io@gmail.com', role: 'ADMIN' }
    ];

    const createdAdmins = [];

    for (const adminData of adminUsers) {
      const admin = await prisma.user.upsert({
        where: { email: adminData.email },
        update: {
          role: 'ADMIN',
          password: hashedPassword // Update password too
        },
        create: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          password: hashedPassword,
          role: adminData.role,
          emailVerified: new Date(),
          createdAt: new Date()
        }
      });
      createdAdmins.push(admin);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin users created successfully',
      admins: createdAdmins.map(admin => ({
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }))
    });
  } catch (error) {
    console.error('Error creating admin users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create admin users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
