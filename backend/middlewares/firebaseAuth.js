const admin = require('firebase-admin');

// Initialize Firebase Admin (Note: this requires a valid service account JSON)
let serviceAccount = {
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
}
if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.warn("Firebase Admin service account not fully configured. Auth middleware will run in MOCK mode.");
}

/**
 * Express middleware to verify the Firebase ID token in the Authorization header.
 * 
 * For development/hackathon purposes where Firebase keys might not be setup yet,
 * it will mock successful authentication if no keys are provided, allowing UI dev to proceed.
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // If we have the real config initialized, verify it via Admin SDK
        if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            return next();
        }

        // MOCK MODE fallback
        console.warn("Using Firebase Auth MOCK Mode");
        req.user = { uid: "mock-user-123", email: "mock@example.com" };
        return next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyToken;
