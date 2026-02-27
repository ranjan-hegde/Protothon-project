/**
 * Mock Mandi Price Service
 * In a real app, this would poll government/agritech mandi APIs.
 */

const getMandiPrices = async (crop) => {

    const basePrices = {
        'wheat': 25,
        'rice': 40,
        'corn': 20,
        'soybean': 50,
        'cotton': 80
    };

    const cropKey = crop ? crop.toLowerCase() : 'wheat';
    const avg_price = basePrices[cropKey] || 30;

    // Randomize trend
    const trends = ["upward", "downward", "stable"];
    const trend = trends[Math.floor(Math.random() * trends.length)];

    return {
        crop: cropKey,
        avg_price,
        trend,
        historical: [
            { date: '7 days ago', price: trend === 'upward' ? avg_price * 0.9 : avg_price * 1.1 },
            { date: '3 days ago', price: trend === 'upward' ? avg_price * 0.95 : avg_price * 1.05 },
            { date: 'today', price: avg_price }
        ]
    };
};

module.exports = {
    getMandiPrices
};
