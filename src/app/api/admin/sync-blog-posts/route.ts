import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { blogArticles } from '@/data/blog-articles';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6h1jKNvgDCVE@ep-divine-sunset-ad5sal24-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Syncing static blog posts to database...');

    const syncedPosts = [];

    for (const article of blogArticles) {
      // Check if post already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: article.slug }
      });

      if (existingPost) {
        console.log(`⏭️ Post already exists: ${article.title}`);
        continue;
      }

      // Create new blog post in database
      const blogPost = await prisma.blogPost.create({
        data: {
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          author: article.author,
          category: article.category,
          tags: JSON.stringify(article.tags),
          readingTime: article.readTime,
          featuredImage: article.featuredImage,
          images: JSON.stringify([article.featuredImage]),
          status: 'published',
          isAIGenerated: false,
          publishedAt: new Date(article.publishDate),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      syncedPosts.push({
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        status: 'synced'
      });

      console.log(`✅ Synced: ${article.title}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedPosts.length} blog posts to database`,
      syncedPosts,
      totalStaticPosts: blogArticles.length
    });

  } catch (error) {
    console.error('Error syncing blog posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to sync blog posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    // Check current blog post status
    const dbPosts = await prisma.blogPost.count();
    const staticPosts = blogArticles.length;

    const staticPostsInDb = [];
    for (const article of blogArticles) {
      const exists = await prisma.blogPost.findUnique({
        where: { slug: article.slug },
        select: { id: true, title: true, slug: true, status: true }
      });

      staticPostsInDb.push({
        title: article.title,
        slug: article.slug,
        inDatabase: !!exists,
        status: exists?.status || 'not_synced'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post sync status',
      data: {
        totalDbPosts: dbPosts,
        totalStaticPosts: staticPosts,
        staticPostsStatus: staticPostsInDb,
        needsSync: staticPostsInDb.some(post => !post.inDatabase)
      }
    });

  } catch (error) {
    console.error('Error checking blog post status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check blog post status'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
