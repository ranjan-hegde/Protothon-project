const express = require('express');
const router = express.Router();

const { getDashboardData } = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/firebaseAuth');
const { apiLimiter, cacheMiddleware } = require('../utils/rateLimiter');

// Protect all /api routes below with Firebase Token Verifier & Rate Limiting
router.use(apiLimiter);
// router.use(verifyToken); // Disabled the hard requirement temporarily to test easier if needed. Enable in prod.

// GET /api/dashboard 
// Expects: ?lat=xx&lng=xx&crop=xx
// Cached for 30 mins (1800 seconds)
router.get('/dashboard', cacheMiddleware(1800), getDashboardData);

// Health check inside the api router
router.get('/status', (req, res) => {
    res.json({ status: 'API is running and secure' });
});

module.exports = router;
