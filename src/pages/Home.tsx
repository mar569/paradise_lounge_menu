import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import type { Carousel3DItem } from '../components/lightswind/carousel-3d';
import Carousel3D from '../components/lightswind/carousel-3d';
import hookah from '../assets/hookah.png';
import tea from '../assets/tea.png'
import coctails from '../assets/coctails.png';
import paradise from '../assets/par.png'

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
        tags: ["Настоящий вкус", "Микс для гурманов",],
        imageUrl: tea,
        link: "/teas",
    },
    {
        id: 3,
        title: "",
        brand: "Лимонады",
        description: "Свежесть в каждом глотке",
        tags: ["Лимонад", "Фрукты", "Основы", "Лед"],
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
    useEffect(() => {
        toast.success("Добро пожаловать в мир изысканных вкусов!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
        });
    }, []);

    return (
        <div className="relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-4 py-8 relative z-10 min-h-screen">
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
