import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { newPassword = 'admin123' } = await request.json();
    
    console.log('🔧 Resetting admin password...');

    // Find admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        error: 'No admin user found'
      }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    console.log('✅ Admin password reset successfully');

    return NextResponse.json({
      success: true,
      message: 'Admin password reset successfully',
      credentials: {
        email: adminUser.email,
        password: newPassword
      }
    });

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset admin password',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
