import React from 'react';
import type { User } from './types';

interface VisitManagementProps {
    handleAddVisit: () => void;
    foundUser: User | null; // Замените на правильный тип
}

const VisitManagement: React.FC<VisitManagementProps> = React.memo(({ handleAddVisit, foundUser }) => {
    return (
        <div className="bg-transparent border-2 border-[#87679b] p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Добавить посещение</h2>
            <div
                onClick={handleAddVisit}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleAddVisit();
                    }
                }}
                className={`cursor-pointer w-full py-2 rounded flex justify-center items-center ${!foundUser ? 'border-2 border-[#3cb755] opacity-50 pointer-events-none' : 'border-2 border-[#3cb755] hover:bg-[#175530] rounded-lg'
                    } text-white text-lg transition duration-300`}
                style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
            >
                Добавить
            </div>
        </div>
    );
});

export default VisitManagement;
