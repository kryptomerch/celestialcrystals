'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [apiTest, setApiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      testAdminAPI();
    }
  }, [session]);

  const testAdminAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setApiTest({
        status: response.status,
        success: response.ok,
        data: data
      });
    } catch (error) {
      setApiTest({
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Admin Authentication Test</h1>

        {/* Session Status */}
        <div className="celestial-card p-6 mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Session Status</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {status === 'loading' ? (
                <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
              ) : status === 'authenticated' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">Status: {status}</span>
            </div>

            {session && (
              <>
                <div className="pl-8 space-y-2 text-sm">
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Name:</strong> {session.user?.firstName} {session.user?.lastName}</p>
                  <p><strong>Role:</strong> {session.user?.role || 'Not set'}</p>
                  <p><strong>Is Admin:</strong> {session.user?.role === 'ADMIN' ? 'Yes' : 'No'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* API Test */}
        <div className="celestial-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900">Admin API Test</h2>
            <button
              onClick={testAdminAPI}
              disabled={loading || !session}
              className="celestial-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
          </div>

          {apiTest && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {apiTest.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  API Status: {apiTest.status} ({apiTest.success ? 'Success' : 'Failed'})
                </span>
              </div>

              <div className="pl-8">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                  {JSON.stringify(apiTest.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="celestial-card p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>Session Object:</strong></p>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex space-x-4">
          <a
            href="/auth/signin"
            className="celestial-button bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            Login
          </a>
          <a
            href="/admin"
            className="celestial-button bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
          >
            Admin Dashboard
          </a>
          <a
            href="/admin/products"
            className="celestial-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Products Page
          </a>
        </div>
      </div>
    </div>
  );
}
