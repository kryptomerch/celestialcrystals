'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';

interface Crystal {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  properties: string[];
  colors?: string[];
  chakra?: string;
  zodiacSigns?: string[];
  birthMonths?: number[];
  element?: string;
  hardness?: string;
  origin?: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
  stockQuantity: number;
  averageRating?: number;
  reviewCount?: number;
}

interface CrystalCardProps {
  crystal: Crystal;
}

export default function CrystalCard({ crystal }: CrystalCardProps) {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: crystal.id,
      name: crystal.name,
      description: crystal.description,
      price: crystal.price,
      properties: crystal.properties,
      colors: crystal.colors || [],
      category: crystal.category,
      chakra: crystal.chakra || '',
      zodiacSigns: crystal.zodiacSigns || [],
      birthMonths: crystal.birthMonths || [],
      element: crystal.element || '',
      hardness: crystal.hardness || '',
      origin: crystal.origin || '',
      rarity: crystal.rarity || 'Common',
      image: crystal.image
    });
  };

  const toggleWishlist = (crystalId: string) => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const isOutOfStock = crystal.stockQuantity === 0;
  const isLowStock = crystal.stockQuantity > 0 && crystal.stockQuantity <= 5;

  return (
    <div className={`group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={crystal.image}
          alt={crystal.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(crystal.id)}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isWishlisted
            ? 'bg-red-500 text-white'
            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Only {crystal.stockQuantity} left!
          </div>
        )}
        {!isOutOfStock && !isLowStock && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {crystal.name}
          </h3>
          <span className={`font-bold text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
            ${crystal.price}
          </span>
        </div>

        {/* Rating */}
        {crystal.averageRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(crystal.averageRating!)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {crystal.averageRating}
            </span>
            {crystal.reviewCount && (
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                ({crystal.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {crystal.description}
        </p>

        {/* Properties */}
        <div className="flex flex-wrap gap-1 mb-4">
          {crystal.properties.slice(0, 3).map((property, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${isDark
                ? 'bg-purple-900/50 text-purple-300'
                : 'bg-purple-100 text-purple-700'
                }`}
            >
              {property}
            </span>
          ))}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isDark
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
