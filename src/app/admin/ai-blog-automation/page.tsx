'use client';

import { useState, useEffect } from 'react';
import { Bot, Calendar, FileText, TrendingUp, Zap, Clock, Target, Globe } from 'lucide-react';

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

  const loadDashboardData = async () => {
    try {
      // Load recent AI-generated posts and stats
      // This would fetch from your blog API
      setStats({
        totalPosts: 24,
        aiGeneratedPosts: 18,
        avgSeoScore: 87,
        totalViews: 12450,
        scheduledPosts: 3
      });

      setRecentPosts([
        {
          id: '1',
          title: 'The Complete Guide to Amethyst Crystal: Healing Properties & Benefits',
          category: 'Crystal Guides',
          status: 'published',
          publishDate: '2025-01-15',
          viewCount: 1250,
          seoScore: 92,
          isAIGenerated: true
        },
        {
          id: '2', 
          title: 'Best Crystals for Heart Chakra Healing: Complete Guide 2025',
          category: 'Chakra Healing',
          status: 'published',
          publishDate: '2025-01-10',
          viewCount: 890,
          seoScore: 88,
          isAIGenerated: true
        },
        {
          id: '3',
          title: 'Winter Crystal Rituals: Seasonal Healing & Energy Alignment',
          category: 'Seasonal Healing',
          status: 'scheduled',
          publishDate: '2025-01-20',
          viewCount: 0,
          seoScore: 85,
          isAIGenerated: true
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const triggerAIGeneration = async (action: string) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/cron/ai-blog-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'your-cron-secret-key-here'}`,
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Generate AI Content
            </h2>

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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' 
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
                    <span className={`font-medium ${
                      post.seoScore >= 90 ? 'text-green-600' :
                      post.seoScore >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      SEO: {post.seoScore}%
                    </span>
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
    </div>
  );
}
