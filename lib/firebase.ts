import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApVSU5Tw6WZtS1WDK-PjbUrM8VzoLfdW8",
  authDomain: "mentorai-8d445.firebaseapp.com",
  projectId: "mentorai-8d445",
  storageBucket: "mentorai-8d445.firebasestorage.app",
  messagingSenderId: "304841231236",
  appId: "1:304841231236:web:008cb5fa53e4bdf6d3abd1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);