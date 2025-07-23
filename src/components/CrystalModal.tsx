'use client';

import { useState, useEffect } from 'react';
import { Crystal } from '@/data/crystals';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { X, ShoppingBag, Sparkles, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

interface CrystalModalProps {
  crystal: Crystal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (crystal: Crystal) => void;
}

export default function CrystalModal({ crystal, isOpen, onClose, onAddToCart }: CrystalModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isDark } = useTheme();

  // Get images array, fallback to single image or placeholder
  const images = crystal?.images || (crystal?.image ? [crystal.image] : []);

  // Auto-slide functionality - change image every 10 seconds
  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isOpen, images.length]);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, crystal?.id]);

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
            className={`absolute top-2 right-2 sm:top-4 sm:right-4 transition-colors z-10 ${isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Crystal Image Carousel */}
          <div className={`relative w-full aspect-[3/2] mb-4 sm:mb-6 rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {images.length > 0 ? (
              <>
                {/* Main Image */}
                <img
                  src={images[currentImageIndex]}
                  alt={`${crystal.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain transition-opacity duration-500"
                  onError={(e) => {
                    console.error(`Failed to load image: ${images[currentImageIndex]}`);
                  }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              /* Fallback placeholder */
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${isDark ? 'text-gray-500' : 'text-gray-600'}`} />
              </div>
            )}
          </div>

          <h2 className={`text-2xl sm:text-3xl font-light mb-3 sm:mb-4 pr-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>{crystal.name}</h2>
          <p className={`mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-600'}`}>{crystal.description}</p>

          {/* Crystal Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h3 className={`text-base sm:text-lg font-medium mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Properties</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {crystal.properties.map((property, index) => (
                  <span
                    key={index}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium border ${isDark
                      ? 'bg-gray-800 text-white border-gray-600'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                  >
                    {property}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-base sm:text-lg font-medium mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Colors</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {crystal.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-1.5 sm:space-x-2">
                    <div
                      className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border shadow-sm ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className={`text-xs sm:text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Details</h3>
              <div className={`space-y-2 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <div><span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Chakra:</span> {crystal.chakra}</div>
                <div><span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Element:</span> {crystal.element}</div>
                <div><span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Hardness:</span> {crystal.hardness}</div>
                <div><span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Origin:</span> {crystal.origin}</div>
                <div><span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Rarity:</span> {crystal.rarity}</div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Zodiac Signs</h3>
              <div className="flex flex-wrap gap-2">
                {crystal.zodiacSigns.map((sign, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-sm border ${isDark
                      ? 'bg-gray-800 text-white border-gray-600'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className={`pt-4 sm:pt-6 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <span className={`text-2xl sm:text-3xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>${crystal.price}</span>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Free shipping on orders over $75</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Quantity:</span>
                <div className={`flex items-center border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`p-1.5 sm:p-2 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <Minus className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  </button>
                  <span className={`px-3 sm:px-4 py-1.5 sm:py-2 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`p-1.5 sm:p-2 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <Plus className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center space-x-2 text-sm sm:text-base py-3 sm:py-2 px-4 font-medium transition-all duration-200 uppercase tracking-wide ${
                isDark 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
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
