import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const period = searchParams.get('period') || '30' // days
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let dateFilter: any = {}
    
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      const daysAgo = parseInt(period)
      dateFilter = {
        gte: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      }
    }

    // Sales Analytics
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      salesByDay,
      topProducts,
      recentOrders,
      customerGrowth,
      inventoryStats,
      reviewStats
    ] = await Promise.all([
      // Total Revenue
      prisma.order.aggregate({
        where: {
          createdAt: dateFilter,
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
        },
        _sum: { totalAmount: true }
      }),

      // Total Orders
      prisma.order.count({
        where: {
          createdAt: dateFilter,
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
        }
      }),

      // Total Customers
      prisma.user.count({
        where: { createdAt: dateFilter }
      }),

      // Average Order Value
      prisma.order.aggregate({
        where: {
          createdAt: dateFilter,
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
        },
        _avg: { totalAmount: true }
      }),

      // Sales by Day (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as orders,
          SUM(total_amount) as revenue
        FROM orders 
        WHERE created_at >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
          AND status IN ('PROCESSING', 'SHIPPED', 'DELIVERED')
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,

      // Top Products
      prisma.orderItem.groupBy({
        by: ['crystalId'],
        where: {
          order: {
            createdAt: dateFilter,
            status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
          }
        },
        _sum: { quantity: true, price: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      }),

      // Recent Orders
      prisma.order.findMany({
        where: { createdAt: dateFilter },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }
          },
          items: {
            include: {
              crystal: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Customer Growth
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_customers
        FROM users 
        WHERE created_at >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,

      // Inventory Stats
      prisma.crystal.aggregate({
        where: { isActive: true },
        _count: { id: true },
        _sum: { stockQuantity: true }
      }),

      // Review Stats
      prisma.review.aggregate({
        where: {
          createdAt: dateFilter,
          isApproved: true
        },
        _count: { id: true },
        _avg: { rating: true }
      })
    ])

    // Get crystal names for top products
    const topProductIds = topProducts.map(p => p.crystalId)
    const crystalNames = await prisma.crystal.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, price: true }
    })

    const crystalNameMap = crystalNames.reduce((acc, crystal) => {
      acc[crystal.id] = crystal
      return acc
    }, {} as Record<string, any>)

    // Format top products with names
    const formattedTopProducts = topProducts.map(product => ({
      crystalId: product.crystalId,
      name: crystalNameMap[product.crystalId]?.name || 'Unknown',
      price: crystalNameMap[product.crystalId]?.price || 0,
      quantitySold: product._sum.quantity || 0,
      revenue: product._sum.price || 0,
      orderCount: product._count.id
    }))

    // Calculate growth rates
    const previousPeriodStart = new Date(dateFilter.gte.getTime() - (dateFilter.gte.getTime() - Date.now()))
    const previousRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: dateFilter.gte
        },
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: { totalAmount: true }
    })

    const revenueGrowth = previousRevenue._sum.totalAmount 
      ? ((totalRevenue._sum.totalAmount || 0) - (previousRevenue._sum.totalAmount || 0)) / (previousRevenue._sum.totalAmount || 1) * 100
      : 0

    return NextResponse.json({
      overview: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalOrders,
        totalCustomers,
        averageOrderValue: averageOrderValue._avg.totalAmount || 0,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100
      },
      charts: {
        salesByDay: salesByDay,
        customerGrowth: customerGrowth
      },
      topProducts: formattedTopProducts,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
        totalAmount: order.totalAmount,
        status: order.status,
        itemCount: order.items.length,
        createdAt: order.createdAt
      })),
      inventory: {
        totalProducts: inventoryStats._count.id || 0,
        totalStock: inventoryStats._sum.stockQuantity || 0
      },
      reviews: {
        totalReviews: reviewStats._count.id || 0,
        averageRating: reviewStats._avg.rating || 0
      }
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get customer analytics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { type } = await request.json()

    if (type === 'customers') {
      // Customer segmentation
      const [
        totalCustomers,
        activeCustomers,
        newCustomers,
        returningCustomers,
        topCustomers,
        customersByLocation
      ] = await Promise.all([
        // Total customers
        prisma.user.count(),

        // Active customers (ordered in last 30 days)
        prisma.user.count({
          where: {
            orders: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          }
        }),

        // New customers (registered in last 30 days)
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),

        // Returning customers (more than 1 order)
        prisma.user.count({
          where: {
            orders: {
              some: {}
            }
          }
        }),

        // Top customers by revenue
        prisma.user.findMany({
          include: {
            orders: {
              where: {
                status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
              },
              select: {
                totalAmount: true
              }
            },
            _count: {
              select: { orders: true }
            }
          },
          take: 10
        }),

        // Customers by location (if addresses available)
        prisma.address.groupBy({
          by: ['state'],
          _count: { userId: true },
          orderBy: { _count: { userId: 'desc' } },
          take: 10
        })
      ])

      // Calculate customer lifetime values
      const topCustomersWithLTV = topCustomers
        .map(customer => ({
          id: customer.id,
          name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email,
          email: customer.email,
          totalOrders: customer._count.orders,
          totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
          joinedAt: customer.createdAt
        }))
        .filter(customer => customer.totalSpent > 0)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10)

      return NextResponse.json({
        summary: {
          totalCustomers,
          activeCustomers,
          newCustomers,
          returningCustomers,
          retentionRate: totalCustomers > 0 ? (returningCustomers / totalCustomers * 100) : 0
        },
        topCustomers: topCustomersWithLTV,
        locationDistribution: customersByLocation.map(location => ({
          state: location.state,
          customerCount: location._count.userId
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
  } catch (error) {
    console.error('Customer analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
