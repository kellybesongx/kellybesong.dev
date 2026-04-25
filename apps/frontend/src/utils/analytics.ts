
// FILE: apps/frontend/src/utils/analytics.ts

import type { AnalyticsEvent, AnalyticsResponse, AnalyticsEventsResponse } from '../types/analytics';

// Get API URL from environment variable
// Vite uses import.meta.env for environment variables
// The VITE_ prefix is required for Vite to expose them to the browser
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Check if debug logging is enabled
const IS_DEBUG = import.meta.env.VITE_DEBUG_ANALYTICS === 'true';

/**
 * Generate a unique session ID for this user
 * The ID persists during the browser session (until tab is closed)
 * @returns A unique session ID string
 */
const getSessionId = (): string => {
    // Check if we already have a session ID in sessionStorage
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
        // Create a new random ID
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 10);
        sessionId = `session_${timestamp}_${randomPart}`;
        
        // Store for future events in this tab
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    return sessionId;
};

/**
 * Track an analytics event
 * Sends the event to the backend API for storage in Supabase
 * 
 * @param eventName - The name of the event (e.g., 'page_view', 'button_click')
 * @param payload - Additional data about the event
 * @returns Promise with the response from the backend
 */
export async function trackEvent(
    eventName: string, 
    payload: Record<string, unknown>
): Promise<AnalyticsResponse> {
    const sessionId = getSessionId();
    
    const eventData: AnalyticsEvent = {
        eventName: eventName,
        payload: payload,
        sessionId: sessionId
    };
    
    // Only log in development mode (controlled by .env.development)
    if (IS_DEBUG) {
        console.log('📊 [Analytics] Sending event:', eventData);
        console.log('📊 [Analytics] API URL:', API_URL);
    }
    
    try {
        const response = await fetch(`${API_URL}/api/analytics/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });
        
        const result: AnalyticsResponse = await response.json();
        
        if (result.success && IS_DEBUG) {
            console.log('✅ [Analytics] Event saved:', result.data);
        } else if (!result.success) {
            console.error('❌ [Analytics] Failed to save:', result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ [Analytics] Network error:', error);
        
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown network error'
        };
    }
}

/**
 * Get all analytics events (for dashboard use)
 * @param limit - Maximum number of events to return
 * @param fromDate - Only events after this date (ISO string)
 * @returns Promise with events array
 */
export async function getAnalyticsEvents(
    limit: number = 100,
    fromDate?: string
): Promise<AnalyticsEventsResponse> {
    try {
        let url = `${API_URL}/api/analytics/events?limit=${limit}`;
        if (fromDate) {
            url += `&fromDate=${fromDate}`;
        }
        
        if (IS_DEBUG) {
            console.log('📊 [Analytics] Fetching events from:', url);
        }
        
        const response = await fetch(url);
        const result: AnalyticsEventsResponse = await response.json();
        
        return result;
        
    } catch (error) {
        console.error('❌ [Analytics] Failed to fetch events:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}


// // export function trackEvent(eventName: string, payload: Record<string, unknown>) {
// //   console.log("ANALYTICS EVENT:", {
// //     event: eventName,
// //     ...payload,
// //   });
// // }

// import type { AnalyticsEvent, AnalyticsResponse, AnalyticsEventsResponse } from '../types/analytics';

// /**
//  * Generate a unique session ID for this user
//  * The ID persists during the browser session (until tab is closed)
//  * @returns A unique session ID string
//  */
// const getSessionId = (): string => {
//     // Check if we already have a session ID in sessionStorage
//     // sessionStorage persists only for the current browser tab
//     let sessionId = sessionStorage.getItem('analytics_session_id');
    
//     if (!sessionId) {
//         // Create a new random ID
//         // Format: session_[timestamp]_[random 8 chars]
//         const timestamp = Date.now();
//         const randomPart = Math.random().toString(36).substring(2, 10);
//         sessionId = `session_${timestamp}_${randomPart}`;
        
//         // Store for future events in this tab
//         sessionStorage.setItem('analytics_session_id', sessionId);
//     }
    
//     return sessionId;
// };

// /**
//  * Track an analytics event
//  * Sends the event to the backend API for storage in Supabase
//  * 
//  * @param eventName - The name of the event (e.g., 'page_view', 'button_click')
//  * @param payload - Additional data about the event (e.g., { page: 'home', buttonId: 'submit' })
//  * @returns Promise with the response from the backend
//  * 
//  * @example
//  * // Track a page view
//  * trackEvent('page_view', { page: 'home', section: 'hero' });
//  * 
//  * // Track a button click
//  * trackEvent('button_click', { buttonId: 'contact_submit', form: 'contact' });
//  */
// export async function trackEvent(
//     eventName: string, 
//     payload: Record<string, unknown>
// ): Promise<AnalyticsResponse> {
//     // Get or create session ID for this user
//     const sessionId = getSessionId();
    
//     // Prepare the complete event data
//     const eventData: AnalyticsEvent = {
//         eventName: eventName,
//         payload: payload,
//         sessionId: sessionId
//     };
    
//     // Development logging - helps debug
//     if (process.env.NODE_ENV === 'development') {
//         console.log('📊 [Analytics] Sending event:', eventData);
//     }
    
//     try {
//         // Send to your backend API
//         const response = await fetch('http://localhost:3001/api/analytics/event', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(eventData)
//         });
        
//         const result: AnalyticsResponse = await response.json();
        
//         if (result.success) {
//             if (process.env.NODE_ENV === 'development') {
//                 console.log('✅ [Analytics] Event saved:', result.data);
//             }
//         } else {
//             console.error('❌ [Analytics] Failed to save:', result.error);
//         }
        
//         return result;
        
//     } catch (error) {
//         // Never throw errors from analytics - they shouldn't break your app
//         console.error('❌ [Analytics] Network error:', error);
        
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : 'Unknown network error'
//         };
//     }
// }

// /**
//  * Get all analytics events (for dashboard use)
//  * @param limit - Maximum number of events to return
//  * @param fromDate - Only events after this date (ISO string)
//  * @returns Promise with events array
//  */
// export async function getAnalyticsEvents(
//     limit: number = 100,
//     fromDate?: string
// ): Promise<AnalyticsEventsResponse> {
//     try {
//         // Build URL with query parameters
//         let url = `http://localhost:3001/api/analytics/events?limit=${limit}`;
//         if (fromDate) {
//             url += `&fromDate=${fromDate}`;
//         }
        
//         const response = await fetch(url);
//         const result: AnalyticsEventsResponse = await response.json();
        
//         return result;
        
//     } catch (error) {
//         console.error('❌ [Analytics] Failed to fetch events:', error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : 'Unknown error'
//         };
//     }
// }


