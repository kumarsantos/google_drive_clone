'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '@/public/assets/icons/logo-full-brand.svg';
import LogoMobile from '@/public/assets/icons/logo-brand.svg';
import Files from '@/public/assets/images/files-2.png';
import { navItems, PLACEHOLDER_IMAGE } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Props } from '@/types';

const Sidebar = ({ email, fullName, avatar, ownerId, accountId }: Props) => {
    const pathname = usePathname();
    return (
        <aside className="sidebar">
            <Link href={'/'}>
                <Image
                    src={Logo}
                    alt="logo"
                    height={50}
                    width={160}
                    className="hidden h-auto lg:block"
                />
                <Image
                    src={LogoMobile}
                    alt="logo"
                    height={52}
                    width={52}
                    className="lg:hidden"
                />
            </Link>

            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                            <Link
                                href={item.url}
                                className="lg:w-full"
                                key={item.name}
                            >
                                <li
                                    className={cn(
                                        'sidebar-nav-item',
                                        isActive && 'shad-active'
                                    )}
                                >
                                    <Image
                                        src={item.icon}
                                        height={24}
                                        width={24}
                                        alt={item.name}
                                        className={cn(
                                            'nav-icon',
                                            isActive && 'nav-icon-active'
                                        )}
                                    />
                                    <p className="hidden lg:block">
                                        {item.name}
                                    </p>
                                </li>
                            </Link>
                        );
                    })}
                </ul>
            </nav>
            <Image
                src={Files}
                height={418}
                width={506}
                alt={'logo'}
                className="w-full"
            />
            <div className="sidebar-user-info">
                <Image
                    src={avatar}
                    height={44}
                    width={44}
                    alt={'user'}
                    className="sidebar-user-avatar"
                />
                <div className="hidden lg:block">
                    <p className="subtitle-2 capitalize">{fullName}</p>
                    <p className="caption">{email}</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
