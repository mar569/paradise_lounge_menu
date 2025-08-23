import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, increment, addDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../services/firebase';
import AchievementsCard from '../components/result/AchievementCard';
import { Achievement } from '../components/result/Achievement';
import status_1 from '../assets/status-1.jpg';
import status_2 from '../assets/status-2.jpg';
import status_4 from '../assets/status-4.jpg';

interface VisitData {
    id: string;
    timestamp: { seconds: number };
    orderAmount: number;
    userId: string;
    cafeName: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    image: string;
    progress: number;
    target: number;
    reward: number;
    claimed: boolean;
    type: 'visit' | 'monthly';
}

interface AchievementsPageProps {
    userId: string;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ userId }) => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, [userId]);

    const fetchAchievements = async () => {
        if (!userId) return;

        try {
            const visitsRef = collection(db, 'visits');
            const q = query(visitsRef, where('userId', '==', userId));
            const visitsSnapshot = await getDocs(q);
            const visitsData: VisitData[] = visitsSnapshot.docs.map(doc => doc.data() as VisitData);

            // Calculate progress for each achievement
            const achievementsData: Achievement[] = [
                {
                    id: 'master_relax',
                    title: 'Мастер релакса',
                    description: '20 посещений на сумму 20.000₽',
                    image: status_1,
                    progress: Math.min(visitsData.length, 20),
                    target: 20,
                    reward: 250,
                    claimed: false,
                    type: 'visit'
                },
                {
                    id: 'guru_comfort',
                    title: 'Гуру комфорта',
                    description: '50 посещений на сумму 50.000₽',
                    image: status_2,
                    progress: Math.min(visitsData.length, 50),
                    target: 50,
                    reward: 550,
                    claimed: false,
                    type: 'visit'
                },
                {
                    id: 'smoky_discharge',
                    title: 'Дымный разряд',
                    description: '15 посещений за текущий месяц',
                    image: status_4,
                    progress: Math.min(calculateMonthlyVisits(visitsData), 15), // Используем функцию для расчета прогресса
                    target: 15,
                    reward: 300,
                    claimed: false,
                    type: 'monthly'
                }
            ];

            // Проверка, были ли достижения получены
            const achievementsRef = collection(db, 'achievements');
            const achievementsSnapshot = await getDocs(query(achievementsRef, where('userId', '==', userId)));
            achievementsSnapshot.forEach(doc => {
                const achievementData = doc.data() as Achievement;
                const index = achievementsData.findIndex(a => a.id === achievementData.id);
                if (index !== -1) {
                    achievementsData[index].claimed = achievementData.claimed;
                }
            });

            setAchievements(achievementsData);
        } catch (error) {
            console.error('Ошибка загрузки достижений:', error);
            toast.error('Ошибка загрузки достижений');
        } finally {
            setLoading(false);
        }
    };

    const calculateMonthlyVisits = (visits: VisitData[]): number => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return visits.filter(visit => {
            const visitDate = new Date(visit.timestamp.seconds * 1000);
            return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        }).length;
    };

    const handleCardOpen = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        setIsCardOpen(true);
    };

    const handleCardClose = () => {
        setIsCardOpen(false);
        setSelectedAchievement(null);
    };

    const handleClaimReward = async (achievementId: string) => {
        if (!userId) return;

        try {
            const achievement = achievements.find(a => a.id === achievementId);
            if (!achievement || achievement.claimed) return;

            // Начисляем баллы
            await updateDoc(doc(db, 'users', userId), {
                cashback: increment(achievement.reward)
            });

            // Добавляем запись о посещении с наградой
            await addDoc(collection(db, 'visits'), {
                userId,
                timestamp: new Date(),
                cashback: achievement.reward, // Добавляем награду как кэшбек
                orderAmount: 0, // Указываем 0, так как это не обычное посещение
                cafeName: "Paradise Lounge Bonus",
                isDeduction: false // Указываем, что это не списание
            });

            // Сохраняем достижение как полученное
            await addDoc(collection(db, 'achievements'), {
                userId,
                id: achievementId,
                claimed: true,
                progress: achievement.progress,
                target: achievement.target,
                reward: achievement.reward,
                type: achievement.type,
                image: achievement.image
            });

            // Помечаем достижение как полученное
            setAchievements(prev =>
                prev.map(a => a.id === achievementId ? { ...a, claimed: true } : a)
            );

            toast.success(`Получено ${achievement.reward} бонусных баллов!`);
            handleCardClose();
        } catch (error) {
            console.log('Ошибка получения награды:', error);
            toast.error('Ошибка получения награды');
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <span
                        onClick={() => navigate(-1)}
                        className="mr-4 text-[#76c7c0] hover:text-[#76c7c0]"
                    >
                        <ArrowLeft size={24} className='cursor-pointer' />
                    </span>
                    <h4 className="text-3xl">Мои достижения</h4>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {achievements.map((achievement) => (
                        <Achievement
                            key={achievement.id}
                            achievement={achievement}
                            onClick={() => handleCardOpen(achievement)}
                        />
                    ))}
                </div>

                {/* Info Text */}
                <div className="mt-8 text-center text-gray-400">
                    <p>Нажимайте на карточки для подробной информации и получения наград</p>
                </div>
            </div>

            {/* Achievement Card Modal */}
            {selectedAchievement && (
                <AchievementsCard
                    achievement={selectedAchievement}
                    isOpen={isCardOpen}
                    onClose={handleCardClose}
                    onClaim={handleClaimReward}
                />
            )}
        </div>
    );
};

export default AchievementsPage;
