import axios from 'axios';
import { auth } from '../firebase';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach Firebase ID Token
apiClient.interceptors.request.use(
    async (config) => {
        if (auth.currentUser) {
            try {
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error("Failed to get Firebase token attached:", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
