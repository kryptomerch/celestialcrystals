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

    // Get recent orders and their email status
    const recentOrders = await prisma.order.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Check environment variables for email configuration
    const emailConfig = {
      resendConfigured: !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here'),
      smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_USER !== 'your_email@gmail.com'),
      fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev'
    };

    // Format order data with email status indicators
    const ordersWithEmailStatus = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown',
      customerEmail: order.user.email,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      // Email status indicators
      shouldHaveReceivedEmail: order.paymentStatus === 'PAID',
      timeSinceOrder: Date.now() - order.createdAt.getTime(),
      orderAge: Math.floor((Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60)), // hours
    }));

    return NextResponse.json({
      success: true,
      emailConfig,
      orders: ordersWithEmailStatus,
      summary: {
        totalOrders: recentOrders.length,
        paidOrders: recentOrders.filter(o => o.paymentStatus === 'PAID').length,
        recentOrders: recentOrders.filter(o => Date.now() - o.createdAt.getTime() < 24 * 60 * 60 * 1000).length,
        emailSystemStatus: emailConfig.resendConfigured || emailConfig.smtpConfigured ? 'Configured' : 'Not Configured'
      }
    });

  } catch (error) {
    console.error('❌ Error in email status API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch email status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test email delivery for a specific order
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { orderId, testEmail } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Send test email for the order
    const testResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/test-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        email: testEmail
      })
    });

    const testResult = await testResponse.json();

    if (testResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        result: testResult
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send test email',
          details: testResult
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
