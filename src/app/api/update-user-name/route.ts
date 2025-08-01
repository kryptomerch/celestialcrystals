import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating user name:', { email, firstName, lastName });

    // Update user name in database
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        firstName: firstName,
        lastName: lastName || 'Customer'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    console.log('✅ User name updated:', updatedUser);

    return NextResponse.json({
      success: true,
      message: 'User name updated successfully',
      userData: updatedUser
    });

  } catch (error) {
    console.error('❌ Update user name error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update user name',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
