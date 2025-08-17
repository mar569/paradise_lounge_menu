import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import logo from '../../assets/paradiseLogo.jpg';
import { FaGear, FaTrash } from "react-icons/fa6";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../lightswind/dialog';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import { deleteUser } from 'firebase/auth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../lightswind/Accordion';
import { FaExclamationTriangle } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

interface VisitData {
    id: string;
    userId: string; // Добавьте это поле, если оно есть в ваших данных
    timestamp: { seconds: number }; // Предполагается, что timestamp хранится в формате Firestore
    cashback: number; // Предполагается, что cashback хранится как число
}

interface UserData {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    status: 'pending' | 'active' | 'admin';
    emailVerified: boolean;
    avatarUrl?: string;
    visits: number;
    cashback: number;
    qrCode?: string;
    orderAmount: number;
}

interface UserProfileProps {
    userData: UserData | null;
    onLogout: () => void;
    onUpdateProfile: (data: UserData) => void;
    onEditProfile: (newName: string) => void;
    onPasswordReset: (email: string) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({
    userData,
    onLogout,
    onUpdateProfile,
    onEditProfile,
    onPasswordReset,
}) => {
    const [name, setName] = useState(userData?.name || '');
    const [dob, setDob] = useState<string>('');
    const navigate = useNavigate();
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    const [defaultDob] = useState<string>(defaultDate.toISOString().split('T')[0]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);
    const [isBonusAccordionOpen, setIsBonusAccordionOpen] = useState(false);
    const [visitsHistory, setVisitsHistory] = useState<VisitData[]>([]);

    const fetchVisitsHistory = async () => {
        if (!userData) return;
        const visitsRef = collection(db, 'visits');
        const visitsSnapshot = await getDocs(visitsRef);
        const visitsData = visitsSnapshot.docs
            .map(doc => {
                const data = doc.data() as Omit<VisitData, 'id'>; // Указываем, что это VisitData без id
                return { id: doc.id, ...data }; // Возвращаем объект с id
            })
            .filter(visit => visit.userId === userData.id); // Фильтруем по userId
        setVisitsHistory(visitsData); // Устанавливаем состояние
    };

    const calculateCashbackPercentage = (visits: number) => {
        if (visits >= 50) return 10;
        if (visits >= 20) return 7;
        if (visits >= 10) return 5;
        return 0;
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Введите имя');
            return;
        }

        try {
            const userRef = doc(db, 'users', auth.currentUser?.uid || '');
            await updateDoc(userRef, {
                name: DOMPurify.sanitize(name),
                dateOfBirth: dob || defaultDob,
                avatarUrl: userData?.avatarUrl,
            });

            if (userData) {
                onUpdateProfile({
                    ...userData,
                    name,
                });
            }

            onEditProfile(name);
            toast.success('Профиль успешно обновлен');
        } catch (err) {
            toast.error('Ошибка при сохранении профиля: ' + (err as Error).message);
        }
    };

