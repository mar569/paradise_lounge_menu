import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

export interface Carousel3DItem {
  id: number;
  title: string;
  brand: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

interface Carousel3DProps {
  items: Carousel3DItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
}

const Carousel3D = ({
  items,
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 500,
}: Carousel3DProps) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 opacity-60 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0";
  };

  return (
    <section
      id="carousel3d"
      className="bg-transparent min-w-full mx-auto flex items-center justify-center"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 min-w-[350px] md:min-w-[1000px] max-w-7xl">
        <div
          className="relative overflow-hidden min-h-[500px] h-[60vh] lg:h-[65vh] 2xl:h-[70vh]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute  top-0 left-0 w-full h-full flex items-center justify-center ">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(index)}`}
              >
                <Card className={`overflow-hidden bg-background h-[${cardHeight}px] border-2 border-[#5a6360] shadow-sm hover:shadow-md flex flex-col`}>
                  <div
                    className="relative bg-black p-6 flex items-center justify-center h-55 overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",

                    }}
                  >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 text-center text-white">
                      <h3 className="text-2xl font-bold mb-2" style={{ textShadow: "2px 2px 4px rgba(128, 150, 10, 0.7)", fontFamily: "'Nunito', sans-serif" }}>
                        {item.brand.toUpperCase()}
                      </h3>
                      <div className="w-18 h-0.5 bg-[#88c0a7] mx-auto " />
                      <p className="text-[20px]">{item.title}</p>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow bg-[#070707]">
                    <h3 className="text-[24px] text-[#e3ebe9] font-bold mb-1 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-[20px] flex-grow">
                      {item.description}
                    </p>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-[16px] bg-[#cef8e7] text-[#242525] rounded-full animate-pulse-slow"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={item.link}
                        className="text-gray-500 flex items-center hover:underline relative group hover:text-[#058c6f]"
                        onClick={() => {
                          if (item.link.startsWith("/")) {
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        <span className="relative z-10 text-[18px] text-[#cef1ea] hover:text-[#058c6f]" style={{ fontFamily: "'Nunito', sans-serif" }}>Просмотреть</span>
                        <ArrowRight className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#058c6f] transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {!isMobile && (
            <>
              <span
                className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)}
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8 cursor-pointer" />
              </span>
              <span
                className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8 cursor-pointer" />
              </span>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {items.map((_, idx) => (
              <span
                key={idx}
                className={`w-6 h-4 cursor-pointer rounded-full transition-all duration-300 ${active === idx ? "bg-[#7db39b] w-8" : "bg-gray-200 hover:bg-gray-300"}`}
                onClick={() => setActive(idx)}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel3D;
