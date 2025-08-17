import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { toast } from 'react-toastify'; // Для уведомлений

const NotAuth: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);

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
            await sendEmailVerification(auth.currentUser);
            toast.success('Ссылка для подтверждения email отправлена повторно.');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Требуется подтверждение email</h1>
                <p className="text-gray-700 mb-6">
                    Вы зарегистрированы, но не подтвердили свой email. Пожалуйста, проверьте вашу почту и перейдите по ссылке для подтверждения.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={handleEmailVerification}
                        className={`w-full ${loading || verificationInProgress ? 'bg-gray-400' : 'bg-green-600'} text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors`}
                        disabled={loading || verificationInProgress}
                    >
                        {verificationInProgress ? 'Проверка...' : 'Я подтвердил(а) почту'}
                    </button>
                    <button
                        onClick={handleResendVerification}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Повторно отправить ссылку
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        На главную
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotAuth;



// Для реализации системы кэшбэка и учета посещений в вашем проекте с использованием Firebase, QR-кодов и автоматического начисления кэшбэка, можно следовать следующему подходу. Ниже я опишу основные компоненты и примерную архитектуру, а также примерный алгоритм.

// Общая идея системы
// Генерация уникальных QR-кодов для каждого пользователя

// При регистрации или по запросу пользователь получает уникальный QR-код (например, на основе его UID или случайного токена).
// Этот QR-код сканируется админом при каждом посещении.
// Сканирование QR-кода админом

// Админ сканирует QR-код клиента при входе или заказе.
// В системе фиксируется факт посещения и связывается с заказом.
// Создание заказа и начисление кэшбэка

// После завершения заказа админ вводит сумму заказа в систему.
// На основе суммы начисляется 5% кэшбэка пользователю.
// В базе данных обновляется баланс кэшбэка пользователя.
// Отслеживание истории посещений и заказов

// В базе хранится история посещений, заказов и начисленных кэшбэков.
// Техническая реализация
// 1. Структура базы данных Firebase (Firestore) Генерация QR-кода
// Для каждого пользователя создайте уникальный токен (qrCodeToken), например, UUID.
// Генерируйте на основе этого токена QR-код (используя библиотеки типа qrcode). Обработка сканирования QR-кода админом
// Админ сканирует QR-код, получая qrCodeToken.
// В системе ищется пользователь по этому токену.
// Создается запись о посещении (visit) с текущей датой и временем. Ввод суммы заказа и начисление кэшбэка
// После заказа админ вводит сумму.
// Расчет кэшбэка — 3 , 5 , 10 % от суммы. в зависимости от количества посещений
// Обновление баланса пользователя. Итоговая схема работы
// Пользователь регистрируется и получает уникальный qrCodeToken.
// Админ сканирует QR-код при входе/посещении.
// В системе создается запись о визите.
// После заказа админ вводит сумму заказа.
// Система автоматически начисляет кэшбэк — увеличивая баланс пользователя.
// Пользователь может видеть свой баланс в личном кабинете.
// Что еще важно учесть
// Безопасность: храните только безопасные данные; не сохраняйте чувствительные данные в открытом виде.
// Интерфейс администратора: для быстрого сканирования и ввода данных.
// История: ведите историю посещений и начислений для прозрачности.
// Механизм вывода/использования кэшбэка: реализуйте возможность использования накопленных средств внутри системы. Используя мое веб-приложение как можно все это реализовать