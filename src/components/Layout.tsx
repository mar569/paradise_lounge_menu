
import type { ReactNode } from 'react';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white relative pb-16 md:pb-0">

            <main className="flex-grow">
                {children}
            </main>
            <MobileBottomNav />
        </div>
    );
}