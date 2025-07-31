'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
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
  Database,
  MessageSquare,
  Mail,
  Zap,
  Settings
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

export default function SimpleAdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, [session, status]);

  useEffect(() => {
    if (isAuthorized) {
      fetchAnalytics();
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

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await response.json();

      if (data.success !== false) {
        setAnalytics(data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeedMessage('');

    try {
      const response = await fetch('/api/admin/seed-database', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSeedMessage(`✅ Database seeded successfully! Created ${data.data.createdCrystals} crystals and ${data.data.createdCustomers} customers.`);
        // Refresh analytics data
        fetchAnalytics();
      } else {
        setSeedMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setSeedMessage(`❌ Failed to seed database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const setupRealInventory = async () => {
    setIsSeeding(true);
    setSeedMessage('');

    try {
      const response = await fetch('/api/admin/setup-inventory-simple', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSeedMessage(`✅ Real inventory setup complete! Added ${data.data.totalProducts} crystal bracelets with ${data.data.totalStock} total stock. Price range: ${data.data.priceRange}`);
        // Refresh analytics data
        fetchAnalytics();
      } else {
        setSeedMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setSeedMessage(`❌ Failed to setup inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Go Home
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

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {seedMessage && (
          <div className={`mb-6 border rounded-lg p-4 ${seedMessage.includes('✅')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <p>{seedMessage}</p>
          </div>
        )}

        {/* Real Inventory Setup Section */}
        <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-purple-900">Real Inventory Setup</h3>
              <p className="text-purple-700 mt-1">
                Set up your actual 21 crystal bracelets with correct stock quantities and prices.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={setupRealInventory}
                disabled={isSeeding}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isSeeding
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
              >
                {isSeeding ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  '📦 Setup Real Inventory'
                )}
              </button>
              <button
                onClick={() => window.open('https://console.neon.tech', '_blank')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🗄️ Database Console
              </button>
              <button
                onClick={() => fetchAnalytics()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {!analytics ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <>
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Orders</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage customer orders, track shipments, and update order status.
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

              <div className="celestial-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Package className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage product inventory, stock levels, and pricing.
                </p>
                <button
                  onClick={() => router.push('/admin/inventory')}
                  className="w-full celestial-button"
                >
                  Manage Inventory
                </button>
              </div>
            </div>

            {/* AI & Automation Tools */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Bot className="w-6 h-6 mr-2 text-purple-600" />
                AI & Automation Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* AI Chat Assistant */}
                <div className="celestial-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">AI Chat</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Generate blog posts, product descriptions, and get AI assistance for content creation.
                  </p>
                  <button
                    onClick={() => router.push('/admin/ai-chat')}
                    className="w-full celestial-button bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Open AI Chat
                  </button>
                </div>

                {/* Price Update Tool */}
                <div className="celestial-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900">Price Update</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Quickly update product prices, manage bulk pricing, and view current pricing.
                  </p>
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="w-full celestial-button bg-green-600 hover:bg-green-700 text-white"
                  >
                    Update Prices
                  </button>
                </div>

                {/* Email Campaigns */}
                <div className="celestial-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-medium text-gray-900">Email Campaigns</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Create and send newsletters, welcome emails, and promotional campaigns.
                  </p>
                  <button
                    onClick={() => router.push('/admin/email-campaigns')}
                    className="w-full celestial-button bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Create Emails
                  </button>
                </div>

                {/* Quick Tools */}
                <div className="celestial-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-medium text-gray-900">Quick Tools</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Access database sync, test emails, and other admin utilities.
                  </p>
                  <button
                    onClick={() => router.push('/admin/sync')}
                    className="w-full celestial-button bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Admin Tools
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
