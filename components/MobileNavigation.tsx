'use client';
import { Props } from '@/types';
import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    // SheetDescription,
    // SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import Logo from '@/public/assets/icons/logo-full-brand.svg';
import CloseIcon from '@/public/assets/icons/menu.svg';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { navItems } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Logout from '@/public/assets/icons/logout.svg';
import { Button } from './ui/button';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';

const MobileNavigation = ({
    fullName,
    avatar,
    email,
    accountId,
    ownerId
}: Props) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="mobile-header">
            <Image
                src={Logo}
                alt="logo"
                height={52}
                width={120}
                className="h-auto"
            />

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Image
                        src={CloseIcon}
                        alt="logo"
                        height={30}
                        width={24}
                        className="h-auto"
                    />
                </SheetTrigger>
                <SheetContent className="shad-sheet h-screen px-2">
                    <SheetTitle>
                        <div className="header-user">
                            <Image
                                src={avatar}
                                alt="user-avatar"
                                width={44}
                                height={44}
                                className="header-user-avatar"
                            />
                            <div>
                                <p className="subtitle-2 capitalize">
                                    {fullName}
                                </p>
                                <p className="caption">{email}</p>
                            </div>
                        </div>
                        <Separator className=" mb-4 bg-light-200/20" />
                    </SheetTitle>
                    <nav className="mobile-nav">
                        <ul className="mobile-nav-list">
                            {navItems.map((item) => (
                                <Link
                                    href={item.url}
                                    className="lg:w-full"
                                    key={item.name}
                                >
                                    <li
                                        className={cn(
                                            'mobile-nav-item',
                                            pathname === item.url &&
                                                'shad-active'
                                        )}
                                    >
                                        <Image
                                            src={item.icon}
                                            height={24}
                                            width={24}
                                            alt={item.name}
                                            className={cn(
                                                'nav-icon',
                                                pathname === item.url &&
                                                    'nav-icon-active'
                                            )}
                                        />
                                        <p>{item.name}</p>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </nav>
                    <Separator className="my-5 bg-light-200/20" />
                    <div className="flex flex-col justify-between gap-5 pb-5">
                        <FileUploader ownerId={ownerId} accountId={accountId} />
                        <Button
                            type="button"
                            className="mobile-sign-out-button"
                            onClick={async () => signOutUser()}
                        >
                            <Image
                                src={Logout}
                                width={24}
                                height={24}
                                alt="logout"
                            />
                            <p>Logout</p>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
};

export default MobileNavigation;
