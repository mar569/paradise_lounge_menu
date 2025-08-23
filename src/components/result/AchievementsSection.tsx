import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CiAlignBottom } from 'react-icons/ci';

interface AchievementsSectionProps {
    achievementsCount: number;
    totalAchievements: number; // Total achievements available
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
    achievementsCount,
    totalAchievements
}) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false); // State to control visibility
    const navigate = useNavigate();

    return (
        <motion.div
            className="mt-2 bg-transparent rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center">
                <CiAlignBottom size={24} className='mr-2  btn-history rounded-2xl cursor-pointer text-[#fff]' />
                <span onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                    className="text-md text-[#fff] cursor-pointer btn-history "
                >
                    {isDetailsVisible ? "Скрыть достижения" : "Достижения"}</span>
            </div>

            {isDetailsVisible && (
                <motion.div
                    className="mt-2  bg-black/80 rounded-md"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{ padding: '16px 0 16px 0' }}
                >
                    <div className="mt-4 border-2 border-[#7bc0a6] rounded-2xl "
                        style={{ padding: '16px 16px 16px 16px' }}>
                        <div className='mb-4'>
                            <p className="text-gray-300 text-[16px] ">
                                Разблокируйте все свои достижения и зарабатывайте бонусные баллы
                            </p>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[16px]"
                                style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>Прогресс</span>
                            <span className="text-sm text-gray-400">
                                {Math.round((achievementsCount / totalAchievements) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-[#ffffff] rounded-full h-2 mb-4">
                            <div
                                className="bg-gradient-to-r from-[#76c7c0] to-[#875ed3] h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.round((achievementsCount / totalAchievements) * 100)}%`
                                }}
                            />
                        </div>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate('/achievements-:userId')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate('/achievements-:userId');
                                }
                            }}
                            className="gradient-border w-full max-w-[160px] cursor-pointer px-6 py-2  rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                        >
                            Смотреть
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AchievementsSection;
