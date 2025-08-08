import { getBlogArticleBySlug } from '@/data/blog-articles';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';

// Server-side data fetching
async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug: slug,
        status: 'published'
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
        tags: Array.isArray(post.tags) ? post.tags : [],
        readTime: post.readingTime,
        featuredImage: post.featuredImage,
        publishDate: post.publishedAt || post.createdAt,
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
  params: {
    slug: string;
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = params;

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
