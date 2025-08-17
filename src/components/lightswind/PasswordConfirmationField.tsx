import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface PasswordConfirmationFieldProps {
    value: string;
    onChange: (value: string) => void;
    showVisibilityToggle?: boolean;
    className?: string;
}

export const PasswordConfirmationField: React.FC<PasswordConfirmationFieldProps> = ({
    value,
    onChange,
    showVisibilityToggle = true,
    className = ''
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggleVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={`relative ${className} w-full`}>
            <input
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Подтверждение пароля"
                className="p-2 w-full max-w-[90%] pr-10 rounded focus:outline-none"
                required
            />

            {showVisibilityToggle && (
                <button
                    type="button"
                    onClick={handleToggleVisibility}
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

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    aria-label="Удалить пароль"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
