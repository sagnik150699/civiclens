
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// By removing storageBucket, the client SDK will auto-discover it.
const firebaseConfig = {
  apiKey: "AIzaSyAanUGeE4WzPNUCfx9d_KSM4vt5cZdStJg",
  authDomain: "civiclens-bexm4.firebaseapp.com",
  projectId: "civiclens-bexm4",
  messagingSenderId: "873086332859",
  appId: "1:873086332859:web:8856f2a6ffa3f493ff5e9e"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

// Guard: log once in dev
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("[Web SDK] Initialized with projectId =", firebaseConfig.projectId);
}


export { app, storage, firebaseConfig };
