'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Mail, Sparkles, ArrowRight, Truck } from 'lucide-react';

interface OrderData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  timestamp: string;
}

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderNumber] = useState(() =>
    'CC' + Date.now().toString().slice(-8).toUpperCase()
  );

  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Get order data from localStorage (in a real app, this would come from your database)
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
      // Clear the order data after displaying
      localStorage.removeItem('lastOrder');
    }
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your crystal journey continues!
          </p>
          <p className="text-lg text-gray-500">
            Order #{orderNumber}
          </p>
          {orderData && (
            <p className="text-sm text-gray-500 mt-2">
              Total: {formatPrice(orderData.total)} • Payment: {orderData.paymentMethod === 'stripe' ? 'Credit Card' : 'PayPal'}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="celestial-card p-6">
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Estimated Delivery:</span>
                <p className="text-gray-600">{estimatedDelivery}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Shipping Method:</span>
                <p className="text-gray-600">Standard Shipping (3-7 business days)</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tracking:</span>
                <p className="text-gray-600">You'll receive tracking information via email once your order ships</p>
              </div>
            </div>
          </div>

          <div className="celestial-card p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Order confirmation email sent</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Order processing (1-2 business days)</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Shipping notification with tracking</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Delivery to your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crystal Care Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Caring for Your New Crystals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cleanse</h3>
              <p className="text-gray-600 text-sm">
                Cleanse your crystals under moonlight or with sage smoke to remove any negative energy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Charge</h3>
              <p className="text-gray-600 text-sm">
                Charge your crystals by placing them in sunlight or on a selenite charging plate.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Set Intentions</h3>
              <p className="text-gray-600 text-sm">
                Hold your crystals and set clear intentions for what you want to manifest.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/crystals"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <Link
            href="/account/orders"
            className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300"
          >
            View Order Details
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to help with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View FAQ
            </Link>
            <Link
              href="/shipping"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
