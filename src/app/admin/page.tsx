'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Activity
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

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    className={`w-5 h-5 ${
                      star <= Math.round(analytics.reviews.averageRating)
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
    </div>
  );
}
