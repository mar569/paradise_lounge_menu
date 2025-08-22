import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { motion } from 'framer-motion';
import { PasswordStrengthIndicator } from '../lightswind/PasswordStrengthIndicator';
import { PasswordConfirmationField } from '../lightswind/PasswordConfirmationField';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FirebaseError } from 'firebase/app';

interface RegisterFormProps {
    onSwitchMode: () => void;
    onRegistrationComplete: () => void;
}

// Валидация формы
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
    dateOfBirth: yup.string().required('Дата рождения обязательна'),
});

const generateShortId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

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

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const minDateStr = '1900-01-01';

    const handleRegister = useCallback(async (data: { name: string; email: string; password: string; confirmPassword: string; dateOfBirth: string }) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await sendEmailVerification(userCredential.user);

            const userIdCode = generateShortId();

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                id: userCredential.user.uid,
                userId: userIdCode,
                name: data.name,
                email: data.email,
                dateOfBirth: data.dateOfBirth,
                createdAt: serverTimestamp(),
                status: 'pending',
                emailVerified: false,
                cashback: 200,
                visits: 0,
                orderAmount: 0
            });

            toast.success(`Регистрация успешна! Ваш ID: ${userIdCode}. Проверьте почту для подтверждения email`, {
                autoClose: 5000,
            });

            onRegistrationComplete();

        } catch (error) {
            const firebaseError = error as FirebaseError;
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

                {/* Обработка ошибок формы */}
                {errors.root && (
                    <div className="text-red-600 text-center mb-4">
                        {errors.root.message}
                    </div>
                )}

                {/* Имя */}
                <div className="field">
                    <input
                        autoComplete='off'
                        type="text"
                        placeholder="Имя"
                        className="w-full px-[12px] py-[2px] input-field "
                        {...register('name')}
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                </div>

                {/* Дата рождения с ограничениями */}
                <div className="field">
                    <input
                        type="date"
                        placeholder="Дата рождения"
                        className="w-full px-[12px] py-[2px] input-field"
                        {...register('dateOfBirth')}
                        min={minDateStr}
                        max={maxDateStr}
                    />
                    {errors.dateOfBirth && <p className="text-red-600 text-sm">{errors.dateOfBirth.message}</p>}
                </div>

                {/* Email */}
                <div className="field">
                    <input
                        autoComplete='off'
                        type="email"
                        placeholder="Email"
                        className="w-full px-[12px] py-[2px] input-field "
                        {...register('email')}
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                </div>

                {/* Пароль */}
                <div className="field">
                    <PasswordStrengthIndicator
                        value={password || ''}
                        onChange={(value) => setValue('password', value)}
                        showScore={true}
                        showVisibilityToggle={true}
                        className='input-field'
                    />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                </div>

                {/* Подтверждение пароля */}
                <div className="field">
                    <PasswordConfirmationField
                        value={watch('confirmPassword') || ''}
                        onChange={(value) => setValue('confirmPassword', value)}
                        showVisibilityToggle={true}
                        className='input-field'
                    />
                    {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
                </div>

                {/* Кнопка регистрации */}
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

                {/* Переключение на вход */}
                <button
                    type="button"
                    onClick={onSwitchMode}
                    disabled={isLoading}
                    className="w-full py-2 px-4 text-[#b9dfd8] rounded-md hover:underline disabled:opacity-50 cursor-pointer"
                >
                    Есть аккаунт? <span style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>Войти</span>
                </button>
            </motion.form>
        </>
    );
};

export default RegisterForm;

