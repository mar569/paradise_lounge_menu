import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

import Carousel3D, { type Carousel3DItem } from '../components/lightswind/carousel-3d';
import hookah from '../assets/hookah.png';
import tea from '../assets/tea.png';
import coctails from '../assets/coctails.png';
import paradise from '../assets/par.png';

const categories: Carousel3DItem[] = [
    {
        id: 1,
        title: "",
        brand: "Паровые Коктейли",
        description: "Дым и вкус — идеальное сочетание",
        tags: ["Дымно", "Миксы под настроение"],
        imageUrl: hookah,
        link: "/cocktails-page-:cocktail",
    },
    {
        id: 2,
        title: "",
        brand: "Чайный микс",
        description: "Настоящий чай для настоящих ценителей",
        tags: ["Ароматные", "Микс для гурманов"],
        imageUrl: tea,
        link: "/teas-slug-:tea",
    },
    {
        id: 3,
        title: "",
        brand: "Лимонады",
        description: "Свежесть в каждом глотке",
        tags: ["Лимонад", "Фрукты", "Основы"],
        imageUrl: coctails,
        link: "/lemonades/fruit-flavored",
    },
    {
        id: 4,
        title: "",
        brand: "Наши Правила",
        description: "Простые правила для приятного отдыха",
        tags: ["Правила", "Уважение", "Комфорт"],
        imageUrl: paradise,
        link: "/rules/command-guidelines",
    }
];

export default function Home() {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated === 'true') {
            navigate('/auth-page');
        } else {
            navigate('/profile/tab=settings');
        }
    };

    return (
        <div className="relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-4 py-6 relative z-10 min-h-screen">
                <div className="text-center mb-8">
                    <div className='absolute top-2 right-2 hidden md:block'>
                        <div
                            onClick={handleProfileClick}
                            role="button"
                            tabIndex={0}
                            aria-label="Профиль"
                            className="flex items-center justify-center p-2 bg-transparent rounded-full hover:bg-black transition cursor-pointer"
                            style={{
                                transition: 'background-color 0.3s ease',
                                boxShadow: '2px 2px 6px rgba(120, 170, 11, 0.2)',
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleProfileClick();
                                }
                            }}
                        >
                            <User onClick={handleProfileClick} size={28} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 pt-">
                        Добро пожаловать в <span className="text-[34px] md:text-[40px] text-[#c9f5f3]">Paradise Lounge!</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Погрузись в атмосферу уюта и насладись нашими вкусными миксами
                    </p>
                </div>
                <Carousel3D items={categories} />
            </div>
        </div>
    );
}