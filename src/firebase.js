import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsPZsRwk4uFh7r-IN8NCzAca_mxPe67OE",
  authDomain: "anandmobiles-daa8b.firebaseapp.com",
  projectId: "anandmobiles-daa8b",
  storageBucket: "anandmobiles-daa8b.firebasestorage.app",
  messagingSenderId: "403268549781",
  appId: "1:403268549781:web:4aa820dddb7db1fa076f9c",
  measurementId: "G-PQSMJKJFFS",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
