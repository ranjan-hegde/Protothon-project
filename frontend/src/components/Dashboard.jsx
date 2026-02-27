import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import MapWidget from './MapWidget';
import { LogOut, RefreshCw, AlertTriangle, CloudRain, Sun, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Default values simulating farmer context
    const [location, setLocation] = useState({ lat: 21.1458, lng: 79.0882 }); // Nagpur
    const [crop, setCrop] = useState('wheat');
    const [addressInput, setAddressInput] = useState('');
    const [geocoding, setGeocoding] = useState(false);

    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get(`/dashboard?lat=${location.lat}&lng=${location.lng}&crop=${crop}`);
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [crop, location.lat, location.lng]);

    const handleAddressSearch = async (e) => {
        e.preventDefault();
        if (!addressInput.trim()) return;

        setGeocoding(true);
        setError('');
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=1`;
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
            } else {
                setError('Address not found. Please try a different location.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to geocode address.');
        } finally {
            setGeocoding(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'upward': return <TrendingUp className="text-green-500 w-5 h-5" />;
            case 'downward': return <TrendingDown className="text-red-500 w-5 h-5" />;
            default: return <Minus className="text-gray-500 w-5 h-5" />;
        }
    };

    // Safe destructuring
    const weather = data?.weather || {};
    const market = data?.market || {};
    const recommendation = data?.recommendation || {};
    const facilities = data?.facilities_within_50km || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-700">Agritech Platform</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 hidden sm:block">
                            {auth.currentUser?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-600 hover:text-red-600 transition"
                        >
                            <LogOut className="w-5 h-5 mr-1" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto flex-1 mr-4">
                        <form onSubmit={handleAddressSearch} className="flex flex-1 max-w-md">
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                placeholder="Enter address (e.g. Pune, Maharashtra)"
                                value={addressInput}
                                onChange={(e) => setAddressInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={geocoding}
                                className="liquid-glass-button text-gray-800 font-semibold py-2.5 px-4 rounded-r-lg transition whitespace-nowrap"
                            >
                                {geocoding ? 'Locating...' : 'Set Address'}
                            </button>
                        </form>

                        <div className="w-full sm:w-48">
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                            >
                                <option value="wheat">Wheat</option>
                                <option value="rice">Rice</option>
                                <option value="soybean">Soybean</option>
                                <option value="cotton">Cotton</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 sm:mt-0 flex items-center liquid-glass-button text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {loading && !data ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gray-200 h-48 rounded-2xl shadow-sm border border-gray-100"></div>
                            <div className="bg-gray-200 h-[400px] rounded-2xl shadow-sm border border-gray-100"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-200 h-40 rounded-2xl shadow-sm border border-gray-100"></div>
                            <div className="bg-gray-200 h-32 rounded-2xl shadow-sm border border-gray-100"></div>
                            <div className="bg-gray-200 h-64 rounded-2xl shadow-sm border border-gray-100"></div>
                        </div>
                    </div>
                ) : (
                    data && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Column - Recommendations and Map */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Recommendation Card */}
                                <div className={`p-6 rounded-2xl shadow-sm border ${recommendation.risk_level === 'High' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">Smart Recommendation</h2>
                                    <p className="text-xl font-medium text-gray-800 mb-4">{recommendation.action}</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                        <div className="bg-white p-3 rounded-xl shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Harvest Window</p>
                                            <p className="font-semibold text-gray-900">{recommendation.harvest_window}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                                            <p className={`font-semibold ${recommendation.risk_level === 'High' ? 'text-red-600' : 'text-green-600'}`}>{recommendation.risk_level}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Risk Variable</p>
                                            <p className="font-semibold text-gray-900">{recommendation.risk_score}%</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">Confidence</p>
                                            <p className="font-semibold text-blue-600">{recommendation.confidence * 100}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Widget */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-bold text-gray-900">Facilities within 50km</h2>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {facilities.length} Found
                                        </span>
                                    </div>
                                    <MapWidget location={location} facilities={facilities} />
                                </div>
                            </div>

                            {/* Sidebar - Weather and Market Price */}
                            <div className="space-y-6">

                                {/* Weather Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        {weather.condition === 'Sunny' ? <Sun className="w-5 h-5 mr-2 text-yellow-500" /> : <CloudRain className="w-5 h-5 mr-2 text-blue-500" />}
                                        Weather Forecast
                                    </h2>
                                    <div className="mb-4">
                                        <p className="text-4xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</p>
                                        <p className="text-sm text-gray-500 capitalize">{weather.description}</p>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Rain Probability</span>
                                            <span className={`font-semibold ${weather.rain_probability > 50 ? 'text-red-500' : 'text-gray-700'}`}>{weather.rain_probability}%</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Humidity</span>
                                            <span className="font-semibold text-gray-700">{Math.round(weather.humidity)}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Market Price Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Mandi Market</h2>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-3xl font-bold text-gray-800">₹{market.avg_price}</p>
                                            <p className="text-sm text-gray-500">average per kg ({market.crop})</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-full">
                                            {getTrendIcon(market.trend)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">Prices are currently trending {market.trend}.</p>
                                </div>

                                {/* Best Facilities List Highlights */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Top Offers Nearby</h2>
                                    {facilities.slice(0, 3).map((fac, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{fac.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{fac.type} {fac.verified ? '✓' : ''}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold text-sm ${fac.offered_price_per_kg > market.avg_price ? 'text-green-600' : 'text-gray-700'}`}>
                                                    ₹{fac.offered_price_per_kg}/kg
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {fac.offered_price_per_kg > market.avg_price ? `+₹${(fac.offered_price_per_kg - market.avg_price).toFixed(2)} premium` : `average rates`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {facilities.length === 0 && <p className="text-sm text-gray-500">No facilities nearby</p>}
                                </div>

                            </div>
                        </div>
                    )
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center">
                    <p className="text-sm text-gray-500">
                        Designed & Developed by{' '}
                        <a
                            href="https://github.com/ranjan-hegde/Protothon-project.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                            Team Fluxo
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
