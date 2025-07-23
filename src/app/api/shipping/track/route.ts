import { NextRequest, NextResponse } from 'next/server';
import { CanadaPostService } from '@/lib/shipping/canada-post';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const trackingInfo = await CanadaPostService.trackShipment(trackingNumber);

    return NextResponse.json({
      success: true,
      trackingNumber,
      trackingInfo,
    });

  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json(
      { error: 'Failed to track shipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { trackingNumber } = await request.json();

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const trackingInfo = await CanadaPostService.trackShipment(trackingNumber);

    return NextResponse.json({
      success: true,
      trackingNumber,
      trackingInfo,
    });

  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json(
      { error: 'Failed to track shipment' },
      { status: 500 }
    );
  }
}
