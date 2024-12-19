import React, { useState, useEffect } from 'react';
import jwtDecode from 'jsonwebtoken';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { loginUser } from '../services/authService';
import Language from '@components/language/language';

const Login: React.FC = () => {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = async () => {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                try {
                    const token = JSON.parse(loggedInUser).token;
                    const decodedToken: any = jwtDecode.decode(token);

                    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                        console.warn('Token expired. Removing from localStorage.');
                        localStorage.removeItem('loggedInUser');
                    } else {
                        router.push('/');
                        return;
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    localStorage.removeItem('loggedInUser');
                }
            }
            setAuthenticated(true);
        };

        checkAuthentication();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);
            console.log(t('loginPage.success'), data);

            localStorage.setItem('loggedInUser', JSON.stringify(data));

            router.push('/');
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || error.message || t('loginPage.failed');
            console.error(errorMessage);
            alert(errorMessage);
        }
    };

    if (!authenticated) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{t('loginPage.title')}</title>
                <meta name="description" content={t('loginPage.metaDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-blue-100 relative">
                <div className="absolute top-5 left-5">
                    <Language textColor="text-blue-500" />
                </div>
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
                        {t('loginPage.heading')}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">
                                {t('loginPage.emailLabel')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700">
                                {t('loginPage.passwordLabel')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            {t('loginPage.buttonText')}
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        {t('loginPage.noAccount')}{' '}
                        <Link href="/register" className="text-blue-500">
                            {t('loginPage.registerLink')}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default Login;
