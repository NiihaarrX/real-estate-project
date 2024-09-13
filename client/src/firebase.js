// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-912b8.firebaseapp.com",
  projectId: "real-estate-912b8",
  storageBucket: "real-estate-912b8.appspot.com",
  messagingSenderId: "598270810026",
  appId: "1:598270810026:web:70b11a3d4629382b15bdd3"
};

export const app = initializeApp(firebaseConfig);