
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration, with explicit values.
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "civiclens-bexm4",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:873086332859:web:8856f2a6ffa3f493ff5e9e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "civiclens-bexm4.appspot.com",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAanUGeE4WzPNUCfx9d_KSM4vt5cZdStJg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "civiclens-bexm4.firebaseapp.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "873086332859",
};

// This function can be called from anywhere (client-side) to get the app instance.
function getClientApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  const app = initializeApp(firebaseConfig);
  return app;
}

// This function can be called from anywhere (client-side) to get the storage instance.
function getClientStorage(): FirebaseStorage {
    const app = getClientApp();
    return getStorage(app);
}

// Export the functions that provide the initialized services.
// Components should import these functions, not the variables.
export const app = getClientApp();
export const storage = getClientStorage();
export { firebaseConfig };
