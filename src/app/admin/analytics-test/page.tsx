'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGoogleAnalytics } from '@/components/GoogleAnalytics';

export default function AnalyticsTest() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { trackEvent, trackCrystalView, trackAddToCart, trackSearch } = useGoogleAnalytics();
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGoogleAnalytics = () => {
    addTestResult('Testing Google Analytics...');

    // Test basic event tracking
    trackEvent('test_event', {
      event_category: 'Admin Test',
      event_label: 'Analytics Test Page',
      value: 1
    });
    addTestResult('✅ Basic event tracked');

    // Test crystal view tracking
    trackCrystalView('test-crystal-1', 'Test Amethyst Bracelet', 'Protection', 39.99);
    addTestResult('✅ Crystal view tracked');

    // Test add to cart tracking
    trackAddToCart('test-crystal-1', 'Test Amethyst Bracelet', 'Protection', 39.99, 1);
    addTestResult('✅ Add to cart tracked');

    // Test search tracking
    trackSearch('natural crystal bracelet canada');
    addTestResult('✅ Search tracked');

    addTestResult('🎉 All Google Analytics tests completed!');
  };

  const checkGoogleAnalytics = () => {
    addTestResult('Checking Google Analytics setup...');

    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        addTestResult('✅ Google Analytics (gtag) is loaded');
        addTestResult(`✅ Measurement ID: ${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`);
      } else {
        addTestResult('❌ Google Analytics (gtag) not found');
      }

      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        addTestResult(`✅ DataLayer exists with ${window.dataLayer.length} items`);
      } else {
        addTestResult('❌ DataLayer not found');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Google Analytics Test</h1>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Analytics Configuration</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Measurement ID:</strong> {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'Not configured'}</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                <p><strong>Domain:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'Server-side'}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={checkGoogleAnalytics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Check GA Setup
              </button>
              <button
                onClick={testGoogleAnalytics}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Test Event Tracking
              </button>
              <button
                onClick={() => setTestResults([])}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Clear Results
              </button>
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Results</h3>
              <div className="space-y-1 text-sm font-mono">
                {testResults.map((result, index) => (
                  <div key={index} className="text-gray-700">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">How to Verify in Google Analytics</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
              <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Analytics</a></li>
              <li>Select your property (G-LB6Y0RG4JQ)</li>
              <li>Go to Reports → Realtime</li>
              <li>Click the test buttons above</li>
              <li>You should see events appearing in real-time</li>
              <li>Check "Events" section for custom events</li>
            </ol>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Enhanced eCommerce Events Configured</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li><strong>view_item:</strong> When users view crystal products</li>
              <li><strong>add_to_cart:</strong> When users add crystals to cart</li>
              <li><strong>purchase:</strong> When users complete orders</li>
              <li><strong>search:</strong> When users search for crystals</li>
              <li><strong>page_view:</strong> Automatic page tracking</li>
              <li><strong>web_vitals:</strong> Core Web Vitals performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
