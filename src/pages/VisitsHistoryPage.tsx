import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IoArrowUp } from 'react-icons/io5';
import type { VisitData } from '../components/account/userProfile/types';

const VisitsHistoryPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const visitsHistory: VisitData[] = location.state?.visitsHistory || [];
    const [showScrollTop, setShowScrollTop] = useState(false);

    const formatDate = (timestamp: { seconds: number }) => {
        return new Date(timestamp.seconds * 1000).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Очищаем историю посещений раз в год с момента первой записи
    useEffect(() => {
        const firstVisitDate = visitsHistory[0]?.timestamp.seconds * 1000;
        if (firstVisitDate) {
            const oneYearAgo = new Date(firstVisitDate).getTime() + 31536000000; // 31536000000 - количество миллисекунд в году
            if (new Date().getTime() > oneYearAgo) {
                // Очищаем историю посещений
                visitsHistory.length = 0;
            }
        }
    }, [visitsHistory]);

    return (
        <div className="p-4 max-w-3xl mx-auto age-verification-bg">
            <div className="flex items-center mb-6">
                <span
                    onClick={() => navigate('/auth-page')}
                    className="mr-4 text-[#76c7c0] hover:text-[#76c7c0]"
                >
                    <ArrowLeft onClick={() => navigate('/auth-page')} size={24} className='cursor-pointer' />
                </span>
                <h2 className="text-2xl text-[#fff] font-bold">История посещений</h2>
            </div>

            <div className="bg-transparent rounded-lg shadow overflow-hidden">
                {visitsHistory.length > 0 ? (
                    <ul className="divide-y">
                        {visitsHistory.map((visit) => (
                            <li key={visit.id} className="p-4 hover:bg-[#2c2c2c] cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-[#fff] text-lg">
                                            {visit.cafeName || 'Посещение'}
                                        </p>
                                        <p className="text-lg text-[#c6c3c3]">
                                            {formatDate(visit.timestamp)}
                                        </p>
                                        {visit.orderAmount > 0 && (
                                            <p className="text-lg">Сумма чека: {visit.orderAmount} ₽</p>
                                        )}
                                    </div>
                                    <p className={visit.cashback > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                                        {visit.cashback > 0 ? '+' : ''}{visit.cashback} ₽
                                    </p>
                                </div>
                                {visit.isDeduction && (
                                    <p className="text-[16px] text-red-400 mt-1">Списание баллов</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        История посещений пуста
                    </div>
                )}
            </div>
            {showScrollTop && (
                <button
                    className="scroll-to-top-btn showed cursor-pointer"
                    aria-label="scroll top"
                    type="button"
                    onClick={handleScrollToTop}
                >
                    <IoArrowUp size={24} className="text-[#55e0d4] w-full" />
                </button>
            )}
        </div>
    );
};

export default VisitsHistoryPage;
