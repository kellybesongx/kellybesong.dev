// FILE: apps/dashboard/src/types/analytics.ts

/**
 * An analytics event from the database
 */
export interface AnalyticsEvent {
    /** Unique ID from database */
    id: number;
    
    /** Name of the event (e.g., 'page_view', 'button_click') */
    eventName: string;
    
    /** Additional data about the event */
    payload: Record<string, unknown>;
    
    /** Unique session ID for the user */
    sessionId: string;
    
    /** When the event occurred (ISO string) */
    createdAt: string;
}

/**
 * Response from GET /api/analytics/events
 */
export interface AnalyticsEventsResponse {
    success: boolean;
    data?: AnalyticsEvent[];
    count?: number;
    error?: string;
}

/**
 * Summary statistics response
 */
export interface AnalyticsSummaryResponse {
    success: boolean;
    data?: Record<string, number>;  // eventName -> count
    total?: number;
    error?: string;
}