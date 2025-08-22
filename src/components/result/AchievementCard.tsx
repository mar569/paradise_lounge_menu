import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { X } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    image: string;
    progress: number;
    target: number;
    reward: number;
    claimed: boolean;
}

interface AchievementsCardProps {
    achievement: Achievement;
    isOpen: boolean;
    onClose: () => void;
    onClaim: (achievementId: string) => void;
}

const AchievementsCard: React.FC<AchievementsCardProps> = ({
    achievement,
    isOpen,
    onClose,
    onClaim
}) => {
    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, 100], [1, 0]);

    const progressPercentage = Math.min((achievement.progress / achievement.target) * 100, 100);

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            transition={{ duration: 0.9 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-black rounded-lg shadow-3xl p-6 w-full max-w-md relative"
                style={{ y, opacity, boxShadow: '2px 6px 8px rgba(5, 136, 95, 0.5)' }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y > 100) {
                        onClose();
                    }
                }}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9 }}
                animate={{ scale: isOpen ? 1 : 0.9 }}
                exit={{ scale: 0.9 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="object-cover"
                    />

                    <p className="text-gray-600 mb-4">{achievement.description}</p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[18px] font-medium text-gray-700"
                            style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>Прогресс</span>
                        <span className="text-sm text-gray-600">
                            {achievement.progress}/{achievement.target}
                        </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-[#76c7c0] to-[#875ed3] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <p className="text-lg font-semibold text-[#875ed3]">
                        Награда: {achievement.reward} баллов
                    </p>
                </div>

                {!achievement.claimed && achievement.progress >= achievement.target && (
                    <button
                        onClick={() => onClaim(achievement.id)}
                        className="cursor-pointer w-full bg-gradient-to-r from-[#76c7c0] to-[#875ed3] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Получить награду
                    </button>
                )}

                {achievement.claimed && (
                    <div className="text-center py-3 bg-green-100 text-green-700 rounded-lg">
                        Награда получена!
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AchievementsCard;
