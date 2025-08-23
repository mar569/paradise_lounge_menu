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
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/")}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate("/");
                        }
                    }}
                    className="text-[#058c6f] cursor-pointer flex items-center hover:underline group z-20 mt-6"
                >
                    <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="relative z-10 text-[24px] ml-2" style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>
                        вернуть обратно
                    </span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div onClick={() => setOpenFine(!openFine)}>
                    <span className="mt-6 right-4 text-[#a4a0ab] border border-[#2c2c2c] rounded-lg px-2 py-1 cursor-pointer flex items-center hover:underline">Штрафы</span >
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
                                <div className="flex float-right mt-2">
                                    <button
                                        onClick={() => setOpenFine(false)}
                                        className="neumorphism-button">
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


