'use client';

import { useState } from 'react';
import { getAllBlogCategories } from '@/data/blog-articles';
import { Calendar, Clock, User, Search, Filter, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
  publishDate: string;
  isAI: boolean;
}

// Map blog categories to crystal colors for glow effects
const getCategoryGlowClass = (category: string): string => {
  const categoryColors: { [key: string]: string[] } = {
    'Crystal Care': ['green'],
    'Healing': ['green'],
    'Spiritual Growth': ['purple'],
    'Crystal Properties': ['blue'],
    'Meditation': ['purple'],
    'Chakras': ['purple'],
    'Love & Relationships': ['pink'],
    'Protection': ['black'],
    'Abundance': ['golden'],
    'Energy Cleansing': ['white'],
    'Beginner Guide': ['blue'],
    'Crystal Combinations': ['purple'],
    'Birthstones': ['blue'],
    'Zodiac': ['purple'],
    'Moon Phases': ['white'],
    'Seasonal': ['green'],
  };

  const colors = categoryColors[category] || ['purple'];
  return getCrystalGlowClass(colors);
};

interface BlogPageClientProps {
  allArticles: BlogPost[];
}

export default function BlogPageClient({ allArticles }: BlogPageClientProps) {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', ...getAllBlogCategories()];

  // Filter articles based on search and category
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
  });

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
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                }`}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              {/* Category Filter */}
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`pl-10 pr-8 py-3 border rounded focus:outline-none focus:ring-1 ${isDark
                    ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 border rounded focus:outline-none focus:ring-1 ${isDark
                  ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {sortedArticles.length} of {allArticles.length} articles
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Featured Article */}
        {sortedArticles.length > 0 && (
          <div className="mb-16">
            <div className={`celestial-card overflow-hidden ${getCategoryGlowClass(sortedArticles[0].category)}`}>
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
                    {(sortedArticles[0] as any).featuredImage ? (
                      <img
                        src={(sortedArticles[0] as any).featuredImage}
                        alt={sortedArticles[0].title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className="flex items-center justify-center">
                      <BookOpen className={`w-16 h-16 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                      Featured
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                      {sortedArticles[0].category}
                    </span>
                    {sortedArticles[0].isAI && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>
                        AI Generated
                      </span>
                    )}
                  </div>

                  <h3 className={`text-2xl font-medium mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {sortedArticles[0].title}
                  </h3>

                  <p className={`mb-6 leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    {sortedArticles[0].excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-sm ${isDark ? 'text-white' : 'text-gray-500'}`}>
                      <User className="w-4 h-4 mr-1" />
                      {sortedArticles[0].author}
                    </div>

                    <Link
                      href={`/blog/${sortedArticles[0].slug}`}
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
          {sortedArticles.slice(1).map((article) => (
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
                <div className="flex items-center justify-center">
                  <BookOpen className={`w-12 h-12 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Category and AI Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                    {article.category}
                  </span>
                  {article.isAI && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>
                      AI Generated
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-medium mb-3 leading-tight flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className={`mb-4 text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  {article.excerpt}
                </p>

                {/* Meta Info */}
                <div className={`flex items-center justify-between text-xs ${isDark ? 'text-white' : 'text-gray-500'}`}>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} min
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.publishDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Read More Button */}
                <div className="mt-4">
                  <Link
                    href={`/blog/${article.slug}`}
                    className={`inline-flex items-center text-sm font-medium transition-colors ${isDark
                      ? 'text-purple-400 hover:text-purple-300'
                      : 'text-purple-600 hover:text-purple-500'
                    }`}
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {sortedArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No articles found</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
