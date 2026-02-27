/**
 * Mock Weather Service
 * In a real application, this would call an external API like OpenWeatherMap.
 */

const getWeatherData = async (lat, lng) => {

    // Generate a random probability of rain between 0 and 100 for demonstration
    const rain_probability = Math.floor(Math.random() * 100);

    // Decide conditions based on rain probability
    let condition = "Sunny";
    let description = "Clear skies";
    if (rain_probability > 70) {
        condition = "Rainy";
        description = "Heavy rain expected";
    } else if (rain_probability > 30) {
        condition = "Cloudy";
        description = "Partly cloudy with chance of light rain";
    }

    return {
        temperature: 28 + (Math.random() * 5 - 2.5), // around 28C
        humidity: 60 + rain_probability * 0.3, // higher if rain
        rain_probability,
        condition,
        description,
        forecast: [
            { day: 1, condition: rain_probability > 60 ? 'Rainy' : 'Sunny', temp: 28 },
            { day: 2, condition: rain_probability > 50 ? 'Rainy' : 'Cloudy', temp: 27 },
            { day: 3, condition: 'Sunny', temp: 29 },
        ]
    };
};

module.exports = {
    getWeatherData
};
