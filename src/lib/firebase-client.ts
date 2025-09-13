
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAanUGeE4WzPNUCfx9d_KSM4vt5cZdStJg",
  authDomain: "civiclens-bexm4.firebaseapp.com",
  projectId: "civiclens-bexm4",
  storageBucket: "civiclens-bexm4.appspot.com", // Correct bucket name
  messagingSenderId: "873086332859",
  appId: "1:873086332859:web:8856f2a6ffa3f493ff5e9e"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = app ? null : null; // This is not used, but kept to avoid breaking imports if any
const storage = getStorage(app);

export { app, db, storage, firebaseConfig };

