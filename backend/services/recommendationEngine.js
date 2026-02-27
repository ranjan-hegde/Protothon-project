/**
 * Rule-Based Recommendation Engine
 */

const generateRecommendation = (weather, market) => {
    let risk_level = "Low";
    let confidence = 0.9;
    let harvest_window = "Flexible";
    let action = "No immediate action required";

    const { rain_probability } = weather;
    const { trend: price_trend } = market;

    // Rule 1: High rain risk
    if (rain_probability > 60) {
        risk_level = "High";
        confidence = 0.85;
        harvest_window = "ASAP (Within 24 hours)";
        action = "Recommend early harvest to avoid crop damage due to impending rain.";
    }
    // Rule 2: Good price trend and low risk
    else if (price_trend === "upward" && rain_probability < 30) {
        risk_level = "Low";
        confidence = 0.8;
        harvest_window = "Wait (3-5 days)";
        action = "Prices are trending upward. Weather is clear. Wait for better margins.";
    }
    // Rule 3: Declining prices
    else if (price_trend === "downward") {
        risk_level = "Medium";
        confidence = 0.75;
        harvest_window = "Soon (1-3 days)";
        action = "Prices are dropping. Harvest soon to secure current rates.";
    }

    // Calculate generic risk score 0-100
    let risk_score = rain_probability;
    if (price_trend === "downward") risk_score += 20;
    if (risk_score > 100) risk_score = 100;

    return {
        harvest_window,
        risk_level,
        risk_score,
        action,
        confidence
    };
};

module.exports = {
    generateRecommendation
};
