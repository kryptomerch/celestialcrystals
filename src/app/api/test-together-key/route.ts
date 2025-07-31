import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Test the API key with a simple request to Together AI
    const response = await fetch('https://api.together.xyz/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: 'API key is valid!',
        modelsCount: data.length || 0
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: Invalid API key`
      });
    }
  } catch (error) {
    console.error('API key test error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test API key' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Check if environment API key is configured
  const apiKey = process.env.TOGETHER_API_KEY;
  
  if (!apiKey || apiKey === 'your_together_ai_api_key_here') {
    return NextResponse.json({
      success: false,
      error: 'TOGETHER_API_KEY not configured in environment variables'
    });
  }

  try {
    // Test the environment API key
    const response = await fetch('https://api.together.xyz/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Environment API key is valid!',
        keyPreview: `${apiKey.substring(0, 12)}...`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Environment API key is invalid'
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test environment API key'
    });
  }
}
