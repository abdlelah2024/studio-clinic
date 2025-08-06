import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";
import { Auth, getAuth, initializeAuth, browserLocalPersistence } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

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

// Initialize App Check for local development
let appCheck: AppCheck | undefined;
if (typeof window !== 'undefined') {
  // Check if running in a local development environment
  if (process.env.NODE_ENV === 'development') {
    // Set the debug token to true to allow local development
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6Ld-pA8qAAAAAK1Y-a43r7y7d5e-E2a4e3a4b5c6'),
      isTokenAutoRefreshEnabled: true
    });
  } else {
    // In production, initialize App Check without the debug token
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6Ld-pA8qAAAAAK1Y-a43r7y7d5e-E2a4e3a4b5c6'),
      isTokenAutoRefreshEnabled: true
    });
  }
}

// Initialize Auth separately to handle persistence
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
