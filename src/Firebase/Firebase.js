import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAIQ0AJbvaWehQe1MmmSct53cCqbC6DJ40",
  authDomain: "emergehome-4f0c7.firebaseapp.com",
  projectId: "emergehome-4f0c7",
  storageBucket: "emergehome-4f0c7.firebasestorage.app",
  messagingSenderId: "532489831975",
  appId: "1:532489831975:web:2ad65bfae2c5aba9957002",
  databaseURL: "https://emergehome-4f0c7-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app;