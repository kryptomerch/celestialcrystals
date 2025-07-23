'use client';

import { useState } from 'react';
import { Crystal, crystalDatabase } from '@/data/crystals';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingBag, Sparkles, Star, Heart, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getColorHex } from '@/utils/colors';
import { getCrystalGlowClass } from '@/utils/crystal-glow';

interface CrystalDetailPageProps {
  crystal: Crystal;
}

export default function CrystalDetailPage({ crystal }: CrystalDetailPageProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Get related crystals
  const relatedCrystals = crystalDatabase
    .filter(c =>
      c.id !== crystal.id && (
        c.category === crystal.category ||
        c.properties.some(prop => crystal.properties.includes(prop))
      )
    )
    .slice(0, 4);

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000', 'Brown': '#8B4513', 'Golden': '#FFD700', 'Light Blue': '#87CEEB',
      'Blue-Green': '#0D98BA', 'Blue': '#0000FF', 'Red': '#FF0000', 'Orange': '#FFA500',
      'Yellow': '#FFFF00', 'Green': '#008000', 'Light Green': '#90EE90', 'Indigo': '#4B0082',
      'Violet': '#8A2BE2', 'White': '#FFFFFF', 'Cream': '#F5F5DC', 'Pink': '#FFC0CB',
      'Rose': '#FF69B4', 'Purple': '#800080', 'Lavender': '#E6E6FA', 'Deep Purple': '#663399',
      'Clear': '#F0F8FF', 'Deep Blue': '#00008B', 'Blue with Gold': '#1E90FF',
      'Metallic Gray': '#C0C0C0', 'Dark Green': '#006400', 'Peach': '#FFCBA4',
      'Gray': '#808080', 'Teal': '#008080'
    };
    return colorMap[colorName] || '#9CA3AF';
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(crystal);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: crystal.name,
          text: crystal.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/crystals" className="text-gray-500 hover:text-gray-700">Crystals</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{crystal.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Crystal Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-32 h-32 text-purple-300" />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center cursor-pointer hover:from-purple-500/20 hover:to-pink-500/20 transition-colors">
                  <Sparkles className="w-8 h-8 text-purple-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Crystal Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{crystal.name}</h1>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.8) 127 reviews</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${crystal.rarity === 'Common' ? 'bg-green-100 text-green-800' :
                  crystal.rarity === 'Uncommon' ? 'bg-blue-100 text-blue-800' :
                    crystal.rarity === 'Rare' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  {crystal.rarity}
                </span>
              </div>

              <div className="text-3xl font-bold text-purple-600 mb-6">
                ${crystal.price}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Free shipping over $50
                </span>
              </div>
            </div>

            {/* Properties */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Healing Properties</h3>
              <div className="flex flex-wrap gap-2">
                {crystal.properties.map((property, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {property}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Colors</h3>
              <div className="flex items-center space-x-3">
                {crystal.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-sm text-gray-600">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Quick Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Chakra:</span>
                  <p className="text-gray-600">{crystal.chakra}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Element:</span>
                  <p className="text-gray-600">{crystal.element}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Hardness:</span>
                  <p className="text-gray-600">{crystal.hardness}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Origin:</span>
                  <p className="text-gray-600">{crystal.origin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'properties', label: 'Properties' },
                { id: 'zodiac', label: 'Zodiac Signs' },
                { id: 'reviews', label: 'Reviews (127)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">{crystal.description}</p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This beautiful {crystal.name} is perfect for those seeking {crystal.properties.slice(0, 3).join(', ').toLowerCase()}.
                  As a {crystal.chakra} chakra stone, it helps to balance and align your energy centers, promoting overall well-being and spiritual growth.
                </p>
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Metaphysical Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {crystal.properties.map((property, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{property}</h4>
                          <p className="text-gray-600 text-sm">
                            Enhances {property.toLowerCase()} and promotes positive energy flow.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'zodiac' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compatible Zodiac Signs</h3>
                <div className="flex flex-wrap gap-3">
                  {crystal.zodiacSigns.map((sign, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium"
                    >
                      {sign}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mt-4">
                  This crystal resonates particularly well with these zodiac signs, enhancing their natural traits and providing spiritual support.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews Coming Soon</h3>
                  <p className="text-gray-600">Customer reviews will be available soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Crystals */}
        {relatedCrystals.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCrystals.map((relatedCrystal) => (
                <Link
                  key={relatedCrystal.id}
                  href={`/crystals/${relatedCrystal.id}`}
                  className="group"
                >
                  <div className={`celestial-card overflow-hidden ${getCrystalGlowClass(relatedCrystal.colors)}`}>
                    <div className="relative h-48 bg-gray-100">
                      {relatedCrystal.image ? (
                        <img
                          src={relatedCrystal.image}
                          alt={relatedCrystal.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      {/* Fallback placeholder */}
                      <div className={`absolute inset-0 flex items-center justify-center ${relatedCrystal.image ? 'hidden' : ''}`}>
                        <Sparkles className="w-16 h-16 text-gray-400" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{relatedCrystal.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedCrystal.description}</p>

                      {/* Colors */}
                      <div className="flex items-center space-x-1 mb-3">
                        {relatedCrystal.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${relatedCrystal.price}</span>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm font-medium">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
