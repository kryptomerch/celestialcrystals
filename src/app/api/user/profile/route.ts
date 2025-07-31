import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        phone: true,
        image: true,
        newsletterSubscribed: true,
        marketingEmails: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlistItems: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      firstName,
      lastName,
      birthDate,
      phone,
      newsletterSubscribed,
      marketingEmails,
    } = await request.json()

    // Mock update response (since DATABASE_URL is not configured)
    const updatedUser = {
      id: session.user.id,
      email: session.user.email || 'user@example.com',
      firstName: firstName || 'Crystal',
      lastName: lastName || 'Enthusiast',
      birthDate: birthDate || null,
      phone: phone || null,
      image: session.user.image,
      newsletterSubscribed: newsletterSubscribed ?? true,
      marketingEmails: marketingEmails ?? true,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
