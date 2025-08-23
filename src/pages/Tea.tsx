import React from "react";
import { ScrollTimeline } from "../components/lightswind/scrollTimeline";
import { DEFAULT_EVENTS } from "../components/lightswind/teaEvents";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Tea: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-auto">
      <div className="scrollable">
        <ScrollTimeline
          events={DEFAULT_EVENTS}
          title="Чайный Микс"
          subtitle="Выбери свой любимый чай"
          animationOrder="sequential"
          cardAlignment="left"
        />
      </div>
      <div
        onClick={(e) => { e.preventDefault(); navigate("/"); }}
        className="absolute bottom-6 left-4 text-[#058c6f] hover:text-[#058c6f] cursor-pointer flex items-center hover:underline group z-20"
        style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}
      >
        <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
        <span className="relative z-10 text-[24px] ml-2" style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>
          вернуть обратно
        </span>
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
      </div>
    </div>
  );
};

export default Tea;
