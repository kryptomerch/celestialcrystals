import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdminEmail(email: string): boolean {
  const adminEmails = [
    'kryptomerch.io@gmail.com',
    'dhruvaparik@gmail.com',
    'dhruvshah8888@gmail.com',
    'admin@thecelestial.xyz',
    'admin@celestialcrystals.com'
  ];
  return adminEmails.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    console.log('🔍 Fetching orders with where clause:', where);

    // Get orders from database
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          items: {
            include: {
              crystal: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  price: true
                }
              }
            }
          },
          shippingAddress: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true,
              address1: true,
              address2: true,
              city: true,
              state: true,
              zipCode: true,
              country: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    console.log(`✅ Successfully fetched ${orders.length} orders out of ${totalCount} total`);

    // Get summary statistics
    const stats = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Format the response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.totalAmount,
      subtotal: order.subtotal,
      shippingAmount: order.shippingAmount,
      taxAmount: order.taxAmount,
      discountAmount: order.discountAmount,
      createdAt: order.createdAt.toISOString(),
      user: {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName || '',
        lastName: order.user.lastName || ''
      },
      shippingAddress: order.shippingAddress ? {
        id: order.shippingAddress.id,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        company: order.shippingAddress.company,
        address1: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone
      } : null,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        crystal: {
          id: item.crystal.id,
          name: item.crystal.name,
          image: item.crystal.image,
          price: item.crystal.price
        }
      }))
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      summary: {
        totalRevenue: stats._sum.totalAmount || 0,
        totalOrders: stats._count.id || 0,
        statusBreakdown: statusCounts.reduce((acc: any, item: any) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('❌ Error in admin orders API:', error);

    // If database connection fails, return empty state for local development
    if (error instanceof Error && error.message.includes('password authentication failed')) {
      console.log('🔄 Database connection failed, returning empty state for local development');
      return NextResponse.json({
        success: true,
        orders: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          statusBreakdown: {}
        }
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
