import React from 'react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    image: string;
    progress: number;
    target: number;
    reward: number;
    claimed: boolean;
    type: 'visit' | 'consecutive' | 'monthly' | 'spent';
}

interface AchievementProps {
    achievement: Achievement;
    onClick: () => void;
}

export const Achievement: React.FC<AchievementProps> = ({ achievement, onClick }) => {
    return (
        <div
            className="bg-[#000000] rounded-2xl p-6 cursor-pointer "
            style={{ boxShadow: '0px 6px 4px rgba(5, 136, 95, 0.5)' }}
            onClick={onClick}
        >

            {/* Изображение в центре сверху */}
            <div className="flex justify-center mb-4">
                <img
                    src={achievement.image}
                    alt={achievement.title}
                    className=" object-cover rounded-2xl"
                />
            </div>

            <div className="mb-3 ">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[16px] text-[#058c6f] mb-2">Прогресс</span>
                    <span className="text-sm">
                        {achievement.progress}/{achievement.target}
                    </span>
                </div>
                <div className=" w-full bg-gray-300 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-[#76c7c0] to-[#875ed3] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                    />
                </div>



                <div className="flex justify-between items-center mt-2">

                    {achievement.claimed && (
                        <span className="text-green-400 text-sm">✅ Получено</span>
                    )}
                </div>
            </div>
        </div>
    );
};
