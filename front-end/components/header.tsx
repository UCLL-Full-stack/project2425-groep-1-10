import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    return (
        <header className="relative p-5 bg-gradient-to-br from-green-600 to-green-400 shadow-lg">
            <nav className="flex flex-col items-center">
                <div className='flex flex-col items-center'>
                    <Image
                        src="/images/S.png"
                        alt="Logo"
                        width={120}
                        height={100}
                        priority
                        className="rounded-full shadow-md mb-4"
                    />
                    <Link href="/" className="text-white text-xl font-semibold">Home</Link>
                </div>
                <ul className="absolute top-5 right-5 list-none flex space-x-8 font-semibold text-xl text-white">
                    <li>
                        <Link href="/login">Login</Link>
                    </li>
                    <li>
                        <Link href="/register">Register</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;