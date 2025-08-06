'use client';

import { useState, useEffect } from 'react';
import { Bot, Calendar, FileText, TrendingUp, Zap, Clock, Target, Globe, Eye, CheckCircle, XCircle, Plus, Edit } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  status: string;
  publishDate: string;
  viewCount: number;
  seoScore: number;
  isAIGenerated: boolean;
}

interface AutomationStats {
  totalPosts: number;
  aiGeneratedPosts: number;
  avgSeoScore: number;
  totalViews: number;
  scheduledPosts: number;
}

export default function AIBlogAutomationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [publishingPost, setPublishingPost] = useState<string | null>(null);
  const [stats, setStats] = useState<AutomationStats>({
    totalPosts: 0,
    aiGeneratedPosts: 0,
    avgSeoScore: 0,
    totalViews: 0,
    scheduledPosts: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePreviewPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/blog-posts/preview/${postId}`);
      const data = await response.json();

      if (data.success) {
        setPreviewPost(data.post);
        setShowPreview(true);
      } else {
        alert('Failed to load preview');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to load preview');
    }
  };

  const handlePublishPost = async (postId: string, action: 'publish' | 'unpublish') => {
    setPublishingPost(postId);
    try {
      const response = await fetch('/api/admin/blog-posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the dashboard data
        await loadDashboardData();
        alert(`Post ${action}ed successfully!`);
      } else {
        alert(`Failed to ${action} post: ${data.error}`);
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      alert(`Failed to ${action} post`);
    } finally {
      setPublishingPost(null);
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('🔄 Loading dashboard data...');

      // Fetch real blog posts from API
      const response = await fetch('/api/admin/blog-posts');
      const data = await response.json();

      console.log('📊 API Response:', { status: response.status, data });

      if (response.status === 401) {
        console.log('🔒 Not authenticated - showing empty state');
        // User not authenticated - show empty state
        setIsAuthenticated(false);
        setStats({
          totalPosts: 0,
          aiGeneratedPosts: 0,
          avgSeoScore: 0,
          totalViews: 0,
          scheduledPosts: 0
        });
        setRecentPosts([]);
        return;
      }

      if (data.success && data.posts) {
        const posts = data.posts || [];
        const aiPosts = posts.filter((post: any) => post.isAIGenerated);

        console.log('✅ Loaded real data:', { totalPosts: posts.length, aiPosts: aiPosts.length });

        setIsAuthenticated(true);

        // Calculate real stats
        setStats({
          totalPosts: posts.length,
          aiGeneratedPosts: aiPosts.length,
          avgSeoScore: 85, // Default SEO score - could be calculated based on content analysis
          totalViews: posts.reduce((sum: number, post: any) => sum + (post.views || 0), 0),
          scheduledPosts: posts.filter((post: any) => post.status === 'scheduled').length
        });

        // Set recent AI-generated posts with correct current dates
        setRecentPosts(
          aiPosts
            .slice(0, 5) // Show last 5 AI posts
            .map((post: any) => ({
              id: post.id,
              title: post.title,
              category: post.category,
              status: post.status,
              publishDate: post.publishedAt || post.createdAt,
              viewCount: post.views || 0,
              seoScore: 85, // Default SEO score
              isAIGenerated: post.isAIGenerated
            }))
        );
      } else {
        console.log('⚠️ API call failed or no data - showing empty state');
        // Fallback to empty state if API fails
        setStats({
          totalPosts: 0,
          aiGeneratedPosts: 0,
          avgSeoScore: 0,
          totalViews: 0,
          scheduledPosts: 0
        });
        setRecentPosts([]);
      }
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      // Set empty state on error
      setStats({
        totalPosts: 0,
        aiGeneratedPosts: 0,
        avgSeoScore: 0,
        totalViews: 0,
        scheduledPosts: 0
      });
      setRecentPosts([]);
    }
  };

  const triggerAIGeneration = async (action: string) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/admin/ai-blog-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      setResults(data);

      if (data.success) {
        // Reload dashboard data to show new post
        setTimeout(loadDashboardData, 2000);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setResults({ error: 'Failed to generate content' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto text-purple-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Blog Automation</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Access Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in with an admin account to access the AI blog automation dashboard.
              </p>
              <a
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bot className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Blog Automation</h1>
          </div>
          <p className="text-gray-600">
            Automated content generation for crystal healing education and North America SEO optimization
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aiGeneratedPosts}</p>
              </div>
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgSeoScore}%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledPosts}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Generation Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Generate AI Content
              </h2>
              <a
                href="/admin/blog-editor"
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </a>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => triggerAIGeneration('weekly-crystal-post')}
                disabled={isLoading}
                className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Weekly Crystal Guide</span>
              </button>

              <button
                onClick={() => triggerAIGeneration('monthly-chakra-post')}
                disabled={isLoading}
                className="w-full p-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Generate Monthly Chakra Guide</span>
              </button>

              <button
                onClick={() => triggerAIGeneration('seasonal-post')}
                disabled={isLoading}
                className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Generate Seasonal Content</span>
              </button>

              <button
                onClick={() => triggerAIGeneration('generate-all')}
                disabled={isLoading}
                className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Bot className="w-4 h-4" />
                <span>Generate Multiple Posts</span>
              </button>
            </div>

            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Generating AI content...</span>
                </div>
              </div>
            )}

            {results && (
              <div className={`mt-4 p-4 rounded-lg ${results.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <h3 className="font-medium mb-2">
                  {results.success ? '✅ Success!' : '❌ Error'}
                </h3>
                <p className="text-sm">
                  {results.success ? results.result.message : results.error}
                </p>
                {results.success && (
                  <p className="text-xs mt-1 opacity-75">
                    Generated at: {new Date(results.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recent AI Posts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Recent AI-Generated Posts
            </h2>

            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                      {post.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.category}</span>
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-600">{post.viewCount} views</span>
                    <span className={`font-medium ${post.seoScore >= 90 ? 'text-green-600' :
                      post.seoScore >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      SEO: {post.seoScore}%
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => handlePreviewPost(post.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={`/admin/blog-editor?edit=${post.id}`}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </a>

                    {post.status === 'draft' ? (
                      <button
                        onClick={() => handlePublishPost(post.id, 'publish')}
                        disabled={publishingPost === post.id}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm disabled:opacity-50"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{publishingPost === post.id ? 'Publishing...' : 'Publish'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublishPost(post.id, 'unpublish')}
                        disabled={publishingPost === post.id}
                        className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-sm disabled:opacity-50"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>{publishingPost === post.id ? 'Unpublishing...' : 'Unpublish'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation Schedule */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
            Automation Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Weekly Crystal Posts</h3>
              <p className="text-sm text-purple-700">Every Tuesday at 6 AM EST</p>
              <p className="text-xs text-purple-600 mt-1">Next: Individual crystal guides</p>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg">
              <h3 className="font-medium text-pink-900 mb-2">Monthly Chakra Guides</h3>
              <p className="text-sm text-pink-700">First Monday of each month</p>
              <p className="text-xs text-pink-600 mt-1">Next: Heart Chakra healing</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Seasonal Content</h3>
              <p className="text-sm text-green-700">Start of each season</p>
              <p className="text-xs text-green-600 mt-1">Next: Spring renewal rituals</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Content Boost</h3>
              <p className="text-sm text-blue-700">Every Friday at 10 AM EST</p>
              <p className="text-xs text-blue-600 mt-1">Next: How-to guides batch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Preview Modal */}
      {showPreview && previewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 border-b bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Blog Preview</h2>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`font-medium ${previewPost.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {previewPost.status}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Featured Image */}
              {previewPost.featuredImage && (
                <div className="mb-6">
                  <img
                    src={previewPost.featuredImage}
                    alt={previewPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Article Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {previewPost.category}
                  </span>
                  <span>{previewPost.author}</span>
                  <span>{previewPost.readingTime} min read</span>
                  {previewPost.isAIGenerated && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      AI Generated
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {previewPost.title}
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {previewPost.excerpt}
                </p>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: previewPost.content }}
                  className="text-gray-800 leading-relaxed"
                />
              </div>

              {/* Tags */}
              {previewPost.tags && previewPost.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {previewPost.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t flex space-x-4">
                {previewPost.status === 'draft' ? (
                  <button
                    onClick={() => {
                      handlePublishPost(previewPost.id, 'publish');
                      setShowPreview(false);
                    }}
                    disabled={publishingPost === previewPost.id}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{publishingPost === previewPost.id ? 'Publishing...' : 'Publish Now'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handlePublishPost(previewPost.id, 'unpublish');
                      setShowPreview(false);
                    }}
                    disabled={publishingPost === previewPost.id}
                    className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{publishingPost === previewPost.id ? 'Unpublishing...' : 'Unpublish'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
