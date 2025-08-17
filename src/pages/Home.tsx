import { useState } from 'react';
import { motion } from 'framer-motion';
import Carousel3D, { type Carousel3DItem } from '../components/lightswind/carousel-3d';
import hookah from '../assets/hookah.png';
import tea from '../assets/tea.png';
import coctails from '../assets/coctails.png';
import paradise from '../assets/par.png';
import HamburgerMenuOverlay from '../components/lightswind/HamburgerMenuOverlay';

const categories: Carousel3DItem[] = [
    {
        id: 1,
        title: "",
        brand: "Паровые Коктейли",
        description: "Дым и вкус — идеальное сочетание",
        tags: ["Дымно", "Миксы под настроение"],
        imageUrl: hookah,
        link: "/cocktails",
    },
    {
        id: 2,
        title: "",
        brand: "Чайный микс",
        description: "Настоящий чай для настоящих ценителей",
        tags: ["Ароматные", "Микс для гурманов"],
        imageUrl: tea,
        link: "/teas",
    },
    {
        id: 3,
        title: "",
        brand: "Лимонады",
        description: "Свежесть в каждом глотке",
        tags: ["Лимонад", "Фрукты", "Основы"],
        imageUrl: coctails,
        link: "/lemonades",
    },
    {
        id: 4,
        title: "",
        brand: "Наши Правила",
        description: "Простые правила для приятного отдыха",
        tags: ["Правила", "Уважение", "Комфорт"],
        imageUrl: paradise,
        link: "/rules",
    }
];

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            label: "Профиль",
            onClick: () => {
                // Handle profile click
                setIsMenuOpen(false);
                // Navigate to profile page or perform other actions
            },
        },
    ];

    return (
        <div className="relative overflow-hidden min-h-screen">
            <div className='absolute top-0 left-0 w-full h-full'>
                <HamburgerMenuOverlay
                    items={menuItems}
                    isOpen={isMenuOpen}
                    onRequestClose={() => setIsMenuOpen(false)} // Use onRequestClose to close the menu
                    buttonTop="60px" // Provide required props
                    buttonLeft="60px"
                    buttonSize="md"
                    buttonColor="#000" // Example color
                    overlayBackground="radial-gradient(circle, rgba(33, 32, 32, 0.99) 16%, rgba(33, 32, 32, 0.99) 41%, rgba(33, 32, 32, 1) 69%, rgba(22, 28, 22, 0.9) 94%)"
                    textColor="#ffffff"
                    fontSize="md"
                    fontFamily='"Krona One", monospace'
                    fontWeight="bold"
                    animationDuration={1.5}
                    staggerDelay={0}
                    menuAlignment="left"
                    className=""
                    buttonClassName=""
                    menuItemClassName=""
                    keepOpenOnItemClick={false}
                    customButton={null}
                    ariaLabel="Navigation menu"
                    onOpen={() => setIsMenuOpen(true)} // Optional, if you want to handle open
                    onClose={() => setIsMenuOpen(false)} // Optional, if you want to handle close
                    menuDirection="vertical"
                    enableBlur={false}
                    zIndex={1000}
                />
            </div>
            <div className="container mx-auto px-4 py-8 pt-10 relative z-10 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Добро пожаловать в <span className="text-[34px] md:text-[40px] text-[#c9f5f3]">Paradise Lounge!</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Погрузись в атмосферу уюта и насладись нашими вкусными миксами
                    </p>
                </motion.div>
                <Carousel3D items={categories} />
            </div>
        </div>
    );
}
