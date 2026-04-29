// FILE: apps/frontend/src/types/analytics.ts

/**
 * The payload of an analytics event
 * Can be any object with string keys and any values
 */
export type AnalyticsPayload = Record<string, unknown>;

/**
 * The event data sent to the backend
 */
export interface AnalyticsEvent {
    /** Name of the event (e.g., 'page_view', 'button_click') */
    eventName: string;
    
    /** Additional data about the event */
    payload: AnalyticsPayload;
    
    /** Unique identifier for the user's session */
    sessionId: string;
}

/**
 * The response from the backend after saving an event
 */
export interface AnalyticsResponse {
    success: boolean;
    message?: string;
    data?: {
        id: number;
        eventName: string;
        payload: AnalyticsPayload;
        sessionId: string;
        createdAt: string;
    };
    error?: string;
}

/**
 * Response when getting multiple events
 */
export interface AnalyticsEventsResponse {
    success: boolean;
    data?: Array<{
        id: number;
        eventName: string;
        payload: AnalyticsPayload;
        sessionId: string;
        createdAt: string;
    }>;
    count?: number;
    error?: string;
}