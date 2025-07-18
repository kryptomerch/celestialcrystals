'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, X, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    crystal: {
      id: string;
      name: string;
      image?: string;
      properties: string[];
    };
  }>;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/orders');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router, selectedStatus]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await fetch(`/api/user/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'PROCESSING':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-8 h-8 text-gray-600" />
            <h1 className="text-3xl font-light text-gray-900">Order History</h1>
          </div>
          <p className="text-gray-600">
            {orders.length > 0 
              ? `${orders.length} order${orders.length === 1 ? '' : 's'} found`
              : 'No orders found'
            }
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === '' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Orders
            </button>
            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-4">No orders found</h2>
            <p className="text-gray-600 mb-8">
              {selectedStatus 
                ? `No orders with status "${selectedStatus.toLowerCase()}" found.`
                : "You haven't placed any orders yet."
              }
            </p>
            <button
              onClick={() => router.push('/crystals')}
              className="celestial-button"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="celestial-card p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.crystal.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} • {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        +{order.items.length - 3} more item{order.items.length - 3 === 1 ? '' : 's'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Payment:</span>
                      <span className="text-gray-900 capitalize">
                        {order.paymentMethod === 'stripe' ? 'Credit Card' : order.paymentMethod}
                      </span>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Tracking:</span>
                        <span className="text-gray-900 font-mono">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                    
                    {order.deliveredAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Delivered:</span>
                        <span className="text-gray-900">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="celestial-button-outline flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    {order.status === 'DELIVERED' && (
                      <button
                        onClick={() => router.push(`/orders/${order.id}/review`)}
                        className="celestial-button-outline"
                      >
                        Write Review
                      </button>
                    )}
                    
                    {order.status === 'DELIVERED' && (
                      <button
                        onClick={() => router.push('/crystals')}
                        className="celestial-button-outline"
                      >
                        Reorder Items
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
