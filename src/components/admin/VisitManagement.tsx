import React from 'react';
import type { User } from './types';

interface VisitManagementProps {
    handleAddVisit: () => void;
    foundUser: User | null; // Замените на правильный тип
}

const VisitManagement: React.FC<VisitManagementProps> = React.memo(({ handleAddVisit, foundUser }) => {
    return (
        <div className="bg-transparent border-1 border-[#394d3e] p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Добавить посещение</h2>
            <button
                onClick={handleAddVisit}
                className="cursor-pointer w-full py-2 bg-[#379461] text-[#fff] rounded hover:bg-[#175530] disabled:opacity-50"
                style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                disabled={!foundUser}
            >
                Добавить посещение
            </button>
        </div>
    );
});

export default VisitManagement;