    const handleDeleteProfile = async () => {
        if (!auth.currentUser || !userData) return;

        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'users', userData.id));
            await deleteUser(auth.currentUser);
            toast.success('Профиль успешно удален');
            navigate('/');
        } catch (error) {
            console.error('Ошибка удаления:', error);
            toast.error('Не удалось удалить профиль');
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className='flex justify-between items-center'>
                <h4 className="text-xl text-[#fff] font-semibold">Профиль</h4>
                <Dialog>
                    <DialogTrigger>
                        <button className="flex items-center">
                            <FaGear className="h-5 w-5 text-[#fff] " />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Редактировать профиль</DialogTitle>
                        <DialogDescription>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Имя</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
                                <input
                                    type="date"
                                    defaultValue={defaultDob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </DialogDescription>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Сохранить
                            </button>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => onPasswordReset(userData?.email || '')}
                                className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 mt-2"
                            >
                                Сбросить пароль
                            </button>
                            <button
                                onClick={onLogout}
                                className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 mt-2"
                            >
                                Выйти
                            </button>
                            <button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 mt-2"
                            >
                                Удалить профиль
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex items-center space-x-4">
                <div
                    className="flex items-center justify-center w-20 h-20 rounded-full overflow-hidden"
                    style={{
                        background: 'radial-gradient(circle at 35.86% 50%, #3cb755 0%, #05885f 48.96%, #3D0162 100%)',
                        padding: '2px'
                    }}
                >
                    <div className="w-full h-full rounded-full ">
                        <img
                            src={logo}
                            alt="Логотип"
                            className="w-19 h-19 object-cover rounded-full"
                        />
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-xl text-[#fff] font-semibold">{name}</h2>
                    <p className="text-gray-500">{userData?.email}</p>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-lg font-semibold text-center mb-2">Уровень <span className="font-bold"
                    style={{ color: '#76c7c0', fontFamily: 'monospace' }}>cashback</span></h4>
                <div className="relative">
                    <div className="flex justify-between mb-1">
                        <span className="text-md font-bold ml-3" style={{ fontFamily: 'Roboto, sans-serif' }}>0%</span>
                        <span className="text-md font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>5%</span>
                        <span className="text-md font-bold mr-3" style={{ fontFamily: 'Roboto, sans-serif' }}>10%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-[#76c7c0] rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${calculateCashbackPercentage(userData?.visits || 0)}%`,
                                backgroundSize: '200% 100%',
                                animation: 'pulse 2s infinite alternate'
                            }}
                        />
                    </div>
                </div>
            </div>

            {userData?.qrCode && (
                <div className="mt-4 flex justify-between items-end gradient-border p-4">
                    <div>
                        <h4 className='text-md text-[#fff] font-semibold'>Твои баллы: {userData?.cashback} ₽</h4>
                        <p className='text-xl mt-2'>3% <span className='text-xs' style={{ color: '#76c7c0', fontFamily: 'monospace' }}>CASHBACK</span></p>
                    </div>
                    <div className='gradient-border ' >
                        <img
                            src={userData.qrCode}
                            alt="QR-код"
                            className="w-32 h-32 rounded-2xl p-2 cursor-pointer"
                            onClick={() => setIsQrCodeDialogOpen(true)}
                        />
                    </div>
                </div>
            )}
            <div>
                <button
                    onClick={() => setIsBonusAccordionOpen(!isBonusAccordionOpen)} // Переключение состояния аккордеона
                    className="mt-2 text-[#fff] "
                >
                    <div className='flex items-center'>
                        <CiStar size={24} className='mr-2' />
                        {isBonusAccordionOpen ? "Скрыть бонусную программу" : "О бонусной программе"}
                    </div>
                </button>
            </div>
            {isBonusAccordionOpen && (
                <div className="mt-4 p-4 bg-black/80 rounded-md">
                    <Accordion>
                        <AccordionItem value="bonus1">
                            <AccordionTrigger>Что такое бонусная программа</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>Бонусная программа предоставляет возможность получать баллы за каждую покупку. Накопленные баллы можно оплатить до 20% от всей суммы заказа.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus2">
                            <AccordionTrigger>Как работает кэшбэк?</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>За каждое посещение и заказ в "Paradise Lounge" вы накапливаете баллы.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus3">
                            <AccordionTrigger>Как использовать кэшбэк?</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>В рамках одного заказа вы можете либо накопить баллы, либо списать их для оплаты части счета.
                                    Обратите внимание: при списании баллов на сумму заказа не начисляются новые баллы.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus4">
                            <AccordionTrigger>Как повысить уровень кэшбэка?</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>Увеличивайте количество посещений и покупок, чтобы повысить уровень кэшбэка до 10%!</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus5">
                            <AccordionTrigger>Баллы</AccordionTrigger>
                            <AccordionContent>
                                <h2> 1 балл = 1 рубль. </h2>
                                <div className='mt-4 border-1 border-[#875ed3] p-4 rounded-2xl'>
                                    <h3 className='text-[#875ed3] text-xl mb-1'>Cashback 0%</h3>
                                    <p className='text-[#fff]'>Чтобы начать накапливать и тратить баллы , соверши 2 посещения в "Paradise Lounge". </p>
                                </div>
                                <div className='mt-4 border-1 border-[#875ed3] p-4 rounded-2xl'>
                                    <h3 className='text-[#875ed3] text-xl mb-1'>Cashback 5%</h3>
                                    <p className='text-[#fff]'>Соверши не менее 20 посещений на общую сумму 20.000₽ и получи статус "Мастер релакса" </p>
                                </div>
                                <div className='mt-4 border-1 border-[#875ed3] p-4 rounded-2xl'>
                                    <h3 className='text-[#875ed3] text-xl mb-1'>Cashback 10%</h3>
                                    <p className='text-[#fff]'>Соверши не менее 40 посещений на общую сумму 50.000₽ и получи статус "Гуру комфорта" </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
            <div className="mt-4">
                <h4 className="text-lg font-semibold">История посещений</h4>
                <button onClick={fetchVisitsHistory} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Загрузить историю посещений
                </button>
                <ul className="mt-2">
                    {visitsHistory.map(visit => (
                        <li key={visit.id} className="border-b py-2">
                            <p>Дата: {new Date(visit.timestamp.seconds * 1000).toLocaleDateString()}</p>
                            <p>Баллы: {visit.cashback} ₽</p>
                        </li>
                    ))}
                </ul>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <FaExclamationTriangle className="text-yellow-500 text-xl" />
                        <DialogTitle className="text-lg font-bold">Подтверждение удаления</DialogTitle>
                    </div>
                    <DialogDescription className="mb-6 text-gray-600">
                        Вы уверены, что хотите полностью удалить свой профиль? Все данные будут безвозвратно утеряны.
                    </DialogDescription>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                            disabled={isDeleting}
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleDeleteProfile}
                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <span className="inline-block animate-spin">↻</span>
                            ) : (
                                <>
                                    <FaTrash />
                                    Удалить
                                </>
                            )}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Кнопка "На главную" */}
            <button
                onClick={() => navigate('/')}
                className="absolute bottom-6 left-4 text-[#a4a0ab] hover:text-[#a557da] cursor-pointer flex items-center hover:underline group duration-500"
            >
                На главную
            </button>

            {/* Диалог для отображения QR-кода */}
            {userData?.qrCode && (
                <Dialog open={isQrCodeDialogOpen} onOpenChange={setIsQrCodeDialogOpen}>
                    <DialogContent className="gradient-borderCode rounded-lg shadow-xl max-w-md w-[80%]">
                        <div className="flex flex-col items-center justify-center">
                            <img
                                src={userData.qrCode}
                                alt="QR-код"
                                className="min-w-[260px] min-h-[200px] object-contain rounded-2xl"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default UserProfile;
