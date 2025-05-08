import React, { useState, useEffect } from 'react';
import jwtDecode from 'jsonwebtoken';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { loginUser } from '../services/authService';
import Language from '@components/language/language';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// versoepeld: geen hoofdletter/special char vereist
const passwordRegex = /^.{6,}$/;

const Login: React.FC = () => {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    const users = [
        { email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { email: 'user.one@example.com', password: 'user123', role: 'user' },
        { email: 'user.two@example.com', password: 'user123', role: 'user' },
        { email: 'company.one@example.com', password: 'company123', role: 'company' },
        { email: 'company.two@example.com', password: 'company123', role: 'company' },
    ];

    useEffect(() => {
        const checkAuthentication = () => {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                try {
                    const token = JSON.parse(loggedInUser).token;
                    const decodedToken: any = jwtDecode.decode(token);
                    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                        localStorage.removeItem('loggedInUser');
                    } else {
                        router.push('/');
                        return;
                    }
                } catch (err) {
                    localStorage.removeItem('loggedInUser');
                }
            }
            setAuthenticated(true);
        };

        checkAuthentication();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            setError(t('loginPage.invalidEmail', 'Ongeldig e-mailadres'));
            return;
        }
        if (!passwordRegex.test(password)) {
            setError(t('loginPage.invalidPassword', 'Wachtwoord moet minstens 6 tekens bevatten'));
            return;
        }

        try {
            const data = await loginUser(email, password);
            localStorage.setItem('loggedInUser', JSON.stringify(data));
            router.push('/');
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err.message || t('loginPage.failed', 'Inloggen mislukt');
            setError(message);
        }
    };

    if (!authenticated) return null;

    return (
        <>
            <Head>
                <title>{t('loginPage.title', 'Inloggen')}</title>
                <meta name="description" content={t('loginPage.metaDescription', 'Loginpagina')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative">
                <div className="absolute top-5 left-5">
                    <Language textColor="text-blue-500" />
                </div>
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
                        {t('loginPage.heading', 'Log in')}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">
                                {t('loginPage.emailLabel', 'E-mailadres')}
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
                                {t('loginPage.passwordLabel', 'Wachtwoord')}
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
                        {error && (
                            <div className="text-red-500 text-sm mb-4">{error}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            {t('loginPage.buttonText', 'Inloggen')}
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        {t('loginPage.noAccount', 'Nog geen account?')}{' '}
                        <Link href="/register" className="text-blue-500">
                            {t('loginPage.registerLink', 'Registreer')}
                        </Link>
                    </p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        {t('loginPage.usersTable.heading', 'Gebruikersinfo')}
                    </h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">
                                    {t('loginPage.usersTable.email', 'E-mail')}
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    {t('loginPage.usersTable.password', 'Wachtwoord')}
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    {t('loginPage.usersTable.role', 'Rol')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.email}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.password}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {t(`loginPage.usersTable.roles.${user.role}`, user.role)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
