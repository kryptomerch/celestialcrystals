import { prisma } from '@/lib/prisma';

export interface AnalyticsEvent {
  event: string;
  page?: string;
  userId?: string;
  sessionId?: string;
  data?: any;
}

// Track an analytics event
export async function trackEvent(event: AnalyticsEvent) {
  try {
    // For now, just log analytics events
    // TODO: Implement proper analytics storage when needed
    console.log('📊 Analytics event:', {
      event: event.event,
      page: event.page,
      userId: event.userId,
      sessionId: event.sessionId,
      data: event.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
}

// Get analytics data for admin dashboard
export async function getAnalyticsData(period: number = 30) {
  try {
    console.log('✅ Mock: Getting analytics data for period:', period);

    // Mock analytics data
    const totalViews = Math.floor(Math.random() * 1000) + 500;
    const uniqueVisitors = Math.floor(Math.random() * 200) + 100;
    const crystalViews = Math.floor(Math.random() * 300) + 150;
    const addToCarts = Math.floor(Math.random() * 50) + 25;
    const purchases = Math.floor(Math.random() * 20) + 10;
    const blogViews = Math.floor(Math.random() * 100) + 50;

    // Mock daily breakdown
    const dailyViews = Array.from({ length: period }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (period - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 100) + 20
      };
    });

    // Mock top pages
    const topPages = [
      { page: '/', _count: { page: Math.floor(Math.random() * 200) + 100 } },
      { page: '/crystals', _count: { page: Math.floor(Math.random() * 150) + 80 } },
      { page: '/blog', _count: { page: Math.floor(Math.random() * 100) + 50 } },
      { page: '/about', _count: { page: Math.floor(Math.random() * 80) + 30 } },
      { page: '/contact', _count: { page: Math.floor(Math.random() * 60) + 20 } },
    ];

    // Mock top crystals
    const topCrystals = [
      { data: 'triple-protection-1', _count: { data: Math.floor(Math.random() * 50) + 25 } },
      { data: 'lava-7-chakra-1', _count: { data: Math.floor(Math.random() * 40) + 20 } },
      { data: 'blue-aquamarine-1', _count: { data: Math.floor(Math.random() * 35) + 15 } },
      { data: 'money-magnet-1', _count: { data: Math.floor(Math.random() * 30) + 10 } },
    ];

    return {
      overview: {
        totalViews,
        uniqueVisitors,
        crystalViews,
        addToCarts,
        purchases,
        blogViews,
        conversionRate: totalViews > 0 ? ((purchases / totalViews) * 100).toFixed(2) : '0.00'
      },
      charts: {
        dailyViews: dailyViews.map(item => ({
          date: item.date,
          views: Number(item.views)
        }))
      },
      topPages: topPages.map(item => ({
        page: item.page,
        views: item._count.page
      })),
      topCrystals: topCrystals.map(item => ({
        crystalId: typeof item.data === 'object' && item.data && 'crystalId' in item.data
          ? (item.data as any).crystalId
          : 'unknown',
        views: item._count.data
      }))
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return {
      overview: {
        totalViews: 0,
        uniqueVisitors: 0,
        crystalViews: 0,
        addToCarts: 0,
        purchases: 0,
        blogViews: 0,
        conversionRate: '0.00'
      },
      charts: {
        dailyViews: []
      },
      topPages: [],
      topCrystals: []
    };
  }
}

// Track page view
export async function trackPageView(page: string, userId?: string, sessionId?: string) {
  await trackEvent({
    event: 'page_view',
    page,
    userId,
    sessionId
  });
}

// Track crystal view
export async function trackCrystalView(crystalId: string, userId?: string, sessionId?: string) {
  await trackEvent({
    event: 'crystal_view',
    userId,
    sessionId,
    data: { crystalId }
  });
}

// Track add to cart
export async function trackAddToCart(crystalId: string, quantity: number, userId?: string, sessionId?: string) {
  await trackEvent({
    event: 'add_to_cart',
    userId,
    sessionId,
    data: { crystalId, quantity }
  });
}

// Track purchase
export async function trackPurchase(orderId: string, totalAmount: number, items: any[], userId?: string, sessionId?: string) {
  await trackEvent({
    event: 'purchase',
    userId,
    sessionId,
    data: { orderId, totalAmount, items }
  });
}

// Track blog view
export async function trackBlogView(blogId: string, userId?: string, sessionId?: string) {
  await trackEvent({
    event: 'blog_view',
    userId,
    sessionId,
    data: { blogId }
  });

  // Mock: Blog post view count increment
  console.log('✅ Mock: Blog post view count incremented for:', blogId);
}
