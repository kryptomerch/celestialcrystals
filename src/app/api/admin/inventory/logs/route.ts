import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get inventory logs
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const crystalId = searchParams.get('crystalId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (crystalId) {
      where.crystalId = crystalId
    }

    if (type) {
      where.type = type
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Get logs with crystal info
    const [logs, totalCount] = await Promise.all([
      prisma.inventoryLog.findMany({
        where,
        include: {
          crystal: {
            select: {
              id: true,
              name: true,
              stockQuantity: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.inventoryLog.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Inventory logs fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get inventory analytics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { startDate, endDate, crystalId } = await request.json()

    const where: any = {}
    
    if (crystalId) {
      where.crystalId = crystalId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Get analytics data
    const [
      totalLogs,
      stockMovements,
      topRestocked,
      topSold,
      recentActivity
    ] = await Promise.all([
      // Total logs count
      prisma.inventoryLog.count({ where }),

      // Stock movements by type
      prisma.inventoryLog.groupBy({
        by: ['type'],
        where,
        _sum: { quantity: true },
        _count: { id: true }
      }),

      // Top restocked items
      prisma.inventoryLog.groupBy({
        by: ['crystalId'],
        where: {
          ...where,
          type: 'RESTOCK'
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      }),

      // Top sold items
      prisma.inventoryLog.groupBy({
        by: ['crystalId'],
        where: {
          ...where,
          type: 'SALE'
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      }),

      // Recent activity
      prisma.inventoryLog.findMany({
        where,
        include: {
          crystal: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ])

    // Get crystal names for top items
    const topRestockedIds = topRestocked.map(item => item.crystalId)
    const topSoldIds = topSold.map(item => item.crystalId)
    
    const crystalNames = await prisma.crystal.findMany({
      where: {
        id: { in: [...topRestockedIds, ...topSoldIds] }
      },
      select: { id: true, name: true }
    })

    const crystalNameMap = crystalNames.reduce((acc, crystal) => {
      acc[crystal.id] = crystal.name
      return acc
    }, {} as Record<string, string>)

    // Format top items with names
    const formattedTopRestocked = topRestocked.map(item => ({
      crystalId: item.crystalId,
      crystalName: crystalNameMap[item.crystalId] || 'Unknown',
      totalQuantity: item._sum.quantity || 0
    }))

    const formattedTopSold = topSold.map(item => ({
      crystalId: item.crystalId,
      crystalName: crystalNameMap[item.crystalId] || 'Unknown',
      totalQuantity: Math.abs(item._sum.quantity || 0)
    }))

    return NextResponse.json({
      summary: {
        totalLogs,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      },
      stockMovements: stockMovements.map(movement => ({
        type: movement.type,
        totalQuantity: movement._sum.quantity || 0,
        count: movement._count.id
      })),
      topRestocked: formattedTopRestocked,
      topSold: formattedTopSold,
      recentActivity: recentActivity.map(log => ({
        id: log.id,
        type: log.type,
        crystalName: log.crystal.name,
        quantity: log.quantity,
        previousQty: log.previousQty,
        newQty: log.newQty,
        reason: log.reason,
        createdAt: log.createdAt
      }))
    })
  } catch (error) {
    console.error('Inventory analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
