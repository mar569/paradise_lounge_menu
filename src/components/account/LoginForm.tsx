import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onSwitchMode: () => void;
    onPasswordReset: (email: string) => void;
    onLoginSuccess: () => void;
}

const schema = yup.object().shape({
    email: yup.string().email('Неверный формат электронной почты').required('Email обязателен'),
    password: yup.string().required('Пароль обязателен'),
});

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode, onPasswordReset, onLoginSuccess }) => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });
    const emailValue = watch('email');
    const navigate = useNavigate();

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (!userData.emailVerified) {
                    navigate('/not-auth'); // Redirect to NotAuth page if email is not verified
                    return;
                }
                localStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('isAuthenticated', 'true'); // Сохраняем состояние в sessionStorage

                // Проверяем, является ли пользователь администратором
                if (userData.status === 'admin') {
                    navigate('/admin'); // Перенаправляем на админский интерфейс
                } else {
                    navigate('/auth-page-userId'); // Перенаправляем на личный кабинет
                }

                onLoginSuccess(); // Вызываем функцию при успешном входе
            } else {
                alert('Пользователь не найден.');
            }
        } catch (error) {
            alert("Ошибка входа: " + (error as Error).message);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(handleLogin)}
            className="form"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p id="heading">Вход</p>
            <div className="field">
                <input
                    autoComplete="on"
                    placeholder="Email"
                    className="input-field ml-2"
                    type="email"
                    {...register('email')}
                />
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            <div className="field">
                <input
                    placeholder="Пароль"
                    className="input-field ml-2"
                    type="password"
                    {...register('password')}
                />
                {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
            <div className="btn">
                <button className="button_1" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <div className='spinner_auth'></div> : 'Войти'}
                </button>
                <button className="button2" type="button" onClick={onSwitchMode} disabled={isSubmitting}>
                    Зарегистрироваться
                </button>
            </div>
            <button
                className="button3"
                type="button"
                onClick={() => {
                    if (!emailValue) {
                        alert('Пожалуйста, введите email для восстановления пароля');
                        return;
                    }
                    onPasswordReset(emailValue);
                }}
            >
                Забыли пароль?
            </button>
        </motion.form>
    );
};

export default LoginForm;
