'use client';

import { useState } from 'react';
import { crystalDatabase, Crystal } from '@/data/crystals';
import { Shield, Heart, Coins, MessageSquare, Eye, Flower2, Zap, Mountain, Sun, Moon, Gem, Star } from 'lucide-react';
import Link from 'next/link';
import CrystalModal from '@/components/CrystalModal';
import { useCart } from '@/contexts/CartContext';

export default function CategoriesPage() {
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const { addToCart } = useCart();

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-light mb-4 text-gray-900">Crystal Categories</h1>
          <p className="text-xl text-gray-600">Explore crystals by their healing properties and spiritual purposes</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                href={`/crystals?category=${encodeURIComponent(category.name)}`}
                className="group h-full"
              >
                <div className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden hover:shadow-md h-full flex flex-col">
                  <div className="h-32 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-16 h-16 text-gray-600" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-medium text-gray-900">{category.name}</h3>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                        {category.count}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm flex-grow">{category.description}</p>

                    <div className="flex items-center text-gray-700 font-medium group-hover:text-gray-900 transition-colors mt-auto">
                      <span className="text-sm uppercase tracking-wide">Explore {category.name}</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Crystals Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Featured Crystals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover some of our most popular crystals, each carefully selected for their powerful healing properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCrystals.map((crystal) => (
              <div
                key={crystal.id}
                className="group cursor-pointer h-full"
                onClick={() => setSelectedCrystal(crystal)}
              >
                <div className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden hover:shadow-md h-full flex flex-col">
                  <div className="h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Gem className="w-16 h-16 text-gray-600" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{crystal.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{crystal.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {crystal.properties.slice(0, 2).map((property, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {property}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-medium text-gray-900">${crystal.price}</span>
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors text-sm uppercase tracking-wide">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Choose Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-8">How to Choose Your Crystal</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Follow Your Intuition</h3>
              <p className="text-gray-600 text-sm">Trust your instincts and choose the crystal that resonates with you most strongly.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consider Your Needs</h3>
              <p className="text-gray-600 text-sm">Think about what areas of your life you'd like to improve or enhance.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Explore Properties</h3>
              <p className="text-gray-600 text-sm">Learn about each crystal's unique healing properties and metaphysical benefits.</p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/birthdate-guide"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-all duration-200 text-sm uppercase tracking-wide"
            >
              <span>Find Your Birthdate Crystal</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
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
