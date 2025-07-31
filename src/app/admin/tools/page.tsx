'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  DollarSign,
  Users,
  Database,
  Edit,
  Send,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  MessageSquare,
  Calendar,
  Package
} from 'lucide-react';

interface ToolCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  status: 'working' | 'needs-fix' | 'new';
  category: 'email' | 'products' | 'users' | 'analytics' | 'content';
}

export default function AdminToolsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    emailSubscribers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch real data from multiple endpoints
      const [usersRes, productsRes, ordersRes, subscribersRes] = await Promise.all([
        fetch('/api/admin/customers'),
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/email-subscribers')
      ]);

      const [users, products, orders, subscribers] = await Promise.all([
        usersRes.ok ? usersRes.json() : { customers: [] },
        productsRes.ok ? productsRes.json() : { products: [] },
        ordersRes.ok ? ordersRes.json() : { orders: [] },
        subscribersRes.ok ? subscribersRes.json() : { subscribers: [] }
      ]);

      setStats({
        totalUsers: users.customers?.length || 0,
        totalProducts: products.products?.length || 0,
        totalOrders: orders.orders?.length || 0,
        emailSubscribers: (subscribers.newsletterSubscribers?.length || 0) + (subscribers.userSubscribers?.length || 0)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to 0 if API fails
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        emailSubscribers: 0
      });
    }
  };

  const tools: ToolCard[] = [
    // Email Management Tools
    {
      title: 'Email Templates',
      description: 'Edit, preview, and manage email templates. Send test emails.',
      icon: <Mail className="w-6 h-6" />,
      href: '/admin/email-templates',
      status: 'working',
      category: 'email'
    },
    {
      title: 'Bulk Email Sender',
      description: 'Send emails to all registered users and newsletter subscribers.',
      icon: <Send className="w-6 h-6" />,
      href: '/admin/email-templates',
      status: 'new',
      category: 'email'
    },

    // Product Management Tools
    {
      title: 'Price Manager',
      description: 'Update product prices in bulk. Easy spreadsheet-like interface.',
      icon: <DollarSign className="w-6 h-6" />,
      href: '/admin/price-manager',
      status: 'new',
      category: 'products'
    },
    {
      title: 'Product Management',
      description: 'Add, edit, and manage crystal products and inventory.',
      icon: <ShoppingCart className="w-6 h-6" />,
      href: '/admin/products',
      status: 'working',
      category: 'products'
    },

    // User Management Tools
    {
      title: 'Customer Management',
      description: 'View and manage registered users, roles, and permissions.',
      icon: <Users className="w-6 h-6" />,
      href: '/admin/customers',
      status: 'working',
      category: 'users'
    },
    {
      title: 'Email Subscribers',
      description: 'Manage newsletter subscribers and email preferences.',
      icon: <Database className="w-6 h-6" />,
      href: '/admin/email-subscribers',
      status: 'new',
      category: 'users'
    },

    // Analytics Tools
    {
      title: 'Analytics Dashboard',
      description: 'View sales, traffic, and performance analytics.',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/admin',
      status: 'working',
      category: 'analytics'
    },
    {
      title: 'Order Management',
      description: 'View and manage customer orders and fulfillment.',
      icon: <FileText className="w-6 h-6" />,
      href: '/admin/orders',
      status: 'working',
      category: 'analytics'
    },
    {
      title: 'Inventory Management',
      description: 'Track stock levels, manage inventory, and view logs.',
      icon: <Package className="w-6 h-6" />,
      href: '/admin/inventory',
      status: 'working',
      category: 'analytics'
    },

    // Content Management Tools
    {
      title: 'AI Blog Management',
      description: 'Create and manage blog posts with AI assistance.',
      icon: <Edit className="w-6 h-6" />,
      href: '/admin/ai-blog-automation',
      status: 'working',
      category: 'content'
    },
    {
      title: 'AI Chat Assistant',
      description: 'Interactive AI chat for content and support.',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/admin/ai-chat',
      status: 'working',
      category: 'content'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'needs-fix': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'products': return <ShoppingCart className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'content': return <Edit className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const categories = ['email', 'products', 'users', 'analytics', 'content'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Tools</h1>
              <p className="mt-2 text-gray-600">Manage your Celestial Crystals website</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg">
                <span className="text-blue-700 text-sm font-medium">
                  {tools.filter(t => t.status === 'working').length} Tools Working
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emailSubscribers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map(category => {
          const categoryTools = tools.filter(tool => tool.category === category);
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

          return (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-4">
                {getCategoryIcon(category)}
                <h2 className="ml-2 text-xl font-semibold text-gray-900">{categoryName} Tools</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool, index) => (
                  <Link key={index} href={tool.href}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {tool.icon}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tool.status)}`}>
                          {tool.status === 'needs-fix' ? 'Needs Fix' : tool.status === 'new' ? 'New' : 'Working'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
