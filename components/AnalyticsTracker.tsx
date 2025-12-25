'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from '@/utils/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface AnalyticsTrackerProps {
  measurementId?: string;
}

/**
 * Sends page_view events to Google Analytics (gtag) and Firebase Analytics on route changes.
 */
export default function AnalyticsTracker({ measurementId }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    const pageTitle = document.title || pathname;
    
    // Track with Firebase Analytics
    trackPageView(url, pageTitle);
    
    // Also track with gtag if available (for Google Analytics)
    if (measurementId && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: pageTitle,
        send_to: measurementId,
      });
    }
  }, [pathname, searchParams, measurementId]);

  return null;
}
