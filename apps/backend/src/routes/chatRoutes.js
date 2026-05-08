// /**
//  * Express router for chat endpoints
//  * Following implementation plan: router.post('/start', ...)
//  */

// // import { Router } from 'express';
// import express from 'express';
// import  chatController from '../controllers/chatController.js';
// import { validateIntent, validateLead } from '../middleware/validation.js';
// import { apiLimiter, leadLimiter } from '../middleware/rateLimit.js';

// const router = express.Router();

// // POST /chat/start - Start a chat session
// router.post('/start', apiLimiter, validateIntent, chatController.startChat);

// // POST /chat/respond - Get AI response (maps intent to response)
// router.post('/respond', apiLimiter, validateIntent, chatController.getResponse);

// // POST /chat/lead - Capture lead with stricter rate limiting
// router.post('/lead', leadLimiter, validateLead, chatController.saveLead);

// // // GET /chat/analytics - Get analytics (protected in production)
// // router.get('/analytics', chatController.getAnalytics);

// export default router;

const express = require('express');

const { chatController } = require('../controllers/chatController');

const {
  validateIntent,
  validateLead
} = require('../middleware/validation');

const {
  apiLimiter,
  leadLimiter
} = require('../middleware/rateLimit');

const router = express.Router();


// POST /chat/start
router.post(
  '/start',
  apiLimiter,
  validateIntent,
  chatController.startChat
);


// POST /chat/respond
router.post(
  '/respond',
  apiLimiter,
  validateIntent,
  chatController.getResponse
);


// POST /chat/lead
router.post(
  '/lead',
  leadLimiter,
  validateLead,
  chatController.saveLead
);

module.exports = router;