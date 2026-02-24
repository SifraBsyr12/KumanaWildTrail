import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYyl6SaMzNKPafdj-KgW__kCkjxSY9akA",
  authDomain: "wild-trails-safari.firebaseapp.com",
  projectId: "wild-trails-safari",
  storageBucket: "wild-trails-safari.firebasestorage.app",
  messagingSenderId: "298549071871",
  appId: "1:298549071871:web:50de4dd79be08ee39221ca",
  measurementId: "G-1PC0VL11EB"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
