'use client';

import { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Shield, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ShippingRate {
  service: string;
  serviceName: string;
  price: number;
  deliveryDays: string;
  guaranteed: boolean;
}

interface ShippingCalculatorProps {
  items: any[];
  onShippingSelect: (rate: ShippingRate) => void;
  selectedRate?: ShippingRate;
  subtotal?: number;
  className?: string;
}

export default function ShippingCalculator({
  items,
  onShippingSelect,
  selectedRate,
  subtotal = 0,
  className = ''
}: ShippingCalculatorProps) {
  const { isDark } = useTheme();
  const [postalCode, setPostalCode] = useState('');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  // Check if order qualifies for free shipping
  const qualifiesForFreeShipping = subtotal >= 75;

  const calculateShipping = async () => {
    if (!postalCode.trim()) {
      setError('Please enter your postal code');
      return;
    }

    // Validate Canadian postal code format
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!canadianPostalRegex.test(postalCode)) {
      setError('Please enter a valid Canadian postal code (e.g., K1A 0A6)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postalCode: postalCode.trim(),
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate shipping');
      }

      // Apply free shipping if qualified
      const processedRates = qualifiesForFreeShipping
        ? data.rates.map((rate: ShippingRate) => ({ ...rate, price: 0 }))
        : data.rates;

      setRates(processedRates);
      setHasCalculated(true);

      // Auto-select the cheapest option (or free shipping)
      if (processedRates.length > 0) {
        const cheapestRate = processedRates.reduce((prev: ShippingRate, current: ShippingRate) =>
          prev.price < current.price ? prev : current
        );
        onShippingSelect(cheapestRate);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shipping');
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPostalCode(value);
    setError('');

    // Reset rates when postal code changes
    if (hasCalculated) {
      setRates([]);
      setHasCalculated(false);
    }
  };

  const handleRateSelect = (rate: ShippingRate) => {
    onShippingSelect(rate);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Truck className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Options</h3>
      </div>

      {/* Free Shipping Banner */}
      {qualifiesForFreeShipping ? (
        <div className={`rounded-lg p-4 mb-4 ${isDark
          ? 'bg-green-900/20 border border-green-700'
          : 'bg-green-50 border border-green-200'
          }`}>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>
              🎉 Congratulations! You qualify for FREE SHIPPING!
            </span>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            Your order is over $75, so shipping is completely free.
          </p>
        </div>
      ) : (
        <div className={`rounded-lg p-4 mb-4 ${isDark
          ? 'bg-blue-900/20 border border-blue-700'
          : 'bg-blue-50 border border-blue-200'
          }`}>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              Add ${(75 - subtotal).toFixed(2)} more for FREE SHIPPING!
            </span>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            Orders over $75 ship free across Canada.
          </p>
        </div>
      )}

      {/* Postal Code Input */}
      <div className="space-y-2">
        <label htmlFor="postalCode" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Postal Code
        </label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={handlePostalCodeChange}
              placeholder="K1A 0A6"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isDark
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
              maxLength={7}
            />
          </div>
          <button
            onClick={calculateShipping}
            disabled={loading || !postalCode.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span>{loading ? 'Calculating...' : 'Calculate'}</span>
          </button>
        </div>
        {error && (
          <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        )}
      </div>

      {/* Shipping Rates */}
      {rates.length > 0 && (
        <div className="space-y-3">
          <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Shipping Options:</h4>
          <div className="space-y-2">
            {rates.map((rate) => (
              <label
                key={rate.service}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedRate?.service === rate.service
                  ? isDark
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-purple-500 bg-purple-50'
                  : isDark
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shippingRate"
                    value={rate.service}
                    checked={selectedRate?.service === rate.service}
                    onChange={() => handleRateSelect(rate)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{rate.serviceName}</span>
                      {rate.guaranteed && (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-3 h-3" />
                      <span>{rate.deliveryDays}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {rate.price === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `$${rate.price.toFixed(2)}`
                    )}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {rate.price === 0 ? 'No charge' : '+ taxes'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Info */}
      <div className={`rounded-lg p-4 ${isDark
          ? 'bg-blue-900/20 border border-blue-700'
          : 'bg-blue-50 border border-blue-200'
        }`}>
        <div className="flex items-start space-x-2">
          <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
            <p className="font-medium mb-1">Shipping from Hamilton, ON</p>
            <ul className={`space-y-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              <li>• <strong>FREE SHIPPING</strong> on orders over $75</li>
              <li>• All packages include tracking</li>
              <li>• Secure packaging for crystal protection</li>
              <li>• Canada-wide delivery available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
