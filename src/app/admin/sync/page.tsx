'use client';

import { useState } from 'react';

export default function AdminSyncPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const syncBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/sync-blog-posts', {
        method: 'POST'
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to sync blog posts');
    } finally {
      setLoading(false);
    }
  };

  const setupInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/setup-inventory-simple', {
        method: 'POST'
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to setup inventory');
    } finally {
      setLoading(false);
    }
  };

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/crystals-db');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to test database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Sync Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={syncBlogPosts}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Syncing...' : 'Sync Blog Posts'}
          </button>
          
          <button
            onClick={setupInventory}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Setup 21 Bracelets'}
          </button>
          
          <button
            onClick={testDatabase}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Database'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
