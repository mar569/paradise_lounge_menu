import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rules() {
    const navigate = useNavigate();
    const [openFine, setOpenFine] = useState(false);


    const rules = [
        "🚭 Не курим сигареты внутри — даже если очень хочется, у нас есть специальные места для этого.",
        "🤝 Уважайте других гостей и кальянного мастера — они тоже пришли расслабиться, а не спорить о том, кто лучше курит.",
        "👥 Компания от 4 человек? Тогда 2 кальяна — это минимум! Чем больше, тем вкуснее.",
        "💸 Пробковый сбор — всего 200 рублей за единицу. Не волнуйтесь, это не налог, а вклад в хорошее настроение.",
        "🎶 Наслаждайтесь атмосферой и расслабляйтесь! Но не забудьте оставить свои гаджеты в режиме 'не мешать' — мы тут не для селфи.",
        "🕒 Время работы — как хорошая шутка: максимум до 1:00 ночи. После этого мы закрываем лавочку. Не опаздывайте — иначе придется ждать следующего дня!",
        "😄 И самое главное: улыбайтесь! Хорошее настроение — это как хороший кальян: чем больше, тем лучше.",
    ];

    const renderItem = (item: string) => (
        <div className="p-4 bg-black border border-[#2c2c2c] rounded-lg shadow-md">
            <p className="text-lg">{item}</p>
        </div>
    );

    return (
        <div className="p-8 text-white rounded-lg shadow-lg max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Наши Правила (или как не испортить атмосферу)</h1>
            <div className="flex flex-col gap-4"
            >
                {rules.map((rule, index) => (
                    <div key={index}>
                        {renderItem(rule)}
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 left-4 text-[#058c6f] cursor-pointer flex items-center hover:underline group"
                >
                    <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="relative z-10 text-[24px] ml-2"
                        style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>

                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <div onClick={() => setOpenFine(!openFine)}>
                    <button className="mt-6 right-4 text-[#a4a0ab] bg-[#0b0b0b] border border-[#2c2c2c] rounded-lg px-2 py-1 cursor-pointer flex items-center hover:underline">Штрафы</button>
                </div>
                <AnimatePresence>
                    {openFine && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/90  p-6">
                            <motion.div
                                className="bg-[#0b0b0b] rounded-lg p-6 shadow-xl max-w-md w-full border-1 border-amber-50"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, x: '-100%' }}
                                transition={{ duration: 0.9 }}
                            >

                                <ul className="text-[#f0eeee] list-disc pl-6 space-y-2 text-[20px]">
                                    <li>За разбитую колбу - 1500 ₽.</li>
                                    <li>За разбитую чашу - 700 ₽.</li>
                                    <li>Прожег диван? - стоимость ремонта.</li>
                                </ul>
                                <div className="flex float-right">
                                    <button
                                        onClick={() => setOpenFine(false)}
                                        className=" neumorphism-button">
                                        Свернуть
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}




// import { useEffect, useState } from 'react';
// import { Routes, Route } from 'react-router-dom';

// import 'react-toastify/dist/ReactToastify.css';
// import PageLayout from './components/PageLayout';
// import Home from './pages/Home';
// import Lemonades from './pages/Lemonades';
// import Rules from './pages/Rules';
// import ParticleOrbitEffect from './components/lightswind/particleOrbitEffect';
// import ShaderBackground from './components/lightswind/shadedBackground';
// import Tea from './pages/Tea';
// import Cocktails from './pages/Coctails';


// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {loading ? (
//         <ParticleOrbitEffect className="absolute inset-0" />
//       ) : (
//         <div className="relative">
//           <ShaderBackground className="absolute inset-0" color="#07EAC0" backdropBlurAmount="md" />
//           <PageLayout>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/cocktails" element={<Cocktails />} />
//               <Route path="/teas" element={<Tea />} />
//               <Route path="/lemonades" element={<Lemonades />} />
//               <Route path="/rules" element={<Rules />} />
//             </Routes>
//           </PageLayout>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import { motion } from 'framer-motion';
// import type { Carousel3DItem } from '../components/lightswind/carousel-3d';
// import Carousel3D from '../components/lightswind/carousel-3d';
// import hookah from '../assets/hookah.png';
// import tea from '../assets/tea.png'
// import coctails from '../assets/coctails.png';
// import paradise from '../assets/par.png'

// const categories: Carousel3DItem[] = [
//     {
//         id: 1,
//         title: "",
//         brand: "Паровые Коктейли",
//         description: "Дым и вкус — идеальное сочетание",
//         tags: ["Дымно", "Миксы под настроение"],
//         imageUrl: hookah,
//         link: "/cocktails",
//     },
//     {
//         id: 2,
//         title: "",
//         brand: "Чайный микс",
//         description: "Настоящий чай для настоящих ценителей",
//         tags: ["Ароматные", "Микс для гурманов",],
//         imageUrl: tea,
//         link: "/teas",
//     },
//     {
//         id: 3,
//         title: "",
//         brand: "Лимонады",
//         description: "Свежесть в каждом глотке",
//         tags: ["Лимонад", "Фрукты", "Основы",],
//         imageUrl: coctails,
//         link: "/lemonades",
//     },
//     {
//         id: 4,
//         title: "",
//         brand: "Наши Правила",
//         description: "Простые правила для приятного отдыха",
//         tags: ["Правила", "Уважение", "Комфорт"],
//         imageUrl: paradise,
//         link: "/rules",
//     }
// ];

// export default function Home() {
//     return (
//         <div className="relative overflow-hidden min-h-screen">
//             <div className="container mx-auto px-4 py-8 relative z-10 min-h-screen">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8 }}
//                     className="text-center mb-8"
//                 >
//                     <h1 className="text-4xl md:text-5xl font-bold mb-2">
//                         Добро пожаловать в <span className="text-[34px] md:text-[40px] text-[#c9f5f3]">Paradise Lounge!</span>
//                     </h1>
//                     <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//                         Погрузись в атмосферу уюта и насладись нашими вкусными миксами
//                     </p>
//                 </motion.div>

//                 <Carousel3D items={categories} />
//             </div>
//         </div>
//     );
// }
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { TypingText } from "../components/lightswind/typingText";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import fon_hook from '../assets/fon_hook.png';
// import video from '../assets/IMG_5953.mp4';

// export default function Cocktails() {
//     const navigate = useNavigate();
//     const [showFact, setShowFact] = useState(false);
//     const [showVideo, setShowVideo] = useState(false);

//     const cocktails = [
//         {
//             name: "Darkside и Blackburn",
//             description: "Листья Darkside и Blackburn имеют насыщенный вкус. Они отличаются сильной дымностью и богатым ароматом.",
//         },
//         {
//             name: "Sebero и MustHave",
//             description: "Обладает мягкой дымностью. Идеально подходит для тех, кто ищет баланс между насыщенностью и мягкостью.",
//         },
//         {
//             name: "Trofimoff",
//             description: "Уникальный табак Trofimoff имеет древесные ноты, насыщенный вкус. Тот кто любит покрепче.",
//         },
//     ];

//     return (
//         <div className="relative p-4 md:p-6 overflow-hidden min-h-screen">
//             <div className="absolute left-0 top-0 h-full w-auto" style={{ width: '50%', height: '100vh', overflow: 'hidden' }}>
//                 <img
//                     src={fon_hook}
//                     alt=""
//                     className="h-full w-full object-cover opacity-70 rounded-2xl"
//                     style={{ filter: 'blur(4px)', transform: 'translateX(-40%)' }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#00211a1b] opacity-5" />
//             </div>
//             <div className="flex w-full max-w-[1200px] mx-auto justify-center z-20 mt-2 relative">
//                 <h1 className="text-[32px] font-bold mb-4 text-white">Паровые Коктейли</h1>
//             </div>
//             <TypingText
//                 className="mb-6 text-lg text-[#f3f1d7] text-center z-20 relative"
//                 delay={0.5}
//                 duration={1.5}
//                 fontSize="text-[25px]"
//                 fontWeight="font-bold"
//                 color="text-[#f3f1d7]"
//                 letterSpacing="tracking-wide"
//                 align="center"
//             >
//                 Погрузись в мир ароматных паровых коктейлей, созданных из лучших табаков:  Darkside, Blackburn, Sebero, Duft, MustHave, Trofimoff. <br /> Цена за уникальный опыт — 1000 ₽.
//             </TypingText>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-20 relative bg-hookah-purple rounded-lg p-4">
//                 {cocktails.map((cocktail, index) => (
//                     <div key={index}
//                         className="bg-hookah-purple rounded-lg p-4 hover:scale-105 transition-transform duration-300 z-20 relative"
//                         style={{
//                             boxShadow: '0 25px 50px -12px rgba(33, 33, 33, 1)',
//                         }}>
//                         <h3 className="text-[22px] font-semibold text-white mb-2"
//                             style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>{cocktail.name}</h3>
//                         <p className="text-white text-[18px]">{cocktail.description}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className="mt-4 flex items-center z-20 relative">
//                 <div className="flex items-center cursor-pointer" onClick={() => setShowFact(!showFact)}>
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl neumorphism-fact">
//                         💡
//                     </div>
//                 </div>

//                 <button
//                     onClick={() => setShowVideo(!showVideo)}
//                     className="ml-auto flex items-center cursor-pointer"
//                 >
//                     {showVideo ? (
//                         <>
//                             <span className="mr-2 text-2xl"></span>
//                         </>
//                     ) : (
//                         <>
//                             <span className="mr-2 text-[32px]">✨</span>
//                         </>
//                     )}
//                 </button>
//             </div>

//             <AnimatePresence>
//                 {showFact && (
//                     <div className="fixed inset-0 flex items-center justify-center z-30 bg-[#000000ec] bg-opacity-50 p-4">
//                         <motion.div
//                             className="bg-[#607c80] rounded-lg p-6 shadow-lg max-w-md w-full"
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.8, x: '-100%' }}
//                             transition={{ duration: 0.9 }}
//                         >
//                             <h4 className="text-xl font-semibold mb-2 text-[#e2f8f5]"
//                                 style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>Интересный факт</h4>
//                             <p className="text-[#181e1d] text-[18px]"
//                                 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
//                                 А знаешь? Паровые коктейли — это современное искусство, сочетающее традиционные табачные смеси с инновационными методами подачи. Они создают уникальную атмосферу релакса и вдохновения, а использование премиальных табаков делает каждую затяжку особенной!
//                             </p>
//                             <button
//                                 onClick={() => setShowFact(false)}
//                                 className="mt-4 neumorphism-button">
//                                 Свернуть
//                             </button>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>

//             <AnimatePresence>
//                 {showVideo && (
//                     <motion.div
//                         className="absolute top-0 left-0 w-full h-full z-0"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 1, ease: "easeInOut" }}
//                     >
//                         <video
//                             src={video}
//                             playsInline
//                             autoPlay
//                             muted
//                             onEnded={() => setShowVideo(false)}
//                             className="w-full h-full object-cover"
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <div className="mt-16">
//                 <button
//                     onClick={() => navigate("/")}
//                     className="absolute bottom-6 left-4 text-[#a4a0ab] cursor-pointer flex items-center hover:underline group z-20"
//                 >
//                     <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
//                     <span className="relative z-10 text-[24px] ml-2"
//                         style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>
//                     <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
//                 </button>
//             </div>
//         </div >
//     );
// }
// import React from "react";
// import { ScrollTimeline } from "../components/lightswind/scrollTimeline";
// import { DEFAULT_EVENTS } from "../components/lightswind/teaEvents";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// const Tea: React.FC = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="relative h-auto">
//       <div className="scrollable">
//         <ScrollTimeline
//           events={DEFAULT_EVENTS}
//           title="Чайный Микс"
//           subtitle="Выбери свой любимый чай"
//           animationOrder="sequential"
//           cardAlignment="left"
//         />
//       </div>
//       <button
//         onClick={() => navigate("/")}
//         className="absolute bottom-6 left-4 text-[#a4a0ab] cursor-pointer flex items-center hover:underline  group"
//       >
//         <ArrowLeft className=" w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
//         <span className="relative z-10 text-[24px] ml-2"
//           style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>

//         <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
//       </button>
//     </div>
//   );
// };

// export default Tea;
// // src/pages/Lemonades.tsx
// import { useNavigate } from "react-router-dom";
// import { CountGroup } from "../components/lightswind/countGroup";
// import { ArrowLeft } from "lucide-react";

// export default function Lemonades() {
//     const navigate = useNavigate();

//     const lemonades = [
//         {
//             name: "Мохито",
//             description: "Освежающий лимонад с лаймом и легкой сладостью",
//             price: 350,
//         },
//         {
//             name: "Лимонад Клубника",
//             description: "Натуральный, тонизирующий лимонад из клубники.",
//             price: 400,
//         },
//         {
//             name: "Лимонад Ягодный",
//             description: "Густой напиток с добавлением лесных ягод и лимона.",
//             price: 400,
//         },
//         {
//             name: "Лимонад Манго-Маракуя",
//             description: "Экзотический лимонад с насыщенным вкусом манго и маракуи, освежающий и ароматный.",
//             price: 400,
//         },
//     ];

//     return (
//         <div className="p-8 w-full max-w-[1200px] mx-auto">
//             <h2 className="text-[36px] text-center font-bold mb-4 text-[#f3f1d7]">Лимонады</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {lemonades.map((lemonade, index) => (
//                     <div key={index} className="rounded-lg p-4 "
//                         style={{
//                             boxShadow: '0 25px 50px -12px rgba(33, 33, 33, 1)',
//                         }}>
//                         <h2 className="text-[22px] font-medium text-[#d7d3a1]"
//                             style={{ fontFamily: "font-serif" }}>{lemonade.name}</h2>
//                         <div className="text-[#c4c4c4] font-extralight pt-2">{lemonade.description}</div>
//                         <div className="flex items-center gap-6 pt-2">
//                             <div className="text-sm text-[#ebeae1]"> 950 мл.</div>
//                             <CountGroup
//                                 value={lemonade.price}
//                                 duration={2}
//                                 prefix=""
//                                 suffix=" ₽"
//                                 decimals={0}
//                                 textColor="text-[#d7d3a1]"
//                                 fontFamily="font-serif"
//                                 animationStyle="bounce"
//                                 easing="easeInOut"
//                                 className="text-[20px] font-bold"
//                             />
//                         </div>

//                     </div>
//                 ))}
//             </div>
//             <button
//                 onClick={() => navigate("/")}
//                 className="text-[#a4a0ab] cursor-pointer flex items-center hover:underline relative group mt-4"
//             >
//                 <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
//                 <span className="relative z-10 text-[24px] ml-2"
//                     style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>

//                 <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
//             </button>
//         </div>
//     );
// }
// import { AnimatePresence, motion } from "framer-motion";
// import { ArrowLeft } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Rules() {
//     const navigate = useNavigate();
//     const [openFine, setOpenFine] = useState(false);


//     const rules = [
//         "🚭 Не курим сигареты внутри — даже если очень хочется, у нас есть специальные места для этого.",
//         "🤝 Уважайте других гостей и кальянного мастера — они тоже пришли расслабиться, а не спорить о том, кто лучше курит.",
//         "👥 Компания от 4 человек? Тогда 2 кальяна — это минимум! Чем больше, тем вкуснее.",
//         "💸 Пробковый сбор — всего 200 рублей за единицу. Не волнуйтесь, это не налог, а вклад в хорошее настроение.",
//         "🎶 Наслаждайтесь атмосферой и расслабляйтесь! Но не забудьте оставить свои гаджеты в режиме 'не мешать' — мы тут не для селфи.",
//         "🕒 Время работы — как хорошая шутка: максимум до 1:00 ночи. После этого мы закрываем лавочку. Не опаздывайте — иначе придется ждать следующего дня!",
//         "😄 И самое главное: улыбайтесь! Хорошее настроение — это как хороший кальян: чем больше, тем лучше.",
//     ];

//     const renderItem = (item: string) => (
//         <div className="p-4 bg-black border border-[#2c2c2c] rounded-lg shadow-md">
//             <p className="text-lg">{item}</p>
//         </div>
//     );

//     return (
//         <div className="p-8 text-white rounded-lg shadow-lg max-w-2xl mx-auto">
//             <h1 className="text-4xl font-bold mb-6 text-center">Наши Правила (или как не испортить атмосферу)</h1>
//             <div className="flex flex-col gap-4"
//             >
//                 {rules.map((rule, index) => (
//                     <div key={index}>
//                         {renderItem(rule)}
//                     </div>
//                 ))}
//             </div>
//             <div className="flex justify-between">
//                 <button
//                     onClick={() => navigate("/")}
//                     className="mt-6 left-4 text-[#a4a0ab] cursor-pointer flex items-center hover:underline group"
//                 >
//                     <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
//                     <span className="relative z-10 text-[24px] ml-2"
//                         style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>

//                     <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
//                 </button>
//                 <div onClick={() => setOpenFine(!openFine)}>
//                     <button className="mt-6 right-4 text-[#a4a0ab] border border-[#2c2c2c] rounded-lg px-2 py-1 cursor-pointer flex items-center hover:underline">Штрафы</button>
//                 </div>
//                 <AnimatePresence>
//                     {openFine && (
//                         <div className="fixed inset-0 flex items-center justify-center bg-black/90  p-6">
//                             <motion.div
//                                 className="bg-[#0b0b0b] rounded-lg p-6 shadow-xl max-w-md w-full border-1 border-amber-50"
//                                 initial={{ opacity: 0, scale: 0.8 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 exit={{ opacity: 0, scale: 0.8, x: '-100%' }}
//                                 transition={{ duration: 0.9 }}
//                             >

//                                 <ul className="text-[#f0eeee] list-disc pl-6 space-y-2 text-[20px]">
//                                     <li>За разбитую колбу - 1500 ₽.</li>
//                                     <li>За разбитую чашу - 700 ₽.</li>
//                                     <li>Прожег диван? - по стоимости ремонта.</li>
//                                 </ul>
//                                 <div className="flex float-right">
//                                     <button
//                                         onClick={() => setOpenFine(false)}
//                                         className=" neumorphism-button">
//                                         Свернуть
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         </div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// }
// вот немного вам моего проекта для большего понимания что я хочу реализовать  Общие цели и требования
// Обеспечить безопасную регистрацию пользователей с подтверждением по email.
// Отправлять на email пользователя письмо от имени "BlackBox AI" с проверочным кодом.
// Хранить аккаунты и данные пользователей надежно и защищенно.
// Обеспечить корректную работу сайта без ошибок при подтверждении, даже при задержках доставки писем.
// Минимизировать сбои, связанные с асинхронностью или нагрузкой.
// Внедрить механизмы защиты от злоупотреблений (например, ограничение попыток ввода кода). Firebase Authentication	Хранение учетных записей (email + пароль)
// Firestore	Хранение данных о статусе пользователя, проверочных кодах, попытках подтверждения
// Firebase Cloud Functions	Генерация кода, отправка писем, проверка кода
// Email-сервис (например, SendGrid)	Отправка писем с проверочным кодом
// Веб-интерфейс (React TS)	Формы регистрации и подтверждения. Структура базы данных Firestore. Процесс регистрации
// Шаги:
// Пользователь заполняет форму:

// Email
// Пароль
// Подтверждение пароля
// На фронтенде происходит предварительная проверка:

// Валидность email
// Совпадение паролей
// После проверки вызывается API Firebase Authentication для создания аккаунта: После успешной регистрации вызывается Cloud Function sendVerificationCode, которая:
// Генерирует уникальный 6-значный код.
// Сохраняет его в Firestore вместе с метками времени и счетчиком попыток.
// Отправляет письмо на email пользователя с этим кодом. Генерация и отправка проверочного кода (Cloud Function)
// Создайте Cloud Function sendVerificationCode, которая:

// Генерирует случайный 6-значный код.
// Записывает его в Firestore в документе пользователя (verificationCode, codeGeneratedAt, codeAttempts=0).
// Отправляет письмо через SendGrid или другой сервис.
// Пример реализации Cloud Function:  Ввод кода пользователем и его проверка
// Шаги:
// Пользователь вводит полученный код на сайте.
// Фронтенд вызывает API или Cloud Function verifyUserCode для проверки. Важные моменты:
// После успешного подтверждения меняется статус на 'active'.
// При превышении лимита попыток — блокировать или требовать повторную регистрацию. Обеспечение надежности и безопасности
// Правила Firestore: Защита от спама:
// Внедрите капчу при запросе отправки кода.
// Ограничьте частоту запросов через правила или серверные функции.
// Ограничение попыток:
// Храните счетчик codeAttempts.
// После лимита — блокируйте повторные попытки или требуйте повторной регистрации.
// Обработка ошибок:
// На фронтенде показывайте понятные сообщения при ошибках.
// Автоматическая очистка просроченных кодов:
// Создайте периодическую функцию (cron), которая удаляет или сбрасывает устаревшие коды через определенное время (например, сутки). распишите полноценные подробные компоненты и тд , с полного нуля до старта используя мой проект, мою структуру проекта 