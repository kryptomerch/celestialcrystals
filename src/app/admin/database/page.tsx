'use client';

import { useState, useEffect } from 'react';
import { Database, Users, Package, ShoppingCart, RefreshCw, Eye, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  emailVerified?: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

interface Crystal {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: string;
  isActive: boolean;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    email: string;
    firstName?: string;
  };
}

export default function DatabaseViewer() {
  const [users, setUsers] = useState<User[]>([]);
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'crystals' | 'orders'>('users');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCrystals: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Fetch crystals
      const crystalsRes = await fetch('/api/admin/products');
      if (crystalsRes.ok) {
        const crystalsData = await crystalsRes.json();
        setCrystals(crystalsData.products || []);
      }

      // Fetch orders
      const ordersRes = await fetch('/api/admin/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      setStats({
        totalUsers: users.length,
        totalCrystals: crystals.length,
        totalOrders: orders.length,
        totalRevenue
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Database className="w-8 h-8 mr-3 text-blue-600" />
              Database Viewer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage your database records
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCrystals}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'users', label: 'Users', icon: Users },
                { key: 'crystals', label: 'Products', icon: Package },
                { key: 'orders', label: 'Orders', icon: ShoppingCart }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Verified</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{user.email}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'ADMIN' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {user.role || 'USER'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.emailVerified 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {user.emailVerified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {user._count?.orders || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Products Tab */}
                {activeTab === 'crystals' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Price</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Stock</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crystals.map((crystal) => (
                          <tr key={crystal.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{crystal.name}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{crystal.category}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{formatCurrency(crystal.price)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                crystal.stockQuantity > 10
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : crystal.stockQuantity > 0
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {crystal.stockQuantity}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                crystal.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {crystal.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white font-mono text-sm">
                              {order.id.substring(0, 8)}...
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {order.user?.email || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                              {formatCurrency(order.total)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : order.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
