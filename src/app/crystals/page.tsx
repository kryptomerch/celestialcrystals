'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Crystal } from '@/data/crystals';
import { Search, Filter, Sparkles, ShoppingBag, ArrowUpDown, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CrystalModal from '@/components/CrystalModal';
import { getColorHex } from '@/utils/colors';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

function CrystalsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const rarityParam = searchParams.get('rarity');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (rarityParam) {
      setSelectedRarity(rarityParam);
    }
  }, [searchParams]);

  // Fetch crystals from database
  useEffect(() => {
    fetchCrystals();
  }, []);

  const fetchCrystals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crystals-db');
      const data = await response.json();

      if (data.crystals) {
        setCrystals(data.crystals);
        setError(null);
      } else {
        setError('Failed to load crystals');
      }
    } catch (err) {
      setError('Failed to load crystals');
      console.error('Error fetching crystals:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Protection', 'Love', 'Abundance', 'Communication', 'Spiritual Protection', 'Chakra Healing', 'Energy', 'Grounding', 'Intuition', 'Healing', 'Emotional Healing'];
  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare'];

  const filteredCrystals = crystals
    .filter(crystal => {
      const matchesSearch = crystal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crystal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crystal.properties.some(prop => prop.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' ||
        crystal.category === selectedCategory ||
        // Handle special property-based categories
        (selectedCategory === 'Energy' && crystal.properties.some(prop => prop.toLowerCase().includes('energy'))) ||
        (selectedCategory === 'Grounding' && crystal.properties.some(prop => prop.toLowerCase().includes('grounding'))) ||
        (selectedCategory === 'Intuition' && crystal.properties.some(prop => prop.toLowerCase().includes('intuition')));
      const matchesRarity = selectedRarity === 'All' || crystal.rarity === selectedRarity;
      const matchesPrice = crystal.price >= priceRange[0] && crystal.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesRarity && matchesPrice;
    })
    .sort((a, b) => {
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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Loading crystals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="text-center">
          <p className={`text-red-500 mb-4`}>{error}</p>
          <button
            onClick={fetchCrystals}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Explore Our Crystal Collection</h1>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-600'}`}>Discover our complete range of healing crystals and gemstone bracelets</p>
        </div>
      </div>

      {/* Free Shipping Banner */}
      <div className={`${isDark
        ? 'bg-purple-900 border-y border-purple-700'
        : 'bg-blue-50 border-y border-blue-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className={`flex items-center justify-center space-x-2 ${isDark
            ? 'text-purple-200'
            : 'text-blue-800'
            }`}>
            <Truck className="w-5 h-5" />
            <span className="font-medium">FREE SHIPPING on orders over $75 • Fast Canada-wide delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                  ? isDark
                    ? 'bg-purple-600 text-white'
                    : 'bg-black text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
            <input
              type="text"
              placeholder="Quick search crystals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-1 ${isDark
                ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400'
                }`}
            />
          </div>
          <div className="relative">
            <ArrowUpDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="celestial-card p-6">
              <h3 className={`text-lg font-medium mb-4 flex items-center ${isDark
                ? 'text-white'
                : 'text-gray-900'
                }`}>
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark
                  ? 'text-white'
                  : 'text-gray-900'
                  }`}>Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search crystals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded focus:ring-1 ${isDark
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400'
                      }`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${isDark
                    ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-500 focus:border-transparent'
                    }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Rarity Filter */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}>Rarity</label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${isDark
                    ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-500 focus:border-transparent'
                    }`}
                >
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}>
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center ${isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}>
                  <ArrowUpDown className="w-4 h-4 mr-1" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${isDark
                    ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-500 focus:border-transparent'
                    }`}
                >
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="category-asc">Category: A to Z</option>
                  <option value="rarity-rare">Rarity: Rare First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Crystal Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className={`${isDark
                ? 'text-gray-300'
                : 'text-gray-600'
                }`}>{filteredCrystals.length} crystals found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrystals.map((crystal) => (
                <div
                  key={crystal.id}
                  className={`celestial-card overflow-hidden cursor-pointer flex flex-col h-full ${getCrystalGlowClass(crystal.colors)}`}
                  onClick={() => setSelectedCrystal(crystal)}
                >
                  {/* Crystal Image */}
                  <div className={`relative aspect-[3/2] ${isDark
                    ? 'bg-gray-800'
                    : 'bg-gray-100'
                    }`}>
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
                      <Sparkles className={`w-16 h-16 ${isDark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                        }`} />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-medium ${isDark
                        ? 'text-white'
                        : 'text-gray-900'
                        }`}>{crystal.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${crystal.rarity === 'Common'
                        ? isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                        : crystal.rarity === 'Uncommon'
                          ? isDark ? 'bg-gray-600 text-gray-100' : 'bg-gray-200 text-gray-800'
                          : crystal.rarity === 'Rare'
                            ? 'bg-purple-600 text-white'
                            : isDark ? 'bg-gray-500 text-gray-100' : 'bg-gray-300 text-gray-800'
                        }`}>
                        {crystal.rarity}
                      </span>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 flex-grow ${isDark
                      ? 'text-white'
                      : 'text-gray-600'
                      }`}>{crystal.description}</p>

                    {/* Properties */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {crystal.properties.slice(0, 3).map((property, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs border ${isDark
                            ? 'bg-gray-800 text-white border-gray-600'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                        >
                          {property}
                        </span>
                      ))}
                    </div>

                    {/* Colors and Price */}
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="flex items-center space-x-1">
                        {crystal.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-full border shadow-sm ${isDark
                              ? 'border-gray-600'
                              : 'border-gray-300'
                              }`}
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                        ))}
                      </div>
                      <span className={`text-lg font-medium ${isDark
                        ? 'text-white'
                        : 'text-gray-900'
                        }`}>${crystal.price}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(crystal);
                      }}
                      className={`w-full py-2 px-4 text-xs font-medium uppercase tracking-wide transition-colors flex items-center justify-center space-x-2 ${isDark
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCrystals.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className={`w-16 h-16 mx-auto mb-4 ${isDark
                  ? 'text-gray-500'
                  : 'text-gray-300'
                  }`} />
                <h3 className={`text-lg font-medium mb-2 ${isDark
                  ? 'text-white'
                  : 'text-gray-900'
                  }`}>No crystals found</h3>
                <p className={`${isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
                  }`}>Try adjusting your filters to see more results.</p>
              </div>
            )}
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

export default function CrystalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
        <div className="relative z-10 text-center">
          <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-200">Loading crystals...</p>
        </div>
      </div>
    }>
      <CrystalsPageContent />
    </Suspense>
  );
}
