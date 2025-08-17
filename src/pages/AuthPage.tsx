import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import UserProfile from '../components/account/UserProfile';
import { sendPasswordResetEmail } from 'firebase/auth';

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

const AuthPage: React.FC = () => {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data() as UserData;
                        setUserData(data);

                        // Обновляем статус если нужно
                        if (user.emailVerified && data.status === 'pending') {
                            await updateDoc(doc(db, 'users', user.uid), {
                                status: 'active'
                            });
                            setUserData(prev => ({ ...prev!, status: 'active' }));
                        }
                    }
                } catch (error) {
                    console.error("Ошибка загрузки данных:", error);
                    setMessage('Ошибка загрузки профиля');
                }
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth-page'); // Перенаправляем на страницу входа, если пользователь не авторизован
        } else if (user && !user.emailVerified) {
            navigate('/not-auth'); // Перенаправляем на страницу NotAuth, если почта не подтверждена
        } else if (user && user.email === 'efiminkirill01@mail.ru') {
            navigate('/admin'); // Перенаправляем на админский интерфейс
        }
    }, [user, loading, navigate]);

    const handlePasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(`Ссылка для сброса отправлена на ${email}`);
        } catch (error) {
            setMessage(`Ошибка: ${(error as Error).message}`);
        }
    };

    if (loading) return <div className='spinner'></div>;

    return (
        <div className='bgI '>
            <div className="container mx-auto px-4 py-8 max-w-md">
                {userData && (
                    <div className="">
                        <UserProfile
                            userData={userData}
                            onLogout={async () => {
                                await auth.signOut();
                                localStorage.removeItem('isAuthenticated');
                                navigate('/');
                            }}
                            onUpdateProfile={async (updatedData: Partial<UserData>) => {
                                await updateDoc(doc(db, 'users', user!.uid), updatedData);
                                setUserData(prev => ({ ...prev!, ...updatedData }));
                            }}
                            onEditProfile={(newName: string) => {
                                setUserData(prev => (prev ? { ...prev!, name: newName } : null));
                            }}
                            onPasswordReset={handlePasswordReset}
                        />
                        {message && (
                            <p className="mt-4 p-2 text-sm text-center rounded-md bg-white bg-opacity-20">
                                {message}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
