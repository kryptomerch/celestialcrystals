import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
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
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      author,
      status
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Generate slug from title if title changed
    const slug = title !== existingPost.title
      ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      : existingPost.slug;

    // Calculate reading time
    const readingTime = Math.ceil(content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200);

    // Update blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
        slug,
        category: category || existingPost.category,
        featuredImage: featuredImage || existingPost.featuredImage,
        author: author || existingPost.author,
        tags: tags || existingPost.tags,
        status: status || existingPost.status,
        readingTime,
        updatedAt: new Date(),
        // Set publishedAt if status changed to published and wasn't published before
        publishedAt: status === 'published' && existingPost.status !== 'published'
          ? new Date()
          : existingPost.publishedAt
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Blog post update error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id: postId }
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
