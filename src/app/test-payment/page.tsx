'use client';

import { useState } from 'react';

export default function TestPaymentPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testPaymentIntent = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Testing payment intent creation...');
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 25.99,
          currency: 'usd',
          orderData: {
            customerInfo: {
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User'
            },
            items: [
              {
                id: 'test-1',
                name: 'Test Crystal',
                price: 25.99,
                quantity: 1
              }
            ]
          }
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      console.error('❌ Payment intent test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Payment Intent Test
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Test Payment Intent Creation
              </h2>
              <p className="text-blue-700 text-sm mb-4">
                This will test the /api/create-payment-intent endpoint with sample data.
              </p>
              
              <button
                onClick={testPaymentIntent}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Payment Intent'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">❌ Error</h3>
                <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Success</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">Client Secret:</span>
                    <span className="text-green-600 text-sm font-mono">
                      {result.clientSecret ? '✅ Generated' : '❌ Missing'}
                    </span>
                  </div>
                  {result.clientSecret && (
                    <div className="mt-2">
                      <span className="text-green-700 text-xs">
                        {result.clientSecret.substring(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔧 Debug Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Environment:</span>
                  <span className="text-gray-600">{process.env.NODE_ENV}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Stripe Publishable Key:</span>
                  <span className="text-gray-600">
                    {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                💡 Common Issues
              </h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Check if STRIPE_SECRET_KEY is properly set in environment variables</li>
                <li>• Verify the API endpoint is accessible</li>
                <li>• Check browser console for network errors</li>
                <li>• Ensure amount is a valid number</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
