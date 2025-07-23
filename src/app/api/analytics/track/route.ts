import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      );
    }

    // Extract analytics data
    const analyticsData = {
      event,
      page: data?.page,
      userId: data?.userId,
      sessionId: data?.sessionId,
      data: data
    };

    // Track the event
    await trackEvent(analyticsData);

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
