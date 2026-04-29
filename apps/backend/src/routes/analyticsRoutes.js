// FILE: analyticsRoutes.js
// PURPOSE: Define URL endpoints for analytics

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// POST /api/analytics/event - Save an event
router.post('/event', analyticsController.trackEvent);

// GET /api/analytics/events - Get all events
router.get('/events', analyticsController.getEvents);

// GET /api/analytics/summary - Get summary statistics
router.get('/summary', analyticsController.getSummary);

module.exports = router;