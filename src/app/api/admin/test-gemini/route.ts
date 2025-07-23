import { NextRequest, NextResponse } from 'next/server';
import { GeminiAIService } from '@/lib/gemini-ai';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Gemini AI connection...');
    
    // Test basic connection
    const isConnected = await GeminiAIService.testConnection();
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Gemini AI connection failed',
        details: 'Unable to connect to Gemini AI service'
      }, { status: 500 });
    }

    // Test blog generation
    const testBlog = await GeminiAIService.generateBlogPost({
      topic: 'Crystal Healing Benefits',
      crystalName: 'Amethyst',
      keywords: ['healing', 'meditation', 'spiritual'],
      tone: 'educational',
      length: 'short'
    });

    // Test social media generation
    const testSocial = await GeminiAIService.generateSocialMediaPost({
      platform: 'instagram',
      topic: 'Daily Crystal Affirmation',
      crystalName: 'Rose Quartz',
      includeHashtags: true,
      tone: 'inspirational'
    });

    return NextResponse.json({
      success: true,
      message: 'Gemini AI is working correctly!',
      tests: {
        connection: true,
        blogGeneration: {
          title: testBlog.title,
          contentLength: testBlog.content.length,
          tags: testBlog.tags
        },
        socialMediaGeneration: {
          platform: testSocial.platform,
          contentLength: testSocial.content.length,
          hashtags: testSocial.hashtags?.length || 0
        }
      },
      apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Missing'
    });

  } catch (error) {
    console.error('Gemini AI test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Gemini AI test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Missing'
    }, { status: 500 });
  }
}
