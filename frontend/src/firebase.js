// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "property-management-2fd26.firebaseapp.com",
  projectId: "property-management-2fd26",
  storageBucket: "property-management-2fd26.appspot.com",
  messagingSenderId: "964557915564",
  appId: "1:964557915564:web:951550aff0aaf3f3f66609",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
