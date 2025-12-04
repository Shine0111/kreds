// Firebase configuration for your app
// Replace these values with your Firebase project credentials
// app/config/firebase.ts

import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBQQi6tb5hzWyF-R3unenW7R0xzBKbLRI4",
  authDomain: "kreds-6ce41.firebaseapp.com",
  projectId: "kreds-6ce41",
  storageBucket: "kreds-6ce41.firebasestorage.app",
  messagingSenderId: "819429982974",
  appId: "1:819429982974:android:20e38365d67c55539d1baf",
};
// Note: You can get these values from your Firebase console
// Project Settings → Service Accounts → Copy the config

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics (only on web/supported platforms)
let analytics: Analytics | null = null;

// Check if analytics is supported before initializing
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  } else {
    console.log("Firebase Analytics not supported on this platform");
  }
});

export { analytics };
