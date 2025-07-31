import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking session...');
    
    const session = await getServerSession(authOptions);
    console.log('📋 Session data:', JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'No session found',
        session: null,
        user: null
      });
    }

    // Check user in database
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

    console.log('👤 User from database:', JSON.stringify(user, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Session debug info',
      session: {
        user: session.user,
        expires: session.expires
      },
      user: user,
      isAdmin: user?.role === 'ADMIN',
      checks: {
        hasSession: !!session,
        hasUserEmail: !!session?.user?.email,
        userExists: !!user,
        userRole: user?.role,
        isAdminRole: user?.role === 'ADMIN'
      }
    });

  } catch (error) {
    console.error('❌ Session debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to debug session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
