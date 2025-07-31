import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'No session found',
        session: null
      }, { status: 401 });
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

    return NextResponse.json({
      success: true,
      session: {
        user: session.user,
        expires: session.expires
      },
      databaseUser: user,
      isAdmin: user?.role === 'ADMIN',
      adminEmails: ['dhruvaparik@gmail.com', 'kryptomerch.io@gmail.com'],
      isAdminEmail: ['dhruvaparik@gmail.com', 'kryptomerch.io@gmail.com'].includes(session.user.email?.toLowerCase() || '')
    });

  } catch (error) {
    console.error('Debug user role error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get user role',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
