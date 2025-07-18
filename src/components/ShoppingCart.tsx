'use client';

import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DiscountCodeInput from './DiscountCodeInput';

export default function ShoppingCart() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    discountCode,
    getDiscountAmount,
    getFinalTotal
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setIsOpen(false);
    router.push('/checkout');
    setIsCheckingOut(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              <h2 className="text-base sm:text-lg font-medium text-gray-900">
                Cart ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Add some beautiful crystals to get started!</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="celestial-button text-sm sm:text-base px-4 sm:px-6 py-2"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 p-3 sm:p-4">
                    {/* Crystal Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-400 rounded-full opacity-60" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>

                      {/* Properties */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.properties.slice(0, 2).map((property, index) => (
                          <span
                            key={index}
                            className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                          >
                            {property}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-4 sm:px-6 py-4 space-y-4">
              {/* Discount Code Input */}
              <div className="border-b border-gray-100 pb-4">
                <DiscountCodeInput showLabel={false} />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-gray-900">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Discount Row */}
                {discountCode && discountCode.isValid && getDiscountAmount() > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">
                      Discount ({discountCode.percentage}% off)
                    </span>
                    <span className="text-green-600">-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}

                {/* Final Total */}
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total:</span>
                  <span>{formatPrice(discountCode && discountCode.isValid ? getFinalTotal() : getTotalPrice())}</span>
                </div>

                {/* Savings Message */}
                {discountCode && discountCode.isValid && getDiscountAmount() > 0 && (
                  <div className="text-sm text-green-600 text-center">
                    You're saving {formatPrice(getDiscountAmount())}!
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full celestial-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full celestial-button-outline"
              >
                Continue Shopping
              </button>

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
