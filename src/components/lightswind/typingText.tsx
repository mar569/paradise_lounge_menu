"use client";

import { motion, type Variants } from "framer-motion";
import React, {
    useEffect,
    useState,
    type ElementType,
    type ReactNode,
} from "react";
import { cn } from "../lib/utils";

export interface TypingTextProps {
    children: ReactNode;
    as?: ElementType;
    className?: string;
    delay?: number;
    duration?: number;
    fontSize?: string;
    fontWeight?: string;
    style?: React.CSSProperties;
    color?: string;
    letterSpacing?: string;
    align?: "left" | "center" | "right";
    loop?: boolean;
}

export const TypingText = ({
    children,
    as: Component = "div",
    className = "",
    delay = 0,
    duration = 2,
    fontSize = "text-3xl",
    fontWeight = "font-bold",
    color = "text-white",
    letterSpacing = "tracking-wide",
    align = "left",
    style,
}: TypingTextProps) => {
    const [textContent, setTextContent] = useState<string>("");

    useEffect(() => {
        const extractText = (node: ReactNode): string => {
            if (typeof node === "string" || typeof node === "number") {
                return node.toString();
            }
            if (Array.isArray(node)) {
                return node.map(extractText).join("");
            }
            if (React.isValidElement(node)) {
                const element = node as React.ReactElement<{ children?: ReactNode }>;
                return extractText(element.props.children);
            }
            return "";
        };

        setTextContent(extractText(children));
    }, [children]);

    const words = textContent.split(" ").map((word, index) => ({
        word,
        index,
    }));

    const characterVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: delay + i * (duration / words.length),
                duration: 0.3,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <Component
            className={cn(
                "inline-flex",
                className,
                fontSize,
                fontWeight,
                color,
                letterSpacing,
                align === "center"
                    ? "justify-center text-center"
                    : align === "right"
                        ? "justify-end text-right"
                        : "justify-start text-left"
            )}
            style={{ ...style, fontFamily: 'Roboto, sans-serif' }} // Ensure Roboto is applied
        >
            <motion.span
                className="inline-block"
                initial="hidden"
                animate="visible"
                aria-label={textContent}
                role="text"
            >
                {words.map(({ word, index }) => (
                    <motion.span
                        key={`${word}-${index}`}
                        className="inline-block"
                        variants={characterVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                    >
                        {word} {index < words.length - 1 && <>&nbsp;</>}
                    </motion.span>
                ))}
            </motion.span>
        </Component>
    );
};
