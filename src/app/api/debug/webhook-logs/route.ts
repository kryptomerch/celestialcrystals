import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory log storage (in production, use a proper logging service)
let webhookLogs: Array<{
  timestamp: string;
  type: string;
  data: any;
}> = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    logs: webhookLogs.slice(-20), // Last 20 logs
    totalLogs: webhookLogs.length,
    message: 'Recent webhook activity'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook call
    webhookLogs.push({
      timestamp: new Date().toISOString(),
      type: body.type || 'unknown',
      data: body
    });

    // Keep only last 100 logs to prevent memory issues
    if (webhookLogs.length > 100) {
      webhookLogs = webhookLogs.slice(-100);
    }

    console.log('🔔 Webhook logged:', {
      type: body.type,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook logged successfully'
    });

  } catch (error) {
    console.error('Webhook logging error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log webhook' },
      { status: 500 }
    );
  }
}
