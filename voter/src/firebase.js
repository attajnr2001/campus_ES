// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBEg_ag9_untNdsqQz2PYRccww1bzExeFY",
  authDomain: "campuses-aa49d.firebaseapp.com",
  projectId: "campuses-aa49d",
  storageBucket: "campuses-aa49d.appspot.com",
  messagingSenderId: "405851956514",
  appId: "1:405851956514:web:7f91ac842023a09832317b",
  measurementId: "G-JC80B990K6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
const analytics = getAnalytics(app);
