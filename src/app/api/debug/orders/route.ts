import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking orders in database...');

    // Get total count of orders
    const totalOrders = await prisma.order.count();
    console.log(`📊 Total orders in database: ${totalOrders}`);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        items: {
          include: {
            crystal: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    console.log('📋 Recent orders:', recentOrders);

    // Get total users
    const totalUsers = await prisma.user.count();
    console.log(`👥 Total users in database: ${totalUsers}`);

    // Get total crystals
    const totalCrystals = await prisma.crystal.count();
    console.log(`💎 Total crystals in database: ${totalCrystals}`);

    // Check for any payment intents
    const ordersWithPaymentIntents = await prisma.order.findMany({
      where: {
        paymentIntentId: {
          not: null
        }
      },
      select: {
        id: true,
        orderNumber: true,
        paymentIntentId: true,
        paymentStatus: true,
        totalAmount: true,
        createdAt: true
      }
    });

    console.log('💳 Orders with payment intents:', ordersWithPaymentIntents);

    return NextResponse.json({
      success: true,
      debug: {
        totalOrders,
        totalUsers,
        totalCrystals,
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
          customerEmail: order.user.email,
          customerName: `${order.user.firstName} ${order.user.lastName}`,
          itemCount: order.items.length,
          createdAt: order.createdAt,
          paymentIntentId: order.paymentIntentId
        })),
        ordersWithPaymentIntents: ordersWithPaymentIntents.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug orders error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
