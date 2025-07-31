import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if the user is one of the admin emails
    const adminEmails = [
      'dhruvaparik@gmail.com',
      'kryptomerch.io@gmail.com'
    ];

    if (!adminEmails.includes(session.user.email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to become admin' },
        { status: 403 }
      );
    }

    // Update user to admin role
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role: 'ADMIN' }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin role granted successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to setup admin' },
      { status: 500 }
    );
  }
}
