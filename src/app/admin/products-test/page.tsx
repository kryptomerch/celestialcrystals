'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminProductsTestPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'loading') {
      fetchProducts();
    }
  }, [status]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await fetch('/api/admin/products');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products data:', data);
        setProducts(data.products || []);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setError(`Error: ${errorData.error || 'Failed to load products'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError('Network error: Please check your connection');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-6">Loading session...</div>;
  }

  if (!session?.user?.email) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Products Test</h1>
        <p>Please sign in to access this page.</p>
        <a href="/auth/signin" className="text-blue-600 hover:underline">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Products Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Session Info:</h2>
        <p>Email: {session.user.email}</p>
        <p>Role: {session.user.role || 'Not set'}</p>
        <p>Status: {status}</p>
      </div>

      {loading && <div>Loading products...</div>}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={fetchProducts}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Products ({products.length})</h2>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid gap-4">
              {products.slice(0, 5).map((product: any) => (
                <div key={product.id} className="p-4 border rounded">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                  <p className="text-sm">Stock: {product.stockQuantity}</p>
                  <p className="text-sm">Category: {product.category}</p>
                </div>
              ))}
              {products.length > 5 && (
                <p className="text-sm text-gray-500">
                  ... and {products.length - 5} more products
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
