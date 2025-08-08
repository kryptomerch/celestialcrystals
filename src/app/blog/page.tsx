import { blogArticles } from '@/data/blog-articles';
import { prisma } from '@/lib/prisma';
import BlogPageClient from './BlogPageClient';

// Server-side data fetching
async function getBlogPosts() {
  try {
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

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      author: post.author,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags : [],
      readTime: post.readingTime,
      featuredImage: post.featuredImage,
      publishDate: post.publishedAt || post.createdAt,
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

  // Combine static articles with database posts
  const allArticles = [
    ...blogArticles.map(article => ({
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
    })),
    ...databasePosts
  ];

  return <BlogPageClient allArticles={allArticles} />;
}
