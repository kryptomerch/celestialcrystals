'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Generate a session ID for anonymous users
function getSessionId() {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Track analytics event
async function trackEvent(event: string, data?: any) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      page: pathname,
      userId: session?.user?.id,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString()
    });
  }, [pathname, session]);

  return null; // This component doesn't render anything
}

// Hook for tracking custom events
export function useAnalytics() {
  const { data: session } = useSession();

  const track = (event: string, data?: any) => {
    trackEvent(event, {
      ...data,
      userId: session?.user?.id,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString()
    });
  };

  return { track };
}
