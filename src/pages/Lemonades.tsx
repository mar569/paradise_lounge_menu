// src/pages/Lemonades.tsx
import { useNavigate } from "react-router-dom";
import { CountGroup } from "../components/lightswind/countGroup";
import { ArrowLeft } from "lucide-react";

export default function Lemonades() {
    const navigate = useNavigate();

    const lemonades = [
        {
            name: "Мохито",
            description: "Освежающий лимонад с лаймом и легкой сладостью",
            price: 350,
        },
        {
            name: "Лимонад Клубника",
            description: "Натуральный, тонизирующий лимонад из клубники.",
            price: 400,
        },
        {
            name: "Лимонад Ягодный",
            description: "Густой напиток с добавлением лесных ягод и лимона.",
            price: 400,
        },
        {
            name: "Лимонад Манго-Маракуя",
            description: "Экзотический лимонад с насыщенным вкусом манго и маракуи, освежающий и ароматный.",
            price: 400,
        },
    ];

    return (
        <div className="p-8 w-full max-w-[1200px] mx-auto">
            <h2 className="text-[36px] text-center font-bold mb-4 text-[#f3f1d7]">Лимонады</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lemonades.map((lemonade, index) => (
                    <div key={index} className="rounded-lg p-4 "
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(33, 33, 33, 1)',
                        }}>
                        <h2 className="text-[22px] font-medium text-[#d7d3a1]"
                            style={{ fontFamily: "font-serif" }}>{lemonade.name}</h2>
                        <div className="text-[#c4c4c4] font-extralight pt-2">{lemonade.description}</div>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="text-sm text-[#ebeae1]"> 950 мл.</div>
                            <CountGroup
                                value={lemonade.price}
                                duration={2}
                                prefix=""
                                suffix=" ₽"
                                decimals={0}
                                textColor="text-[#d7d3a1]"
                                fontFamily="font-serif"
                                animationStyle="bounce"
                                easing="easeInOut"
                                className="text-[20px] font-bold"
                            />
                        </div>

                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate("/")}
                className="text-[#a4a0ab] cursor-pointer flex items-center hover:underline relative group mt-4"
            >
                <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                <span className="relative z-10 text-[24px] ml-2"
                    style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>вернуться обратно</span>

                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
        </div>
    );
}
