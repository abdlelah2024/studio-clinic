
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
    try {
        enableIndexedDbPersistence(db)
            .then(() => console.log("Firestore persistence enabled."))
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Firestore persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.');
                } else if (err.code == 'unimplemented') {
                    console.warn('Firestore persistence failed: Browser does not support persistence.');
                }
            });
    } catch (error) {
        console.error("Error enabling Firestore persistence:", error);
    }
}


export { db };
