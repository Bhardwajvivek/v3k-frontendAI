// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4km8HN_r3VVjkGjA_sKlSj-mDZI33el4",
  authDomain: "v3k-ai.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "v3k-ai.firebasestorage.app",
  messagingSenderId: "630320762373",
  appId: "1:630320762373:web:1ccf7e05049821dc4c966c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const logTradeSignal = async (signal) => {
  try {
    const docRef = await addDoc(collection(db, "v3k_signals"), {
      ...signal,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Trade logged to Firebase:", signal.symbol);
  } catch (e) {
    console.error("❌ Firebase log error:", e);
  }
};
