
import { useState } from "react";
import { Bell, Home, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import NotificationModal from './NotificationModal';

export default function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    if (location.pathname !== '/') return null;
    const goToMain = () => {
        navigate('/');
    };

    const goToProfile = () => {
        navigate('/profile/tab=settings');
    };

    const goToNotifications = () => {
        setModalOpen(true);
    };

    const isMainActive = location.pathname === '/';
    const isProfileActive = location.pathname.startsWith('/profile');
    const isNotificationsActive = location.pathname.startsWith('/notifications');

    const activeColorClass = 'text-[#0F766E] scale-120';
    const inactiveScaleClass = 'scale-[0.8]';

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t border-gray-500 flex justify-around rounded-t-xl items-center py-4 md:hidden z-50">

                <button
                    type="button"
                    aria-label="Личный кабинет"
                    onClick={goToProfile}
                    className={`flex flex-col items-center text-sm transition-transform duration-300 ${isProfileActive ? activeColorClass : inactiveScaleClass + ' text-white'}`}
                >
                    <User size={24} />
                    <span>Профиль</span>
                </button>

                <button
                    type="button"
                    aria-label="Главная"
                    onClick={goToMain}
                    className={`flex flex-col items-center text-sm transition-transform duration-300 ${isMainActive ? activeColorClass : inactiveScaleClass + ' text-white'}`}
                >
                    <Home size={24} />
                    <span>Главная</span>
                </button>

                <button
                    type="button"
                    aria-label="Уведомления"
                    onClick={goToNotifications}
                    className={`flex flex-col items-center text-sm transition-transform duration-300 ${isNotificationsActive ? activeColorClass : inactiveScaleClass + ' text-white'}`}
                >
                    <Bell size={24} />
                    <span>Уведомления</span>
                </button>
            </nav>

            <NotificationModal open={modalOpen} setOpen={setModalOpen} />
        </>
    );
}