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

## 🚀 Setup & Configuration

### Prerequisites
1. **Node.js** installed locally.
2. **MongoDB Atlas** account (free cluster) or local MongoDB instance.
3. **Firebase** project created (Enable Email/Password sign-in in Firebase Auth).
4. **Redis** installed locally (or running via docker) for API caching.

### 1. Backend Configuration
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Edit or create the `.env` file in the `backend` folder with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agritech?retryWrites=true&w=majority
REDIS_URL=redis://localhost:6379

# Firebase Admin SDK (Generate from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

Start the backend server:
```bash
npm run dev
# OR
node server.js
```

### 2. Frontend Configuration
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` root and add your Firebase Web Client config keys (Get these from Firebase Console -> Project Settings -> General -> Web App):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🔍 Note on Mock Data
The application currently functions out-of-the-box by heavily relying on mock data returned by `weatherService.js` and `mandiService.js`. Furthermore, the Authentication middleware on the backend `middlewares/firebaseAuth.js` and the `dashboardController.js` are currently configured to **swallow errors gracefully and inject mock data** if Firebase/MongoDB keys are not yet provided.
This allows you to test the UI immediately. When you connect real SDKs, remove the fallback conditionals.
