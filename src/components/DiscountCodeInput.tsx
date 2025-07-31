'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Tag, Check, X, Loader } from 'lucide-react';

interface DiscountCodeInputProps {
  className?: string;
  showLabel?: boolean;
}

export default function DiscountCodeInput({
  className = '',
  showLabel = true
}: DiscountCodeInputProps) {
  const { discountCode, applyDiscountCode, removeDiscountCode } = useCart();
  const { isDark } = useTheme();
  const [inputCode, setInputCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim() || isApplying) return;

    setIsApplying(true);
    const success = await applyDiscountCode(inputCode.trim().toUpperCase());

    if (success) {
      setInputCode('');
    }
    setIsApplying(false);
  };

  const handleRemoveCode = () => {
    removeDiscountCode();
    setInputCode('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700">
          Discount Code
        </label>
      )}

      {/* Applied Discount Display */}
      {discountCode && discountCode.isValid ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {discountCode.code}
            </span>
            <span className="text-sm text-green-600">
              {discountCode.freeShipping ? '(Free Delivery)' : `(${discountCode.percentage}% off)`}
            </span>
          </div>
          <button
            onClick={handleRemoveCode}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Remove discount code"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Discount Code Input Form */
        <form onSubmit={handleApplyCode} className="space-y-2">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Enter discount code"
                className="w-full px-3 py-2 pl-9 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                disabled={isApplying}
              />
              <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={!inputCode.trim() || isApplying}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              {isApplying ? (
                <>
                  <Loader className="w-3 h-3 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {discountCode && !discountCode.isValid && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <X className="w-4 h-4" />
              <span>{discountCode.message || 'Invalid discount code'}</span>
            </div>
          )}
        </form>
      )}

      {/* Success Message */}
      {discountCode && discountCode.isValid && discountCode.message && (
        <div className="text-sm text-green-600">
          {discountCode.message}
        </div>
      )}


    </div>
  );
}
