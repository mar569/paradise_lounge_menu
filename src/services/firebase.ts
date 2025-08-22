import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyATaMjs5PJvToPKJWhahjWw7WfNxLiKufk',
  authDomain: 'paradise-lounge-4a4b7.firebaseapp.com',
  projectId: 'paradise-lounge-4a4b7',
  storageBucket: 'paradise-lounge-4a4b7.firebasestorage.app',
  messagingSenderId: '230931035852',
  appId: '1:230931035852:web:d7150509402eb6a4a17469',
  measurementId: 'G-L9W6H4GJD2',
};

const app = initializeApp(firebaseConfig);

// Инициализация сервисов
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  doc,
  setDoc,
  serverTimestamp,
};
