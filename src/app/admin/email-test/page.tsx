'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function EmailTestPage() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testWelcomeEmail = async () => {
    if (!email || !firstName) {
      setResult({
        success: false,
        error: 'Email and first name are required'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-welcome-email-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send test email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-light mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Email Testing
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Test welcome emails and other email functionality
          </p>
        </div>

        <div className="celestial-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Test Welcome Email
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className={`w-full px-4 py-2 border rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Test User"
                className={`w-full px-4 py-2 border rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <button
            onClick={testWelcomeEmail}
            disabled={loading || !email || !firstName}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Sending...' : 'Send Test Welcome Email'}</span>
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </span>
              </div>
              
              <p className={`text-sm ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message || result.error}
              </p>

              {result.success && result.details && (
                <div className="mt-3 text-xs text-green-600">
                  <p><strong>Email:</strong> {result.details.email}</p>
                  <p><strong>Discount Code:</strong> {result.details.discountCode}</p>
                  <p><strong>Sent at:</strong> {new Date(result.details.timestamp).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 celestial-card p-6">
          <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Email Configuration Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Resend API Key:</span>
              <span className={`${process.env.RESEND_API_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {process.env.RESEND_API_KEY ? 'Configured' : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>From Email:</span>
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {process.env.FROM_EMAIL || 'noreply@celestialcrystals.com'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
