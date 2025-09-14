
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration, with explicit values.
const firebaseConfig = {
  apiKey: "AIzaSyAanUGeE4WzPNUCfx9d_KSM4vt5cZdStJg",
  authDomain: "civiclens-bexm4.firebaseapp.com",
  projectId: "civiclens-bexm4",
  storageBucket: "civiclens-bexm4.appspot.com", 
  messagingSenderId: "873086332859",
  appId: "1:873086332859:web:8856f2a6ffa3f493ff5e9e"
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
