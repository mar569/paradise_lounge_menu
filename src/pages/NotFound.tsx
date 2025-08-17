import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Страница не найдена</h1>
                <p className="text-gray-600 mb-6">
                    Извините, запрашиваемая страница не существует или была перемещена.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                    На главную
                </button>
            </div>
        </div>
    );
};

export default NotFound;
