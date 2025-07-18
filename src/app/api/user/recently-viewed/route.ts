import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get recently viewed products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const recentlyViewed = await prisma.productView.findMany({
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
            reviews: {
              where: { isApproved: true },
              select: { rating: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['crystalId'] // Only get unique crystals
    })

    const formattedProducts = recentlyViewed.map(view => ({
      ...view.crystal,
      viewedAt: view.createdAt,
      averageRating: view.crystal.reviews.length > 0 
        ? view.crystal.reviews.reduce((sum, review) => sum + review.rating, 0) / view.crystal.reviews.length
        : 0,
      reviewCount: view.crystal.reviews.length
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Recently viewed fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Track product view
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { crystalId, sessionId } = await request.json()

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

    // Create product view record
    await prisma.productView.create({
      data: {
        crystalId,
        userId: session?.user?.id || null,
        sessionId: sessionId || null
      }
    })

    return NextResponse.json({ message: 'Product view tracked' })
  } catch (error) {
    console.error('Product view tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Clear recently viewed
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

    if (crystalId) {
      // Remove specific product from recently viewed
      await prisma.productView.deleteMany({
        where: {
          userId: session.user.id,
          crystalId: crystalId
        }
      })
    } else {
      // Clear all recently viewed
      await prisma.productView.deleteMany({
        where: { userId: session.user.id }
      })
    }

    return NextResponse.json({ 
      message: crystalId ? 'Product removed from recently viewed' : 'Recently viewed cleared' 
    })
  } catch (error) {
    console.error('Recently viewed clear error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
