'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Calendar,
  DollarSign,
  Package,
  Star,
  MapPin,
  Phone,
  Shield,
  UserCheck
} from 'lucide-react';

interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  emailVerified?: string;
  newsletterSubscribed: boolean;
  marketingEmails: boolean;
  _count: {
    orders: number;
    reviews: number;
    wishlistItems: number;
  };
  orders: {
    totalAmount: number;
  }[];
}

export default function AdminCustomersPage() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const email = customer.email || '';
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    const matchesSearch =
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || customer.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getTotalSpent = (customer: Customer) => {
    return customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Customer Management
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            View and manage your customer base
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-2xl shadow-sm border ${isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            }`}>
            <div className="flex items-center space-x-3">
              <Users className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {customers.length}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Customers
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border ${isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            }`}>
            <div className="flex items-center space-x-3">
              <UserCheck className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {customers.filter(c => c.emailVerified).length}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Verified
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border ${isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            }`}>
            <div className="flex items-center space-x-3">
              <Mail className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {customers.filter(c => c.newsletterSubscribed).length}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Newsletter
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border ${isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            }`}>
            <div className="flex items-center space-x-3">
              <Shield className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {customers.filter(c => c.role === 'ADMIN').length}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Admins
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`p-6 rounded-2xl shadow-sm border mb-8 ${isDark
          ? 'bg-gray-800/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
          }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                  ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
            </div>

            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                  ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              >
                <option value="all">All Roles</option>
                <option value="USER">Users</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total: {filteredCustomers.length}
              </span>
              <Users className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className={`p-6 rounded-2xl shadow-sm border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${isDark
                ? 'bg-gray-800/80 border-gray-700/50 shadow-purple-900/20'
                : 'bg-white/80 border-gray-200/50 shadow-blue-900/10'
                }`}
            >
              {/* Customer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${customer.role === 'ADMIN'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-blue-100 text-blue-600'
                    }`}>
                    {customer.role === 'ADMIN' ? (
                      <Shield className="w-6 h-6" />
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {customer.email}
                    </p>
                  </div>
                </div>
                {customer.emailVerified && (
                  <UserCheck className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                )}
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Package className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {customer._count?.orders || 0}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Orders</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {customer._count?.reviews || 0}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <DollarSign className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {getTotalSpent(customer).toFixed(0)}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Spent</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Joined
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Newsletter
                  </span>
                  <span className={`text-sm ${customer.newsletterSubscribed
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                    {customer.newsletterSubscribed ? 'Subscribed' : 'Not subscribed'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowModal(true);
                }}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${isDark
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className={`text-center py-12 ${isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            } rounded-2xl border`}>
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No customers found
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {searchTerm || roleFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Customers will appear here once they sign up'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
