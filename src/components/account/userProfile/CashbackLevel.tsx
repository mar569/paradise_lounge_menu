import React from 'react';
import type { UserData } from './types';
import { IoMdStar } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { motion } from 'framer-motion';

interface CashbackLevelProps {
    userData: UserData | null;
    currentLevel: number;
    visitsCount: number;
    totalSpent: number;
}

const CashbackLevel: React.FC<CashbackLevelProps> = React.memo(({
    currentLevel,
    visitsCount,
    totalSpent
}) => {
    const progressWidth = Math.max(currentLevel * 13, 3);
    const starPosition = `${progressWidth}%`;

    const getLevelRequirements = () => {
        if (currentLevel >= 10) return "Вы достигли максимального уровня!";

        const requirements = [
            { level: 3, visits: 4, spent: 4000 },
            { level: 5, visits: 20, spent: 20000 },
            { level: 10, visits: 50, spent: 50000 }
        ];

        for (const req of requirements) {
            if (currentLevel < req.level) {
                const remainingVisits = req.visits - visitsCount;
                const remainingSpent = req.spent - totalSpent;

                const visitsMessage = remainingVisits <= 0
                    ? <span><FaCheck className="inline-block ml-1" /></span>
                    : <span>{remainingVisits} {remainingVisits === 1 ? 'посещение' : 'посещений'}</span>;

                const spentMessage = remainingSpent > 0
                    ? (remainingSpent <= 0
                        ? <span>сумма достигнута <FaCheck className="inline-block ml-1" /></span>
                        : <span>{remainingSpent}₽</span>)
                    : null;

                return (
                    <span>
                        Для {req.level}%: {visitsMessage} {spentMessage && 'и '}{spentMessage}
                    </span>
                );
            }
        }

        return "";
    };

    return (
        <motion.div
            className="mt-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h4 className="text-lg font-semibold text-center mb-2">
                Уровень <span className="font-bold" style={{ color: '#76c7c0', fontFamily: 'monospace' }}>cashback:</span>
            </h4>

            <div className="relative">
                <div className="flex justify-between mb-1">
                    <span className="text-lg font-bold text-[#76c7c0]">0%</span>
                    <span className="text-lg font-bold text-[#76c7c0] ml-6">3%</span>
                    <span className="text-lg font-bold text-[#76c7c0]">5%</span>
                    <span className="text-lg font-bold text-[#76c7c0]">10%</span>
                </div>

                <div className="h-4 bg-gray-300 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-[#76c791] to-[#138231] rounded-full"
                        style={{
                            width: `${progressWidth}%`,
                            transition: 'width 1s ease-out',
                        }}
                    />
                    <IoMdStar
                        className="absolute"
                        style={{
                            left: starPosition,
                            top: '-5px',
                            transform: 'translateX(-50%)',
                            color: '#FFD700',
                            fontSize: '1.6rem',
                            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                        }}
                    />
                </div>

                <div className="mt-2 text-center text-sm text-gray-400">
                    {getLevelRequirements()}
                </div>
            </div>
        </motion.div>
    );
});

export default CashbackLevel;
