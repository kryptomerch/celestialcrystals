'use client';

import { useState } from 'react';
import { crystalDatabase, Crystal } from '@/data/crystals';
import { Shield, Heart, Coins, MessageSquare, Eye, Flower2, Zap, Mountain, Sun, Moon, Gem, Star } from 'lucide-react';
import Link from 'next/link';
import CrystalModal from '@/components/CrystalModal';
import { useCart } from '@/contexts/CartContext';
import { getColorHex } from '@/utils/colors';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

// Map category names to crystal colors for glow effects
const getCategoryGlowClass = (categoryName: string): string => {
  const categoryColors: { [key: string]: string[] } = {
    'Protection': ['black'], // protection = black
    'Love': ['pink'], // love = pink
    'Abundance': ['golden'], // abundance = golden
    'Communication': ['blue'], // communication = blue
    'Spiritual Protection': ['purple'], // spiritual = purple
    'Chakra Healing': ['purple'], // chakras = purple
    'Energy': ['orange'], // energy = orange
    'Healing': ['green'], // healing = green
    'Grounding': ['brown'], // grounding = brown
    'Intuition': ['purple'], // intuition = purple
  };

  const colors = categoryColors[categoryName] || ['purple']; // default purple
  return getCrystalGlowClass(colors);
};

export default function CategoriesPage() {
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const categories = [
    {
      name: 'Protection',
      description: 'Crystals that shield against negative energies and provide spiritual protection.',
      icon: Shield,
      count: crystalDatabase.filter(c => c.category === 'Protection').length
    },
    {
      name: 'Love',
      description: 'Stones that open the heart, promote self-love, and attract loving relationships.',
      icon: Heart,
      count: crystalDatabase.filter(c => c.category === 'Love').length
    },
    {
      name: 'Abundance',
      description: 'Crystals that attract prosperity, success, and financial abundance.',
      icon: Coins,
      count: crystalDatabase.filter(c => c.category === 'Abundance').length
    },
    {
      name: 'Communication',
      description: 'Stones that enhance communication, truth, and intellectual abilities.',
      icon: MessageSquare,
      count: crystalDatabase.filter(c => c.category === 'Communication').length
    },
    {
      name: 'Spiritual Protection',
      description: 'Crystals for spiritual growth, intuition, and psychic protection.',
      icon: Eye,
      count: crystalDatabase.filter(c => c.category === 'Spiritual Protection').length
    },
    {
      name: 'Chakra Healing',
      description: 'Stones that balance and align the chakra system for overall well-being.',
      icon: Flower2,
      count: crystalDatabase.filter(c => c.category === 'Chakra Healing').length
    },
    {
      name: 'Energy',
      description: 'Crystals that boost vitality, motivation, and personal power.',
      icon: Zap,
      count: crystalDatabase.filter(c => c.properties.some(p => p.toLowerCase().includes('energy'))).length
    },
    {
      name: 'Healing',
      description: 'Stones known for their powerful healing and therapeutic properties.',
      icon: Sun,
      count: crystalDatabase.filter(c => c.properties.some(p => p.toLowerCase().includes('healing'))).length
    },
    {
      name: 'Grounding',
      description: 'Stones that provide stability, connection to earth, and emotional balance.',
      icon: Mountain,
      count: crystalDatabase.filter(c => c.properties.some(p => p.toLowerCase().includes('grounding'))).length
    },
    {
      name: 'Intuition',
      description: 'Crystals that enhance psychic abilities, dreams, and inner wisdom.',
      icon: Moon,
      count: crystalDatabase.filter(c => c.properties.some(p => p.toLowerCase().includes('intuition'))).length
    }
  ];

  const featuredCrystals = crystalDatabase.slice(0, 3);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Crystal Categories</h1>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-600'}`}>Explore crystals by their healing properties and spiritual purposes</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/crystals?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className={`celestial-card p-8 text-center h-full flex flex-col ${getCategoryGlowClass(category.name)}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${isDark
                    ? 'bg-gray-700 group-hover:bg-gray-600'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                    <Icon className={`w-8 h-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.name}</h3>
                  <p className={`mb-4 flex-grow ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{category.description}</p>
                  <div className={`flex items-center justify-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{category.count} crystals</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Crystals Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Featured Crystals</h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-white' : 'text-gray-600'}`}>
              Discover some of our most popular crystals, each carefully selected for their powerful healing properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCrystals.map((crystal) => (
              <div
                key={crystal.id}
                className={`celestial-card cursor-pointer flex flex-col h-full ${getCrystalGlowClass(crystal.colors)}`}
                onClick={() => setSelectedCrystal(crystal)}
              >
                <div className={`relative h-48 flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {crystal.image ? (
                    <img
                      src={crystal.image}
                      alt={crystal.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Fallback placeholder */}
                  <div className={`absolute inset-0 flex items-center justify-center ${crystal.image ? 'hidden' : ''}`}>
                    <Gem className={`w-16 h-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{crystal.name}</h3>
                  <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-white' : 'text-gray-600'}`}>{crystal.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {crystal.properties.slice(0, 2).map((property, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${isDark
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {property}
                      </span>
                    ))}
                  </div>

                  {/* Colors */}
                  <div className="flex items-center space-x-1 mb-6">
                    {crystal.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border shadow-sm ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                    ))}
                  </div>

                  {/* Price and Learn More button - pushed to bottom */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>${crystal.price}</span>
                    <span className={`font-medium group-hover:text-purple-400 transition-colors text-sm uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Learn More →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Choose Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-light mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>How to Choose Your Crystal</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Heart className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Follow Your Intuition</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Trust your instincts and choose crystals that resonate with your energy and intentions.</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Star className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Consider Your Goals</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Select crystals based on the specific healing properties or life areas you want to enhance.</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Gem className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Start Small</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Begin with one or two crystals and gradually build your collection as you learn and grow.</p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/birthdate-guide"
              className={`inline-flex items-center justify-center px-8 py-3 font-medium transition-all duration-200 text-sm uppercase tracking-wide ${isDark
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
            >
              Get Personalized Recommendations
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to Start Your Crystal Journey?</h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Explore our complete collection of authentic healing crystals and find the perfect stones for your spiritual practice.
          </p>
          <Link href="/crystals" className="celestial-button mr-4">
            Browse All Crystals
          </Link>
          <Link href="/contact" className={`inline-flex items-center px-6 py-3 border-2 font-medium rounded transition-all duration-200 ${isDark
            ? 'border-white text-white hover:bg-white hover:text-gray-900'
            : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
            }`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Get Expert Guidance
          </Link>
        </div>
      </div>

      {/* Crystal Modal */}
      {selectedCrystal && (
        <CrystalModal
          crystal={selectedCrystal}
          isOpen={!!selectedCrystal}
          onClose={() => setSelectedCrystal(null)}
          onAddToCart={(crystal) => {
            addToCart(crystal);
            setSelectedCrystal(null);
          }}
        />
      )}
    </div>
  );
}
