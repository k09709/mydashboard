import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC-5JSDHSO8DzF-1Iqg12XwJvU99-LW9bk",
  authDomain: "rw-personal-dashboard.firebaseapp.com",
  projectId: "rw-personal-dashboard",
  storageBucket: "rw-personal-dashboard.firebasestorage.app",
  messagingSenderId: "599311075059",
  appId: "1:599311075059:web:a3e97e611f62361c4a5986"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
