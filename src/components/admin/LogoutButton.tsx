import { signOut } from 'firebase/auth';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';

interface LogoutButtonProps {
    onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = React.memo(() => {
    const navigate = useNavigate(); // Инициализация useNavigate
    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            navigate('/', { replace: true }); // Добавьте { replace: true } чтобы заменить текущий URL
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    }, [navigate]);

    return (
        <footer className='flex justify-end'>
            <button
                onClick={handleLogout}
                className="cursor-pointer px-4 py-1.5 bg-transparent border-1 border-[#b7443c] text-white rounded hover:bg-red-700"
            >
                Выйти
            </button>
        </footer>
    );
});

export default LogoutButton;
