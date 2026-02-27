import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const MapWidget = ({ location, facilities }) => {
    const position = location ? [location.lat, location.lng] : [20.5937, 78.9629]; // Default: India

    return (
        <div className="h-96 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <MapContainer center={position} zoom={location ? 10 : 5} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {location && (
                    <>
                        {/* Farmer's Location */}
                        <Marker position={position}>
                            <Popup>
                                <strong>Your Farm</strong>
                            </Popup>
                        </Marker>

                        {/* 50km Radius representation */}
                        <Circle
                            center={position}
                            pathOptions={{ fillColor: 'green', color: 'darkgreen', fillOpacity: 0.1 }}
                            radius={50000} // Radius in meters (50km)
                        />
                    </>
                )}

                {/* Nearby Facilities */}
                {facilities && facilities.map((facility, idx) => {
                    const facLocation = [facility.location.coordinates[1], facility.location.coordinates[0]]; // MongoDB is [lng, lat], Leaflet is [lat, lng]
                    return (
                        <Marker key={facility._id || idx} position={facLocation}>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-gray-800">{facility.name}</h3>
                                    <p className="text-sm text-gray-600 capitalize">{facility.type}</p>
                                    <div className="mt-2 flex justify-between items-center text-sm">
                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                            ₹{facility.offered_price_per_kg}/kg
                                        </span>
                                        {facility.verified && (
                                            <span className="text-blue-600 text-xs ml-2">✓ Verified</span>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapWidget;
