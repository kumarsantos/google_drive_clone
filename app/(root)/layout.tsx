import React from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex h-full">
            <Sidebar />
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation />
                <Header />
                <div className="main-content">{children}</div>
            </section>
        </main>
    );
}
