import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// Firebase configuration - matches backend Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDC3zq4BUk6qt6mq7GDpjLg9fRVNSAaZPM",
  authDomain: "elacare-d3556.firebaseapp.com",
  projectId: "elacare-d3556",
  storageBucket: "elacare-d3556.firebasestorage.app",
  messagingSenderId: "120325186454",
  appId: "1:120325186454:web:170368631c0292322373b7",
  measurementId: "G-SEGZC1P4E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
};
