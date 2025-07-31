import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin with multiple fallback methods
    let isAdmin = false;

    // Method 1: Check environment variable first (most reliable)
    if (session.user.email === process.env.ADMIN_EMAIL) {
      isAdmin = true;
      console.log('Admin access granted via ADMIN_EMAIL environment variable');
    }

    // Method 2: Check common admin emails
    const adminEmails = [
      'kryptomerch.io@gmail.com',
      'dhruvaparik@gmail.com',
      'admin@thecelestial.xyz',
      'admin@celestialcrystals.com',
    ];

    if (!isAdmin && adminEmails.includes(session.user.email)) {
      isAdmin = true;
      console.log('Admin access granted via admin email list');
    }

    // Method 3: Try database check (if available)
    if (!isAdmin) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        if (user?.role === 'ADMIN') {
          isAdmin = true;
          console.log('Admin access granted via database role');
        }
      } catch (dbError) {
        console.log('Database check failed, relying on environment/email checks');
      }
    }

    if (!isAdmin) {
      console.log(`Access denied for email: ${session.user.email}`);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log(`Admin access granted for: ${session.user.email}`);

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')

    console.log('📊 Fetching analytics data for period:', period);

    // Try to get real data, but provide fallback if database is not available
    let orders = 0, customers = 0, revenue: any = { _sum: { totalAmount: 0 } };
    let topProducts: any[] = [];
    let recentOrders: any[] = [];
    let inventoryStats = { totalProducts: 0, totalStock: 0 };
    let reviewStats = { totalReviews: 0, averageRating: 0 };

    try {
      // Get real order data
      [orders, customers, revenue] = await Promise.all([
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

      // Get additional stats
      [topProducts, recentOrders, inventoryStats, reviewStats] = await Promise.all([
        getTopProducts(period),
        getRecentOrders(),
        getInventoryStats(),
        getReviewStats()
      ]);
    } catch (dbError) {
      console.log('Database query failed, showing empty state');

      // Show empty/zero data - no mock data
      orders = 0;
      customers = 0;
      revenue = { _sum: { totalAmount: 0 } };
      topProducts = [];
      recentOrders = [];
      inventoryStats = { totalProducts: 0, totalStock: 0 };
      reviewStats = { totalReviews: 0, averageRating: 0 };
    }

    // Return simplified analytics data
    const responseData = {
      overview: {
        totalRevenue: revenue._sum.totalAmount || 0,
        totalOrders: orders,
        totalCustomers: customers,
        averageOrderValue: orders > 0 ? (revenue._sum.totalAmount || 0) / orders : 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        customersGrowth: 0,
        avgOrderGrowth: 0
      },
      charts: {
        revenue: [],
        orders: [],
        customers: []
      },
      topProducts,
      recentOrders,
      inventory: inventoryStats,
      reviews: reviewStats
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
