// lightswind/scrollTimeline.tsx

import { useState, useEffect, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from "framer-motion";
import { cn } from "../lib/utils";
import { Card, CardContent } from "../ui/card";
import { DEFAULT_EVENTS, type TimelineEvent } from "./teaEvents";

export interface ScrollTimelineProps {
    events: TimelineEvent[];
    title?: string;
    subtitle?: string;
    animationOrder?: "sequential" | "staggered" | "simultaneous";
    cardAlignment?: "alternating" | "left" | "right";
    lineColor?: string;
    activeColor?: string;
    progressIndicator?: boolean;
    cardVariant?: "default" | "elevated" | "outlined" | "filled";
    cardEffect?: "none" | "glow" | "shadow" | "bounce";
    parallaxIntensity?: number;
    progressLineWidth?: number;
    progressLineCap?: "round" | "square";
    dateFormat?: "text" | "badge";
    className?: string;
    revealAnimation?: "fade" | "slide" | "scale" | "flip" | "none";
    connectorStyle?: "dots" | "line" | "dashed";
    perspective?: boolean;
    darkMode?: boolean;
    smoothScroll?: boolean;
}

export const ScrollTimeline = ({
    events = DEFAULT_EVENTS,
    title = "Timeline",
    subtitle = "Scroll to explore the journey",
    animationOrder = "staggered",
    cardAlignment = "alternating",
    lineColor = "bg-primary/30",
    activeColor = "border-primary",
    progressIndicator = true,
    cardVariant = "filled",
    cardEffect = "bounce",
    parallaxIntensity = 0.2,
    progressLineWidth = 2,
    progressLineCap = "round",
    revealAnimation = "fade",
    className = "",
    connectorStyle = "dots",
    perspective = false,
    darkMode = false,
    smoothScroll = false,
}: ScrollTimelineProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    const yOffset = useTransform(
        smoothProgress,
        [0, 1],
        [parallaxIntensity * 100, -parallaxIntensity * 100]
    );

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (v) => {
            const newIndex = Math.floor(v * events.length);
            if (
                newIndex !== activeIndex &&
                newIndex >= 0 &&
                newIndex < events.length
            ) {
                setActiveIndex(newIndex);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, events.length, activeIndex]);

    const getCardVariants = (index: number) => {
        const baseDelay =
            animationOrder === "simultaneous"
                ? 0
                : animationOrder === "staggered"
                    ? index * 0.2
                    : index * 0.3;

        const initialStates = {
            fade: { opacity: 0, y: 20 },
            slide: {
                x:
                    cardAlignment === "left"
                        ? -100
                        : cardAlignment === "right"
                            ? 100
                            : index % 2 === 0
                                ? -100
                                : 100,
                opacity: 0,
            },
            scale: { scale: 0.8, opacity: 0 },
            flip: { rotateY: 90, opacity: 0 },
            none: { opacity: 1 },
        };

        return {
            initial: initialStates[revealAnimation],
            whileInView: {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotateY: 0,
                transition: {
                    duration: 0.7,
                    delay: baseDelay,
                    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],
                },
            },
            viewport: { once: false, margin: "-100px" },
        };
    };

    const getConnectorClasses = () => {
        const baseClasses = cn(
            "absolute left-1/2 transform -translate-x-1/2",
            lineColor
        );
        const widthStyle = `w-[${progressLineWidth}px]`;
        switch (connectorStyle) {
            case "dots":
                return cn(baseClasses, "w-1 rounded-full");
            case "dashed":
                return cn(
                    baseClasses,
                    widthStyle,
                    `[mask-image:linear-gradient(to_bottom,black_33%,transparent_33%,transparent_66%,black_66%)] [mask-size:1px_12px]`
                );
            case "line":
            default:
                return cn(baseClasses, widthStyle);
        }
    };

    const getCardClasses = (index: number) => {
        const baseClasses = "relative z-30 rounded-lg transition-all duration-300";
        const variantClasses = {
            default: "bg-black border shadow-sm",
            elevated: "bg-black border border-border/40 shadow-md",
            outlined: "bg-black/50 backdrop-blur border-2 border-primary/20",
            filled: "bg-black/10 border border-primary/30",
        };
        const effectClasses = {
            none: "",
            glow: "hover:shadow-[0_0_15px_rgba(var(--primary-rgb)/0.5)]",
            shadow: "hover:shadow-lg hover:-translate-y-1",
            bounce: "hover:scale-[1.03] hover:shadow-md active:scale-[0.97]",
        };
        const alignmentClassesDesktop =
            cardAlignment === "alternating"
                ? index % 2 === 0
                    ? "lg:mr-[calc(50%+20px)]"
                    : "lg:ml-[calc(50%+20px)]"
                : cardAlignment === "left"
                    ? "lg:mr-auto lg:ml-0"
                    : "lg:ml-auto lg:mr-0";
        const perspectiveClass = perspective
            ? "transform transition-transform hover:rotate-y-1 hover:rotate-x-1"
            : "";

        return cn(
            baseClasses,
            variantClasses[cardVariant],
            effectClasses[cardEffect],
            alignmentClassesDesktop,
            perspectiveClass,
            "w-full lg:w-[calc(50%-40px)]"
        );
    };

    return (
        <div
            ref={scrollRef}
            className={cn(
                "relative min-h-screen w-full overflow-hidden scrollable",
                darkMode ? "bg-background text-foreground" : "",
                smoothScroll ? "scroll-smooth" : "",
                className
            )}
        >
            <div className="text-center py-8 px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 pb-24">
                <div className="relative mx-auto">
                    <div
                        className={cn(getConnectorClasses(), "h-full absolute top-0 z-10")}
                    ></div>

                    {progressIndicator && (
                        <>
                            <motion.div
                                className="absolute top-0 z-10"
                                style={{
                                    height: progressHeight,
                                    width: progressLineWidth,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    borderRadius:
                                        progressLineCap === "round" ? "9999px" : "0px",
                                    background: `linear-gradient(to bottom, #22d3ee, #6366f1, #a855f7)`,
                                    boxShadow: `
                    0 0 15px rgba(99,102,241,0.5),
                    0 0 25px rgba(168,85,247,0.3)
                  `,
                                }}
                            />
                            <motion.div
                                className="absolute z-20"
                                style={{
                                    top: progressHeight,
                                    left: "50%",
                                    translateX: "-50%",
                                    translateY: "-50%",
                                }}
                            >
                                <motion.div
                                    className="w-5 h-5 rounded-full"
                                    style={{
                                        background:
                                            "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(99,102,241,0.5) 40%, rgba(34,211,238,0) 70%)",
                                        boxShadow: `
                      0 0 15px 4px rgba(168, 85, 247, 0.6),
                      0 0 25px 8px rgba(99, 102, 241, 0.4),
                      0 0 40px 15px rgba(34, 211, 238, 0.2)
                    `,
                                    }}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.div>
                        </>
                    )}

                    <div className="relative z-20">
                        {events.map((event, index) => {
                            return (
                                <div
                                    key={event.id || index}
                                    ref={(el) => {
                                        timelineRefs.current[index] = el;
                                    }}
                                    className={cn(
                                        "relative flex items-center mb-20 py-4",
                                        "flex-col lg:flex-row",
                                        cardAlignment === "alternating"
                                            ? index % 2 === 0
                                                ? "lg:justify-start"
                                                : "lg:flex-row-reverse lg:justify-start"
                                            : cardAlignment === "left"
                                                ? "lg:justify-start"
                                                : "lg:flex-row-reverse lg:justify-start"
                                    )}
                                    style={{
                                        transform: `translateY(${yOffset.get()}px)`,
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1/2 transform -translate-y-1/2 z-30",
                                            "left-1/2 -translate-x-1/2"
                                        )}
                                    >
                                        <motion.div
                                            className={cn(
                                                "w-6 h-6 rounded-2xl border-2 bg-black flex items-center justify-center", // Измените на bg-black
                                                index <= activeIndex
                                                    ? activeColor
                                                    : "border bg-card"
                                            )}
                                            animate={
                                                index <= activeIndex
                                                    ? {
                                                        scale: [1, 1.3, 1],
                                                        boxShadow: [
                                                            "0 0 0px rgba(99,102,241,0)",
                                                            "0 0 12px rgba(99,102,241,0.6)",
                                                            "0 0 0px rgba(99,102,241,0)",
                                                        ],
                                                    }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                repeatDelay: 4,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </div>
                                    <motion.div
                                        className={cn(
                                            getCardClasses(index),
                                            "mt-12 lg:mt-0"
                                        )}
                                        variants={getCardVariants(index)}
                                        initial="initial"
                                        whileInView="whileInView"
                                        viewport={{ once: false, margin: "-100px" }}
                                    >
                                        <Card className="bg-black rounded-xl shadow-2xl">
                                            <CardContent className="p-6">
                                                <h3 className="text-[28px] font-bold mb-2 text-[#f3f1d7]" style={{ fontFamily: "Bebas Neue" }}>
                                                    {event.title}
                                                </h3>
                                                {event.subtitle && (
                                                    <p className="text-[18px] font-semibold mb-2" style={{ fontFamily: "Bebas Neue" }}>
                                                        {event.subtitle}
                                                    </p>
                                                )}
                                                <p className="text-muted-foreground mb-4">
                                                    {event.description}
                                                </p>
                                                <div className="h-[1px] bg-[#902bf4] mb-4"></div>
                                                <div className="flex items-end">
                                                    <p className="font-bold text-xl text-[#f3f1d7] ">
                                                        {event.price}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
