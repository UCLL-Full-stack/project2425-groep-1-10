import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Language from '@components/language/language';
import { useTranslation } from 'next-i18next';

const Header: React.FC = () => {
    const { t } = useTranslation('common');
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setLoggedInUser(parsedUser);
            setUserRole(parsedUser.role);

            // Redirect company users to employer page if they are not already on employer-related pages
            if (
                parsedUser.role === 'company' &&
                !['/employer', '/vacancyUpload'].includes(router.pathname)
            ) {
                router.push('/employer');
            }
        } else {
            setLoggedInUser(null);
            setUserRole(null);
        }
    }, [router]);

    const handleClick = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        setUserRole(null);
        router.push('/');
    };

    return (
        <header className="relative p-5 bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg">
            <nav className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/S.png"
                        alt={t('app.logoAlt')}
                        width={120}
                        height={100}
                        priority
                        className="rounded-full shadow-md mb-4"
                    />
                    <div className="flex space-x-8">
                        {userRole === 'admin' && (
                            <>
                                <Link
                                    href="/"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('home')}
                                </Link>
                                <Link
                                    href="/vacancies"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('headerVacancies')}
                                </Link>
                                <Link
                                    href="/progress"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('progress')}
                                </Link>
                                <Link
                                    href="/employer"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('employer')}
                                </Link>
                            </>
                        )}
                        {userRole === 'user' && (
                            <>
                                <Link
                                    href="/"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('home')}
                                </Link>
                                <Link
                                    href="/vacancies"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('headerVacancies')}
                                </Link>
                                <Link
                                    href="/progress"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('progress')}
                                </Link>
                            </>
                        )}
                        {userRole === 'company' && (
                            <>
                                <Link
                                    href="/employer"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('employer')}
                                </Link>
                                <Link
                                    href="/vacancyUpload"
                                    className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                                >
                                    {t('vacancyUpload')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="absolute top-5 right-5 list-none flex space-x-8 font-semibold text-xl text-white">
                    {!loggedInUser ? (
                        <Link
                            href="/login"
                            className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                        >
                            {t('header.login')}
                        </Link>
                    ) : (
                        <>
                            <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 grow">
                                {t('header.welcome')}, {loggedInUser.fullname}!
                            </div>
                            <a
                                href="/"
                                onClick={handleClick}
                                className="text-white text-xl font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-transform after:duration-300 hover:after:w-full"
                            >
                                {t('header.logout')}
                            </a>
                        </>
                    )}
                </div>
                <div className="absolute top-5 left-5">
                    <Language />
                </div>
            </nav>
        </header>
    );
};

export default Header;
