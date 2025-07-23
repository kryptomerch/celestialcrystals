'use client';

import { Truck, Package, Globe, Clock, Shield, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ShippingPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Truck className={`w-12 h-12 mr-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
            <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Information</h1>
          </div>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Fast, secure, and carefully packaged delivery of your precious crystals.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className={`text-2xl font-medium mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="celestial-card p-6">
              <div className="flex items-center mb-4">
                <Package className={`w-8 h-8 mr-3 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Standard Shipping</h3>
              </div>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <li>• 3-7 business days delivery</li>
                <li>• FREE on orders over $75</li>
                <li>• $5.99 for orders under $75</li>
                <li>• Tracking included</li>
                <li>• USPS or UPS Ground</li>
              </ul>
            </div>

            <div className="celestial-card p-6">
              <div className="flex items-center mb-4">
                <Clock className={`w-8 h-8 mr-3 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Express Shipping</h3>
              </div>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <li>• 1-3 business days delivery</li>
                <li>• $12.99 flat rate</li>
                <li>• Priority handling</li>
                <li>• Tracking included</li>
                <li>• UPS 2-Day or Next Day</li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-12">
          <div className="celestial-card p-8">
            <div className="flex items-center mb-6">
              <Globe className={`w-8 h-8 mr-3 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>International Shipping</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Countries</h3>
                <p className={`mb-4 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  We ship to most countries worldwide including:
                </p>
                <ul className={`space-y-1 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  <li>• Canada & Mexico: 7-10 business days</li>
                  <li>• Europe: 10-14 business days</li>
                  <li>• Australia & New Zealand: 12-16 business days</li>
                  <li>• Asia: 10-16 business days</li>
                  <li>• Other countries: 14-21 business days</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Important Notes</h3>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  <li>• Shipping rates calculated at checkout</li>
                  <li>• Customs fees are customer's responsibility</li>
                  <li>• Some restrictions may apply</li>
                  <li>• Tracking provided for all orders</li>
                  <li>• Insurance included on all shipments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Packaging */}
        <div className="mb-12">
          <div className="celestial-card p-8">
            <div className="flex items-center mb-6">
              <Heart className={`w-8 h-8 mr-3 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Careful Packaging</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Shield className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Protected</h3>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Each crystal is individually wrapped in soft padding to prevent damage during transit.
                </p>
              </div>

              <div className="text-center">
                <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Package className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Secure</h3>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Sturdy boxes with additional cushioning ensure your crystals arrive safely.
                </p>
              </div>

              <div className="text-center">
                <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Heart className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Eco-Friendly</h3>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  We use recyclable materials and minimal packaging to protect the environment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="mb-12">
          <div className="celestial-card p-8">
            <h2 className={`text-2xl font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Processing & Handling</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>1</span>
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Confirmation</h3>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>You'll receive an email confirmation immediately after placing your order.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>2</span>
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Processing (1-2 business days)</h3>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>We carefully select and package your crystals with love and attention.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>3</span>
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Notification</h3>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>You'll receive tracking information once your order ships.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>4</span>
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Delivery</h3>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Your crystals arrive safely at your doorstep, ready to enhance your journey.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className={`celestial-card p-6 border-l-4 ${isDark ? 'border-gray-600' : 'border-gray-400'}`}>
          <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Special Circumstances</h3>
          <ul className={`space-y-2 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
            <li>• <strong>Holidays:</strong> Processing may take 1-2 additional days during peak seasons</li>
            <li>• <strong>Weather:</strong> Severe weather conditions may cause shipping delays</li>
            <li>• <strong>Custom Orders:</strong> Allow 3-5 additional business days for processing</li>
            <li>• <strong>Large Orders:</strong> Orders over $500 may require additional processing time</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <h2 className={`text-2xl font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Questions About Shipping?</h2>
          <p className={`mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Our customer service team is here to help with any shipping questions or concerns.
          </p>
          <a
            href="/contact"
            className="celestial-button inline-flex items-center"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
