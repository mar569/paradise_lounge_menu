import React from 'react';
import { motion } from 'framer-motion';

interface User {
    userId: string;
    name: string;
    email: string;
    cashback: number;
    visits: number;
    totalSpent: number;
    status: 'admin' | 'active' | 'inactive' | 'pending';
}

interface UserInfoProps {
    user: User | null;
}

const UserInfo: React.FC<UserInfoProps> = React.memo(({ user }) => {
    if (!user) return null;

    // Функция для расчета процента кэшбека
    const calculateCashbackPercentage = (visits: number, totalSpent: number): number => {
        if (visits < 4) return 0;
        if (visits >= 50 && totalSpent > 50000) return 10;
        if (visits >= 20 && totalSpent > 20000) return 5;
        if (visits >= 4 && totalSpent > 4000) return 3;
        return 0;
    };

    const cashbackPercentage = calculateCashbackPercentage(user.visits, user.totalSpent);

    return (
        <motion.div
            className="bg-transparent border-2 border-[#87679b] p-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
        >
            <h3 className="text-lg font-semibold text-white mb-2">Информация о пользователе</h3>
            <div className="flex flex-col gap-2 text-gray-300">
                <p><span className="font-medium">ID:</span> {user.userId}</p>
                <p><span className="font-medium">Имя:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Баланс:</span> {user.cashback}₽</p>
                <p><span className="font-medium">Посещений:</span> {user.visits}</p>
                <p><span className="font-medium">Текущий кэшбек:</span> {cashbackPercentage}%</p>
                <div><span className="font-medium">Статус:</span>
                    <span className={`px-2 py-1 rounded text-xs ml-2 ${user.status === 'admin' ? 'bg-purple-600' :
                        user.status === 'active' ? 'bg-green-600' :
                            user.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                        {user.status}
                    </span>
                </div>
            </div>
        </motion.div>
    );
});

export default UserInfo;
