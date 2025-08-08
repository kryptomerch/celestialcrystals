'use client';

import { useState, useEffect } from 'react';
import { blogArticles, getAllBlogCategories } from '@/data/blog-articles';
import { Calendar, Clock, User, Search, Filter, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

interface AIBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  featuredImage?: string;
  images?: string[];
  crystalId?: string;
  createdAt: string;
  publishedAt?: string;
  status: string;
}

// Map blog categories to crystal colors for glow effects
const getCategoryGlowClass = (category: string): string => {
  const categoryColors: { [key: string]: string[] } = {
    'Crystal Care': ['green'], // healing/care = green
    'Healing': ['green'], // healing = green
    'Spiritual Growth': ['purple'], // spiritual = purple
    'Crystal Properties': ['blue'], // knowledge = blue
    'Meditation': ['purple'], // spiritual = purple
    'Chakras': ['purple'], // spiritual = purple
    'Love & Relationships': ['pink'], // love = pink
    'Protection': ['black'], // protection = black
    'Abundance': ['golden'], // abundance = golden
    'Energy Cleansing': ['white'], // cleansing = white
    'Beginner Guide': ['blue'], // learning = blue
    'Crystal Combinations': ['purple'], // spiritual = purple
    'Birthstones': ['blue'], // knowledge = blue
    'Zodiac': ['purple'], // spiritual = purple
    'Moon Phases': ['white'], // lunar = white
    'Seasonal': ['green'], // nature = green
  };

  const colors = categoryColors[category] || ['purple']; // default purple
  return getCrystalGlowClass(colors);
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [aiBlogPosts, setAiBlogPosts] = useState<AIBlogPost[]>([]);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchAIBlogPosts();
  }, []);

  const fetchAIBlogPosts = async () => {
    try {
      const response = await fetch('/api/public/blog-posts');

      // Check if response is HTML (authentication page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('API endpoint is protected by authentication, skipping AI blog posts');
        return;
      }

      const data = await response.json();

      if (data.success) {
        const publishedPosts = data.posts
          .filter((post: any) => post.status === 'published')
          .map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            author: post.author,
            category: post.category,
            tags: Array.isArray(post.tags) ? post.tags : [],
            readingTime: post.readingTime,
            featuredImage: post.featuredImage,
            images: Array.isArray(post.images) ? post.images : [],
            crystalId: post.crystalId,
            createdAt: post.createdAt,
            publishedAt: post.publishedAt,
            status: post.status
          }));
        setAiBlogPosts(publishedPosts);
      }
    } catch (error) {
      console.error('Error fetching AI blog posts (API may be protected):', error);
      // Gracefully continue with static articles only
    }
  };

  // Combine static articles with AI-generated posts
  const allArticles = [
    ...blogArticles.map(article => ({
      ...article,
      publishDate: article.publishDate,
      readTime: article.readTime,
      isAI: false
    })),
    ...aiBlogPosts.map(post => ({
      ...post,
      publishDate: post.publishedAt || post.createdAt,
      readTime: post.readingTime,
      isAI: true
    }))
  ];

  const categories = ['All', ...getAllBlogCategories()];

  const filteredArticles = allArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Crystal Healing Blog</h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Discover the ancient wisdom and modern science behind crystal healing.
            Explore detailed guides, healing properties, and spiritual insights.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-1 ${isDark
                  ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400'
                  }`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                    ? (isDark ? 'bg-purple-600 text-white' : 'bg-black text-white')
                    : (isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`pl-10 pr-8 py-3 border rounded focus:outline-none focus:ring-1 appearance-none cursor-pointer min-w-[160px] ${isDark
                  ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                  }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="readTime">Quick Read</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Featured Article (First Article) */}
        {filteredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-2xl font-light mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Featured Article</h2>
            <div className={`celestial-card overflow-hidden ${getCategoryGlowClass(filteredArticles[0].category)}`}>
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
                    {(filteredArticles[0] as any).featuredImage ? (
                      <img
                        src={(filteredArticles[0] as any).featuredImage}
                        alt={filteredArticles[0].title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <BookOpen className={`w-24 h-24 text-purple-300 ${(filteredArticles[0] as any).featuredImage ? 'hidden' : ''}`} />
                  </div>
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className={`flex items-center space-x-4 text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-500'}`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-purple-600 text-white' : 'bg-black text-white'}`}>
                      {filteredArticles[0].category}
                    </span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(filteredArticles[0].publishDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {filteredArticles[0].readTime} min read
                    </div>
                  </div>

                  <h3 className={`text-2xl font-medium mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {filteredArticles[0].title}
                  </h3>

                  <p className={`mb-6 leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    {filteredArticles[0].excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-sm ${isDark ? 'text-white' : 'text-gray-500'}`}>
                      <User className="w-4 h-4 mr-1" />
                      {filteredArticles[0].author}
                    </div>

                    <Link
                      href={`/blog/${filteredArticles[0].slug}`}
                      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(1).map((article) => (
            <article key={article.id} className={`celestial-card overflow-hidden h-full flex flex-col ${getCategoryGlowClass(article.category)}`}>
              {/* Article Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
                {(article as any).featuredImage ? (
                  <img
                    src={(article as any).featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <BookOpen className={`w-16 h-16 text-purple-300 ${(article as any).featuredImage ? 'hidden' : ''}`} />
              </div>

              {/* Article Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Meta Info */}
                <div className={`flex items-center justify-between text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-500'}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${isDark
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      {article.category}
                    </span>

                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTime} min
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-lg font-medium mb-3 leading-tight line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className={`text-sm mb-4 leading-relaxed line-clamp-3 flex-1 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  {article.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center text-xs px-2 py-1 rounded ${isDark
                        ? 'text-white bg-gray-700'
                        : 'text-gray-500 bg-gray-50'
                        }`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-100'}`}>
                  <div className={`flex items-center text-xs ${isDark ? 'text-white' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(article.publishDate)}
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className={`transition-colors text-sm font-medium ${isDark
                      ? 'text-white hover:text-gray-300'
                      : 'text-black hover:text-gray-600'
                      }`}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No articles found</h3>
            <p className={`${isDark ? 'text-white' : 'text-gray-500'}`}>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
