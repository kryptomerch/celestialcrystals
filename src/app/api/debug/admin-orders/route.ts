import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking admin orders API...');

    // Try to get orders directly from database
    let orders: any[] = [];
    let totalCount = 0;
    let dbError = null;

    try {
      [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
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
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }),
        prisma.order.count()
      ]);

      console.log(`📊 Found ${totalCount} orders in database`);
      console.log('📦 Orders:', orders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.totalAmount,
        userEmail: o.user?.email,
        itemCount: o.items?.length || 0
      })));

    } catch (error) {
      dbError = error;
      console.error('❌ Database error:', error);
    }

    return NextResponse.json({
      success: true,
      debug: {
        totalOrders: totalCount,
        dbError: dbError ? (dbError instanceof Error ? dbError.message : String(dbError)) : null,
        orders: orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          userEmail: order.user?.email,
          userName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
          itemCount: order.items?.length || 0,
          createdAt: order.createdAt
        })),
        rawOrdersCount: orders.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug admin orders error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to debug admin orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
