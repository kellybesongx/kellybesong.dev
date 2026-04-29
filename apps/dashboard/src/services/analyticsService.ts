// FILE: apps/dashboard/src/services/analyticsService.ts

import type { AnalyticsEvent, AnalyticsEventsResponse, AnalyticsSummaryResponse } from '../types/analytics';

// API URL - in production, this would be your deployed backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetch all analytics events from the backend
 * @param limit - Maximum number of events to return (default: 100)
 * @returns Promise with events array
 */
export async function fetchAnalyticsEvents(limit: number = 100): Promise<AnalyticsEvent[]> {
    try {
        const response = await fetch(`${API_URL}/api/analytics/events?limit=${limit}`);
        const result: AnalyticsEventsResponse = await response.json();
        
        if (result.success && result.data) {
            return result.data;
        } else {
            console.error('Failed to fetch events:', result.error);
            return [];
        }
    } catch (error) {
        console.error('Network error fetching events:', error);
        return [];
    }
}

/**
 * Fetch event summary statistics
 * @returns Promise with summary object { eventName: count }
 */
export async function fetchAnalyticsSummary(): Promise<Record<string, number>> {
    try {
        const response = await fetch(`${API_URL}/api/analytics/summary`);
        const result: AnalyticsSummaryResponse = await response.json();
        
        if (result.success && result.data) {
            return result.data;
        } else {
            console.error('Failed to fetch summary:', result.error);
            return {};
        }
    } catch (error) {
        console.error('Network error fetching summary:', error);
        return {};
    }
}