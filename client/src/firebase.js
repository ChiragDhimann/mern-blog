// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// console.log(import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-44b43.firebaseapp.com",
  projectId: "mern-blog-44b43",
  storageBucket: "mern-blog-44b43.appspot.com",
  messagingSenderId: "1098341537085",
  appId: "1:1098341537085:web:1cd3b878eaaf21ce9ba154"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);