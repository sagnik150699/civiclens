
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration, with explicit values.
const firebaseConfig = {
  projectId: "your-project-id", // Replace with your Project ID
  appId: "your-app-id", // Replace with your App ID
  storageBucket: "your-project-id.appspot.com", // Replace with your Storage Bucket
  apiKey: "your-api-key", // Replace with your API Key
  authDomain: "your-project-id.firebaseapp.com", // Replace with your Auth Domain
  messagingSenderId: "your-sender-id", // Replace with your Sender ID
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
