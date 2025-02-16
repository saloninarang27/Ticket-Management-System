// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore } from "firebase/firestore"; // Firestore
import { getStorage } from "firebase/storage"; // Storage

const firebaseConfig = {
  apiKey: "AIzaSyA8HKeYgPodZoKtZyRvMea-Fg21V35OPck",
  authDomain: "ticketmanagementsystem-b0fbc.firebaseapp.com",
  projectId: "ticketmanagementsystem-b0fbc",
  storageBucket: "ticketmanagementsystem-b0fbc.firebasestorage.app",
  messagingSenderId: "892517880358",
  appId: "1:892517880358:web:5a75d7385334d339d60ce7",
  measurementId: "G-VL0BMQGBKY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, db, storage };
