import { blogArticles } from '@/data/blog-articles';
import { prisma } from '@/lib/prisma';
import BlogPageClient from './BlogPageClient';

export const dynamic = 'force-dynamic';

// Server-side data fetching
async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        OR: [
          { status: 'published' },
          { status: 'Published' },
          { status: 'PUBLISHED' },
          { publishedAt: { not: null } }
        ]
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

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      author: post.author,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      readTime: post.readingTime,
      featuredImage: post.featuredImage || undefined,
      publishDate: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      isAI: true
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  // Fetch database posts server-side
  const databasePosts = await getBlogPosts();

  // Combine static articles with database posts (hide static in production)
  const includeStatic = process.env.NEXT_PUBLIC_INCLUDE_STATIC_BLOG === 'true' || true; // force include until sync
  const allArticles = [
    ...(includeStatic ? blogArticles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      tags: article.tags,
      readTime: article.readTime,
      featuredImage: article.featuredImage,
      publishDate: article.publishDate,
      isAI: false
    })) : []),
    ...databasePosts
  ];

  return <BlogPageClient allArticles={allArticles} />;
}
