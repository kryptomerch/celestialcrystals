import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAnalyticsData } from '@/lib/analytics'

// Helper functions for real data
async function getTopProducts(period: number) {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['crystalId'],
      where: {
        order: {
          createdAt: {
            gte: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        }
      },
      _sum: {
        quantity: true,
        price: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          price: 'desc'
        }
      },
      take: 5
    });

    return topProducts.map(item => ({
      crystalId: item.crystalId,
      name: `Crystal ${item.crystalId}`,
      quantitySold: item._sum.quantity || 0,
      revenue: item._sum.price || 0,
      orderCount: item._count.id
    }));
  } catch (error) {
    return [];
  }
}

async function getRecentOrders() {
  try {
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: true
      }
    });

    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Guest' : 'Guest',
      totalAmount: order.totalAmount,
      status: order.status,
      itemCount: order.items.length,
      createdAt: order.createdAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    return [];
  }
}

async function getInventoryStats() {
  try {
    const stats = await prisma.crystal.aggregate({
      _count: {
        id: true
      },
      _sum: {
        stockQuantity: true
      },
      where: {
        isActive: true
      }
    });

    return {
      totalProducts: stats._count.id || 0,
      totalStock: stats._sum.stockQuantity || 0
    };
  } catch (error) {
    return {
      totalProducts: 0,
      totalStock: 0
    };
  }
}

async function getReviewStats() {
  try {
    const stats = await prisma.review.aggregate({
      _count: {
        id: true
      },
      _avg: {
        rating: true
      }
    });

    return {
      totalReviews: stats._count.id || 0,
      averageRating: Math.round((stats._avg.rating || 0) * 10) / 10
    };
  } catch (error) {
    return {
      totalReviews: 0,
      averageRating: 0
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin authorization
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id) || isAdminEmail(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')

    // Get real analytics data
    const analyticsData = await getAnalyticsData(period);

    // Get real order data
    const [orders, customers, revenue] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(Date.now() - period * 24 * 60 * 60 * 1000)
          }
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    // Return only real data
    const responseData = {
      overview: {
        totalRevenue: revenue._sum.totalAmount || 0,
        totalOrders: orders,
        totalCustomers: customers,
        averageOrderValue: orders > 0 ? (revenue._sum.totalAmount || 0) / orders : 0,
        revenueGrowth: 0, // Calculate this based on previous period
        ...analyticsData.overview
      },
      charts: analyticsData.charts,
      topProducts: await getTopProducts(period),
      recentOrders: await getRecentOrders(),
      inventory: await getInventoryStats(),
      reviews: await getReviewStats()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
