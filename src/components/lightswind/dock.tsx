// dock.tsx
import DockItem, { type DockItemProps } from "./dockItem";

interface DockProps {
    items: DockItemProps[]; // Используем DockItemProps вместо DockItem
    className?: string;
}

export default function Dock({
    items,
    className = "",
}: DockProps) {
    return (
        <div className={`flex items-center ${className}`}>
            {items.map((item, index) => (
                <DockItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onClick={item.onClick}
                    badgeCount={item.badgeCount}
                />
            ))}
        </div>
    );
}
