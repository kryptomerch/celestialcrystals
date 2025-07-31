'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Lock, Truck, Shield, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import StripePayment from '@/components/StripePayment';
import PayPalPayment from '@/components/PayPalPayment';
import DiscountCodeInput from '@/components/DiscountCodeInput';
import ShippingCalculator from '@/components/ShippingCalculator';

export default function CheckoutPage() {
  const {
    items,
    getTotalPrice,
    getTotalItems,
    clearCart,
    discountCode,
    getDiscountAmount,
    getFinalTotal,
    applyDiscountCode,
    shippingRate,
    setShippingRate,
    getShippingCost
  } = useCart();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [autoDiscountChecked, setAutoDiscountChecked] = useState(false);
  const [autoDiscountMessage, setAutoDiscountMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'CA'
  });

  // Auto-apply discount when email is entered
  const checkAutoDiscount = async (email: string) => {
    if (!email || autoDiscountChecked || discountCode?.isValid) return;

    try {
      const response = await fetch('/api/discount/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success && data.discount) {
        const applied = await applyDiscountCode(data.discount.code);
        if (applied) {
          setAutoDiscountMessage(`🎉 ${data.message}`);
          setAutoDiscountChecked(true);
        }
      } else {
        setAutoDiscountChecked(true);
      }
    } catch (error) {
      console.error('Auto-discount check failed:', error);
      setAutoDiscountChecked(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Format postal code for Canada
    if (name === 'postalCode' && formData.country === 'CA') {
      const formatted = value.toUpperCase().replace(/\s/g, '');
      if (formatted.length <= 6) {
        const formattedValue = formatted.length > 3
          ? `${formatted.slice(0, 3)} ${formatted.slice(3)}`
          : formatted;
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-check for discounts when email is entered
    if (name === 'email' && value.includes('@') && value.includes('.')) {
      setTimeout(() => checkAutoDiscount(value), 1000); // Debounce
    }
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    console.log('Payment successful:', paymentDetails);
    setPaymentSuccess(true);

    const orderNumber = 'CC' + Date.now().toString().slice(-8).toUpperCase();

    // Store order details (in a real app, you'd save to database)
    const orderData = {
      items,
      total,
      paymentMethod,
      paymentDetails,
      customerInfo: formData,
      timestamp: new Date().toISOString(),
      orderNumber,
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Send order confirmation email
    try {
      const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await fetch('/api/email/order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            properties: item.properties,
          })),
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          paymentMethod: paymentMethod,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          shippingMethod: shippingRate ? {
            service: shippingRate.service,
            serviceName: shippingRate.serviceName,
            price: shippingRate.price,
            deliveryDays: shippingRate.deliveryDays,
          } : null,
          estimatedDelivery,
        }),
      });
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }

    // Clear cart and redirect
    clearCart();
    router.push('/order-confirmation');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Sparkles className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h2>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Add some beautiful crystals to get started!</p>
          <button
            onClick={() => router.push('/crystals')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
          >
            Shop Crystals
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const shipping = getShippingCost();
  const tax = (subtotal - discountAmount + shipping) * 0.13; // 13% HST in Ontario
  const total = subtotal - discountAmount + shipping + tax;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`flex items-center transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <Sparkles className={`w-8 h-8 mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
              <h1 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>CELESTIAL</h1>
            </div>
            <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Lock className="w-4 h-4 mr-1" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Checkout</h2>

              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-purple-600">Information</span>
                </div>
                <div className={`flex-1 h-px mx-4 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'}`}>
                    2
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Payment</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="province" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Province
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    >
                      <option value="">Select Province</option>
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      <option value="MB">Manitoba</option>
                      <option value="NB">New Brunswick</option>
                      <option value="NL">Newfoundland and Labrador</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="ON">Ontario</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="QC">Quebec</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="NT">Northwest Territories</option>
                      <option value="NU">Nunavut</option>
                      <option value="YT">Yukon</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="postalCode" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="K1A 0A6"
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    >
                      <option value="CA">Canada</option>
                      <option value="US">United States</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <ShippingCalculator
                  items={items}
                  subtotal={subtotal}
                  onShippingSelect={(rate) => setShippingRate(rate)}
                  selectedRate={shippingRate}
                />
              </div>

              {/* Auto-Discount Message */}
              {autoDiscountMessage && (
                <div className={`border rounded-lg p-4 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`}>
                  <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>{autoDiscountMessage}</p>
                </div>
              )}

              {/* Discount Code */}
              <div className={`p-6 ${isDark ? 'bg-gray-900 border-gray-700' : 'celestial-card'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Discount Code</h3>
                  {discountCode?.isValid && (
                    <span className="text-green-600 text-sm font-medium">
                      ✅ {discountCode.freeShipping ? 'Free Delivery' : `${discountCode.percentage}% off`} applied
                    </span>
                  )}
                </div>
                <DiscountCodeInput />
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Have a discount code? Enter it above. First-time customers automatically receive discounts via email.
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className={`p-6 ${isDark ? 'bg-gray-900 border border-gray-700 rounded-lg' : 'celestial-card'}`}>
                <h3 className={`text-lg font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Method</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`flex-1 p-4 border-2 rounded-lg transition-colors ${paymentMethod === 'stripe'
                        ? isDark ? 'border-white bg-gray-800' : 'border-gray-900 bg-gray-50'
                        : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Credit Card</span>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Visa, Mastercard, Amex</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 p-4 border-2 rounded-lg transition-colors ${paymentMethod === 'paypal'
                        ? isDark ? 'border-white bg-gray-800' : 'border-gray-900 bg-gray-50'
                        : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>PayPal</span>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pay with PayPal</p>
                    </button>
                  </div>
                </div>

                {/* Payment Component */}
                {paymentMethod === 'stripe' && (
                  <StripePayment
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    orderData={{
                      items,
                      subtotal,
                      discountAmount,
                      shipping,
                      tax,
                      total,
                      discountCode: discountCode?.code,
                      customerInfo: formData,
                      shippingRate
                    }}
                  />
                )}

                {paymentMethod === 'paypal' && (
                  <PayPalPayment
                    amount={total}
                    items={items.map(item => ({
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                    }))}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                )}
              </div>


            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8">
            <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 14M5 3v16l7-7 7 7V3H5z"/>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity}</p>
                      {item.properties && item.properties.length > 0 && (
                        <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {item.properties.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`border-t pt-6 space-y-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Subtotal ({getTotalItems()} items)</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(subtotal)}</span>
                </div>

                {/* Discount Row */}
                {discountCode && discountCode.isValid && (discountAmount > 0 || discountCode.freeShipping) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      {discountCode.freeShipping
                        ? `Discount (${discountCode.code} - Free Delivery)`
                        : `Discount (${discountCode.code} - ${discountCode.percentage}% off)`
                      }
                    </span>
                    <span className="text-green-600">
                      {discountCode.freeShipping
                        ? `-${formatPrice(shipping)}`
                        : `-${formatPrice(discountAmount)}`
                      }
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Tax</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(tax)}</span>
                </div>
                <div className={`border-t pt-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(total)}</span>
                  </div>
                  {discountCode && discountCode.isValid && (discountAmount > 0 || discountCode.freeShipping) && (
                    <div className="text-sm text-green-600 text-right mt-1">
                      You saved {formatPrice(discountCode.freeShipping ? shipping : discountAmount)}! 🎉
                    </div>
                  )}
                </div>
              </div>

              {/* Security Features */}
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`flex items-center space-x-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    <span>SSL Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
