import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking up user data for:', email);

    // Get user data to see what fields exist
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    console.log('👤 User data found:', user);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        email: email
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User found',
      userData: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        // Show all available fields
        allFields: Object.keys(user)
      }
    });

  } catch (error) {
    console.error('❌ Debug user error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to debug user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
