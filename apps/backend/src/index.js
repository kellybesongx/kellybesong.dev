
const express = require("express");
const app = express();
const helmet = require('helmet');
require('dotenv').config();
// IMPORTANT: Add CORS middleware to allow frontend to call backend
// CORS = Cross-Origin Resource Sharing
// This tells the browser: "It's OK for your frontend to talk to this backend"

// Option 1: Allow all origins (for development only!)
const cors = require('cors');
app.use(cors());  // This allows ANY website to call your backend
// CORS configuration
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   credentials: true
// }));

// Option 2: Allow only your frontend (more secure - use this!)
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000'],
//     credentials: true
// }));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import analytics routes
console.log('Loading analyticsRoutes...');
const analyticsRoutes = require('./routes/analyticsRoutes');
console.log('analyticsRoutes loaded:', typeof analyticsRoutes);
console.log('analyticsRoutes:', analyticsRoutes);

// Import chats routes
console.log('Loading chatRoutes...');
const chatRoutes = require('./routes/chatRoutes');
console.log('chatRoutes loaded:', typeof chatRoutes);
console.log('chatRoutes:', chatRoutes);

// Mount analytics routes at /api/analytics
app.use('/api/analytics', analyticsRoutes);

// without the " .default " after the chat route function call its will throw an 'argument handler must be a function' error
// app.use('/api/chat', chatRoutes.default || chatRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
      res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: 'Supabase connected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`📊 Analytics API available at http://localhost:${PORT}/api/analytics`);
    console.log(`🔗 CORS enabled - frontend can connect`);
    console.log(`🔗 Supabase enabled - frontend can connect`);
});

module.exports = app;