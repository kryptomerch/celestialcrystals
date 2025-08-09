import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

    const { postId, action } = await request.json();

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Post ID and action are required' },
        { status: 400 }
      );
    }

    if (!['publish', 'unpublish'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "publish" or "unpublish"' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Update post status
    const newStatus = action === 'publish' ? 'published' : 'draft';
    const updateData: any = {
      status: newStatus,
      updatedAt: new Date()
    };

    // If publishing, set publishedAt timestamp
    if (action === 'publish' && post.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: updateData
    });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${updatedPost.slug}`);
    } catch (e) {
      console.warn('revalidatePath failed (non-blocking):', e);
    }

    return NextResponse.json({
      success: true,
      message: `Blog post ${action}ed successfully`,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        status: updatedPost.status,
        publishedAt: updatedPost.publishedAt,
        updatedAt: updatedPost.updatedAt
      }
    });

  } catch (error) {
    console.error('Blog post publish/unpublish error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post status' },
      { status: 500 }
    );
  }
}
