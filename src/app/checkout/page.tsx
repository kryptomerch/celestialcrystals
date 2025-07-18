'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, Truck, Shield, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import StripePayment from '@/components/StripePayment';
import PayPalPayment from '@/components/PayPalPayment';
import DiscountCodeInput from '@/components/DiscountCodeInput';

export default function CheckoutPage() {
  const {
    items,
    getTotalPrice,
    getTotalItems,
    clearCart,
    discountCode,
    getDiscountAmount,
    getFinalTotal
  } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful crystals to get started!</p>
          <button
            onClick={() => router.push('/crystals')}
            className="celestial-button"
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
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = subtotal >= 50 ? 0 : 5.99; // Free shipping on orders over $50 (before discount)
  const tax = discountedSubtotal * 0.08; // 8% tax on discounted amount
  const total = getFinalTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-gray-600 mr-2" />
              <h1 className="text-2xl font-light text-gray-900">CELESTIAL</h1>
            </div>
            <div className="flex items-center text-sm text-gray-500">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-purple-600">Information</span>
                </div>
                <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Discount Code */}
              <div className="celestial-card p-6">
                <DiscountCodeInput />
              </div>

              {/* Payment Method Selection */}
              <div className="celestial-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`flex-1 p-4 border-2 rounded-lg transition-colors ${paymentMethod === 'stripe'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, Amex</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 p-4 border-2 rounded-lg transition-colors ${paymentMethod === 'paypal'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <span className="font-medium">PayPal</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Pay with PayPal</p>
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                {/* Discount Row */}
                {discountCode && discountCode.isValid && discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Discount ({discountCode.code} - {discountCode.percentage}% off)
                    </span>
                    <span className="text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(total)}</span>
                  </div>
                  {discountCode && discountCode.isValid && discountAmount > 0 && (
                    <div className="text-sm text-green-600 text-right mt-1">
                      You saved {formatPrice(discountAmount)}!
                    </div>
                  )}
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
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
