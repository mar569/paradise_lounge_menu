import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

const createAdmin = async () => {
  const email = 'efiminkirill01@mail.ru';
  const password = 'Sovilo27.';
  const role = 'admin';

  try {
    // Создание пользователя
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Добавление администратора в коллекцию
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      status: role,
      createdAt: serverTimestamp(),
      cashback: 0,
      visits: 0,
      totalSpent: 0,
      emailVerified: false,
    });

    console.log(`Администратор ${email} успешно создан!`);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
  }
};

// Вызов функции
createAdmin();
