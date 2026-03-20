import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqeIsMnusT6FQtAxb8Blgp7HbHaCpfRhI",
    authDomain: "pawsafe-2f9f4.firebaseapp.com",
    projectId: "pawsafe-2f9f4",
    storageBucket: "pawsafe-2f9f4.firebasestorage.app",
    messagingSenderId: "35034959321",
    appId: "1:35034959321:web:188e04ce09bebdf24e5dc8",
    measurementId: "G-RNYFR7ETG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if not on localhost to avoid cookie domain errors
let analytics;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
