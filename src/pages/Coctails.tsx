import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TypingText } from "../components/lightswind/typingText";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fon_hook from '../assets/fon_hook.png';
import video from '../assets/IMG_5953.mp4';

export default function Cocktails() {
    const navigate = useNavigate();
    const [showFact, setShowFact] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const cocktails = [
        {
            name: "Darkside и Blackburn",
            description: "Листья Darkside и Blackburn имеют насыщенный вкус. Они отличаются сильной дымностью и богатым ароматом.",
        },
        {
            name: "Sebero и MustHave",
            description: "Обладает мягкой дымностью. Идеально подходит для тех, кто ищет баланс между насыщенностью и мягкостью.",
        },
        {
            name: "Trofimoff",
            description: "Уникальный табак Trofimoff имеет древесные ноты, насыщенный вкус. Тот кто любит покрепче.",
        },
    ];

    return (
        <div className="relative p-4 md:p-6 overflow-hidden min-h-screen">
            <div className="absolute left-0 top-0 h-full w-auto" style={{ width: '50%', height: '100vh', overflow: 'hidden' }}>
                <img
                    src={fon_hook}
                    alt=""
                    className="h-full w-full object-cover opacity-70 rounded-2xl"
                    style={{ filter: 'blur(4px)', transform: 'translateX(-40%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#00211a1b] opacity-5" />
            </div>
            <div className="flex w-full max-w-[1200px] mx-auto justify-center z-20 mt-2 relative">
                <h1 className="text-[32px] font-bold mb-4 text-white">Паровые Коктейли</h1>
            </div>
            <TypingText
                className="mb-6 text-lg text-[#f3f1d7] text-center z-20 relative"
                delay={0.5}
                duration={1.5}
                fontSize="text-[25px]"
                fontWeight="font-bold"
                color="text-[#f3f1d7]"
                letterSpacing="tracking-wide"
                align="center"
            >
                Погрузись в мир ароматных паровых коктейлей, созданных из лучших табаков:  Darkside, Blackburn, Sebero, Duft, MustHave, Trofimoff. <br /> Цена за уникальный опыт — 1000 ₽.
            </TypingText>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-20 relative bg-hookah-purple rounded-lg p-4">
                {cocktails.map((cocktail, index) => (
                    <div key={index}
                        className="bg-hookah-purple rounded-lg p-4 hover:scale-105 transition-transform duration-300 z-20 relative"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(33, 33, 33, 1)',
                        }}>
                        <h3 className="text-[22px] font-semibold text-white mb-2"
                            style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>{cocktail.name}</h3>
                        <p className="text-white text-[18px]">{cocktail.description}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center z-20 relative">
                <div className="flex items-center cursor-pointer" onClick={() => setShowFact(!showFact)}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl neumorphism-fact">
                        💡
                    </div>
                </div>

                <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="ml-auto flex items-center cursor-pointer"
                >
                    {showVideo ? (
                        <>
                            <span className="mr-2 text-2xl"></span>
                        </>
                    ) : (
                        <>
                            <span className="mr-2 text-[32px]">✨</span>
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {showFact && (
                    <div className="fixed inset-0 flex items-center justify-center z-30 bg-[#000000ec] bg-opacity-50 p-4">
                        <motion.div
                            className="bg-[#607c80] rounded-lg p-6 shadow-lg max-w-md w-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, x: '-100%' }}
                            transition={{ duration: 0.9 }}
                        >
                            <h4 className="text-xl font-semibold mb-2 text-[#e2f8f5]"
                                style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>Интересный факт</h4>
                            <p className="text-[#181e1d] text-[18px]"
                                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                А знаешь? Паровые коктейли — это современное искусство, сочетающее традиционные табачные смеси с инновационными методами подачи. Они создают уникальную атмосферу релакса и вдохновения, а использование премиальных табаков делает каждую затяжку особенной!
                            </p>
                            <button
                                onClick={() => setShowFact(false)}
                                className="mt-4 neumorphism-button">
                                Свернуть
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        <video
                            src={video}
                            playsInline
                            autoPlay
                            muted
                            onEnded={() => setShowVideo(false)}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-16">
                <button
                    onClick={() => navigate("/")}
                    className="absolute bottom-6 left-4 text-[#a4a0ab] cursor-pointer flex items-center hover:underline group z-20"
                >
                    <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="relative z-10 text-[24px] ml-2"
                        style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
            </div>
        </div >
    );
}
