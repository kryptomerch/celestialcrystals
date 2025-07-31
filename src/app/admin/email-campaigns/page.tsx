'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Calendar, Users, TrendingUp, Gift, RefreshCw, AlertCircle } from 'lucide-react';

interface EmailData {
  newsletterSubscribers: any[];
  userSubscribers: any[];
  recentOrders: any[];
  stats: {
    totalNewsletterSubscribers: number;
    totalUserSubscribers: number;
    activeNewsletterSubscribers: number;
    totalRecentOrders: number;
  };
}

export default function EmailCampaignsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchEmailData();
  }, []);

  const fetchEmailData = async () => {
    try {
      setLoadingData(true);
      const response = await fetch('/api/admin/email-subscribers');
      if (response.ok) {
        const data = await response.json();
        setEmailData(data.data);
      } else {
        console.error('Failed to fetch email data');
      }
    } catch (error) {
      console.error('Error fetching email data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const sendCampaign = async (action: string) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/cron/email-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'your-cron-secret-key-here'}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Campaign error:', error);
      setResults({ error: 'Failed to send campaign' });
    } finally {
      setIsLoading(false);
    }
  };

  const campaigns = [
    {
      id: 'weekly-newsletter',
      title: 'Weekly Newsletter',
      description: `Send to ${emailData?.stats.totalNewsletterSubscribers || 0} newsletter subscribers`,
      icon: Mail,
      color: 'bg-blue-500',
      recipients: emailData?.stats.totalNewsletterSubscribers || 0,
    },
    {
      id: 'user-marketing',
      title: 'Marketing Emails',
      description: `Send to ${emailData?.stats.totalUserSubscribers || 0} users who opted for marketing`,
      icon: Users,
      color: 'bg-green-500',
      recipients: emailData?.stats.totalUserSubscribers || 0,
    },
    {
      id: 'welcome-email',
      title: 'Winback Campaign',
      description: 'Re-engage inactive customers with special offers',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      id: 'seasonal-promotion',
      title: 'Seasonal Promotion',
      description: 'Send seasonal crystal recommendations and discounts',
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Email Campaigns</h1>
            <p className="text-gray-600">Manage and send automated email campaigns to your customers.</p>
          </div>
          <a
            href="/admin/email-templates"
            className="celestial-button bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email Templates</span>
          </a>
        </div>

        {/* Real Data Statistics */}
        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
            <span className="text-gray-600">Loading email data...</span>
          </div>
        ) : emailData ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="celestial-card p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{emailData.stats.totalNewsletterSubscribers}</p>
                  <p className="text-sm text-gray-600">Newsletter Subscribers</p>
                </div>
              </div>
            </div>
            <div className="celestial-card p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{emailData.stats.totalUserSubscribers}</p>
                  <p className="text-sm text-gray-600">Marketing Subscribers</p>
                </div>
              </div>
            </div>
            <div className="celestial-card p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{emailData.stats.totalRecentOrders}</p>
                  <p className="text-sm text-gray-600">Recent Orders</p>
                </div>
              </div>
            </div>
            <div className="celestial-card p-4">
              <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{emailData.stats.activeNewsletterSubscribers}</p>
                  <p className="text-sm text-gray-600">Active Subscribers</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="celestial-card p-6 mb-8">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <span>Failed to load email data. Please refresh the page.</span>
            </div>
          </div>
        )}

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {campaigns.map((campaign) => {
            const IconComponent = campaign.icon;
            return (
              <div key={campaign.id} className="celestial-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${campaign.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      {campaign.recipients !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">
                          {campaign.recipients} recipients
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => sendCampaign(campaign.id)}
                  disabled={isLoading || (campaign.recipients !== undefined && campaign.recipients === 0)}
                  className="w-full celestial-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isLoading ? 'Sending...' :
                      campaign.recipients === 0 ? 'No Recipients' :
                        'Send Campaign'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Results */}
        {results && (
          <div className="celestial-card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Results</h3>

            {results.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{results.error}</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Campaign Type</p>
                    <p className="font-medium text-gray-900">{results.action}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="font-medium text-gray-900">
                      {results.result?.successCount || 0} / {(results.result?.successCount || 0) + (results.result?.failureCount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Timestamp</p>
                    <p className="font-medium text-gray-900">
                      {new Date(results.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {results.result && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-auto">
                      {JSON.stringify(results.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Email Templates Preview */}
        <div className="celestial-card p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Welcome Email</h4>
              <p className="text-sm text-gray-600 mb-3">Sent to new subscribers with 15% discount</p>
              <button className="text-sm text-blue-600 hover:text-blue-700">Preview Template</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Order Confirmation</h4>
              <p className="text-sm text-gray-600 mb-3">Sent after successful purchase</p>
              <button className="text-sm text-blue-600 hover:text-blue-700">Preview Template</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Newsletter</h4>
              <p className="text-sm text-gray-600 mb-3">Weekly crystal wisdom and tips</p>
              <button className="text-sm text-blue-600 hover:text-blue-700">Preview Template</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Discount Voucher</h4>
              <p className="text-sm text-gray-600 mb-3">Special offers and promotions</p>
              <button className="text-sm text-blue-600 hover:text-blue-700">Preview Template</button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="celestial-card p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="text-lg font-medium text-gray-900">Total Subscribers</h4>
            <p className="text-2xl font-light text-gray-900">1,234</p>
            <p className="text-sm text-gray-600">+12% this month</p>
          </div>

          <div className="celestial-card p-6 text-center">
            <Mail className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="text-lg font-medium text-gray-900">Emails Sent</h4>
            <p className="text-2xl font-light text-gray-900">5,678</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>

          <div className="celestial-card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="text-lg font-medium text-gray-900">Open Rate</h4>
            <p className="text-2xl font-light text-gray-900">24.5%</p>
            <p className="text-sm text-gray-600">Above average</p>
          </div>
        </div>
      </div>
    </div>
  );
}
