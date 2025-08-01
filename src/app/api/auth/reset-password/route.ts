import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Decode and validate the reset token
    let tokenData;
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      tokenData = JSON.parse(decoded);

      // Check if token is expired
      if (Date.now() > tokenData.exp) {
        return NextResponse.json(
          { error: 'Reset token has expired' },
          { status: 400 }
        );
      }
    } catch (decodeError) {
      console.error('❌ Invalid token format:', decodeError);
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Find the user by ID from token
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId }
    });

    if (!user || user.email !== tokenData.email) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ Password reset successful for user:', user.email);

    return NextResponse.json({
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify reset token (for checking if token is valid before showing reset form)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Decode and validate the reset token
    let tokenData;
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      tokenData = JSON.parse(decoded);

      // Check if token is expired
      if (Date.now() > tokenData.exp) {
        return NextResponse.json(
          { error: 'Reset token has expired' },
          { status: 400 }
        );
      }
    } catch (decodeError) {
      console.error('❌ Invalid token format:', decodeError);
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Find the user by ID from token
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      select: {
        id: true,
        email: true,
        firstName: true
      }
    });

    if (!user || user.email !== tokenData.email) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        email: user.email,
        firstName: user.firstName
      }
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
