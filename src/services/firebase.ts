// Импортируйте необходимые функции из SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Конфигурация вашего веб-приложения Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyATaMjs5PJvToPKJWhahjWw7WfNxLiKufk',
  authDomain: 'paradise-lounge-4a4b7.firebaseapp.com',
  projectId: 'paradise-lounge-4a4b7',
  storageBucket: 'paradise-lounge-4a4b7.firebasestorage.app',
  messagingSenderId: '230931035852',
  appId: '1:230931035852:web:d7150509402eb6a4a17469',
  measurementId: 'G-L9W6H4GJD2',
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Инициализация аутентификации
const db = getFirestore(app); // Инициализация Firestore
const storage = getStorage(app); // Инициализация Storage

// Инициализация App Check с использованием reCAPTCHA v3
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LfQW6YrAAAAABWBiuXL2r3XSXyavCoyZaSyS100'), // Замените на ваш ключ сайта
  isTokenAutoRefreshEnabled: true, // Автоматическое обновление токена
});

// Экспортируем auth, db, storage и appCheck
export { auth, db, storage, appCheck };
