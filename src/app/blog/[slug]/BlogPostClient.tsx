'use client';

import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@/contexts/ThemeContext';
import SocialMediaShare from '@/components/SocialMediaShare';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
  publishDate: string;
  isAI: boolean;
}

interface BlogPostClientProps {
  article: BlogPost | null;
}

export default function BlogPostClient({ article }: BlogPostClientProps) {
  const { isDark } = useTheme();

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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className={`inline-flex items-center text-sm font-medium transition-colors ${isDark
            ? 'text-purple-400 hover:text-purple-300'
            : 'text-purple-600 hover:text-purple-500'
            }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {/* Category and AI Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              {article.category}
            </span>

          </div>

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className={`flex items-center justify-center gap-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishDate)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-12">
            <div className="aspect-[16/9] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className={`prose prose-lg max-w-none mb-12 ${isDark
          ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-300 prose-blockquote:text-gray-300 prose-code:text-purple-300 prose-pre:bg-gray-800 prose-pre:text-gray-300'
          : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-700 prose-blockquote:text-gray-700 prose-code:text-purple-600 prose-pre:bg-gray-100'
          }`}>
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="w-full h-auto rounded-lg shadow-lg my-8"
                  loading="lazy"
                />
              ),
              h1: ({ node, ...props }) => (
                <h1 {...props} className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className={`text-3xl font-semibold mb-4 mt-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className={`text-2xl font-medium mb-3 mt-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className={`mb-4 pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className={`mb-4 pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="list-disc" />
              ),
              strong: ({ node, ...props }) => (
                <strong {...props} className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className={`border-l-4 border-purple-500 pl-4 italic my-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-12">
            <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 text-sm rounded-full ${isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Share */}
        <div className="mb-12">
          <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Share this article</h3>
          <SocialMediaShare
            title={article.title}
            content={article.excerpt}
            url={`/blog/${article.slug}`}
            image={article.featuredImage}
            hashtags={article.tags}
          />
        </div>

        {/* Back to Blog */}
        <div className="text-center pt-12 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors ${isDark
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
