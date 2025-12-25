'use client';

import { useEffect } from 'react';
import { trackAdView } from '@/utils/analytics';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  adClient?: string;
  adSlot?: string;
}

/**
 * Lightweight wrapper around a Google AdSense ad slot.
 * Renders nothing if client/slot are not provided.
 */
export default function AdBanner({ adClient, adSlot }: AdBannerProps) {
  useEffect(() => {
    if (!adClient || !adSlot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // Track ad view
      trackAdView(adSlot, adClient);
    } catch (err) {
      console.error('Adsense error', err);
    }
  }, [adClient, adSlot]);

  if (!adClient || !adSlot) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle block w-full"
      style={{ display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
