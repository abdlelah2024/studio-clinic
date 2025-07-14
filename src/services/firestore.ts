
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBT5rf5jIvIsSH2tw0I_S7HMjiJD7xkPE",
  authDomain: "clinicflow-mqtu7.firebaseapp.com",
  databaseURL: "https://clinicflow-mqtu7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clinicflow-mqtu7",
  storageBucket: "clinicflow-mqtu7.appspot.com",
  messagingSenderId: "917305168918",
  appId: "1:917305168918:web:4190e91e303581e8a9d137"
};


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined' && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error", error);
  }
} else if (typeof window !== 'undefined') {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

// Ensure instances are exported for server-side rendering or other environments
// This part is tricky without a full SSR setup, but it's a safeguard.
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);


export { app, auth, db };
