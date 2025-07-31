'use client';

import { useEffect, useState } from 'react';

export default function TestAnalytics() {
  const [gtagStatus, setGtagStatus] = useState<string>('Checking...');
  const [dataLayerStatus, setDataLayerStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check if gtag is loaded
    const checkAnalytics = () => {
      if (typeof window !== 'undefined') {
        // Check gtag
        if (typeof window.gtag === 'function') {
          setGtagStatus('✅ Google Analytics (gtag) is loaded and working!');
        } else {
          setGtagStatus('❌ Google Analytics (gtag) not found');
        }

        // Check dataLayer
        if (window.dataLayer && Array.isArray(window.dataLayer)) {
          setDataLayerStatus(`✅ DataLayer exists with ${window.dataLayer.length} items`);
        } else {
          setDataLayerStatus('❌ DataLayer not found');
        }
      }
    };

    // Check immediately and after a delay
    checkAnalytics();
    setTimeout(checkAnalytics, 2000);
  }, []);

  const testEvent = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'test_button_click', {
        event_category: 'Test',
        event_label: 'Analytics Test Page',
        value: 1
      });
      alert('Test event sent to Google Analytics!');
    } else {
      alert('Google Analytics not available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Google Analytics Test</h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Analytics Status</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Google Analytics (gtag):</span>
                  <span>{gtagStatus}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">DataLayer:</span>
                  <span>{dataLayerStatus}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Tracking ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">G-LB6Y0RG4JQ</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Test Analytics</h2>
              <p className="text-green-800 mb-4">
                Click the button below to send a test event to Google Analytics. 
                You can verify this in your Google Analytics Real-time reports.
              </p>
              <button
                onClick={testEvent}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Send Test Event
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">How to Verify</h2>
              <ol className="list-decimal list-inside space-y-2 text-yellow-800">
                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Analytics</a></li>
                <li>Select your property (G-LB6Y0RG4JQ)</li>
                <li>Navigate to Reports → Realtime</li>
                <li>Click the "Send Test Event" button above</li>
                <li>You should see the event appear in real-time</li>
                <li>Check the "Events" section for the test_button_click event</li>
              </ol>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Enhanced eCommerce Events</h2>
              <p className="text-purple-800 mb-3">The following events are automatically tracked:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-700">
                <li><strong>view_item:</strong> When users view crystal products</li>
                <li><strong>add_to_cart:</strong> When users add crystals to cart</li>
                <li><strong>purchase:</strong> When users complete orders</li>
                <li><strong>search:</strong> When users search for crystals</li>
                <li><strong>page_view:</strong> Automatic page tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
