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

            // Redirect company users to the employer page
            if (parsedUser.role === 'company' && router.pathname !== '/employer') {
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
        router.push('/'); // Redirect to home on logout
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
                        {userRole === 'user' && (
                            <>
                                <Link href="/" className="text-white text-xl font-semibold">
                                    {t('home')}
                                </Link>
                                <Link
                                    href="/vacancies"
                                    className="text-white text-xl font-semibold"
                                >
                                    {t('headerVacancies')}
                                </Link>
                                <Link href="/progress" className="text-white text-xl font-semibold">
                                    {t('progress')}
                                </Link>
                            </>
                        )}
                        {userRole === 'company' && (
                            <Link href="/employer" className="text-white text-xl font-semibold">
                                {t('employer')}
                            </Link>
                        )}
                    </div>
                </div>
                <div className="absolute top-5 right-5 list-none flex space-x-8 font-semibold text-xl text-white">
                    {!loggedInUser ? (
                        <Link
                            href="/login"
                            className="px-4 text-xl text-white hover:bg-gray-600 rounded-lg"
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
                                className="px-4 text-xl text-white hover:bg-gray-600 rounded-lg"
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
