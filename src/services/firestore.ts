
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, browserLocalPersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBT5rf5jIvIsSH2tw0I_S7HMjiJD7xkPE",
  authDomain: "clinicflow-mqtu7.firebaseapp.com",
  databaseURL: "https://clinicflow-mqtu7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clinicflow-mqtu7",
  storageBucket: "clinicflow-mqtu7.appspot.com",
  messagingSenderId: "917305168918",
  appId: "1:917305168918:web:4190e91e303581e8a9d137"
};

// Singleton pattern to initialize Firebase app
const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

const app: FirebaseApp = getFirebaseApp();

// Initialize Auth separately to handle persistence
// This prevents "auth/invalid-user-token" on SSR or page refresh
let auth: Auth;
if (typeof window !== 'undefined') {
    auth = initializeAuth(app, {
        persistence: browserLocalPersistence
    });
} else {
    auth = getAuth(app);
}

const db: Firestore = getFirestore(app);

export { app, auth, db };
