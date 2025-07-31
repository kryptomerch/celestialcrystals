'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Shield, CheckCircle, AlertCircle, User } from 'lucide-react';

export default function AdminSetupPage() {
  const { data: session, status } = useSession();
  const [userStatus, setUserStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session) {
      checkUserStatus();
    }
  }, [session]);

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/user/status');
      const data = await response.json();
      setUserStatus(data);
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const setupAdmin = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Admin role granted successfully!');
        checkUserStatus(); // Refresh status
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to setup admin role');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Authenticated</h1>
          <p className="text-gray-600 mb-4">Please sign in first</p>
          <a href="/auth/signin" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Setup</h1>
          <p className="text-gray-600 mt-2">Check and setup admin access</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Current Status */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h2>
            {userStatus ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email: {userStatus.user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {userStatus.isAdmin ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    Role: {userStatus.user?.role || 'USER'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {userStatus.isAdmin ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    Admin Access: {userStatus.isAdmin ? 'Granted' : 'Not Granted'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Loading user status...</div>
            )}
          </div>

          {/* Setup Button */}
          {userStatus && !userStatus.isAdmin && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Grant Admin Access</h2>
              <button
                onClick={setupAdmin}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Grant Admin Role'}
              </button>
            </div>
          )}

          {/* Success Message */}
          {userStatus && userStatus.isAdmin && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-800 font-medium">Admin access granted!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                You can now access the admin panel.
              </p>
              <a
                href="/admin"
                className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              >
                Go to Admin Panel
              </a>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Navigation */}
          <div className="text-center pt-4 border-t">
            <a href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
