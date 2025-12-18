import React from 'react'
import MobileBottomNav from './MobileBottomNav';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="relative min-h-screen flex flex-col">

                <main className="flex-1">{children}</main>
                <MobileBottomNav />
            </div>
        </>
    );
}