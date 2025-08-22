import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, X } from "lucide-react";

export type StrengthLevel = "empty" | "weak" | "medium" | "strong" | "very-strong";

export interface PasswordStrengthIndicatorProps {
    value: string;
    className?: string;
    label?: string;
    showScore?: boolean;
    showScoreNumber?: boolean;
    onChange?: (value: string) => void;
    onStrengthChange?: (strength: StrengthLevel) => void;
    placeholder?: string;
    showVisibilityToggle?: boolean;
}

// Расчет силы пароля на основе общих правил
const calculateStrength = (password: string): { score: number; level: StrengthLevel } => {
    if (!password) return { score: 0, level: "empty" };

    let score = 0;

    // Проверка длины
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;

    // Проверка разнообразия символов
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Определение уровня на основе баллов
    let level: StrengthLevel = "empty";
    if (score === 0) level = "empty";
    else if (score <= 2) level = "weak";
    else if (score <= 4) level = "medium";
    else if (score <= 5) level = "strong";
    else level = "very-strong";

    return { score, level };
};

// Цвета для различных уровней силы
const strengthColors = {
    empty: "bg-[#ff0000b0]",
    weak: "bg-red-500",
    medium: "bg-orange-500",
    strong: "bg-green-500",
    "very-strong": "bg-emerald-500",
};


export function PasswordStrengthIndicator({
    value,
    className,
    label = "",
    showScoreNumber = false,
    onChange,
    onStrengthChange,
    placeholder = "Введите ваш пароль",
    showVisibilityToggle = true,
}: PasswordStrengthIndicatorProps) {
    const [password, setPassword] = useState(value || "");
    const [showPassword, setShowPassword] = useState(false);
    const { score, level } = calculateStrength(password);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (onStrengthChange) {
            onStrengthChange(level);
        }
    }, [level, onStrengthChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPassword(newValue);
        if (onChange) onChange(newValue);
    };

    const toggleVisibility = () => {
        setShowPassword(!showPassword);

        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 0);
    };

    const handleDelete = () => {
        setPassword("");
        if (onChange) onChange("");
    };

    return (
        <div className={`${className} w-full`}>
            {label && (
                <div className="flex justify-between items-center">
                    <label htmlFor="password" className="font-medium text-gray-700">{label}</label>
                    {showScoreNumber && (
                        <span className="text-xs text-gray-500">
                            {Math.floor((score / 6) * 10)}/10
                        </span>
                    )}
                </div>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className=" p-2 w-full max-w-[90%] pr-10 rounded-md focus:outline-none  transition duration-200"
                />

                {showVisibilityToggle && (
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 cursor-pointer" />
                        ) : (
                            <Eye className="h-5 w-5 cursor-pointer" />
                        )}
                    </button>
                )}

                {password && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        aria-label="Удалить пароль"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="h-1 w-full pr-2 pl-2 bg-transparent rounded-full overflow-hidden flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${i < Math.min(Math.ceil(score / 1.5), 4) ? strengthColors[level] : "bg-[#6e6e6e]"}`}
                    />
                ))}
            </div>
        </div>
    );
}
