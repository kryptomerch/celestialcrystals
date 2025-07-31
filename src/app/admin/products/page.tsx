'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  Star,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Crystal {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  element: string;
  hardness: string;
  origin: string;
  rarity: string;
  properties: string; // JSON string in database
  colors: string; // JSON string in database
  chakra: string;
  zodiacSigns: string; // JSON string in database
  birthMonths: string; // JSON string in database
  keywords: string;
  stockQuantity: number;
  lowStockThreshold: number;
  image: string;
  images: string; // JSON string in database
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely parse JSON strings
const parseJsonField = (field: string | null | undefined): string[] => {
  if (!field) return [];
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function AdminProductsPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  const [products, setProducts] = useState<Crystal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Crystal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Healing Crystals',
    element: 'Earth',
    hardness: '7',
    origin: 'Various',
    rarity: 'Common',
    properties: [] as string[],
    colors: [] as string[],
    chakra: '',
    zodiacSigns: [] as string[],
    birthMonths: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    keywords: '',
    stockQuantity: '',
    lowStockThreshold: '5',
    image: '',
    images: [] as string[],
    isActive: true,
    isFeatured: false
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Healing Crystals',
    'Chakra Stones',
    'Protection Crystals',
    'Love & Relationships',
    'Abundance & Prosperity',
    'Meditation Stones',
    'Raw Crystals',
    'Tumbled Stones',
    'Crystal Jewelry',
    'Crystal Sets'
  ];

  const elements = ['Earth', 'Fire', 'Water', 'Air', 'Spirit'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];
  const chakras = [
    'Root Chakra',
    'Sacral Chakra',
    'Solar Plexus Chakra',
    'Heart Chakra',
    'Throat Chakra',
    'Third Eye Chakra',
    'Crown Chakra'
  ];
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const commonProperties = [
    'Healing', 'Protection', 'Love', 'Abundance', 'Clarity', 'Peace',
    'Strength', 'Wisdom', 'Intuition', 'Grounding', 'Cleansing', 'Balance'
  ];
  const commonColors = [
    'Clear', 'White', 'Black', 'Red', 'Orange', 'Yellow', 'Green',
    'Blue', 'Indigo', 'Violet', 'Pink', 'Brown', 'Gray', 'Multicolor'
  ];

  useEffect(() => {
    checkAdminAccess();
  }, [session, status]);

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
    }
  }, [isAuthorized]);

  const checkAdminAccess = async () => {
    if (status === 'loading') return;

    if (!session?.user?.email) {
      router.push('/auth/signin?callbackUrl=/admin/products');
      return;
    }

    // Check if user is admin
    const adminEmails = ['dhruvaparik@gmail.com', 'kryptomerch.io@gmail.com'];
    const isAdmin = adminEmails.includes(session.user.email.toLowerCase()) ||
      session.user.role === 'ADMIN';

    if (!isAdmin) {
      router.push('/?error=unauthorized');
      return;
    }

    setIsAuthorized(true);
  };

  const fetchProducts = async () => {
    try {
      console.log('🔍 Fetching products...');
      setError(null);
      const response = await fetch('/api/admin/products');
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Products data:', data);
        setProducts(data.products || []);
        setMessage(`Loaded ${data.products?.length || 0} products`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        const errorMsg = `Error: ${errorData.error || 'Failed to load products'}`;
        setMessage(errorMsg);
        setError(errorMsg);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      const errorMsg = 'Network error: Please check your connection';
      setMessage(errorMsg);
      setError(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const url = '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const requestBody: any = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        keywords: JSON.stringify(formData.keywords.split(',').map(k => k.trim())),
      };

      // Add ID for PUT requests
      if (editingProduct) {
        requestBody.id = editingProduct.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setMessage(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        resetForm();
        fetchProducts();
        setTimeout(() => setShowModal(false), 1500);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || 'Failed to save product'}`);
      }
    } catch (error) {
      setMessage('Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Healing Crystals',
      element: 'Earth',
      hardness: '7',
      origin: 'Various',
      rarity: 'Common',
      properties: [],
      colors: [],
      chakra: '',
      zodiacSigns: [],
      birthMonths: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      keywords: '',
      stockQuantity: '',
      lowStockThreshold: '5',
      image: '',
      images: [],
      isActive: true,
      isFeatured: false
    });
    setEditingProduct(null);
    setMessage('');
  };

  const openEditModal = (product: Crystal) => {
    try {
      setEditingProduct(product);

      // Safely parse keywords
      let keywordsArray: string[] = [];
      try {
        keywordsArray = JSON.parse(product.keywords || '[]');
      } catch (e) {
        console.warn('Failed to parse keywords:', product.keywords);
        keywordsArray = [];
      }

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        element: product.element,
        hardness: product.hardness,
        origin: product.origin,
        rarity: product.rarity,
        properties: parseJsonField(product.properties),
        colors: parseJsonField(product.colors),
        chakra: product.chakra,
        zodiacSigns: parseJsonField(product.zodiacSigns),
        birthMonths: product.birthMonths,
        keywords: Array.isArray(keywordsArray) ? keywordsArray.join(', ') : '',
        stockQuantity: product.stockQuantity.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        image: product.image,
        images: parseJsonField(product.images),
        isActive: product.isActive,
        isFeatured: product.isFeatured
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error opening edit modal:', error);
      setMessage('Error opening product for editing');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        setMessage('Product deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || 'Failed to delete product'}`);
      }
    } catch (error) {
      setMessage('Error deleting product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleProperty = (property: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.includes(property)
        ? prev.properties.filter(p => p !== property)
        : [...prev.properties, property]
    }));
  };

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const toggleZodiacSign = (sign: string) => {
    setFormData(prev => ({
      ...prev,
      zodiacSigns: prev.zodiacSigns.includes(sign)
        ? prev.zodiacSigns.filter(s => s !== sign)
        : [...prev.zodiacSigns, sign]
    }));
  };

  if (status === 'loading' || !isAuthorized) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {status === 'loading' ? 'Loading...' : 'Checking permissions...'}
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading products...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`p-6 rounded-lg border ${isDark
            ? 'bg-red-900/50 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-700'
            }`}>
            <h2 className="text-xl font-semibold mb-2">Error Loading Products</h2>
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProducts();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Product Management
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Create and manage your crystal products
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${isDark
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25'
              }`}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.includes('Error')
            ? isDark
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
            : isDark
              ? 'bg-green-900/50 border-green-700 text-green-300'
              : 'bg-green-50 border-green-200 text-green-700'
            }`}>
            <div className="flex items-center space-x-2">
              {message.includes('Error') ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`p-6 rounded-2xl shadow-sm border mb-8 ${isDark
          ? 'bg-gray-800/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
          }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                  ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
            </div>

            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                  ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Products: {filteredProducts.length}
              </span>
              <Package className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading products...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Package className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {products.length === 0 ? 'No products found' : 'No products match your filters'}
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {products.length === 0
                ? 'Get started by creating your first product'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {products.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="celestial-button bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`rounded-2xl shadow-sm border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${isDark
                  ? 'bg-gray-800/80 border-gray-700/50 shadow-purple-900/20'
                  : 'bg-white/80 border-gray-200/50 shadow-blue-900/10'
                  }`}
              >
                {/* Product Image */}
                <div className="relative h-48 rounded-t-2xl overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                      <ImageIcon className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    {!product.isActive && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    )}
                    {product.stockQuantity <= product.lowStockThreshold && (
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-semibold text-lg leading-tight ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <DollarSign className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        {product.price}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                      ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                      : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}>
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Package className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.stockQuantity}
                      </span>
                    </div>
                  </div>

                  {/* Properties Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {parseJsonField(product.properties).slice(0, 3).map((property) => (
                      <span
                        key={property}
                        className={`px-2 py-1 text-xs rounded-full ${isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {property}
                      </span>
                    ))}
                    {parseJsonField(product.properties).length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                        +{parseJsonField(product.properties).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${isDark
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${isDark
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/crystals/${product.slug}`, '_blank')}
                      className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${isDark
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Old Empty State - Remove this since we have a new one above */}
        {false && filteredProducts.length === 0 && (
          <div className={`text-center py-12 ${isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-gray-200/50'
            } rounded-2xl border`}>
            <Package className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No products found
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first product'
              }
            </p>
          </div>
        )}

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
              } border`}>
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Basic Information
                    </h3>

                    {/* Product Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        placeholder="Enter product name"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        placeholder="Describe the crystal's properties and benefits"
                      />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                            ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                            ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Category and Element */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                          Category *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                            ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-purple-500 focus:border-purple-500'
                            : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                          Element
                        </label>
                        <select
                          value={formData.element}
                          onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                            ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-purple-500 focus:border-purple-500'
                            : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                        >
                          {elements.map(element => (
                            <option key={element} value={element}>{element}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Crystal Properties */}
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Crystal Properties
                    </h3>

                    {/* Properties */}
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Properties
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {commonProperties.map(property => (
                          <label key={property} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.properties.includes(property)}
                              onChange={() => toggleProperty(property)}
                              className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600' : ''
                                }`}
                            />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {property}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Colors
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {commonColors.map(color => (
                          <label key={color} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.colors.includes(color)}
                              onChange={() => toggleColor(color)}
                              className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600' : ''
                                }`}
                            />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {color}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Chakra */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Associated Chakra
                      </label>
                      <select
                        value={formData.chakra}
                        onChange={(e) => setFormData({ ...formData, chakra: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                      >
                        <option value="">Select Chakra</option>
                        {chakras.map(chakra => (
                          <option key={chakra} value={chakra}>{chakra}</option>
                        ))}
                      </select>
                    </div>

                    {/* Zodiac Signs */}
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Zodiac Signs
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {zodiacSigns.map(sign => (
                          <label key={sign} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.zodiacSigns.includes(sign)}
                              onChange={() => toggleZodiacSign(sign)}
                              className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600' : ''
                                }`}
                            />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {sign}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Hardness (Mohs Scale)
                      </label>
                      <input
                        type="text"
                        value={formData.hardness}
                        onChange={(e) => setFormData({ ...formData, hardness: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        placeholder="e.g., 7"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Origin
                      </label>
                      <input
                        type="text"
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        placeholder="e.g., Brazil, Madagascar"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Rarity
                      </label>
                      <select
                        value={formData.rarity}
                        onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                      >
                        {rarities.map(rarity => (
                          <option key={rarity} value={rarity}>{rarity}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Images and Keywords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        placeholder="healing, meditation, chakra"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center space-x-8 mt-6">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600' : ''
                          }`}
                      />
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Active Product
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600' : ''
                          }`}
                      />
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Featured Product
                      </span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className={`flex justify-end space-x-4 mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${isDark
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                      }`}
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <ErrorBoundary>
      <AdminProductsPageContent />
    </ErrorBoundary>
  );
}
