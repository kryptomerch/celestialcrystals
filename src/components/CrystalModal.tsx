'use client';

import { useState } from 'react';
import { Crystal } from '@/data/crystals';
import { useCart } from '@/contexts/CartContext';
import { X, ShoppingBag, Sparkles, Plus, Minus } from 'lucide-react';

interface CrystalModalProps {
  crystal: Crystal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (crystal: Crystal) => void;
}

export default function CrystalModal({ crystal, isOpen, onClose, onAddToCart }: CrystalModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!crystal || !isOpen) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(crystal);
    }
  };

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'Brown': '#8B4513',
      'Golden': '#FFD700',
      'Light Blue': '#87CEEB',
      'Blue-Green': '#0D98BA',
      'Blue': '#0000FF',
      'Red': '#FF0000',
      'Orange': '#FFA500',
      'Yellow': '#FFFF00',
      'Green': '#008000',
      'Light Green': '#90EE90',
      'Indigo': '#4B0082',
      'Violet': '#8A2BE2',
      'White': '#FFFFFF',
      'Cream': '#F5F5DC',
      'Pink': '#FFC0CB',
      'Rose': '#FF69B4',
      'Purple': '#800080',
      'Lavender': '#E6E6FA',
      'Deep Purple': '#663399',
      'Clear': '#F0F8FF',
      'Deep Blue': '#00008B',
      'Blue with Gold': '#1E90FF',
      'Metallic Gray': '#C0C0C0',
      'Dark Green': '#006400',
      'Peach': '#FFCBA4',
      'Gray': '#808080',
      'Teal': '#008080'
    };

    return colorMap[colorName] || '#9CA3AF';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4">
      {/* Clean Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative celestial-card max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Crystal Image Placeholder */}
          <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4 text-gray-900 pr-8">{crystal.name}</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{crystal.description}</p>

          {/* Crystal Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-gray-900">Properties</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {crystal.properties.map((property, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium border border-gray-200"
                  >
                    {property}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-gray-900">Colors</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {crystal.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-1.5 sm:space-x-2">
                    <div
                      className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-xs sm:text-sm text-gray-600">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><span className="font-medium text-gray-900">Chakra:</span> {crystal.chakra}</div>
                <div><span className="font-medium text-gray-900">Element:</span> {crystal.element}</div>
                <div><span className="font-medium text-gray-900">Hardness:</span> {crystal.hardness}</div>
                <div><span className="font-medium text-gray-900">Origin:</span> {crystal.origin}</div>
                <div><span className="font-medium text-gray-900">Rarity:</span> {crystal.rarity}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Zodiac Signs</h3>
              <div className="flex flex-wrap gap-2">
                {crystal.zodiacSigns.map((sign, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm border border-gray-200"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <span className="text-2xl sm:text-3xl font-light text-gray-900">${crystal.price}</span>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Free shipping on orders over $50</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 sm:p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-900 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 sm:p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="celestial-button w-full flex items-center justify-center space-x-2 text-sm sm:text-base py-3 sm:py-2"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add {quantity > 1 ? `${quantity} ` : ''}to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
