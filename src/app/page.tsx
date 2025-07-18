'use client';

import { useState } from 'react';
import { crystalDatabase, getRecommendedCrystals, Crystal } from '@/data/crystals';
import { Sparkles, Calendar, Search, ShoppingBag, Star, Heart, Mail, Shield, Zap, Sun, Moon, Gem, Flower2, Mountain, Waves } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from '@/components/ContactModal';
import CrystalModal from '@/components/CrystalModal';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useCart } from '@/contexts/CartContext';

export default function HomePage() {
  const [birthDate, setBirthDate] = useState('');
  const [recommendations, setRecommendations] = useState<Crystal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);

  const categories = [
    { name: 'All', icon: Gem },
    { name: 'Protection', icon: Shield },
    { name: 'Love', icon: Heart },
    { name: 'Abundance', icon: Star },
    { name: 'Communication', icon: Sparkles },
    { name: 'Spiritual Protection', icon: Sun },
    { name: 'Chakra Healing', icon: Flower2 },
    { name: 'Energy', icon: Zap },
    { name: 'Grounding', icon: Mountain },
    { name: 'Intuition', icon: Moon }
  ];

  const handleBirthDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate) {
      const date = new Date(birthDate);
      const recommended = getRecommendedCrystals(date);
      setRecommendations(recommended);
    }
  };

  const filteredCrystals = crystalDatabase.filter(crystal => {
    const matchesSearch = crystal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crystal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crystal.properties.some(prop => prop.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || crystal.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredCrystals = crystalDatabase.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 text-center bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black tracking-tight">
              CELESTIAL
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Discover the power of natural crystal bracelets. Find your perfect crystal companion based on your birthdate or explore our curated collection.
          </p>

          {/* Birth Date Form */}
          <div className="celestial-card p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Find Your Crystal Match</h3>
            </div>
            <form onSubmit={handleBirthDateSubmit} className="space-y-3 sm:space-y-4">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="w-full celestial-button text-sm sm:text-base py-2.5 sm:py-3"
              >
                Get My Recommendations
              </button>
            </form>
          </div>

          {/* Contact Button */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="celestial-card text-gray-900 px-6 py-3 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Mail className="w-5 h-5" />
            <span>Contact Us</span>
          </button>
        </div>
      </section>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-12 text-gray-900">
              Your Personalized Crystal Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {recommendations.map((crystal) => (
                <CrystalCard
                  key={crystal.id}
                  crystal={crystal}
                  onCrystalClick={setSelectedCrystal}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-900">
            Explore Our Crystal Collection
          </h2>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search crystals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-3 rounded font-medium transition-all duration-200 text-sm flex items-center space-x-2 ${selectedCategory === category.name
                    ? 'bg-black text-white'
                    : 'celestial-card text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Crystal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCrystals.map((crystal) => (
              <CrystalCard
                key={crystal.id}
                crystal={crystal}
                onCrystalClick={setSelectedCrystal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-900">
            Featured Crystals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredCrystals.map((crystal) => (
              <CrystalCard
                key={crystal.id}
                crystal={crystal}
                featured
                onCrystalClick={setSelectedCrystal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-8 text-gray-900">
            Why Choose Celestial Crystals?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="celestial-card p-4 sm:p-6">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-900">Authentic Crystals</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Each crystal is carefully sourced and authenticated for genuine healing properties.
              </p>
            </div>
            <div className="celestial-card p-4 sm:p-6">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-900">Personalized Selection</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Find crystals perfectly aligned with your birth date and personal needs.
              </p>
            </div>
            <div className="celestial-card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-900">Expert Knowledge</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Detailed information about each crystal's properties and healing benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

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

      <style jsx>{`
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="0.5" fill="white" opacity="0.8"/><circle cx="80" cy="30" r="0.3" fill="white" opacity="0.6"/><circle cx="40" cy="60" r="0.4" fill="white" opacity="0.7"/><circle cx="90" cy="80" r="0.2" fill="white" opacity="0.5"/><circle cx="10" cy="90" r="0.6" fill="white" opacity="0.9"/><circle cx="70" cy="10" r="0.3" fill="white" opacity="0.6"/><circle cx="30" cy="40" r="0.4" fill="white" opacity="0.7"/><circle cx="60" cy="70" r="0.2" fill="white" opacity="0.5"/></svg>') repeat;
          animation: sparkle 3s linear infinite;
        }
        
        .twinkling {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="0.3" fill="white" opacity="0.4"/><circle cx="75" cy="75" r="0.2" fill="white" opacity="0.6"/><circle cx="50" cy="10" r="0.4" fill="white" opacity="0.3"/><circle cx="15" cy="60" r="0.2" fill="white" opacity="0.5"/><circle cx="85" cy="40" r="0.3" fill="white" opacity="0.4"/></svg>') repeat;
          animation: twinkle 4s ease-in-out infinite alternate;
        }
        
        @keyframes sparkle {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-100px); }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function CrystalCard({
  crystal,
  featured = false,
  onCrystalClick
}: {
  crystal: Crystal;
  featured?: boolean;
  onCrystalClick?: (crystal: Crystal) => void;
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking add to cart
    addToCart(crystal);
  };

  const handleCardClick = () => {
    if (onCrystalClick) {
      onCrystalClick(crystal);
    }
  };

  return (
    <div
      className={`celestial-card overflow-hidden cursor-pointer flex flex-col h-full ${featured ? 'ring-2 ring-gray-400' : ''
        }`}
      onClick={handleCardClick}
    >
      <div className="relative h-40 sm:h-48 bg-gray-100">
        {/* Placeholder for crystal image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
        </div>
        {featured && (
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-gray-900">
          ${crystal.price}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 flex flex-col h-full">
        <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2 text-gray-900 line-clamp-2">{crystal.name}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-grow">{crystal.description}</p>

        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
          {crystal.properties.slice(0, 2).map((property, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-gray-200"
            >
              {property}
            </span>
          ))}
          {crystal.properties.length > 2 && (
            <span className="text-gray-500 text-xs">+{crystal.properties.length - 2} more</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-auto">
          <div className="flex items-center space-x-1">
            {crystal.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: getColorHex(color) }}
              />
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1 w-full sm:w-auto"
          >
            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getColorHex(colorName: string): string {
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
    'Indigo': '#4B0082',
    'Violet': '#8A2BE2',
    'White': '#FFFFFF',
    'Cream': '#F5F5DC',
    'Pink': '#FFC0CB',
    'Rose': '#FF69B4',
    'Purple': '#800080',
    'Clear': '#F0F8FF',
    'Deep Blue': '#00008B',
    'Blue with Gold': '#1E90FF',
    'Metallic Gray': '#C0C0C0',
    'Deep Purple': '#663399',
    'Lavender': '#E6E6FA',
    'Dark Green': '#006400',
    'Peach': '#FFCBA4',
    'Gray': '#808080',
    'Teal': '#008080'
  };

  return colorMap[colorName] || '#9CA3AF';
}