import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user,
      session: {
        email: session.user.email,
        id: session.user.id
      },
      isAdmin: user.role === 'ADMIN'
    });

  } catch (error) {
    console.error('Error getting user status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user status' },
      { status: 500 }
    );
  }
}
