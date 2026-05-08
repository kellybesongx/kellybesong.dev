/**
 * Custom hook for chat analytics tracking
 * Tracks user interactions and conversions
 */

import { useCallback, useRef } from 'react';
// import { AnalyticsEvent, Intent } from '../types/chat.ts';

// Analytics service - replace with your actual analytics provider (Google Analytics, Mixpanel, etc.)
const analyticsService = {
  track: (eventName: string, properties?: Record<string, any>) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, properties);
    }
    
    // TODO: Integrate with your analytics platform
    // Example: gtag('event', eventName, properties);
    // Example: mixpanel.track(eventName, properties);
    
    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('chat_analytics') || '[]');
    events.push({ event: eventName, properties, timestamp: new Date().toISOString() });
    localStorage.setItem('chat_analytics', JSON.stringify(events.slice(-100))); // Keep last 100 events
  }
};

export const useChatAnalytics = () => {
  const sessionId = useRef(Date.now().toString());
  
  const trackEvent = useCallback((event: AnalyticsEvent, properties?: Record<string, any>) => {
    analyticsService.track(event, {
      sessionId: sessionId.current,
      timestamp: new Date().toISOString(),
      ...properties
    });
  }, []);
  
  const trackIntentSelected = useCallback((intent: Intent) => {
    trackEvent('intent_selected', { intent });
  }, [trackEvent]);
  
  const trackLeadSubmitted = useCallback((intent: Intent, success: boolean) => {
    trackEvent('lead_submitted', { intent, success });
  }, [trackEvent]);
  
  const trackChatOpen = useCallback(() => {
    trackEvent('chat_open');
  }, [trackEvent]);
  
  const trackChatClose = useCallback(() => {
    trackEvent('chat_close');
  }, [trackEvent]);
  
  return {
    trackEvent,
    trackIntentSelected,
    trackLeadSubmitted,
    trackChatOpen,
    trackChatClose
  };
};