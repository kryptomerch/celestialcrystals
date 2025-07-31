'use client';

import { useState } from 'react';
import { Mail, Eye, Send, Calendar, Gift, Zap, Sparkles } from 'lucide-react';

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [previewData, setPreviewData] = useState({
    firstName: 'Crystal',
    email: 'crystal@example.com',
    weekNumber: 1,
    offerType: 'flash-sale'
  });

  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Sent when user signs up or logs in for first time'
    },
    {
      id: 'weekly-1',
      name: 'Week 1: Crystal Cleansing',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Crystal cleansing and charging rituals'
    },
    {
      id: 'weekly-2',
      name: 'Week 2: Chakra Balancing',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Chakra balancing with crystals'
    },
    {
      id: 'weekly-3',
      name: 'Week 3: Manifestation',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Crystal grids for manifestation'
    },
    {
      id: 'weekly-4',
      name: 'Week 4: Protection',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Protection and grounding crystals'
    },
    {
      id: 'flash-sale',
      name: 'Flash Sale',
      icon: <Zap className="w-5 h-5" />,
      description: '48-hour flash sale promotion'
    },
    {
      id: 'birthday',
      name: 'Birthday Special',
      icon: <Gift className="w-5 h-5" />,
      description: 'Birthday discount email'
    }
  ];

  const sendTestEmail = async () => {
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          data: previewData
        }),
      });

      if (response.ok) {
        alert('Test email sent successfully!');
      } else {
        alert('Failed to send test email');
      }
    } catch (error) {
      alert('Error sending test email');
    }
  };

  const getPreviewUrl = () => {
    const params = new URLSearchParams({
      template: selectedTemplate,
      ...previewData,
      weekNumber: previewData.weekNumber.toString()
    });
    return `/api/email/preview?${params}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Email Template Preview
          </h1>
          <p className="text-gray-600">
            Preview and test your crystal email templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Template
              </h2>

              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTemplate === template.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${selectedTemplate === template.id ? 'text-indigo-600' : 'text-gray-400'
                        }`}>
                        {template.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${selectedTemplate === template.id ? 'text-indigo-900' : 'text-gray-900'
                          }`}>
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Preview Data */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Preview Data
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={previewData.firstName}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        firstName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={previewData.email}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        email: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>

                  {selectedTemplate.startsWith('weekly') && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Week Number
                      </label>
                      <select
                        value={previewData.weekNumber}
                        onChange={(e) => setPreviewData({
                          ...previewData,
                          weekNumber: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value={1}>Week 1</option>
                        <option value={2}>Week 2</option>
                        <option value={3}>Week 3</option>
                        <option value={4}>Week 4</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <button
                  onClick={() => window.open(getPreviewUrl(), '_blank')}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Email</span>
                </button>

                <button
                  onClick={sendTestEmail}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Test Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    Email Preview
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="text-center mb-4">
                  <a
                    href={getPreviewUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open Email Preview in New Tab</span>
                  </a>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                  <p>Click the button above to preview the email template</p>
                  <p className="text-sm mt-2">Preview URL: {getPreviewUrl()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Schedule Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📅 Email Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Welcome Email
              </div>
              <div className="text-sm text-gray-600">
                Sent immediately when user signs up or logs in for the first time
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Weekly Wisdom
              </div>
              <div className="text-sm text-gray-600">
                Sent every Monday at 9 AM with crystal education and tips
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Special Offers
              </div>
              <div className="text-sm text-gray-600">
                Sent for flash sales, new arrivals, and seasonal promotions
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Birthday Specials
              </div>
              <div className="text-sm text-gray-600">
                Sent on user's birthday with special discount codes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
