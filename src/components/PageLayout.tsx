import React from 'react'
import MobileBottomNav from './MobileBottomNav';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex flex-col" style={{ height: '100vh' }}>
            <main className="flex-1" style={{ height: '90vh', overflow: 'auto' }}>
                {children}
            </main>

            <div style={{ height: '10vh', flexShrink: 0 }}>
                <MobileBottomNav />
            </div>
        </div>
    );
}