'use client';

import { useEffect, useState } from 'react';

export default function TestStripeFrontend() {
  const [stripeKey, setStripeKey] = useState<string | undefined>();
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    // Check if Stripe publishable key is available
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    setStripeKey(key);

    // Test API call
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 29.99 }),
    })
      .then(res => res.json())
      .then(data => {
        setTestResult({ success: true, data });
      })
      .catch(error => {
        setTestResult({ success: false, error: error.message });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stripe Frontend Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</strong>
              <div className="mt-1 p-2 bg-gray-100 rounded">
                {stripeKey ? (
                  <span className="text-green-600">
                    ✅ {stripeKey.substring(0, 20)}...
                  </span>
                ) : (
                  <span className="text-red-600">❌ Not found</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          {testResult ? (
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-semibold mb-2">
                {testResult.success ? '✅ Success' : '❌ Failed'}
              </h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-gray-500">Testing...</div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info</h3>
          <div className="text-sm text-yellow-700">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'Server'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
