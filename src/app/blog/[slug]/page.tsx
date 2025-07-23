'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getBlogArticleBySlug, blogArticles } from '@/data/blog-articles';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@/contexts/ThemeContext';
import SocialMediaShare from '@/components/SocialMediaShare';

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isDark } = useTheme();
  const [aiBlogPost, setAiBlogPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // First try to get static article
  const staticArticle = getBlogArticleBySlug(slug);

  useEffect(() => {
    if (!staticArticle) {
      // If no static article found, try to fetch AI-generated post
      fetchAIBlogPost();
    } else {
      setLoading(false);
    }
  }, [slug, staticArticle]);

  const fetchAIBlogPost = async () => {
    try {
      const response = await fetch('/api/blog-posts');
      const data = await response.json();

      if (data.success) {
        const aiPost = data.posts.find((post: any) => post.slug === slug && post.status === 'published');
        if (aiPost) {
          setAiBlogPost({
            ...aiPost,
            tags: Array.isArray(aiPost.tags) ? aiPost.tags : [],
            images: Array.isArray(aiPost.images) ? aiPost.images : [],
            publishDate: aiPost.publishedAt || aiPost.createdAt,
            readTime: aiPost.readingTime,
            isAI: true
          });
        }
      }
    } catch (error) {
      console.error('Error fetching AI blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const article = staticArticle || aiBlogPost;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id && (
      a.category === article.category ||
      a.tags.some(tag => article.tags.includes(tag))
    ))
    .slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article.title;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    let shareLink = '';

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Back Navigation */}
      <div className={isDark ? 'bg-gray-900 py-4' : 'bg-gray-50 py-4'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className={`inline-flex items-center transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className={`py-12 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Badge */}
          <div className="mb-6 flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-purple-600 text-white' : 'bg-black text-white'
              }`}>
              {article.category}
            </span>
            {(article as any).isAI && (
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                AI Generated
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className={`text-4xl lg:text-5xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            {article.title}
          </h1>

          {/* Featured Image */}
          {(article as any).featuredImage && (
            <div className="mb-8">
              <img
                src={(article as any).featuredImage}
                alt={article.title}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Meta Information */}
          <div className={`flex flex-wrap items-center gap-6 mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag: string) => (
              <span
                key={tag}
                className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${isDark
                  ? 'text-gray-300 bg-gray-700'
                  : 'text-gray-600 bg-gray-100'
                  }`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Share Buttons */}
          <div className={`flex items-center gap-4 mb-12 pb-8 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Share:</span>
            <button
              onClick={() => handleShare('twitter')}
              className="text-gray-600 hover:text-blue-500 transition-colors"
              title="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="text-gray-600 hover:text-blue-700 transition-colors"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare('pinterest')}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Share on Pinterest"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className={`text-3xl font-light mb-6 mt-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</h1>,
              h2: ({ children }) => <h2 className={`text-2xl font-medium mb-4 mt-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</h2>,
              h3: ({ children }) => <h3 className={`text-xl font-medium mb-3 mt-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</h3>,
              p: ({ children }) => <p className={`leading-relaxed mb-6 ${isDark ? 'text-white' : 'text-gray-700'}`}>{children}</p>,
              ul: ({ children }) => <ul className={`list-disc list-inside mb-6 space-y-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>{children}</ul>,
              ol: ({ children }) => <ol className={`list-decimal list-inside mb-6 space-y-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</strong>,
              em: ({ children }) => <em className={`italic ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 pl-6 italic my-6 ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Social Media Share */}
        <div className="mt-12">
          <SocialMediaShare
            title={article.title}
            content={article.excerpt}
            image={article.featuredImage || (article as any).images?.[0]}
            hashtags={article.tags}
          />
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/blog/${relatedArticle.slug}`}
                  className="celestial-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">{relatedArticle.category}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <span>{formatDate(relatedArticle.publishDate)}</span>
                      <span>{relatedArticle.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
