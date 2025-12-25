'use client';

import { logEvent, Analytics } from 'firebase/analytics';
import { initAnalytics } from './firebase';

/**
 * Comprehensive analytics event tracking utility
 * Tracks all user interactions including clicks, typing events, navigation, etc.
 */

// Event names
export const AnalyticsEvents = {
  // Navigation events
  PAGE_VIEW: 'page_view',
  LINK_CLICK: 'link_click',
  BUTTON_CLICK: 'button_click',
  
  // Typing practice events
  TYPING_START: 'typing_start',
  TYPING_COMPLETE: 'typing_complete',
  TYPING_RESET: 'typing_reset',
  NEW_TEXT_LOADED: 'new_text_loaded',
  FOCUS_INPUT: 'focus_input',
  
  // Tutorial events
  TUTORIAL_LEVEL_START: 'tutorial_level_start',
  TUTORIAL_LEVEL_COMPLETE: 'tutorial_level_complete',
  TUTORIAL_LEVEL_PASSED: 'tutorial_level_passed',
  TUTORIAL_LEVEL_FAILED: 'tutorial_level_failed',
  TUTORIAL_LEVEL_NAVIGATE: 'tutorial_level_navigate',
  TUTORIAL_FILTER: 'tutorial_filter',
  
  // Language events
  LANGUAGE_CHANGE: 'language_change',
  
  // Stats events
  STATS_VIEW: 'stats_view',
  
  // Ad events
  AD_VIEW: 'ad_view',
  AD_CLICK: 'ad_click',
} as const;

/**
 * Get analytics instance
 */
async function getAnalytics(): Promise<Analytics | null> {
  return await initAnalytics();
}

/**
 * Log an analytics event
 */
export async function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): Promise<void> {
  try {
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
    
    // Also log to gtag if available (for Google Analytics)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics error:', error);
    }
  }
}

/**
 * Track button clicks
 */
export async function trackButtonClick(
  buttonName: string,
  location?: string,
  additionalParams?: Record<string, any>
): Promise<void> {
  await trackEvent(AnalyticsEvents.BUTTON_CLICK, {
    button_name: buttonName,
    location: location || 'unknown',
    ...additionalParams,
  });
}

/**
 * Track link clicks
 */
export async function trackLinkClick(
  linkText: string,
  linkUrl: string,
  location?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.LINK_CLICK, {
    link_text: linkText,
    link_url: linkUrl,
    location: location || 'unknown',
  });
}

/**
 * Track typing start
 */
export async function trackTypingStart(
  language: string,
  textLength: number,
  isTutorial: boolean = false,
  levelId?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.TYPING_START, {
    language,
    text_length: textLength,
    is_tutorial: isTutorial,
    level_id: levelId,
  });
}

/**
 * Track typing completion
 */
export async function trackTypingComplete(
  language: string,
  wpm: number,
  accuracy: number,
  timeElapsed: number,
  textLength: number,
  isTutorial: boolean = false,
  levelId?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.TYPING_COMPLETE, {
    language,
    wpm: Math.round(wpm),
    accuracy: Math.round(accuracy),
    time_elapsed: Math.round(timeElapsed),
    text_length: textLength,
    is_tutorial: isTutorial,
    level_id: levelId,
  });
}

/**
 * Track typing reset
 */
export async function trackTypingReset(
  language: string,
  reason?: string,
  isTutorial: boolean = false,
  levelId?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.TYPING_RESET, {
    language,
    reason: reason || 'user_action',
    is_tutorial: isTutorial,
    level_id: levelId,
  });
}

/**
 * Track new text loaded
 */
export async function trackNewText(
  language: string,
  textLength: number,
  isTutorial: boolean = false
): Promise<void> {
  await trackEvent(AnalyticsEvents.NEW_TEXT_LOADED, {
    language,
    text_length: textLength,
    is_tutorial: isTutorial,
  });
}

/**
 * Track tutorial level start
 */
export async function trackTutorialLevelStart(
  levelId: string,
  levelTitle: string,
  difficulty: string,
  levelType: string,
  language: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.TUTORIAL_LEVEL_START, {
    level_id: levelId,
    level_title: levelTitle,
    difficulty,
    level_type: levelType,
    language,
  });
}

/**
 * Track tutorial level completion
 */
export async function trackTutorialLevelComplete(
  levelId: string,
  passed: boolean,
  wpm: number,
  accuracy: number,
  timeElapsed: number,
  minAccuracy?: number,
  minWPM?: number
): Promise<void> {
  await trackEvent(
    passed ? AnalyticsEvents.TUTORIAL_LEVEL_PASSED : AnalyticsEvents.TUTORIAL_LEVEL_FAILED,
    {
      level_id: levelId,
      passed,
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      time_elapsed: Math.round(timeElapsed),
      min_accuracy: minAccuracy,
      min_wpm: minWPM,
    }
  );
}

/**
 * Track tutorial level navigation
 */
export async function trackTutorialNavigation(
  fromLevelId: string,
  toLevelId: string,
  direction: 'next' | 'previous'
): Promise<void> {
  await trackEvent(AnalyticsEvents.TUTORIAL_LEVEL_NAVIGATE, {
    from_level_id: fromLevelId,
    to_level_id: toLevelId,
    direction,
  });
}

/**
 * Track tutorial filter change
 */
export async function trackTutorialFilter(
  difficulty: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.TUTORIAL_FILTER, {
    difficulty,
  });
}

/**
 * Track language change
 */
export async function trackLanguageChange(
  fromLanguage: string,
  toLanguage: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.LANGUAGE_CHANGE, {
    from_language: fromLanguage,
    to_language: toLanguage,
  });
}

/**
 * Track focus input
 */
export async function trackFocusInput(
  location: string,
  method: 'click' | 'keyboard' | 'auto'
): Promise<void> {
  await trackEvent(AnalyticsEvents.FOCUS_INPUT, {
    location,
    method,
  });
}

/**
 * Track select/dropdown changes
 */
export async function trackSelectChange(
  selectName: string,
  value: string,
  location?: string
): Promise<void> {
  await trackEvent('select_change', {
    select_name: selectName,
    value,
    location: location || 'unknown',
  });
}

/**
 * Track page view (enhanced)
 */
export async function trackPageView(
  pagePath: string,
  pageTitle?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.PAGE_VIEW, {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/**
 * Track form submission
 */
export async function trackFormSubmit(
  formName: string,
  location?: string
): Promise<void> {
  await trackEvent('form_submit', {
    form_name: formName,
    location: location || 'unknown',
  });
}

/**
 * Track ad interactions
 */
export async function trackAdView(
  adSlot?: string,
  adClient?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.AD_VIEW, {
    ad_slot: adSlot,
    ad_client: adClient,
  });
}

export async function trackAdClick(
  adSlot?: string,
  adClient?: string
): Promise<void> {
  await trackEvent(AnalyticsEvents.AD_CLICK, {
    ad_slot: adSlot,
    ad_client: adClient,
  });
}

