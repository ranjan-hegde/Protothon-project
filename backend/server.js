const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();
const compression = require('compression');

// Middleware
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Basic Route for testing
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agritech_local_dev')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error. Ensure MongoDB is running or connection string is valid.');
        console.error(err);
        // Even if DB fails to connect initially, start the server so health checks pass
        app.listen(PORT, () => console.log(`Server running on port ${PORT} (without DB)`));
    });
