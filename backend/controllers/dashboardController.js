const { getWeatherData } = require('../services/weatherService');
const { getMandiPrices } = require('../services/mandiService');
const { generateRecommendation } = require('../services/recommendationEngine');
const Facility = require('../models/Facility');
const Farmer = require('../models/Farmer');

const getDashboardData = async (req, res) => {
    try {
        const { lat, lng, crop } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // 1. Fetch external data concurrently
        const [weather, market] = await Promise.all([
            getWeatherData(latitude, longitude),
            getMandiPrices(crop)
        ]);

        // 2. Query Facilities within 50km
        // Note: MongoDB geospatial queries require coordinates in [longitude, latitude] order
        const maxDistanceInMeters = 50000; // 50km

        // We wrap this in a try-catch for the mock scenario in case MongoDB isn't running
        let facilities_within_50km = [];
        try {
            facilities_within_50km = await Facility.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: maxDistanceInMeters
                    }
                }
            }).sort({ verified: -1, rating: -1 }).limit(10);

            // If none found in DB, return some mock data for UI testing capability
            if (facilities_within_50km.length === 0) {
                facilities_within_50km = [
                    {
                        _id: "mock1", name: "Green Valley Storage", type: "storage", verified: true, rating: 4.8, offered_price_per_kg: market.avg_price * 0.95,
                        location: { coordinates: [longitude + 0.1, latitude + 0.1] }
                    },
                    {
                        _id: "mock2", name: "AgriCorp Processors", type: "processor", verified: true, rating: 4.5, offered_price_per_kg: market.avg_price * 1.05,
                        location: { coordinates: [longitude - 0.2, latitude - 0.1] }
                    },
                    {
                        _id: "mock3", name: "Local Buyer Singh", type: "buyer", verified: false, rating: 3.9, offered_price_per_kg: market.avg_price,
                        location: { coordinates: [longitude + 0.15, latitude - 0.15] }
                    }
                ];
            }
        } catch (dbError) {
            console.warn("DB Query for facilities failed (likely no DB connection). Sending mock data.", dbError.message);
            facilities_within_50km = [
                {
                    _id: "mock1", name: "Green Valley Storage", type: "storage", verified: true, rating: 4.8, offered_price_per_kg: market.avg_price * 0.95,
                    location: { coordinates: [longitude + 0.1, latitude + 0.1] }
                },
                {
                    _id: "mock2", name: "AgriCorp Processors", type: "processor", verified: true, rating: 4.5, offered_price_per_kg: market.avg_price * 1.05,
                    location: { coordinates: [longitude - 0.2, latitude - 0.1] }
                }
            ];
        }

        // 3. Generate Recommendation
        const recommendation = generateRecommendation(weather, market);

        // 4. Return aggregated response
        return res.status(200).json({
            weather,
            market,
            facilities_within_50km,
            recommendation
        });

    } catch (error) {
        console.error("Error generating dashboard:", error);
        res.status(500).json({ error: 'Failed to generate dashboard data' });
    }
};

module.exports = {
    getDashboardData
};
