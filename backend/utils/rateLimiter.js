const rateLimit = require('express-rate-limit');

// Rate limiting for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

// A simple mock for Redis caching mechanism 
// In a real app we would use `redis` client here
const cacheMiddleware = (durationInSeconds) => {
    return (req, res, next) => {
        // Basic mock implementation of cache hitting
        // if (redisClient.get(req.originalUrl)) return cached logic...
        console.log(`[Cache setup for ${durationInSeconds}s] Path: ${req.originalUrl}`);
        next();
    }
}

module.exports = {
    apiLimiter,
    cacheMiddleware
};
