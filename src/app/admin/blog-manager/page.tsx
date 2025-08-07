'use client';

import { useState, useEffect } from 'react';
import { Trash2, Eye, Edit, Search, Filter, Calendar, User, BookOpen, AlertTriangle, RefreshCw } from 'lucide-react';
import { blogArticles } from '@/data/blog-articles';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: string;
  isAIGenerated: boolean;
  readingTime: number;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  tags?: string[];
}

export default function BlogManagerPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);

      // Fetch database posts
      const response = await fetch('/api/admin/blog-posts');
      let databasePosts: BlogPost[] = [];

      if (response.ok) {
        const data = await response.json();
        console.log('Blog posts API response:', data);

        if (data.success) {
          // Normalize database posts to ensure tags is always an array
          databasePosts = (data.posts || []).map((post: any) => ({
            ...post,
            tags: Array.isArray(post.tags)
              ? post.tags
              : typeof post.tags === 'string'
                ? post.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                : []
          }));
        } else {
          console.error('Failed to fetch database blog posts:', data.error);
        }
      } else {
        console.error('API response not ok:', response.status, response.statusText);
      }

      // Convert static articles to BlogPost format
      const staticPosts: BlogPost[] = blogArticles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        status: 'published', // Static articles are always published
        isAIGenerated: false,
        readingTime: article.readTime,
        featuredImage: article.featuredImage,
        publishedAt: article.publishDate,
        createdAt: article.publishDate,
        tags: Array.isArray(article.tags) ? article.tags : []
      }));

      // Combine static articles with database posts
      const allPosts = [...staticPosts, ...databasePosts];
      setBlogPosts(allPosts);

    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // If there's an error, at least show static articles
      const staticPosts: BlogPost[] = blogArticles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        status: 'published',
        isAIGenerated: false,
        readingTime: article.readTime,
        featuredImage: article.featuredImage,
        publishedAt: article.publishDate,
        createdAt: article.publishDate,
        tags: Array.isArray(article.tags) ? article.tags : []
      }));
      setBlogPosts(staticPosts);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (postId: string) => {
    // Check if this is a static article (cannot be deleted)
    const post = blogPosts.find(p => p.id === postId);
    if (post && !post.isAIGenerated && blogArticles.some(article => article.id === postId)) {
      alert('Cannot delete static blog articles. These are part of the website content.');
      return;
    }

    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(prev => [...prev, postId]);
      const response = await fetch(`/api/admin/blog-posts/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setBlogPosts(prev => prev.filter(post => post.id !== postId));
        setSelectedPosts(prev => prev.filter(id => id !== postId));
      } else {
        alert('Failed to delete blog post: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post');
    } finally {
      setDeleting(prev => prev.filter(id => id !== postId));
    }
  };

  const bulkDelete = async () => {
    if (selectedPosts.length === 0) return;

    // Filter out static articles from selection
    const staticArticleIds = blogArticles.map(article => article.id);
    const deletablePosts = selectedPosts.filter(postId => !staticArticleIds.includes(postId));
    const staticPostsCount = selectedPosts.length - deletablePosts.length;

    if (staticPostsCount > 0) {
      alert(`${staticPostsCount} static blog articles cannot be deleted. Only ${deletablePosts.length} posts will be deleted.`);
    }

    if (deletablePosts.length === 0) {
      alert('No posts can be deleted. Static blog articles are protected.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${deletablePosts.length} blog posts? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(prev => [...prev, ...deletablePosts]);

      const deletePromises = deletablePosts.map(postId =>
        fetch(`/api/admin/blog-posts/${postId}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);

      setBlogPosts(prev => prev.filter(post => !deletablePosts.includes(post.id)));
      setSelectedPosts(prev => prev.filter(id => !deletablePosts.includes(id)));
    } catch (error) {
      console.error('Error bulk deleting posts:', error);
      alert('Error deleting some posts');
    } finally {
      setDeleting([]);
    }
  };

  const toggleSelectPost = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(blogPosts.map(post => post.category))];

  const getContentPreview = (content: string) => {
    if (!content || content.trim().length === 0) return 'No content';
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
  };

  const hasIssues = (post: BlogPost) => {
    return !post.content || post.content.trim().length === 0 ||
      !post.excerpt || post.excerpt.trim().length === 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-4 text-white">Loading blog posts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Blog Manager</h1>
          <p className="text-blue-200">Manage all published blog posts, remove duplicates and empty content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Total Posts</p>
                <p className="text-2xl font-bold text-white">{blogPosts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Published</p>
                <p className="text-2xl font-bold text-white">
                  {blogPosts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Issues</p>
                <p className="text-2xl font-bold text-white">
                  {blogPosts.filter(hasIssues).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">AI Generated</p>
                <p className="text-2xl font-bold text-white">
                  {blogPosts.filter(p => p.isAIGenerated).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchBlogPosts}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              {selectedPosts.length > 0 && (
                <button
                  onClick={bulkDelete}
                  disabled={deleting.length > 0}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedPosts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No blog posts found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/20">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={toggleSelectAll}
                    className="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-white font-medium">
                    {selectedPosts.length > 0 ? `${selectedPosts.length} selected` : 'Select All'}
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/10">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => toggleSelectPost(post.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Title and Status */}
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {post.title}
                              </h3>

                              {/* Status Badge */}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.status === 'published'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                }`}>
                                {post.status}
                              </span>

                              {/* Issues Badge */}
                              {hasIssues(post) && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Issues
                                </span>
                              )}

                              {/* AI/Static Badge */}
                              {post.isAIGenerated ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  AI Generated
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                  Static Article
                                </span>
                              )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString()
                                  : new Date(post.createdAt).toLocaleDateString()
                                }
                              </span>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                {post.category}
                              </span>
                              <span className="text-gray-400">
                                {post.readingTime} min read
                              </span>
                            </div>

                            {/* Content Preview */}
                            <div className="mb-3">
                              <p className="text-gray-300 text-sm mb-1">
                                <strong>Excerpt:</strong> {post.excerpt || 'No excerpt'}
                              </p>
                              <p className="text-gray-400 text-sm">
                                <strong>Content:</strong> {getContentPreview(post.content)}
                              </p>
                            </div>

                            {/* Tags */}
                            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="View Post"
                            >
                              <Eye className="h-4 w-4" />
                            </a>

                            <a
                              href={`/admin/blog-editor?edit=${post.id}`}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Edit Post"
                            >
                              <Edit className="h-4 w-4" />
                            </a>

                            <button
                              onClick={() => deleteBlogPost(post.id)}
                              disabled={deleting.includes(post.id) || (!post.isAIGenerated && blogArticles.some(article => article.id === post.id))}
                              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${(!post.isAIGenerated && blogArticles.some(article => article.id === post.id))
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                                }`}
                              title={(!post.isAIGenerated && blogArticles.some(article => article.id === post.id))
                                ? "Cannot delete static articles"
                                : "Delete Post"
                              }
                            >
                              {deleting.includes(post.id) ? (
                                <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-300 text-sm">
          Showing {filteredPosts.length} of {blogPosts.length} blog posts
        </div>
      </div>
    </div>
  );
}
