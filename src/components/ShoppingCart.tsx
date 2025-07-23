'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Plus, Minus, ShoppingBag, Trash2, Truck, Gift } from 'lucide-react';
import Image from 'next/image';
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
    getFinalTotal,
    getShippingCost
  } = useCart();
  const { isDark } = useTheme();
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

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const shipping = getShippingCost();
  const tax = (subtotal - discountAmount + shipping) * 0.13; // 13% HST in Ontario
  const total = subtotal - discountAmount + shipping + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>${item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`p-1 rounded ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`p-1 rounded ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={`p-2 rounded-md transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
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
            <div className={`border-t p-4 space-y-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`flex justify-between text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className={`w-full py-3 px-4 font-medium transition-all duration-200 text-sm uppercase tracking-wide ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
