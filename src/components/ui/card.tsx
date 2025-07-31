import type { ReactNode } from "react";


interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
    return (
        <div className={`rounded-lg border-0.5 bg-[#2c2c2c] shadow-sm ${className}`}>
            {children}
        </div>
    );
};

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export const CardContent = ({ children, className = "" }: CardContentProps) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
};
