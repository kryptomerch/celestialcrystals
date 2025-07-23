'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { getColorHex } from '@/utils/colors';
import { getCrystalGlowClass } from '@/utils/crystal-glow';

interface WishlistItem {
  id: string;
  createdAt: string;
  crystal: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    properties: string[];
    colors: string[];
    stockQuantity: number;
    isActive: boolean;
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/wishlist');
      return;
    }

    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/user/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlistItems);
      } else {
        setError('Failed to load wishlist');
      }
    } catch (error) {
      setError('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (crystalId: string) => {
    try {
      const response = await fetch(`/api/user/wishlist?crystalId=${crystalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.crystal.id !== crystalId));
      } else {
        setError('Failed to remove item from wishlist');
      }
    } catch (error) {
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = (crystal: any) => {
    addToCart(crystal);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(crystal.id);
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-light text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlistItems.length > 0
              ? `${wishlistItems.length} item${wishlistItems.length === 1 ? '' : 's'} saved for later`
              : 'Your wishlist is empty'
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding crystals you love to keep track of them for later.
            </p>
            <button
              onClick={() => router.push('/crystals')}
              className="celestial-button"
            >
              Explore Crystals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className={`celestial-card overflow-hidden ${getCrystalGlowClass(item.crystal.colors)}`}>
                {/* Crystal Image */}
                <div className="relative h-48 bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gray-400" />
                  </div>

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.crystal.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Price Badge */}
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-sm font-medium text-gray-900">
                    {formatPrice(item.crystal.price)}
                  </div>

                  {/* Stock Status */}
                  {!item.crystal.isActive || item.crystal.stockQuantity === 0 ? (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </div>
                  ) : item.crystal.stockQuantity <= 5 ? (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Low Stock
                    </div>
                  ) : null}
                </div>

                {/* Crystal Info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {item.crystal.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.crystal.description}
                  </p>

                  {/* Properties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.crystal.properties.slice(0, 2).map((property, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200"
                      >
                        {property}
                      </span>
                    ))}
                    {item.crystal.properties.length > 2 && (
                      <span className="text-gray-500 text-xs py-1">
                        +{item.crystal.properties.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  <div className="flex items-center space-x-1 mb-4">
                    {item.crystal.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: getColorHex(color) }}
                        title={color}
                      />
                    ))}
                    {item.crystal.colors.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{item.crystal.colors.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(item.crystal)}
                      disabled={!item.crystal.isActive || item.crystal.stockQuantity === 0}
                      className="w-full celestial-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {!item.crystal.isActive || item.crystal.stockQuantity === 0
                          ? 'Out of Stock'
                          : 'Add to Cart'
                        }
                      </span>
                    </button>

                    <button
                      onClick={() => router.push(`/crystals/${item.crystal.id}`)}
                      className="w-full celestial-button-outline"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Added Date */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/crystals')}
              className="celestial-button-outline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


