import React, { useState } from 'react';
import { getDoc, increment, updateDoc, setDoc, serverTimestamp, doc } from 'firebase/firestore';
import QRCodeScanner from '../QRCodeScanner';
import { toast } from 'react-toastify';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

const AdminDashboard: React.FC = () => {
    const [orderAmount, setOrderAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [qrCodeToken, setQrCodeToken] = useState<string>('');
    const navigate = useNavigate();

    // Обработчик сканирования QR-кода
    const handleScanQRCode = async (userId: string) => {
        setQrCodeToken(userId);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            // Создаем запись о визите
            await setDoc(doc(db, 'visits', `${userId}_${Date.now()}`), {
                userId: userId,
                timestamp: serverTimestamp(),
            });
            setMessage('Посещение зафиксировано!');
            toast.success('Посещение зафиксировано!');
        } else {
            setMessage('Пользователь не найден.');
            toast.error('Пользователь не найден.');
        }
    };

    // Обработчик создания заказа
    const handleCreateOrder = async () => {
        const userDoc = await getDoc(doc(db, 'users', qrCodeToken));
        if (!userDoc.exists()) {
            setMessage('Пользователь не найден.');
            toast.error('Пользователь не найден.');
            return;
        }

        const visits = userDoc.data()?.visits || 0;
        let cashbackPercentage = 0;

        // Рассчитываем процент кэшбэка в зависимости от количества посещений
        if (visits >= 40) cashbackPercentage = 10;
        else if (visits >= 20) cashbackPercentage = 5;

        const cashbackAmount = (orderAmount * cashbackPercentage) / 100;

        // Обновляем баланс кэшбэка пользователя
        await updateDoc(doc(db, 'users', qrCodeToken), {
            cashback: increment(cashbackAmount),
            visits: increment(1) // Увеличиваем количество посещений
        });

        // Создаем запись о заказе
        await setDoc(doc(db, 'orders', `${qrCodeToken}_${Date.now()}`), {
            userId: qrCodeToken,
            amount: orderAmount,
            cashback: cashbackAmount,
            timestamp: serverTimestamp(),
        });

        setMessage('Заказ создан и кэшбэк начислен!');
        toast.success('Заказ создан и кэшбэк начислен!');
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Вы вышли из системы!');
            navigate('/');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            toast.error('Не удалось выйти из системы.');
        }
    };

    // Navigate to Home Page
    const handleNavigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="admin-dashboard p-4 bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-white">Админский кабинет</h1>
            <QRCodeScanner onScanSuccess={handleScanQRCode} />
            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Сумма заказа"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                />
                <button onClick={handleCreateOrder} className="mt-2 bg-green-500 text-white p-2 rounded">
                    Создать заказ
                </button>
            </div>
            {message && <p className="text-red-500">{message}</p>}
            <div className="mt-4">
                <button
                    onClick={handleLogout}
                    className="mr-2 bg-red-500 text-white p-2 rounded"
                >
                    Выйти из системы
                </button>
                <button
                    onClick={handleNavigateToHome}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    На главную
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
