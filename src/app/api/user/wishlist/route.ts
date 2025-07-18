import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        crystal: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            properties: true,
            colors: true,
            stockQuantity: true,
            isActive: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ wishlistItems })
  } catch (error) {
    console.error('Wishlist fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { crystalId } = await request.json()

    if (!crystalId) {
      return NextResponse.json(
        { error: 'Crystal ID is required' },
        { status: 400 }
      )
    }

    // Check if crystal exists
    const crystal = await prisma.crystal.findUnique({
      where: { id: crystalId }
    })

    if (!crystal) {
      return NextResponse.json(
        { error: 'Crystal not found' },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_crystalId: {
          userId: session.user.id,
          crystalId: crystalId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 409 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        crystalId: crystalId
      },
      include: {
        crystal: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            properties: true,
            colors: true,
            stockQuantity: true,
            isActive: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Item added to wishlist',
      wishlistItem
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const crystalId = searchParams.get('crystalId')

    if (!crystalId) {
      return NextResponse.json(
        { error: 'Crystal ID is required' },
        { status: 400 }
      )
    }

    // Remove from wishlist
    const deletedItem = await prisma.wishlistItem.delete({
      where: {
        userId_crystalId: {
          userId: session.user.id,
          crystalId: crystalId
        }
      }
    })

    return NextResponse.json({
      message: 'Item removed from wishlist',
      deletedItem
    })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
