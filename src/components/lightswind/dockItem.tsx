// dockItem.tsx
import React from 'react';

export interface DockItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    badgeCount?: number;
}

const DockItem: React.FC<DockItemProps> = ({
    icon,
    label,
    onClick,
    badgeCount,
}) => {
    return (
        <div
            onClick={onClick}
            className="relative bg-transparent inline-flex items-center justify-center rounded-full cursor-pointer"
            role="button"
            aria-haspopup="true"
        >
            <div onClick={onClick} className="flex items-center justify-center cursor-pointer">{icon}</div>
            {badgeCount !== undefined && badgeCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {badgeCount > 99 ? "99+" : badgeCount}
                </span>
            )}
            <div className="cursor-pointer absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 flex items-center justify-center w-fit whitespace-pre rounded-md border-1 border-[#7bc0a6]  px-2 py-0.5 text-xs text-white">
                {label}
            </div>
        </div>
    );
};

export default DockItem;
