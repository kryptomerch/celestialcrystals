'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { crystalDatabase, Crystal } from '@/data/crystals';
import { Search, Filter, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CrystalModal from '@/components/CrystalModal';

function CrystalsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const { addToCart } = useCart();

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

  const categories = ['All', 'Protection', 'Love', 'Abundance', 'Communication', 'Spiritual Protection', 'Chakra Healing'];
  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare'];

  const filteredCrystals = crystalDatabase
    .filter(crystal => {
      const matchesSearch = crystal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crystal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crystal.properties.some(prop => prop.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || crystal.category === selectedCategory;
      const matchesRarity = selectedRarity === 'All' || crystal.rarity === selectedRarity;
      const matchesPrice = crystal.price >= priceRange[0] && crystal.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesRarity && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Very Rare': 4 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-light mb-4 text-gray-900">Crystal Collection</h1>
          <p className="text-xl text-gray-600">Discover our complete range of healing crystals and gemstone bracelets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="celestial-card p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search crystals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Rarity Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rarity">Rarity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Crystal Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">{filteredCrystals.length} crystals found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrystals.map((crystal) => (
                <div
                  key={crystal.id}
                  className="celestial-card overflow-hidden cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedCrystal(crystal)}
                >
                  {/* Crystal Image Placeholder */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gray-400" />
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{crystal.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${crystal.rarity === 'Common' ? 'bg-gray-100 text-gray-800' :
                        crystal.rarity === 'Uncommon' ? 'bg-gray-200 text-gray-800' :
                          crystal.rarity === 'Rare' ? 'bg-black text-white' :
                            'bg-gray-300 text-gray-800'
                        }`}>
                        {crystal.rarity}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{crystal.description}</p>

                    {/* Properties */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {crystal.properties.slice(0, 3).map((property, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200"
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
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium text-gray-900">${crystal.price}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(crystal);
                      }}
                      className="w-full bg-black text-white py-2 px-4 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
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
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No crystals found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
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
