// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmDiExqFpcWPkZQUwnYOydoEexEKvjVwE",
  authDomain: "villages-website.firebaseapp.com",
  projectId: "villages-website",
  storageBucket: "villages-website.firebasestorage.app", // ✅ fixed
  messagingSenderId: "910590713548",
  appId: "1:910590713548:web:657c6d7f1fba5d1a502c69",
  measurementId: "G-Z2FXK0HF4W"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
