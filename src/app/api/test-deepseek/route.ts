import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'DEEPSEEK_API_KEY not found in environment variables',
      instructions: 'Add DEEPSEEK_API_KEY=your_together_ai_key to your .env.local file'
    });
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant.'
          },
          {
            role: 'user',
            content: 'Say hello and confirm you are working!'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Together AI API error: ${response.status}`,
        details: errorText,
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Together AI connection successful!',
      response: data.choices[0]?.message?.content || 'No content received',
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to Together AI',
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
    });
  }
}

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({
      success: false,
      error: 'Message is required'
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'DEEPSEEK_API_KEY not configured'
    });
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert crystal healer and spiritual guide. Provide helpful, informative responses about crystals, healing, and spiritual practices.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Together AI API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.choices[0]?.message?.content || 'No content received'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get AI response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
