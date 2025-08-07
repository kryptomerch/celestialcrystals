import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Fetching published blog posts...');

    // Fetch only published blog posts for public access
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published'
      },
      orderBy: {
        publishedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        author: true,
        category: true,
        tags: true,
        readingTime: true,
        featuredImage: true,
        images: true,
        crystalId: true,
        publishedAt: true,
        createdAt: true,
        isAIGenerated: true,
        status: true
      }
    });

    console.log(`✅ Found ${posts.length} published blog posts`);
    posts.forEach(post => {
      console.log(`📝 Post: "${post.title}" - Status: ${post.status} - Published: ${post.publishedAt}`);
    });

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('❌ Error fetching published blog posts:', error);

    // If database connection fails, return empty state for graceful degradation
    if (error instanceof Error && error.message.includes('password authentication failed')) {
      console.log('🔄 Database connection failed, returning empty blog posts for graceful degradation');
      return NextResponse.json({
        success: true,
        posts: [],
        count: 0,
        message: 'Blog posts temporarily unavailable'
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
