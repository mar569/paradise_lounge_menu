import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import CashbackLevel from './CashbackLevel';
import VisitsHistory from './VisitsHistory';
import BonusProgram from './BonusProgram';
import DeleteProfileDialog from './DeleteProfileDialog';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserData, VisitData } from './types';
import AchievementsSection from '../../result/AchievementsSection';
import { toast } from 'react-toastify';
import type { FirebaseError } from 'firebase/app';

interface UserProfileProps {
    userData: UserData | null;
    onLogout: () => void;
    onUpdateProfile: (data: Partial<UserData>) => void; // Измените здесь
    onEditProfile: (newName: string) => void;
    onPasswordReset: (email: string) => Promise<void>;
}


const UserProfile: React.FC<UserProfileProps> = React.memo(({
    userData,
    onLogout,
    onUpdateProfile,
    onEditProfile,
    onPasswordReset,
}) => {
    const [visitsHistory, setVisitsHistory] = useState<VisitData[]>([]);
    const [totalSpent, setTotalSpent] = useState<number>(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [achievementsCount, setAchievementsCount] = useState<number>(0);
    const navigate = useNavigate();

    const fetchVisitsHistory = async () => {
        if (!userData) return;

        const visitsRef = collection(db, 'visits');
        const q = query(visitsRef, where('userId', '==', userData.id));
        try {
            const visitsSnapshot = await getDocs(q);

            if (visitsSnapshot.empty) {
                setVisitsHistory([]);
                setTotalSpent(0);
                return;
            }

            const visitsData: VisitData[] = [];
            let total = 0;

            visitsSnapshot.docs.forEach(doc => {
                const data = doc.data() as Omit<VisitData, 'id'>;
                visitsData.push({ id: doc.id, ...data });
                if (data.orderAmount) {
                    total += data.orderAmount;
                }
            });

            setVisitsHistory(visitsData);
            setTotalSpent(total);
            await checkAchievements(userData.id, visitsData); // Проверяем достижения после загрузки посещений
        } catch (error) {
            const firebaseError = error as FirebaseError;
            console.error('Ошибка загрузки истории посещений:', firebaseError);

            if (firebaseError.code !== 'permission-denied') {
                toast.error('Ошибка загрузки истории посещений. Проверьте права доступа.');
            }
        }
    };

    const fetchAchievementsCount = async (userId: string) => {
        const achievementsRef = collection(db, 'achievements');
        const q = query(achievementsRef, where('userId', '==', userId), where('claimed', '==', true));
        const snapshot = await getDocs(q);
        setAchievementsCount(snapshot.size); // Set the count of claimed achievements
    };

    const calculateCashbackLevel = () => {
        if (!userData) return 0;

        const visits = visitsHistory.length;
        if (visits >= 50 && totalSpent > 50000) return 10;
        if (visits >= 20 && totalSpent > 20000) return 5;
        if (visits >= 4 && totalSpent > 4000) return 3;
        return 0;
    };

    const checkConsecutiveDays = (visits: VisitData[]): number => {
        if (visits.length === 0) return 0;

        const visitDates = visits.map(visit => new Date(visit.timestamp.seconds * 1000).toDateString());
        const uniqueDates = [...new Set(visitDates)].sort();

        let consecutiveCount = 0;

        for (let i = 0; i < uniqueDates.length; i++) {
            if (i === 0) {
                consecutiveCount++;
            } else {
                const prevDate = new Date(uniqueDates[i - 1]);
                const currentDate = new Date(uniqueDates[i]);
                const diffTime = currentDate.getTime() - prevDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays === 1) {
                    consecutiveCount++;
                } else {
                    break;
                }
            }
        }

        return Math.min(consecutiveCount, 5);
    };

    const checkAchievements = async (userId: string, visitsData: VisitData[]) => {
        const consecutiveDays = checkConsecutiveDays(visitsData);
        if (consecutiveDays >= 5) {
            await addAchievement(userId, 'Без перерыва', 'Посетите заведение 5 дней подряд', 250);
        } else {
            await resetAchievement(userId, 'Без перерыва');
        }

        const monthlyVisits = checkMonthlyVisits(visitsData);
        if (monthlyVisits >= 15) {
            await addAchievement(userId, 'Дымный разряд', 'Посетите заведение 15 раз за месяц', 300);
        } else {
            await resetAchievement(userId, 'Дымный разряд');
        }
    };

    const checkMonthlyVisits = (visits: VisitData[]) => {
        if (visits.length === 0) return 0;

        const currentMonth = new Date().getMonth();
        return visits.filter(visit => new Date(visit.timestamp.seconds * 1000).getMonth() === currentMonth).length;
    };

    const addAchievement = async (userId: string, title: string, description: string, rewardPoints: number) => {
        try {
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
        } catch (error) {
            console.error('Ошибка добавления достижения:', error);
        }
    };

    const resetAchievement = async (userId: string, title: string) => {
        try {
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef, where('userId', '==', userId), where('title', '==', title));
            const snapshot = await getDocs(q);
            snapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    claimed: false,
                    progress: 0
                });
            });
        } catch (error) {
            console.error('Ошибка сброса достижения:', error);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchVisitsHistory();
            fetchAchievementsCount(userData.id); // Fetch achievements count when userData changes
        }
    }, [userData]);

    const totalAchievements = 4;

    return (
        <div className="space-y-6">
            <ProfileHeader
                userData={userData}
                onLogout={onLogout}
                onEditProfile={onEditProfile}
                onPasswordReset={onPasswordReset}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                onUpdateProfile={onUpdateProfile}
            />
            <ProfileDetails userData={userData} />

            <CashbackLevel
                userData={userData}
                currentLevel={calculateCashbackLevel()}
                visitsCount={visitsHistory.length}
                totalSpent={totalSpent}
            />

            <VisitsHistory
                visitsHistory={visitsHistory}
                cashback={userData?.cashback || 0}
                calculateCashbackPercentage={(visits: number) => {
                    if (visits <= 3) return 0;
                    if (visits >= 50 && totalSpent > 50000) return 10;
                    if (visits >= 20 && totalSpent > 20000) return 5;
                    if (visits >= 4 && totalSpent > 4000) return 3;
                    return 0;
                }}
            />

            <BonusProgram />
            <AchievementsSection achievementsCount={achievementsCount} totalAchievements={totalAchievements} />
            <DeleteProfileDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                userData={userData}
            />

            <div className='absolute bottom-4 left-4  '>
                <span
                    onClick={() => navigate("/")}
                    className="text-[#058c6f] btn-history cursor-pointer flex items-center hover:underline relative group"
                >
                    <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="relative z-10 text-[24px] ml-2"
                        style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>на главную</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
                </span>
            </div>
        </div>
    );
});

export default UserProfile;
