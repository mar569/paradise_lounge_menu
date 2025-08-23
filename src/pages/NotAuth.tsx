import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { toast } from 'react-toastify'; // Для уведомлений
import { FirebaseError } from 'firebase/app';
import { motion } from 'framer-motion'; // Импортируем framer-motion

const NotAuth: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
    const [resendDisabled, setResendDisabled] = useState<boolean>(false);

    const handleEmailVerification = async () => {
        if (auth.currentUser) {
            setLoading(true);
            setVerificationInProgress(true);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация задержки в 2 секунды
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                navigate('/auth-page');
            } else {
                toast.error('Email все еще не подтвержден. Пожалуйста, проверьте вашу почту.');
            }
            setLoading(false);
            setVerificationInProgress(false);
        }
    };

    const handleResendVerification = async () => {
        if (auth.currentUser) {
            try {
                setResendDisabled(true); // Отключаем кнопку
                await sendEmailVerification(auth.currentUser);
                toast.success('Ссылка для подтверждения email отправлена повторно.');

                // Устанавливаем таймер для повторного включения кнопки
                setTimeout(() => {
                    setResendDisabled(false);
                }, 30000); // 30 секунд ожидания
            } catch (error) {
                console.error('Ошибка отправки подтверждения:', error);
                // Проверка, является ли ошибка экземпляром FirebaseError
                if (error instanceof FirebaseError) {
                    if (error.code === 'auth/too-many-requests') {
                        toast.error('Слишком много запросов. Пожалуйста, подождите перед повторной отправкой.');
                    } else {
                        toast.error('Не удалось отправить ссылку для подтверждения: ' + error.message);
                    }
                } else {
                    toast.error('Неизвестная ошибка при отправке подтверждения.');
                }
            } finally {
                // Убедитесь, что кнопка будет отключена на 30 секунд
                setTimeout(() => {
                    setResendDisabled(false);
                }, 30000); // 30 секунд ожидания
            }
        }
    };

    return (
        <motion.div
            className="flex flex-col justify-center items-center min-h-screen p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="bg-transparent border-1 border-[#05885f] p-8 rounded-xl shadow-md text-center max-w-md">
                <h4 className="text-2xl font-bold text-[#f52b2bc4] mb-4">Требуется подтверждение почты</h4>
                <p className="text-[#ffffff] mb-6">
                    Проверьте вашу почту и перейдите по ссылке для подтверждения. Если вы не получили письмо, убедитесь, что оно не попало в папку «Спам».
                </p>
                <div className="space-y-3">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleEmailVerification}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleEmailVerification();
                            }
                        }}
                        aria-disabled={loading || verificationInProgress}
                        className={`w-full cursor-pointer ${loading || verificationInProgress
                            ? 'bg-transparent border border-[#05885f] cursor-not-allowed opacity-50'
                            : 'bg-[#016246]'
                            } border border-[#b1b2b1] text-white py-2 px-4 rounded-md transition-colors hover:bg-green-700 focus:outline-none`}
                    >
                        {verificationInProgress ? (
                            <div className="spinner_auth mx-auto"></div>
                        ) : (
                            'Я подтвердил(а) почту'
                        )}
                    </div>

                    {/* Повторная отправка ссылки */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleResendVerification}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleResendVerification();
                            }
                        }}
                        aria-disabled={resendDisabled}
                        className={`w-full cursor-pointer ${resendDisabled ? 'bg-[#016246] cursor-not-allowed' : 'bg-[#015a7c]'
                            } border border-[#b1b2b1] text-white py-2 px-4 rounded-md transition-colors hover:bg-blue-700 focus:outline-none`}
                    >
                        Повторно отправить ссылку
                    </div>


                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate('/')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                navigate('/');
                            }
                        }}
                        className="w-full cursor-pointer bg-[#017c65] border border-[#b1b2b1] text-white py-2 px-4 rounded-md transition-colors hover:bg-gray-300 focus:outline-none"
                    >
                        На главную
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NotAuth;
// MNGFL9WX