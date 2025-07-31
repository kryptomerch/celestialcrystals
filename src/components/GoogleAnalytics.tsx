'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-LB6Y0RG4JQ';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    trackCrystalView?: (crystalId: string, crystalName: string, category: string, price: number) => void;
    trackAddToCart?: (crystalId: string, crystalName: string, category: string, price: number, quantity?: number) => void;
    trackPurchase?: (transactionId: string, items: any[], total: number) => void;
    trackSearch?: (searchTerm: string) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

    // Wait for gtag to be available
    const checkGtag = () => {
      if (typeof window.gtag === 'function') {
        // Track page views on route changes
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_location: window.location.href,
          page_title: document.title,
        });

        // Track as custom event for better debugging
        window.gtag('event', 'page_view', {
          page_location: window.location.href,
          page_title: document.title,
        });
      } else {
        // Retry after a short delay
        setTimeout(checkGtag, 100);
      }
    };

    checkGtag();
  }, [pathname, GA_MEASUREMENT_ID]);

  // Since scripts are loaded in head, this component just handles route changes
  return null;
}

// Hook for easy tracking in components
export function useGoogleAnalytics() {
  const trackEvent = (eventName: string, parameters: any = {}) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackCrystalView = (crystalId: string, crystalName: string, category: string, price: number) => {
    if (typeof window !== 'undefined' && typeof window.trackCrystalView === 'function') {
      window.trackCrystalView(crystalId, crystalName, category, price);
    }
  };

  const trackAddToCart = (crystalId: string, crystalName: string, category: string, price: number, quantity = 1) => {
    if (typeof window !== 'undefined' && typeof window.trackAddToCart === 'function') {
      window.trackAddToCart(crystalId, crystalName, category, price, quantity);
    }
  };

  const trackPurchase = (transactionId: string, items: any[], total: number) => {
    if (typeof window !== 'undefined' && typeof window.trackPurchase === 'function') {
      window.trackPurchase(transactionId, items, total);
    }
  };

  const trackSearch = (searchTerm: string) => {
    if (typeof window !== 'undefined' && typeof window.trackSearch === 'function') {
      window.trackSearch(searchTerm);
    }
  };

  return {
    trackEvent,
    trackCrystalView,
    trackAddToCart,
    trackPurchase,
    trackSearch
  };
}
