// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxXfF3tIZn4QS8uLD2CMX41i8WFfgrS-o",
  authDomain: "kminh06-topgpt.firebaseapp.com",
  projectId: "kminh06-topgpt",
  storageBucket: "kminh06-topgpt.appspot.com",
  messagingSenderId: "652644592601",
  appId: "1:652644592601:web:e862ceb50f4fd4e74087c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);