
const express = require("express");
const app = express();

// IMPORTANT: Add CORS middleware to allow frontend to call backend
// CORS = Cross-Origin Resource Sharing
// This tells the browser: "It's OK for your frontend to talk to this backend"

// Option 1: Allow all origins (for development only!)
const cors = require('cors');
app.use(cors());  // This allows ANY website to call your backend

// Option 2: Allow only your frontend (more secure - use this!)
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000'],
//     credentials: true
// }));

// Middleware to parse JSON
app.use(express.json());

// Import analytics routes
const analyticsRoutes = require('./routes/analyticsRoutes');

// Mount analytics routes at /api/analytics
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`📊 Analytics API available at http://localhost:${PORT}/api/analytics`);
    console.log(`🔗 CORS enabled - frontend can connect`);
});

module.exports = app;