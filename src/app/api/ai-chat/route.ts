import { NextRequest, NextResponse } from 'next/server';
import { deepseekAI } from '@/lib/deepseek-ai';

export async function POST(request: NextRequest) {
  let message: string = '';
  let type: string = 'general_chat';

  try {
    const body = await request.json();
    message = body.message;
    type = body.type || 'general_chat';

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let response: any;

    switch (type) {
      case 'blog_generation':
        response = await deepseekAI.generateCustomContent(
          `Generate a comprehensive blog post about crystal healing. Include title, content, excerpt, tags, and category. Format as JSON.`,
          'blog'
        );
        break;

      case 'product_description':
        response = await deepseekAI.generateCustomContent(
          `Generate a compelling product description for a crystal bracelet: ${message}`,
          'guide'
        );
        break;

      case 'email_content':
        response = await deepseekAI.generateCustomContent(
          `Generate email content: ${message}`,
          'blog'
        );
        break;

      case 'general_chat':
      default:
        // Use simple response for general chat
        const simpleResponse = await deepseekAI.generateSimpleResponse(message);
        response = {
          title: 'AI Response',
          content: simpleResponse,
          excerpt: simpleResponse.substring(0, 150) + '...',
          tags: ['ai-chat', 'crystal-healing']
        };
        break;
    }

    return NextResponse.json({
      success: true,
      response,
      type
    });

  } catch (error) {
    console.error('AI Chat error:', error);

    // Try fallback response
    try {
      const fallbackResponse = await fetch(`${process.env.VERCEL_URL || 'https://thecelestial.xyz'}/api/ai-chat-fallback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, type: type })
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return NextResponse.json({
          success: true,
          response: fallbackData.response,
          type,
          fallback: true,
          note: 'Using fallback response due to AI service error'
        });
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Try refreshing the page or using simpler requests'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Chat API is active',
    availableTypes: [
      'general_chat',
      'blog_generation',
      'product_description',
      'email_content'
    ],
    usage: {
      general_chat: 'POST with { "message": "your question", "context": "optional context" }',
      blog_generation: 'POST with { "message": "generate blog", "type": "blog_generation", "context": "{\\"topic\\": \\"Crystal Healing\\", \\"crystalName\\": \\"Amethyst\\"}" }',
      product_description: 'POST with { "message": "generate description", "type": "product_description", "context": "{\\"crystalName\\": \\"Rose Quartz\\", \\"properties\\": [\\"Love\\", \\"Healing\\"], \\"category\\": \\"Love\\"}" }',
      email_content: 'POST with { "message": "generate email", "type": "email_content", "context": "{\\"emailType\\": \\"welcome\\", \\"data\\": {}}" }'
    }
  });
}
