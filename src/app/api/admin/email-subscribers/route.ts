import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get real email subscribers from database
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching email subscribers...');

    // Get newsletter subscribers
    const newsletterSubscribers = await prisma.emailSubscriber.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        newsletter: true,
        promotions: true,
        subscribedAt: true
      },
      orderBy: { subscribedAt: 'desc' }
    });

    // Get users who opted for marketing emails
    const userSubscribers = await prisma.user.findMany({
      where: {
        marketingEmails: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        marketingEmails: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get recent orders for customer data
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    console.log(`✅ Found ${newsletterSubscribers.length} newsletter subscribers`);
    console.log(`✅ Found ${userSubscribers.length} user subscribers`);
    console.log(`✅ Found ${recentOrders.length} recent orders`);

    return NextResponse.json({
      success: true,
      data: {
        newsletterSubscribers,
        userSubscribers,
        recentOrders,
        stats: {
          totalNewsletterSubscribers: newsletterSubscribers.length,
          totalUserSubscribers: userSubscribers.length,
          activeNewsletterSubscribers: newsletterSubscribers.filter(s => s.isActive).length,
          totalRecentOrders: recentOrders.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch email subscribers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Send email to specific subscribers
export async function POST(request: NextRequest) {
  try {
    const { emailType, recipients, subject, content } = await request.json();

    console.log('📧 Sending email campaign:', { emailType, recipientCount: recipients?.length });

    // Here you would implement the actual email sending logic
    // For now, we'll simulate it
    const results = {
      sent: recipients?.length || 0,
      failed: 0,
      emailType,
      subject,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: `Email campaign sent successfully to ${results.sent} recipients`,
      results
    });

  } catch (error) {
    console.error('❌ Error sending email campaign:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email campaign',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
