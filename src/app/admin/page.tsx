'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Bot,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    revenueGrowth: number;
  };
  charts: {
    salesByDay: Array<{
      date: string;
      orders: number;
      revenue: number;
    }>;
    customerGrowth: Array<{
      date: string;
      new_customers: number;
    }>;
  };
  topProducts: Array<{
    crystalId: string;
    name: string;
    price: number;
    quantitySold: number;
    revenue: number;
    orderCount: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    itemCount: number;
    createdAt: string;
  }>;
  inventory: {
    totalProducts: number;
    totalStock: number;
  };
  reviews: {
    totalReviews: number;
    averageRating: number;
  };
}

interface BlogPost {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'scheduled';
  createdAt: string;
  views: number;
  isAIGenerated: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [aiSettings, setAiSettings] = useState({
    autoGenerate: true,
    frequency: 'weekly',
    nextScheduled: '2024-01-25',
    lastGenerated: '2024-01-18'
  });

  useEffect(() => {
    checkAdminAccess();
  }, [session, status]);

  useEffect(() => {
    if (isAuthorized) {
      fetchAnalytics();
      fetchBlogPosts();
    }
  }, [period, isAuthorized]);

  const checkAdminAccess = async () => {
    if (status === 'loading') return;

    if (!session?.user?.email) {
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    // Check if user is admin
    const adminEmails = ['dhruvaparik@gmail.com', 'kryptomerch.io@gmail.com'];
    const isAdmin = adminEmails.includes(session.user.email.toLowerCase()) ||
      session.user.role === 'ADMIN';

    if (!isAdmin) {
      router.push('/?error=unauthorized');
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog-posts');
      const data = await response.json();

      if (data.success) {
        const formattedPosts = data.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          status: post.status,
          createdAt: new Date(post.createdAt).toISOString().split('T')[0],
          views: post.views,
          isAIGenerated: post.isAIGenerated
        }));
        setBlogPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const generateNewBlogPost = async () => {
    try {
      const response = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 1 })
      });

      const data = await response.json();

      if (data.success && data.post) {
        // Refresh the blog posts list
        await fetchBlogPosts();

        setAiSettings(prev => ({
          ...prev,
          lastGenerated: new Date().toISOString().split('T')[0]
        }));

        // Show success message (you could add a toast notification here)
        console.log('Blog post generated:', data.post.title);
      } else {
        console.error('Failed to generate blog post:', data.error);
      }
    } catch (error) {
      console.error('Error generating blog post:', error);
    }
  };

  const seedDatabase = async () => {
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        console.log('Database seeded successfully');
        // Refresh analytics and blog posts
        await fetchAnalytics();
        await fetchBlogPosts();
      } else {
        console.error('Failed to seed database:', data.error);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setError('Failed to load analytics');
      }
    } catch (error) {
      setError('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {status === 'loading' ? 'Checking authentication...' : 'Verifying admin access...'}
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Failed to load dashboard</h1>
          <button onClick={fetchAnalytics} className="celestial-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'blog', name: 'Blog Management', icon: FileText },
              { id: 'ai-content', name: 'AI Content', icon: Bot }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="celestial-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-light text-gray-900">
                      {formatCurrency(analytics.overview.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analytics.overview.revenueGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(analytics.overview.revenueGrowth)}`}>
                    {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-light text-gray-900">
                      {formatNumber(analytics.overview.totalOrders)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    Avg: {formatCurrency(analytics.overview.averageOrderValue)}
                  </span>
                </div>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Customers</p>
                    <p className="text-2xl font-light text-gray-900">
                      {formatNumber(analytics.overview.totalCustomers)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">This period</span>
                </div>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-2xl font-light text-gray-900">
                      {formatNumber(analytics.inventory.totalProducts)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {formatNumber(analytics.inventory.totalStock)} in stock
                  </span>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Products */}
              <div className="celestial-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {analytics.topProducts.slice(0, 5).map((product, index) => (
                    <div key={product.crystalId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.quantitySold} sold • {product.orderCount} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(product.revenue)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(product.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="celestial-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {analytics.recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {order.customerName} • {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-medium text-gray-900">AI Blog</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Generate new blog posts about crystals using AI.
                </p>
                <button
                  onClick={generateNewBlogPost}
                  className="w-full celestial-button"
                >
                  Generate Post
                </button>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-900">Sample Data</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Populate database with demo data for testing.
                </p>
                <button
                  onClick={seedDatabase}
                  className="w-full celestial-button bg-green-600 hover:bg-green-700"
                >
                  Seed Database
                </button>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage stock levels, track inventory, and view reports.
                </p>
                <button
                  onClick={() => router.push('/admin/inventory')}
                  className="w-full celestial-button"
                >
                  Manage Inventory
                </button>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-900">Orders</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Process orders, update shipping, and manage customer requests.
                </p>
                <button
                  onClick={() => router.push('/admin/orders')}
                  className="w-full celestial-button"
                >
                  View Orders
                </button>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-medium text-gray-900">Customers</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View customer profiles, order history, and analytics.
                </p>
                <button
                  onClick={() => router.push('/admin/customers')}
                  className="w-full celestial-button"
                >
                  View Customers
                </button>
              </div>
            </div>

            {/* Reviews Summary */}
            <div className="celestial-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reviews Overview</h3>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">
                    {analytics.reviews.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(analytics.reviews.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">
                    {formatNumber(analytics.reviews.totalReviews)}
                  </div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-xs text-gray-500 mt-1">This period</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Management Tab */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
              <button
                onClick={generateNewBlogPost}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate AI Post</span>
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {post.isAIGenerated ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            <Bot className="w-3 h-3 mr-1" />
                            AI Generated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Manual
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Content Tab */}
        {activeTab === 'ai-content' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">AI Content Management</h2>

            {/* AI Status Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">AI Blog Generation Status</h3>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{blogPosts.filter(p => p.isAIGenerated).length}</div>
                  <div className="text-sm text-gray-500">AI Posts Created</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{aiSettings.frequency}</div>
                  <div className="text-sm text-gray-500">Generation Frequency</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{aiSettings.lastGenerated}</div>
                  <div className="text-sm text-gray-500">Last Generated</div>
                </div>
              </div>
            </div>

            {/* AI Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Generation Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto-Generate Blog Posts</label>
                    <p className="text-sm text-gray-500">Automatically create new blog posts about crystals</p>
                  </div>
                  <button
                    onClick={() => setAiSettings(prev => ({ ...prev, autoGenerate: !prev.autoGenerate }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiSettings.autoGenerate ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiSettings.autoGenerate ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Generation Frequency</label>
                  <select
                    value={aiSettings.frequency}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, frequency: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={generateNewBlogPost}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Generate New Post</span>
                  </button>

                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
