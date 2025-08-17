import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import LoginForm from '../components/account/LoginForm';
import RegisterForm from '../components/account/RegisterForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Защита от XSS
import { toast } from 'react-toastify'; // Для уведомлений

const Profile: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/auth-page');
        }
    }, [user, navigate]);

    const handlePasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success(`Ссылка для сброса пароля отправлена на ${DOMPurify.sanitize(email)}`);
        } catch (err) {
            toast.error(`Ошибка: ${(err as Error).message}`);
        }
    };

    const handleLoginSuccess = () => {
        sessionStorage.setItem('isAuthenticated', 'true'); // Хранение токена в sessionStorage
        navigate('/auth-page');
    };

    const handleRegistrationComplete = () => {
        setIsLoginMode(true);
        toast.success('Регистрация успешна! Проверьте email для подтверждения.');
    };

    if (loading) {
        return <div className="spinner">Загрузка...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {isLoginMode ? (
                    <LoginForm
                        onSwitchMode={() => setIsLoginMode(false)}
                        onPasswordReset={handlePasswordReset}
                        onLoginSuccess={handleLoginSuccess}
                    />
                ) : (
                    <RegisterForm
                        onSwitchMode={() => setIsLoginMode(true)}
                        onRegistrationComplete={handleRegistrationComplete}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default Profile;
