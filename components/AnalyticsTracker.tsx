'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface AnalyticsTrackerProps {
  measurementId?: string;
}

/**
 * Sends page_view events to Google Analytics (gtag) on route changes.
 */
export default function AnalyticsTracker({ measurementId }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        send_to: measurementId,
      });
    }
  }, [pathname, searchParams, measurementId]);

  return null;
}
