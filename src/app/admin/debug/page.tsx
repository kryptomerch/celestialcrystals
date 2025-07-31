'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDebug() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      sessionStatus: status,
      userEmail: session?.user?.email,
      userName: session?.user?.firstName + ' ' + session?.user?.lastName,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
    });
  }, [session, status]);

  const testApiCall = async () => {
    try {
      const response = await fetch('/api/admin/analytics?period=30');
      const data = await response.json();

      setDebugInfo((prev: any) => ({
        ...prev,
        apiTest: {
          status: response.status,
          statusText: response.statusText,
          data: data,
          headers: Object.fromEntries(response.headers.entries())
        }
      }));
    } catch (error) {
      setDebugInfo((prev: any) => ({
        ...prev,
        apiTest: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        }
      }));
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p className="mb-4">Please sign in to access the admin panel.</p>
          <button
            onClick={() => router.push('/auth/signin?callbackUrl=/admin/debug')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const adminEmails = ['kryptomerch.io@gmail.com', 'dhruvaparik@gmail.com'];
  const isAdmin = adminEmails.includes(session.user?.email?.toLowerCase() || '');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Debug Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
              <p><strong>Name:</strong> {(session.user?.firstName + ' ' + session.user?.lastName).trim() || 'N/A'}</p>
              <p><strong>Image:</strong> {session.user?.image ? 'Yes' : 'No'}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>

          {/* Admin Check */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Admin Access Check</h2>
            <div className="space-y-2">
              <p><strong>Current Email:</strong> {session.user?.email}</p>
              <p><strong>Admin Emails:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {adminEmails.map(email => (
                  <li key={email} className={session.user?.email === email ? 'text-green-600 font-bold' : ''}>
                    {email}
                  </li>
                ))}
              </ul>
              <p><strong>Access Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {isAdmin ? 'GRANTED' : 'DENIED'}
                </span>
              </p>
            </div>
          </div>

          {/* API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Test</h2>
            <button
              onClick={testApiCall}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Test Analytics API
            </button>
            {debugInfo.apiTest && (
              <div className="mt-4">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.apiTest, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Debug Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Try Main Admin Panel
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
