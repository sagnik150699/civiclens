
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration, with explicit values.
const firebaseConfig = {
  apiKey: "AIzaSyAanUGeE4WzPNUCfx9d_KSM4vt5cZdStJg",
  authDomain: "civiclens-bexm4.firebaseapp.com",
  projectId: "civiclens-bexm4",
  storageBucket: "civiclens-bexm4.firebasestorage.app", 
  messagingSenderId: "873086332859",
  appId: "1:873086332859:web:8856f2a6ffa3f493ff5e9e"
};

let app: FirebaseApp;
let storage: FirebaseStorage;

// Initialize Firebase only on the client side
if (typeof window !== "undefined") {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  storage = getStorage(app);

  // Guard: log once in dev
  if (process.env.NODE_ENV === "development") {
    console.log("[Web SDK] Initialized with explicit projectId:", firebaseConfig.projectId, "and storageBucket:", firebaseConfig.storageBucket);
  }
}

// Export the initialized services
export { app, storage, firebaseConfig };
