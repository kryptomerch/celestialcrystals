import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get inventory overview
export async function GET(request: NextRequest) {
  try {
    // Verify admin access (in a real app, check user role)
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const lowStock = searchParams.get('lowStock') === 'true'
    const outOfStock = searchParams.get('outOfStock') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (lowStock) {
      where.AND = [
        { stockQuantity: { lte: prisma.crystal.fields.lowStockThreshold } },
        { stockQuantity: { gt: 0 } }
      ]
    }

    if (outOfStock) {
      where.stockQuantity = 0
    }

    // Get crystals with inventory info
    const [crystals, totalCount] = await Promise.all([
      prisma.crystal.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
          lowStockThreshold: true,
          isActive: true,
          isFeatured: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orderItems: true,
              inventoryLogs: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.crystal.count({ where })
    ])

    // Get inventory statistics
    const stats = await prisma.crystal.aggregate({
      _count: { id: true },
      _sum: { stockQuantity: true },
      where: { isActive: true }
    })

    const lowStockCount = await prisma.crystal.count({
      where: {
        isActive: true,
        stockQuantity: { lte: 5, gt: 0 }
      }
    })

    const outOfStockCount = await prisma.crystal.count({
      where: {
        isActive: true,
        stockQuantity: 0
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      crystals,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalProducts: stats._count.id,
        totalStock: stats._sum.stockQuantity || 0,
        lowStockCount,
        outOfStockCount
      }
    })
  } catch (error) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update inventory
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { crystalId, quantity, type, reason } = await request.json()

    if (!crystalId || quantity === undefined || !type) {
      return NextResponse.json(
        { error: 'Crystal ID, quantity, and type are required' },
        { status: 400 }
      )
    }

    // Get current crystal
    const crystal = await prisma.crystal.findUnique({
      where: { id: crystalId },
      select: { stockQuantity: true, name: true }
    })

    if (!crystal) {
      return NextResponse.json(
        { error: 'Crystal not found' },
        { status: 404 }
      )
    }

    const previousQty = crystal.stockQuantity
    let newQty: number

    // Calculate new quantity based on type
    switch (type) {
      case 'RESTOCK':
        newQty = previousQty + Math.abs(quantity)
        break
      case 'ADJUSTMENT':
        newQty = quantity
        break
      case 'SALE':
        newQty = Math.max(0, previousQty - Math.abs(quantity))
        break
      case 'RETURN':
        newQty = previousQty + Math.abs(quantity)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid inventory type' },
          { status: 400 }
        )
    }

    // Update crystal stock and create log entry in transaction
    const result = await prisma.$transaction([
      prisma.crystal.update({
        where: { id: crystalId },
        data: { stockQuantity: newQty }
      }),
      prisma.inventoryLog.create({
        data: {
          crystalId,
          type,
          quantity: type === 'SALE' ? -Math.abs(quantity) : Math.abs(quantity),
          previousQty,
          newQty,
          reason,
          createdBy: session.user.id
        }
      })
    ])

    return NextResponse.json({
      message: 'Inventory updated successfully',
      crystal: result[0],
      log: result[1]
    })
  } catch (error) {
    console.error('Inventory update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Bulk inventory update
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { updates } = await request.json()

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      )
    }

    const results = []

    // Process each update
    for (const update of updates) {
      const { crystalId, quantity, type, reason } = update

      if (!crystalId || quantity === undefined || !type) {
        continue // Skip invalid updates
      }

      try {
        const crystal = await prisma.crystal.findUnique({
          where: { id: crystalId },
          select: { stockQuantity: true }
        })

        if (!crystal) continue

        const previousQty = crystal.stockQuantity
        let newQty: number

        switch (type) {
          case 'RESTOCK':
            newQty = previousQty + Math.abs(quantity)
            break
          case 'ADJUSTMENT':
            newQty = quantity
            break
          case 'SALE':
            newQty = Math.max(0, previousQty - Math.abs(quantity))
            break
          case 'RETURN':
            newQty = previousQty + Math.abs(quantity)
            break
          default:
            continue
        }

        const result = await prisma.$transaction([
          prisma.crystal.update({
            where: { id: crystalId },
            data: { stockQuantity: newQty }
          }),
          prisma.inventoryLog.create({
            data: {
              crystalId,
              type,
              quantity: type === 'SALE' ? -Math.abs(quantity) : Math.abs(quantity),
              previousQty,
              newQty,
              reason,
              createdBy: session.user.id
            }
          })
        ])

        results.push({
          crystalId,
          success: true,
          crystal: result[0],
          log: result[1]
        })
      } catch (error) {
        results.push({
          crystalId,
          success: false,
          error: 'Failed to update'
        })
      }
    }

    return NextResponse.json({
      message: 'Bulk inventory update completed',
      results,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length
    })
  } catch (error) {
    console.error('Bulk inventory update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
