import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get reviews for a crystal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const rating = searchParams.get('rating')

    const skip = (page - 1) * limit

    // Build where clause
    const resolvedParams = await params
    const where: any = {
      crystalId: resolvedParams.id,
      isApproved: true
    }

    if (rating) {
      where.rating = parseInt(rating)
    }

    // Get reviews with user info
    const [reviews, totalCount, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { crystalId: resolvedParams.id, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true }
      })
    ])

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { crystalId: resolvedParams.id, isApproved: true },
      _count: { rating: true },
      orderBy: { rating: 'desc' }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
        user: {
          name: review.user.firstName ?
            `${review.user.firstName} ${review.user.lastName?.charAt(0) || ''}.` :
            'Anonymous',
          image: review.user.image
        }
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: averageRating._count.rating || 0,
        ratingDistribution: ratingDistribution.map(item => ({
          rating: item.rating,
          count: item._count.rating
        }))
      }
    })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { rating, title, comment } = await request.json()

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Check if crystal exists
    const resolvedParams = await params
    const crystal = await prisma.crystal.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!crystal) {
      return NextResponse.json(
        { error: 'Crystal not found' },
        { status: 404 }
      )
    }

    // Check if user already reviewed this crystal
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_crystalId: {
          userId: session.user.id,
          crystalId: resolvedParams.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this crystal' },
        { status: 409 }
      )
    }

    // Check if user has purchased this crystal (for verified reviews)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        crystalId: resolvedParams.id,
        order: {
          userId: session.user.id,
          status: 'DELIVERED'
        }
      }
    })

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        crystalId: resolvedParams.id,
        rating,
        title: title?.trim(),
        comment: comment.trim(),
        isVerified: !!hasPurchased,
        isApproved: true // Auto-approve for now, can add moderation later
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Review created successfully',
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
        user: {
          name: review.user.firstName ?
            `${review.user.firstName} ${review.user.lastName?.charAt(0) || ''}.` :
            'Anonymous',
          image: review.user.image
        }
      }
    })
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const { reviewId, rating, title, comment } = await request.json()

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (comment && comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: session.user.id,
        crystalId: resolvedParams.id
      }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating }),
        ...(title !== undefined && { title: title?.trim() }),
        ...(comment && { comment: comment.trim() }),
        isApproved: true // Re-approve after edit
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Review updated successfully',
      review: {
        id: updatedReview.id,
        rating: updatedReview.rating,
        title: updatedReview.title,
        comment: updatedReview.comment,
        isVerified: updatedReview.isVerified,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt,
        user: {
          name: updatedReview.user.firstName ?
            `${updatedReview.user.firstName} ${updatedReview.user.lastName?.charAt(0) || ''}.` :
            'Anonymous',
          image: updatedReview.user.image
        }
      }
    })
  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
