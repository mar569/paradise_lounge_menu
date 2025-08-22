import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { VisitData } from './types';
import { TbMapPinCheck } from "react-icons/tb";
import { motion } from 'framer-motion';

interface VisitsHistoryProps {
    visitsHistory: VisitData[];
    cashback: number;
    calculateCashbackPercentage: (visits: number) => number;
}

const VisitsHistory: React.FC<VisitsHistoryProps> = React.memo(({
    visitsHistory,
    cashback,
    calculateCashbackPercentage
}) => {
    const navigate = useNavigate();

    const handleViewHistory = () => {
        navigate('/visits-history', { state: { visitsHistory } });
    };

    // Сортируем историю посещений по дате и времени в порядке убывания
    const sortedVisitsHistory = visitsHistory.sort((a, b) => {
        return b.timestamp.seconds - a.timestamp.seconds;
    });

    return (
        <motion.div
            className="mt-4 flex flex-col gradient-border "
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='mb-4 p-4 ml-2'>
                <h4 className='text-md text-[#fff] font-semibold'>Твои баллы: {cashback} ₽</h4>
                <p className='text-xl mt-1'>
                    {calculateCashbackPercentage(visitsHistory.length)}%
                    <span className='text-xs' style={{ color: '#76c7c0', fontFamily: 'monospace' }}> CASHBACK</span>
                </p>
            </div>
            <div className="flex-1 p-4">
                <div className="mt-4 flex justify-between items-end gradient-border px-2 py-3">
                    <div>
                        <div className='flex items-end'>
                            <button onClick={handleViewHistory} className="cursor-pointer text-[16px] sm:text-lg md:text-xl font-semibold">
                                История посещений:
                            </button>
                            <TbMapPinCheck onClick={handleViewHistory} className='cursor-pointer absolute bottom-0 right-0 text-[#76c7c0]' size={22} />
                        </div>
                        <ul className="mt-2 text-[#d1cfcf]">
                            {sortedVisitsHistory.length > 0 ? (
                                sortedVisitsHistory.slice(0, 1).map(visit => (
                                    <li key={visit.id} className="border-b py-2">
                                        <p>Дата: {new Date(visit.timestamp.seconds * 1000).toLocaleString()}</p>
                                        {visit.orderAmount > 0 && (
                                            <p>Сумма чека: {visit.orderAmount} ₽</p>
                                        )}
                                        <p className={visit.cashback > 0 ? 'text-green-500' : 'text-red-500'}>
                                            {visit.cashback > 0 ? '+' : ''}{visit.cashback} ₽
                                        </p>
                                        {visit.isDeduction && (
                                            <p className="text-xs text-red-400 mt-1">Списание баллов</p>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">Посещения отсутствуют</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default VisitsHistory;
