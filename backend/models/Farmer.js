const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    crops: [{
        type: String
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for geospatial queries
FarmerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farmer', FarmerSchema);
