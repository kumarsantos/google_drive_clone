import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import Logout from '@/public/assets/icons/logout.svg';
import FileUploader from './FileUploader';
import Search from './Search';
const Header = () => {
    return (
        <header className="header">
            <Search />
            <div className="header-wrapper">
                <FileUploader />
                <form>
                    <Button type="submit" className="sign-out-button">
                        <Image
                            src={Logout}
                            width={24}
                            height={24}
                            alt="logout"
                            className="w-6"
                        />
                    </Button>
                </form>
            </div>
        </header>
    );
};

export default Header;
