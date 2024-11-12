import Image from 'next/image';
import React from 'react';
import FavIcon from '@/public/assets/icons/logo-full.svg';
import Illustration from '@/public/assets/images/files.png';
import Logo from '@/public/assets/icons/logo-full-brand.svg';

export default function AuthLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen">
            <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
                <div className="flex max-h-[800px] max-w-[430px] scroll-py-12 flex-col justify-center">
                    <Image
                        src={FavIcon}
                        alt="fab-icon"
                        height={82}
                        width={224}
                        className="object-contain"
                    />
                    <div className="my-8 space-y-5 text-white">
                        <h1 className="h1">Manage your files the best way</h1>
                        <p className="body-1">
                            This is a place where you can store all your
                            documents
                        </p>
                    </div>
                    <Image
                        src={Illustration}
                        alt="files-icon"
                        height={342}
                        width={342}
                        className="object-contain transition-all hover:rotate-2 hover:scale-105"
                    />
                </div>
            </section>
            <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
                <div className="mb-16 lg:hidden">
                    <Image
                        src={Logo}
                        alt="logo"
                        height={82}
                        width={224}
                        className="lg:w-[[250px] h-auto w-[200px]"
                    />
                </div>
                {children}
            </section>
        </div>
    );
}
