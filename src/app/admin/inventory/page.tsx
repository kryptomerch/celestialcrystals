'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Minus, RotateCcw, Search, Filter } from 'lucide-react';

interface Crystal {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  _count: {
    orderItems: number;
    inventoryLogs: number;
  };
}

interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export default function InventoryManagementPage() {
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update form state
  const [updateForm, setUpdateForm] = useState({
    quantity: '',
    type: 'RESTOCK',
    reason: ''
  });

  useEffect(() => {
    fetchInventory();
  }, [searchTerm, filter]);

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filter === 'lowStock') params.append('lowStock', 'true');
      if (filter === 'outOfStock') params.append('outOfStock', 'true');

      const response = await fetch(`/api/admin/inventory?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCrystals(data.crystals);
        setStats(data.stats);
      } else {
        setError('Failed to load inventory');
      }
    } catch (error) {
      setError('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInventory = async () => {
    if (!selectedCrystal || !updateForm.quantity) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crystalId: selectedCrystal.id,
          quantity: parseInt(updateForm.quantity),
          type: updateForm.type,
          reason: updateForm.reason
        })
      });

      if (response.ok) {
        await fetchInventory();
        setSelectedCrystal(null);
        setUpdateForm({ quantity: '', type: 'RESTOCK', reason: '' });
      } else {
        setError('Failed to update inventory');
      }
    } catch (error) {
      setError('Failed to update inventory');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStockStatus = (crystal: Crystal) => {
    if (crystal.stockQuantity === 0) {
      return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (crystal.stockQuantity <= crystal.lowStockThreshold) {
      return { status: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage crystal inventory levels</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="celestial-card p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-light text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="celestial-card p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-2xl font-light text-gray-900">{stats.totalStock}</p>
                </div>
              </div>
            </div>

            <div className="celestial-card p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-light text-gray-900">{stats.lowStockCount}</p>
                </div>
              </div>
            </div>

            <div className="celestial-card p-6">
              <div className="flex items-center">
                <TrendingDown className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-light text-gray-900">{stats.outOfStockCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="celestial-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search crystals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="all">All Products</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Inventory Table */}
        <div className="celestial-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {crystals.map((crystal) => {
                  const stockStatus = getStockStatus(crystal);
                  return (
                    <tr key={crystal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{crystal.name}</div>
                            <div className="text-sm text-gray-500">
                              {crystal.isActive ? 'Active' : 'Inactive'} • 
                              {crystal.isFeatured ? ' Featured' : ' Standard'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(crystal.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{crystal.stockQuantity}</div>
                          <div className="text-xs text-gray-500">
                            Threshold: {crystal.lowStockThreshold}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {crystal._count.orderItems} orders
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedCrystal(crystal)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Stock Modal */}
        {selectedCrystal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Stock: {selectedCrystal.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock: {selectedCrystal.stockQuantity}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Type
                  </label>
                  <select
                    value={updateForm.type}
                    onChange={(e) => setUpdateForm({ ...updateForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="RESTOCK">Restock (+)</option>
                    <option value="ADJUSTMENT">Adjustment (Set)</option>
                    <option value="SALE">Sale (-)</option>
                    <option value="RETURN">Return (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={updateForm.quantity}
                    onChange={(e) => setUpdateForm({ ...updateForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={updateForm.reason}
                    onChange={(e) => setUpdateForm({ ...updateForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Reason for update"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdateInventory}
                  disabled={isUpdating || !updateForm.quantity}
                  className="flex-1 celestial-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Stock'}
                </button>
                <button
                  onClick={() => {
                    setSelectedCrystal(null);
                    setUpdateForm({ quantity: '', type: 'RESTOCK', reason: '' });
                  }}
                  className="flex-1 celestial-button-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
