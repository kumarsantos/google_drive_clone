import React from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

// page relies on cookies so it throws the error Dynamic server usage: Route / couldn't be rendered statically because it used `cookies
// That's why we are force-fully telling next js this is dynamic page
export const dynamic="force-dynamic"

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return redirect('/sign-in');
    }

    return (
        <main className="flex h-full">
            <Sidebar {...currentUser} />
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation {...currentUser} ownerId={currentUser.$id} />
                <Header userId={currentUser.$id} accountId={currentUser.accountId} />
                <div className="main-content">{children}</div>
            </section>
        </main>
    );
}
