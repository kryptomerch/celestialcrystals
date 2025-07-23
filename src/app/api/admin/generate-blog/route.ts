import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth';
import { generateAndSaveBlogPost, getBlogStats, getAllBlogPosts } from '@/lib/blog-automation';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { crystalId, count = 1 } = body;

    if (count > 1) {
      const posts = [];
      for (let i = 0; i < count; i++) {
        const post = await generateAndSaveBlogPost();
        posts.push(post);
      }
      return NextResponse.json({
        success: true,
        posts,
        message: `Generated and saved ${posts.length} blog posts successfully`
      });
    } else {
      const post = await generateAndSaveBlogPost(crystalId);
      return NextResponse.json({
        success: true,
        post,
        message: 'Blog post generated and saved successfully'
      });
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = getBlogStats();
    return NextResponse.json({
      success: true,
      stats,
      message: 'Blog generation statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting blog stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get blog statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
