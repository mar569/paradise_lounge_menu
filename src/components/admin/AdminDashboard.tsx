import React, { useEffect, useState, useCallback } from 'react';
import { doc, increment, updateDoc, collection, query, where, getDocs, addDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import CashbackManagement from './CashbackManagement';
import VisitManagement from './VisitManagement';
import LogoutButton from './LogoutButton';
import { ArrowLeft } from 'lucide-react';
import UserSearch from './UserSearch';


interface User {
    id: string;
    userId: string;
    name: string;
    email: string;
    cashback: number;
    visits: number;
    status: 'admin' | 'active' | 'inactive' | 'pending';
    totalSpent: number;
}

interface VisitData {
    id: string;
    userId: string;
    timestamp: { seconds: number };
    cashback: number;
    orderAmount: number;
    cafeName: string;
}

const AdminDashboard: React.FC = () => {
    const [orderAmount, setOrderAmount] = useState<number | null>(null);
    const [deductAmount, setDeductAmount] = useState<number | null>(null);
    const [userIdInput, setUserIdInput] = useState<string>('');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [calculatedCashback, setCalculatedCashback] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.log('Пользователь не аутентифицирован');
                navigate('/not-auth');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.status === 'admin') {
                        return;
                    }
                }
                console.log('Пользователь не является администратором');
                navigate('/not-auth');
            } catch (error) {
                console.error('Ошибка проверки прав:', error);
                navigate('/not-auth');
            }
        };

        checkAdminStatus();
    }, [navigate]);

    const handleFindUser = useCallback(async () => {
        if (!userIdInput.trim()) {
            toast.error('Введите ID пользователя');
            return;
        }

        try {
            const usersRef = collection(db, 'users');
            const upperCaseUserId = userIdInput.toUpperCase();
            const q = query(usersRef, where('userId', '==', upperCaseUserId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setFoundUser(null);
                toast.error('Пользователь не найден');
                return;
            }

            const userData = querySnapshot.docs[0].data() as User;
            setFoundUser(userData);
            toast.success('Пользователь найден');
        } catch (error) {
            console.error('Ошибка поиска пользователя:', error);
            toast.error('Недостаточно прав для выполнения операции');
        }
    }, [userIdInput]);

    const calculateCashbackPercentage = (user: User): number => {
        if (user.visits <= 3) return 0; // Не начисляем кэшбек, если меньше 3 посещений
        if (user.visits >= 50 && user.totalSpent > 50000) return 10;
        if (user.visits >= 20 && user.totalSpent > 20000) return 5;
        if (user.visits >= 4 && user.totalSpent > 4000) return 3;
        return 0;
    };

    const calculateMaxDeductible = (amount: number | null): number => {
        return amount ? Math.round(amount * 0.1) : 0; // Изменено на 10%
    };

    const handleOrderAmountChange = useCallback((value: number | null) => {
        setOrderAmount(value);
        if (foundUser && value) {
            const cashbackAmount = Math.round((value * calculateCashbackPercentage(foundUser)) / 100);
            setCalculatedCashback(cashbackAmount);
            setDeductAmount(Math.min(calculateMaxDeductible(value), foundUser.cashback));
        }
    }, [foundUser]);

    const handleAddCashback = useCallback(async () => {
        if (!foundUser || !orderAmount) return; // Проверка на наличие пользователя и суммы

        // Ensure calculated cashback is not negative
        if (calculatedCashback < 0) {
            toast.error('Некорректная сумма кэшбека.');
            return;
        }

        try {
            // Обновляем данные пользователя
            await updateDoc(doc(db, 'users', foundUser.id), {
                cashback: increment(calculatedCashback),
                visits: increment(1),
                totalSpent: increment(orderAmount)
            });

            // Добавляем запись о посещении
            await addDoc(collection(db, 'visits'), {
                userId: foundUser.id,
                timestamp: new Date(),
                cashback: calculatedCashback,
                orderAmount: orderAmount,
                cafeName: "Paradise Lounge"
            });

            // Обновляем локальное состояние
            setFoundUser(prev => prev ? {
                ...prev,
                cashback: prev.cashback + calculatedCashback,
                visits: prev.visits + 1,
                totalSpent: prev.totalSpent + orderAmount
            } : null);

            // Проверяем достижения
            await checkAchievements(foundUser.id, foundUser.visits + 1); // Передаем новое количество посещений

            toast.success(`Кэшбек начислен пользователю ${foundUser.name}`);
            // Очищаем поля
            setOrderAmount(null);
            setCalculatedCashback(0);
            setDeductAmount(null);
            setUserIdInput('');
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Неизвестная ошибка';
            console.error('Ошибка начисления:', error);
            toast.error(`Ошибка начисления: ${errorMessage}`);
        }
    }, [foundUser, orderAmount, calculatedCashback]);


    const handleDeductCashback = useCallback(async () => {
        if (!foundUser || !deductAmount) return;

        // Check if the user has enough cashback to deduct
        if (foundUser.cashback < deductAmount) {
            toast.error('Недостаточно баллов для списания.');
            return;
        }

        try {
            await updateDoc(doc(db, 'users', foundUser.id), {
                cashback: increment(-deductAmount),
                visits: increment(1)
            });

            await addDoc(collection(db, 'visits'), {
                userId: foundUser.id,
                timestamp: new Date(),
                cashback: -deductAmount,
                orderAmount: orderAmount,
                cafeName: "Paradise Lounge",
                isDeduction: true
            });

            setFoundUser(prev => prev ? {
                ...prev,
                cashback: prev.cashback - deductAmount,
                visits: prev.visits + 1
            } : null);

            toast.success(`Баллы списаны у пользователя ${foundUser.name}`);
            // Очищаем поля
            setDeductAmount(null);
            setOrderAmount(null);
            setUserIdInput('');
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Неизвестная ошибка';
            console.error('Ошибка списания:', error);
            toast.error(`Ошибка списания: ${errorMessage}`);
        }
    }, [foundUser, deductAmount, orderAmount]);


    const handleAddVisit = useCallback(async () => {
        if (!foundUser) return;

        try {
            // Добавляем запись о посещении
            await addDoc(collection(db, 'visits'), {
                userId: foundUser.id,
                timestamp: new Date(),
                cashback: 0, // Без начисления кэшбэка
                orderAmount: orderAmount || 0, // Сумма чека
                cafeName: "Paradise Lounge"
            });

            // Обновляем количество посещений пользователя
            await updateDoc(doc(db, 'users', foundUser.id), {
                visits: increment(1),
                totalSpent: increment(orderAmount || 0) // Обновляем общую сумму потраченных средств
            });

            // Обновляем локальное состояние
            setFoundUser(prev => prev ? {
                ...prev,
                visits: prev.visits + 1,
                totalSpent: prev.totalSpent + (orderAmount || 0)
            } : null);

            // Проверяем достижения
            await checkAchievements(foundUser.id, foundUser.visits + 1); // Передаем новое количество посещений

            toast.success(`Посещение добавлено для пользователя ${foundUser.name}`);
            setOrderAmount(null);
            setUserIdInput('');
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'Неизвестная ошибка';
            console.error('Ошибка добавления посещения:', error);
            toast.error(`Ошибка добавления посещения: ${errorMessage}`);
        }
    }, [foundUser, orderAmount]);


    const checkAchievements = async (userId: string, visits: number) => {
        const visitsRef = collection(db, 'visits');
        const q = query(visitsRef, where('userId', '==', userId));
        const visitsSnapshot = await getDocs(q);
        const visitsData = visitsSnapshot.docs.map(doc => doc.data() as VisitData);

        // Проверка достижения "Дымный разряд"
        const monthlyVisits = checkMonthlyVisits(visitsData);
        if (monthlyVisits >= 15) {
            await addAchievement(userId, 'Дымный разряд', 'Посетите заведение 15 раз за месяц', 300);
        } else {
            await resetAchievement(userId, 'Дымный разряд');
        }

        // Проверка достижения "Мастер релакса" и "Гуру комфорта"
        if (visits >= 20) {
            await addAchievement(userId, 'Мастер релакса', '20 посещений на сумму 20.000₽', 250);
        }
        if (visits >= 50) {
            await addAchievement(userId, 'Гуру комфорта', '50 посещений на сумму 50.000₽', 550);
        }
    };

    const checkMonthlyVisits = (visits: VisitData[]): number => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return visits.filter(visit => {
            const visitDate = new Date(visit.timestamp.seconds * 1000);
            return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        }).length;
    };

    const addAchievement = async (userId: string, title: string, description: string, rewardPoints: number) => {
        const achievementsRef = collection(db, 'achievements');
        await addDoc(achievementsRef, {
            userId,
            title,
            description,
            rewardPoints,
            claimed: false,
            progress: 0,
            target: 1,
            image: 'path/to/image'
        });
    };

    const resetAchievement = async (userId: string, title: string) => {
        const achievementsRef = collection(db, 'achievements');
        const q = query(achievementsRef, where('userId', '==', userId), where('title', '==', title));
        const snapshot = await getDocs(q);
        snapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                claimed: false,
                progress: 0
            });
        });
    };

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    }, [navigate]);

    return (
        <div className='bgI p-6'>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">Административная панель</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserSearch
                    userIdInput={userIdInput}
                    setUserIdInput={setUserIdInput}
                    onFindUser={handleFindUser}
                    foundUser={foundUser}
                />
                <CashbackManagement
                    orderAmount={orderAmount}
                    setOrderAmount={handleOrderAmountChange}
                    deductAmount={deductAmount}
                    setDeductAmount={setDeductAmount}
                    calculatedCashback={calculatedCashback}
                    handleAddCashback={handleAddCashback}
                    handleDeductCashback={handleDeductCashback}
                    foundUser={foundUser}
                />
                <VisitManagement handleAddVisit={handleAddVisit} foundUser={foundUser} />
                <LogoutButton onLogout={handleLogout} />
                <button onClick={() => navigate("/")}
                    className="absolute bottom-6 left-4 text-[#058c6f] cursor-pointer flex items-center hover:underline group z-20"
                >
                    <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="relative z-10 text-[24px] ml-2"
                        style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>на главную</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
