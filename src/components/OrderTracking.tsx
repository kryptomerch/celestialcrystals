'use client';

import { useState } from 'react';
import { Package, MapPin, Clock, CheckCircle, Truck, Search, Loader2 } from 'lucide-react';

interface TrackingEvent {
  date: string;
  status: string;
  location: string;
}

interface TrackingInfo {
  status: string;
  location: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

interface OrderTrackingProps {
  trackingNumber?: string;
  className?: string;
}

export default function OrderTracking({ trackingNumber: initialTracking, className = '' }: OrderTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || '');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/shipping/track?trackingNumber=${encodeURIComponent(trackingNumber.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track order');
      }

      setTrackingInfo(data.trackingInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track order');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('delivered')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (statusLower.includes('transit') || statusLower.includes('shipping')) {
      return <Truck className="w-5 h-5 text-blue-500" />;
    } else if (statusLower.includes('picked up') || statusLower.includes('processed')) {
      return <Package className="w-5 h-5 text-orange-500" />;
    } else {
      return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('delivered')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (statusLower.includes('transit') || statusLower.includes('shipping')) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    } else if (statusLower.includes('picked up') || statusLower.includes('processed')) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    } else {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Package className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">Track Your Order</h3>
      </div>

      {/* Tracking Number Input */}
      <div className="space-y-2">
        <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700">
          Tracking Number
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter your tracking number"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={trackOrder}
            disabled={loading || !trackingNumber.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{loading ? 'Tracking...' : 'Track'}</span>
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Tracking Results */}
      {trackingInfo && (
        <div className="space-y-4">
          {/* Current Status */}
          <div className={`p-4 border rounded-lg ${getStatusColor(trackingInfo.status)}`}>
            <div className="flex items-center space-x-3">
              {getStatusIcon(trackingInfo.status)}
              <div>
                <h4 className="font-medium">{trackingInfo.status}</h4>
                <div className="flex items-center space-x-4 text-sm mt-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{trackingInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Est. delivery: {trackingInfo.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking History */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Tracking History</h4>
            <div className="space-y-4">
              {trackingInfo.events.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Package className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Delivery Information</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Signature may be required for delivery</li>
                  <li>• Package will be left in a safe location if no one is home</li>
                  <li>• You'll receive an email notification when delivered</li>
                  <li>• Contact Canada Post if you have delivery concerns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Tracking numbers are sent via email when your order ships</p>
          <p>• It may take 24 hours for tracking information to appear</p>
          <p>• Contact us if you haven't received tracking info within 2 business days</p>
          <p>• For urgent inquiries, email us at support@celestialcrystals.com</p>
        </div>
      </div>
    </div>
  );
}
