'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  Settings
} from 'lucide-react';

interface EmailConfig {
  resendConfigured: boolean;
  smtpConfigured: boolean;
  fromEmail: string;
}

interface OrderEmailStatus {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shouldHaveReceivedEmail: boolean;
  timeSinceOrder: number;
  orderAge: number;
}

interface EmailStatusData {
  emailConfig: EmailConfig;
  orders: OrderEmailStatus[];
  summary: {
    totalOrders: number;
    paidOrders: number;
    recentOrders: number;
    emailSystemStatus: string;
  };
}

export default function EmailStatusPage() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const [data, setData] = useState<EmailStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingEmail, setTestingEmail] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    fetchEmailStatus();
  }, []);

  const fetchEmailStatus = async () => {
    try {
      const response = await fetch('/api/admin/email-status');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch email status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async (orderId: string) => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setTestingEmail(orderId);
    try {
      const response = await fetch('/api/admin/email-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          testEmail
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Test email sent successfully to ${testEmail}`);
      } else {
        alert(`Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      alert('Error sending test email');
    } finally {
      setTestingEmail(null);
    }
  };

  const getStatusIcon = (order: OrderEmailStatus) => {
    if (order.paymentStatus !== 'PAID') {
      return <Clock className="w-5 h-5 text-gray-400" />;
    }
    
    if (order.orderAge < 1) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (order.orderAge < 24) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (order: OrderEmailStatus) => {
    if (order.paymentStatus !== 'PAID') {
      return 'Payment pending';
    }
    
    if (order.orderAge < 1) {
      return 'Recent order - email should be delivered';
    } else if (order.orderAge < 24) {
      return `${order.orderAge}h ago - check spam folder`;
    } else {
      return `${Math.floor(order.orderAge / 24)}d ago - likely email issue`;
    }
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

  if (!data) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center py-12">
          <XCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Failed to load email status
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Email Delivery Status
              </h1>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Monitor order confirmation email delivery
              </p>
            </div>
            <button
              onClick={fetchEmailStatus}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Email Configuration Status */}
        <div className={`p-6 rounded-lg mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-3 mb-4">
            <Settings className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Email System Configuration
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              {data.emailConfig.resendConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Resend API
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.emailConfig.resendConfigured ? 'Configured' : 'Not configured'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {data.emailConfig.smtpConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  SMTP Backup
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.emailConfig.smtpConfigured ? 'Configured' : 'Not configured'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  From Email
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.emailConfig.fromEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <Mail className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.summary.totalOrders}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Orders
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.summary.paidOrders}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Paid Orders
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                <Clock className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.summary.recentOrders}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last 24h
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${data.summary.emailSystemStatus === 'Configured' 
                ? isDark ? 'bg-green-900/50' : 'bg-green-100'
                : isDark ? 'bg-red-900/50' : 'bg-red-100'
              }`}>
                {data.summary.emailSystemStatus === 'Configured' ? (
                  <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                ) : (
                  <XCircle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                )}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.summary.emailSystemStatus}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email System
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Email Section */}
        <div className={`p-6 rounded-lg mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Test Email Delivery
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="email"
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
            />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Use this email to test order confirmation delivery
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className={`rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Orders & Email Status
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    Order
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    Customer
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    Amount
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    Email Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {data.orders.map((order) => (
                  <tr key={order.id} className={`hover:${isDark ? 'bg-gray-700/30' : 'bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          #{order.orderNumber}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {order.customerName}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order)}
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {getStatusText(order)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.shouldHaveReceivedEmail && (
                        <button
                          onClick={() => sendTestEmail(order.id)}
                          disabled={testingEmail === order.id || !testEmail}
                          className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                            testingEmail === order.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : !testEmail
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isDark
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {testingEmail === order.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span>Test Email</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
