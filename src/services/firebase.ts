import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from 'firebase/app-check';

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

// App Check с reCAPTCHA v3
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Lewg64rAAAAALoHsMQt_dj4LAZeroP-9w9vRBTK'), // Замените на ваш ключ сайта
  isTokenAutoRefreshEnabled: false, // Автоматическое обновление токена
});

async function getAppCheckToken() {
  try {
    const token = await getToken(appCheck);
    return token;
  } catch (error) {
    console.error('Error getting App Check token:', error);
    return null;
  }
}

export {
  auth,
  db,
  appCheck,
  getAppCheckToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  doc,
  setDoc,
  serverTimestamp,
};
