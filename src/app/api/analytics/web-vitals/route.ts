import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Log Web Vitals data
    console.log('Web Vitals:', {
      name: data.name,
      value: data.value,
      url: data.url,
      timestamp: new Date(data.timestamp)
    });

    // Store in database (optional) - TODO: Add analyticsEvent table to schema
    // For now, we'll just log to console and send to Google Analytics
    // try {
    //   await prisma.analyticsEvent.create({
    //     data: {
    //       event: 'web_vital',
    //       page: data.url,
    //       data: {
    //         name: data.name,
    //         value: data.value,
    //         id: data.id,
    //         label: data.label,
    //         delta: data.delta
    //       },
    //       timestamp: new Date(data.timestamp)
    //     }
    //   });
    // } catch (dbError) {
    //   console.error('Failed to store web vitals in database:', dbError);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web Vitals API error:', error);
    return NextResponse.json({ error: 'Failed to process web vitals' }, { status: 500 });
  }
}
