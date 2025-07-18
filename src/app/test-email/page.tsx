'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testWelcomeEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });

      const data = await response.json();
      setResult({ success: response.ok, data });
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const testNewsletterEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });

      const data = await response.json();
      setResult({ success: response.ok, data });
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const testDiscountEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/discount-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          email,
          discountPercentage: 20,
          reason: 'birthday'
        }),
      });

      const data = await response.json();
      setResult({ success: response.ok, data });
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Email System Test</h1>
          <p className="text-gray-600">Test the email automation system with real emails.</p>
        </div>

        {/* Test Form */}
        <div className="celestial-card p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Test Email Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="John"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testWelcomeEmail}
              disabled={isLoading || !email || !firstName}
              className="celestial-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Test Welcome Email</span>
            </button>

            <button
              onClick={testNewsletterEmail}
              disabled={isLoading || !email || !firstName}
              className="celestial-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Test Newsletter</span>
            </button>

            <button
              onClick={testDiscountEmail}
              disabled={isLoading || !email || !firstName}
              className="celestial-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Test Discount Email</span>
            </button>
          </div>

          {isLoading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Sending email...</p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="celestial-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {result.success ? 'Email Sent Successfully!' : 'Email Failed'}
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>

            {result.success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  ✅ Check your email inbox for the test email. If you don't see it, check your spam folder.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Email Configuration Status */}
        <div className="celestial-card p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Configuration Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Resend API Key</span>
              <span className={`px-2 py-1 rounded text-xs ${
                process.env.NEXT_PUBLIC_RESEND_API_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {process.env.NEXT_PUBLIC_RESEND_API_KEY ? 'Configured' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SMTP Configuration</span>
              <span className={`px-2 py-1 rounded text-xs ${
                process.env.NEXT_PUBLIC_SMTP_USER ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {process.env.NEXT_PUBLIC_SMTP_USER ? 'Configured' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">From Email</span>
              <span className="text-gray-600 text-sm">
                {process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@celestialcrystals.com'}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Development Mode:</strong> If no email service is configured, emails will be logged to the console instead of being sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
