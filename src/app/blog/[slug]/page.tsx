import { getBlogArticleBySlug } from '@/data/blog-articles';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Server-side data fetching
async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug: slug,
        OR: [
          { status: 'published' },
          { status: 'Published' },
          { status: 'PUBLISHED' },
          { publishedAt: { not: null } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
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

    if (post) {
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        author: post.author,
        category: post.category,
        tags: Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string') : [],
        readTime: post.readingTime,
        featuredImage: post.featuredImage || undefined,
        publishDate: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        isAI: true
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // First try to get static article
  const staticArticle = getBlogArticleBySlug(slug);

  if (staticArticle) {
    // Convert static article to the expected format
    const article = {
      id: staticArticle.id,
      title: staticArticle.title,
      slug: staticArticle.slug,
      excerpt: staticArticle.excerpt,
      content: staticArticle.content,
      author: staticArticle.author,
      category: staticArticle.category,
      tags: staticArticle.tags,
      readTime: staticArticle.readTime,
      featuredImage: staticArticle.featuredImage,
      publishDate: staticArticle.publishDate,
      isAI: false
    };

    return <BlogPostClient article={article} />;
  }

  // If no static article found, try to fetch AI-generated post
  const databasePost = await getBlogPost(slug);

  if (databasePost) {
    return <BlogPostClient article={databasePost} />;
  }

  // If neither static nor database post found, return 404
  notFound();
}
