// src/pages/AgeVerificationPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AgeVerificationPage: React.FC<{ onConfirm: () => void; onDeny: () => void; }> = ({ onConfirm, onDeny }) => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        onConfirm();
        sessionStorage.setItem('ageVerified', 'true');
        navigate('/');
    };

    const handleDeny = () => {
        onDeny();
    };

    return (
        <div className="flex items-center justify-center min-h-screen age-verification-bg text-white p-6">
            <div className="text-center border-1 border-[#7bc0a6] rounded-lg p-8">
                <h4 className="text-2xl font-bold">Вам уже есть 18 лет?</h4>
                <p className="mt-4">Пожалуйста, подтвердите, что вам уже есть 18 лет, чтобы продолжить.</p>
                <div className="mt-6">
                    <button onClick={handleConfirm} className="btn gradient-border px-6 py-1 cursor-pointer">Да</button>
                    <button onClick={handleDeny} className="btn ml-4 gradient-border_no px-6 py-1 cursor-pointer">Нет</button>
                </div>
            </div>
        </div>
    );
};

export default AgeVerificationPage;
