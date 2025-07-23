import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
        isAIGenerated: true
      }
    });

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
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
