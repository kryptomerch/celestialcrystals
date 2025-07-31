'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { crystalDatabase, getRecommendedCrystals, Crystal } from '@/data/crystals';
import { Sparkles, Calendar, Search, ShoppingBag, Star, Heart, Mail, Shield, Zap, Sun, Moon, Gem, Flower2, Mountain, Waves, ArrowUpDown, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from '@/components/ContactModal';
import CrystalModal from '@/components/CrystalModal';
import NewsletterSignup from '@/components/NewsletterSignup';
import SlidingBanner from '@/components/SlidingBanner';
import { useCart } from '@/contexts/CartContext';
import { getColorHex } from '@/utils/colors';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [birthDate, setBirthDate] = useState('');
  const [recommendations, setRecommendations] = useState<Crystal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [databaseCrystals, setDatabaseCrystals] = useState<Crystal[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch crystals from database
  useEffect(() => {
    const fetchCrystals = async () => {
      try {
        const response = await fetch('/api/crystals');
        if (response.ok) {
          const data = await response.json();
          setDatabaseCrystals(data.crystals || []);
        } else {
          // Fallback to static data if API fails
          setDatabaseCrystals(crystalDatabase);
        }
      } catch (error) {
        console.error('Failed to fetch crystals:', error);
        // Fallback to static data
        setDatabaseCrystals(crystalDatabase);
      } finally {
        setLoading(false);
      }
    };

    fetchCrystals();
  }, []);

  const handleBirthDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate) {
      const date = new Date(birthDate);
      const recommended = getRecommendedCrystals(date);
      setRecommendations(recommended);
    }
  };

  const filteredCrystals = databaseCrystals.filter(crystal => {
    const matchesSearch = crystal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crystal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crystal.properties.some(prop => prop.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' ||
      crystal.category === selectedCategory ||
      // Handle special property-based categories
      (selectedCategory === 'Energy' && crystal.properties.some(prop => prop.toLowerCase().includes('energy'))) ||
      (selectedCategory === 'Grounding' && crystal.properties.some(prop => prop.toLowerCase().includes('grounding'))) ||
      (selectedCategory === 'Intuition' && crystal.properties.some(prop => prop.toLowerCase().includes('intuition')));

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        // Clean names by removing "Bracelet" and everything after " - "
        const nameA = a.name.replace(/\s+Bracelet(\s+-.*)?$/i, '').trim().toLowerCase();
        const nameB = b.name.replace(/\s+Bracelet(\s+-.*)?$/i, '').trim().toLowerCase();
        return nameA.localeCompare(nameB, 'en', { numeric: true, sensitivity: 'base' });
      case 'name-desc':
        const nameA2 = a.name.replace(/\s+Bracelet(\s+-.*)?$/i, '').trim().toLowerCase();
        const nameB2 = b.name.replace(/\s+Bracelet(\s+-.*)?$/i, '').trim().toLowerCase();
        return nameB2.localeCompare(nameA2, 'en', { numeric: true, sensitivity: 'base' });
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'category-asc':
        return a.category.localeCompare(b.category, 'en', { sensitivity: 'base' });
      case 'rarity-rare':
        const rarityOrder = { 'Very Rare': 4, 'Rare': 3, 'Uncommon': 2, 'Common': 1 };
        return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
      default:
        return 0;
    }
  });

  const featuredCrystals = databaseCrystals.slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sliding Banner */}
      <SlidingBanner />

      {/* Hero Section */}
      <section className="px-4 text-center -mt-8 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center -mb-24">
            <img
              src="/images/logo-name.png"
              alt="Celestial"
              className={`h-64 sm:h-80 lg:h-96 object-contain ${isDark ? 'brightness-0 invert' : ''}`}
            />
          </div>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto font-light leading-relaxed text-foreground/70">
            North America's #1 destination for authentic natural crystal bracelets. Discover the power of healing crystals with fast shipping across USA and Canada.
          </p>

          {/* Birth Date Form */}
          <div className="celestial-card p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <h3 className={`text-base sm:text-lg font-medium ${isDark
                ? 'text-white'
                : 'text-gray-900'
                }`}>Find Your Crystal Match</h3>
            </div>
            <form onSubmit={handleBirthDateSubmit} className="space-y-3 sm:space-y-4">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border focus:outline-none focus:ring-1 text-sm sm:text-base ${isDark
                  ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                  }`}
                required
              />
              <button
                type="submit"
                className={`w-full py-2.5 sm:py-3 px-4 font-medium transition-all duration-200 text-sm sm:text-base uppercase tracking-wide ${isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
              >
                Get My Recommendations
              </button>
            </form>
          </div>

          {/* Contact Button */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className={`celestial-card px-6 py-3 font-medium transition-all duration-200 flex items-center space-x-2 mx-auto ${isDark
              ? 'text-white hover:bg-gray-800'
              : 'text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Mail className="w-5 h-5" />
            <span>Contact Us</span>
          </button>
        </div>
      </section>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className={`py-16 px-4 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-light text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
      <section className={`py-16 px-4 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-light text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Explore Our Crystal Collection
          </h2>

          {/* Search Bar and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search crystals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`pl-10 pr-8 py-3 border rounded focus:outline-none focus:ring-1 appearance-none cursor-pointer min-w-[200px] ${isDark
                  ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                  }`}
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="category-asc">Category: A to Z</option>
                <option value="rarity-rare">Rarity: Rare First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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
                    : isDark
                      ? 'celestial-card text-white hover:bg-gray-800'
                      : 'celestial-card text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-gray-600">{filteredCrystals.length} crystals found</p>
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
      <section className={`py-16 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-light text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
      <section className={`py-16 px-4 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-light mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why North America Chooses CELESTIAL?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="celestial-card p-4 sm:p-6">
              <Star className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              <h3 className={`text-lg sm:text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Authentic Crystals</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-600'}`}>
                Each crystal is carefully sourced and authenticated for genuine healing properties.
              </p>
            </div>
            <div className="celestial-card p-4 sm:p-6">
              <Heart className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              <h3 className={`text-lg sm:text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personalized Selection</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-600'}`}>
                Find crystals perfectly aligned with your birth date and personal needs.
              </p>
            </div>
            <div className="celestial-card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <Sparkles className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              <h3 className={`text-lg sm:text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Expert Knowledge</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-600'}`}>
                Detailed information about each crystal's properties and healing benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* North America Shipping */}
      <section className={`py-16 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-3xl font-light mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Fast Shipping Across North America
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="celestial-card p-6">
              <div className="text-4xl mb-4">🇺🇸</div>
              <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>United States</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'} mb-4`}>
                Free shipping on orders over $50 to all 50 states including Alaska and Hawaii
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Truck className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>2-7 business days</span>
              </div>
            </div>
            <div className="celestial-card p-6">
              <div className="text-4xl mb-4">🇨🇦</div>
              <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Canada</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'} mb-4`}>
                Free shipping on orders over $65 CAD to all provinces and territories
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Truck className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>3-10 business days</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/shipping"
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${isDark
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
            >
              <span>View Shipping Details</span>
              <Truck className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className={`py-16 px-4 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
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
  const { isDark } = useTheme();

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
      className={`celestial-card overflow-hidden cursor-pointer flex flex-col h-full ${getCrystalGlowClass(crystal.colors)} ${featured ? 'ring-2 ring-gray-400' : ''
        }`}
      onClick={handleCardClick}
    >
      <div className={`relative aspect-[3/2] ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
          <Sparkles className={`w-12 h-12 sm:w-16 sm:h-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        {featured && (
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium">
            Featured
          </div>
        )}
        <div className={`absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium ${isDark
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-900'
          }`}>
          ${crystal.price}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 flex flex-col h-full">
        <h3 className={`text-base sm:text-lg font-medium mb-1.5 sm:mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{crystal.name}</h3>
        <p className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-grow ${isDark ? 'text-white' : 'text-gray-600'}`}>{crystal.description}</p>

        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
          {crystal.properties.slice(0, 2).map((property, index) => (
            <span
              key={index}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border ${isDark
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
            >
              {property}
            </span>
          ))}
          {crystal.properties.length > 2 && (
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>+{crystal.properties.length - 2} more</span>
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

