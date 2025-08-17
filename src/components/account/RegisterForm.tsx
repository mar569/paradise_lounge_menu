import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { generateQRCode } from '../../utils/generateQRCode';
import { motion } from 'framer-motion';
import { PasswordStrengthIndicator } from '../lightswind/PasswordStrengthIndicator';
import { PasswordConfirmationField } from '../lightswind/PasswordConfirmationField';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { FirebaseError } from 'firebase/app';

interface RegisterFormProps {
    onSwitchMode: () => void;
    onRegistrationComplete: () => void; // Добавляем пропс
}

const schema = yup.object().shape({
    name: yup.string().required('Имя обязательно'),
    email: yup.string().email('Некорректный email').required('Email обязателен'),
    password: yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .matches(/[a-z]/, 'Должна быть строчная буква')
        .matches(/[A-Z]/, 'Должна быть заглавная буква')
        .matches(/[0-9]/, 'Должна быть цифра')
        .required('Пароль обязателен'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), undefined], 'Пароли должны совпадать')
        .required('Подтвердите пароль'),
    isAdmin: yup.boolean().default(false), // Устанавливаем значение по умолчанию
});

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchMode, onRegistrationComplete }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const password = watch('password');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = useCallback(async (data: { name: string; email: string; password: string; confirmPassword: string; isAdmin: boolean }) => {
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await sendEmailVerification(userCredential.user);

            // Генерация QR-кода
            const qrCode = await generateQRCode(userCredential.user.uid);

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                id: userCredential.user.uid,
                name: data.name,
                email: data.email,
                createdAt: serverTimestamp(),
                status: data.isAdmin ? 'admin' : 'pending', // Устанавливаем статус в зависимости от isAdmin
                emailVerified: false,
                qrCode: qrCode,
                cashback: 200,
                visits: 0,
                orderAmount: 0
            });

            toast.success('Регистрация успешна! Проверьте почту для подтверждения email', {
                autoClose: 5000,
            });

            // Вызов функции при успешной регистрации
            onRegistrationComplete();

        } catch (error) {
            const firebaseError = error as FirebaseError; // Приведение типа к FirebaseError
            if (firebaseError.code === 'auth/email-already-in-use') {
                setError('email', { message: 'Email уже используется' });
            } else if (firebaseError.code === 'auth/weak-password') {
                setError('password', { message: 'Пароль слишком простой' });
            } else {
                toast.error(`Ошибка регистрации: ${firebaseError.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [setError, onRegistrationComplete]);

    return (
        <>
            <ToastContainer position="top-center" />
            <motion.form
                onSubmit={handleSubmit(handleRegister)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="form"
            >
                <p id="heading">Регистрация</p>

                {errors.root && (
                    <div className="text-red-600 text-center mb-4">
                        {errors.root.message}
                    </div>
                )}

                <div className="field">
                    <input
                        type="text"
                        placeholder="Имя"
                        className="w-full px-4 py-2"
                        {...register('name')}
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                </div>

                <div className="field">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2"
                        {...register('email')}
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                </div>

                <div className="field">
                    <PasswordStrengthIndicator
                        value={password || ''}
                        onChange={(value) => setValue('password', value)}
                        showScore={true}
                        showVisibilityToggle={true}
                    />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                </div>

                <div className="field">
                    <PasswordConfirmationField
                        value={watch('confirmPassword') || ''}
                        onChange={(value) => setValue('confirmPassword', value)}
                        showVisibilityToggle={true}
                    />
                    {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
                </div>

                <div className="field">
                    <label>
                        <input type="checkbox" {...register('isAdmin')} />
                        Я администратор
                    </label>
                </div>

                <div className='btn'>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="button_1"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Регистрация...
                            </>
                        ) : (
                            'Зарегистрироваться'
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onSwitchMode}
                    disabled={isLoading}
                    className="w-full py-2 px-4 text-blue-600 rounded-md hover:underline disabled:opacity-50"
                >
                    Уже есть аккаунт? Войти
                </button>
            </motion.form>
        </>
    );
};

export default RegisterForm;






// // components/account/RegisterForm.tsx
// import React, { useState, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from '../../services/firebase';
// import { generateQRCode } from '../../utils/generateQRCode'; // Импортируем утилиту
// import { motion } from 'framer-motion';
// import { PasswordConfirmationField } from '../lightswind/PasswordConfirmationField';
// import { PasswordStrengthIndicator } from '../lightswind/PasswordStrengthIndicator';

// const schema = yup.object().shape({
//     name: yup.string().required('Имя обязательно'),
//     email: yup.string().email('Некорректный email').required('Email обязателен'),
//     password: yup.string()
//         .min(8, 'Пароль должен содержать минимум 8 символов')
//         .matches(/[a-z]/, 'Должна быть строчная буква')
//         .matches(/[A-Z]/, 'Должна быть заглавная буква')
//         .matches(/[0-9]/, 'Должна быть цифра')
//         .required('Пароль обязателен'),
//     confirmPassword: yup.string()
//         .oneOf([yup.ref('password'), undefined], 'Пароли должны совпадать')
//         .required('Подтвердите пароль'),
// });

// const RegisterForm: React.FC<{ onSwitchMode: () => void; onRegistrationComplete: () => void; }> = ({ onSwitchMode, onRegistrationComplete }) => {
//     const { register, handleSubmit, formState: { errors, isSubmitting }, setError, watch, setValue } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             name: '',
//             email: '',
//             password: '',
//             confirmPassword: ''
//         }
//     });

//     const password = watch('password');
//     const [message, setMessage] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const handleRegister = useCallback(async (data: { name: string; email: string; password: string }) => {
//         setIsLoading(true);
//         setMessage('');

//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
//             await sendEmailVerification(userCredential.user);

//             // Генерация QR-кода
//             const qrCode = await generateQRCode(userCredential.user.uid);

//             await setDoc(doc(db, 'users', userCredential.user.uid), {
//                 id: userCredential.user.uid,
//                 name: data.name,
//                 email: data.email,
//                 createdAt: serverTimestamp(),
//                 status: 'pending',
//                 emailVerified: false,
//                 qrCode: qrCode, // Сохраняем QR-код
//                 cashback: 0, // Начальный баланс кэшбэка
//                 visits: 0 // Начальное количество посещений
//             });

//             setMessage('Регистрация успешна! Проверьте email для подтверждения.');
//             setTimeout(() => {
//                 onRegistrationComplete(); // Перенаправление на страницу входа
//             }, 3000);
//         } catch (error: any) {
//             const errorCode = error.code;
//             if (errorCode === 'auth/email-already-in-use') {
//                 setError('email', { message: 'Email уже используется' });
//             } else if (errorCode === 'auth/weak-password') {
//                 setError('password', { message: 'Пароль слишком простой' });
//             } else {
//                 setError('root', { message: `Ошибка регистрации: ${error.message}` });
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     }, [setError, onRegistrationComplete]);




//     return (
//         <motion.form
//             onSubmit={handleSubmit(handleRegister)}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="form"
//         >
//             <p id="heading">Регистрация</p>

//             {errors.root && (
//                 <div className="text-red-600 text-center mb-4">
//                     {errors.root.message}
//                 </div>
//             )}

//             <div className="field">
//                 <input
//                     type="text"
//                     placeholder="Имя"
//                     className="w-full px-4 py-2"
//                     {...register('name')}
//                 />
//                 {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
//             </div>

//             <div className="field">
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     className="w-full px-4 py-2"
//                     {...register('email')}
//                 />
//                 {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
//             </div>

//             <div className="field">
//                 <PasswordStrengthIndicator
//                     value={password || ''}
//                     onChange={(value) => setValue('password', value)}
//                     showScore={true}
//                     showVisibilityToggle={true}
//                 />
//                 {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
//             </div>

//             <div className="field">
//                 <PasswordConfirmationField
//                     value={watch('confirmPassword') || ''}
//                     onChange={(value) => setValue('confirmPassword', value)}
//                     showVisibilityToggle={true}
//                 />
//                 {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
//             </div>

//             <div className='btn'>
//                 <button
//                     type="submit"
//                     disabled={isSubmitting || isLoading}
//                     className="button_1"
//                 >
//                     {isLoading ? (
//                         <span className="flex items-center justify-center">
//                             <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                             Регистрация...
//                         </span>
//                     ) : (
//                         'Зарегистрироваться'
//                     )}
//                 </button>
//             </div>

//             <button
//                 type="button"
//                 onClick={onSwitchMode}
//                 disabled={isLoading}
//                 className="w-full py-2 px-4 text-blue-600 rounded-md hover:underline disabled:opacity-50"
//             >
//                 Уже есть аккаунт? Войти
//             </button>

//             {message && (
//                 <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
//                 >
//                     <p className="text-green-600 text-center text-sm">{message}</p>
//                 </motion.div>
//             )}
//         </motion.form>
//     );
// };

// export default RegisterForm;
