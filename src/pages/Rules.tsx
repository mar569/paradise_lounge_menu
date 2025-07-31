import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Rules() {
    const navigate = useNavigate();
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
            <button
                onClick={() => navigate("/")}
                className="mt-6 left-4 text-[#a4a0ab] cursor-pointer flex items-center hover:underline group" // Добавлен отступ снизу
            >
                <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                <span className="relative z-10 text-[22px] ml-2">вернуться обратно</span>

                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
        </div>
    );
}
