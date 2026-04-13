// FILE: analyticsController.js
// PURPOSE: Process incoming requests and send responses

// This will import the service once it's created
const analyticsService = require('../services/analyticsService');

async function trackEvent(req, res) {
    // Frontend sends camelCase (eventName, sessionId)
    const { eventName, payload, sessionId } = req.body;
    
    // Validate required fields
    if (!eventName) {
        return res.status(400).json({
            success: false,
            error: 'Missing required field: eventName'
        });
    }
    
    if (!sessionId) {
        return res.status(400).json({
            success: false,
            error: 'Missing required field: sessionId'
        });
    }
    
    // IMPORTANT: Convert camelCase to snake_case for database
    // Frontend sends: { eventName, sessionId }
    // Database expects: { event_name, session_id }
    const eventData = {
        event_name: eventName,    // camelCase → snake_case
        payload: payload || {},
        session_id: sessionId     // camelCase → snake_case
        // Do NOT include id or created_at - database handles these
    };
    
    // Log what we're sending (helpful for debugging)
    console.log('📤 Saving event:', JSON.stringify(eventData, null, 2));
    
    // Save to database
    const result = await analyticsService.saveEvent(eventData);
    
    if (result.success) {
        res.status(201).json({
            success: true,
            message: 'Event tracked successfully',
            data: result.data
        });
    } else {
        res.status(500).json({
            success: false,
            error: result.error
        });
    }
}

async function getEvents(req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const fromDate = req.query.fromDate || null;
    
    const result = await analyticsService.getEvents({ limit, fromDate });
    
    if (result.success) {
        // Data from service already has camelCase for frontend
        res.status(200).json({
            success: true,
            data: result.data,
            count: result.count
        });
    } else {
        res.status(500).json({
            success: false,
            error: result.error
        });
    }
}

async function getSummary(req, res) {
    const result = await analyticsService.getEventSummary();
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data,
            total: result.total
        });
    } else {
        res.status(500).json({
            success: false,
            error: result.error
        });
    }
}

module.exports = {
    trackEvent,
    getEvents,
    getSummary
};