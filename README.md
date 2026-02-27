# Agritech Recommendation Platform

A full-stack application providing farmers with a comprehensive dashboard recommending harvest timing based on crop type, real-time GPS location within a 50km radius, market price trends, and weather forecasts.

## Tech Stack
* **Frontend**: React (Vite), Tailwind CSS, React Leaflet, Firebase Authentication, React Router
* **Backend**: Node.js, Express, MongoDB Atlas, Redis, Firebase Admin (JWT Verification)

## Features
* **Authentication**: Login/Sign Up via Firebase Email/Password
* **Geo-Spatial Search**: MongoDB `2dsphere` query returning verified facilities matching buyer/storage within a 50km radius of the farmer.
* **Recommendations**: Rule-based engine computing Risk Score and Harvest Window based on probability of rain and market price trends.
* **Dashboard Stats**: Real-time integration (mocked currently) for weather API and Mandi API prices.

---
