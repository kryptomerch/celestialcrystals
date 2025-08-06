import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin authorization
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id) || isAdminEmail(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const params = await context.params;
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get the blog post (including drafts)
    const post = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        category: post.category,
        featuredImage: post.featuredImage,
        author: post.author,
        tags: post.tags,
        status: post.status,
        isAIGenerated: post.isAIGenerated,
        readingTime: post.readingTime,
        views: post.views,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });

  } catch (error) {
    console.error('Blog post preview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post preview' },
      { status: 500 }
    );
  }
}
