import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchVacanciesForUser, applyForVacancy } from '@services/vacancyService';

interface Vacancy {
    id: string;
    title: string;
    companyName: string;
    location: string;
    salaryRange: string;
    description: string;
}

const Vacancies: React.FC = () => {
    const { t } = useTranslation('common');
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({ vacancyName: '', vacancyId: '' });
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);
            setError(null);

            try {
                const loggedInUser = localStorage.getItem('loggedInUser');
                if (loggedInUser) {
                    const token = JSON.parse(loggedInUser).token;
                    const userVacancies: Vacancy[] = await fetchVacanciesForUser(token);
                    setVacancies(userVacancies);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load vacancies.');
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, []);

    const handleApplyClick = (vacancyName: string, vacancyId: string) => {
        setPopupData({ vacancyName, vacancyId });
        setShowPopup(true);
    };

    const confirmApplication = async () => {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const token = JSON.parse(loggedInUser).token;
                await applyForVacancy(token, popupData.vacancyId);
                setConfirmationMessage('Application confirmed!');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to apply for the vacancy.');
        } finally {
            setShowPopup(false);
            setTimeout(() => setConfirmationMessage(null), 3000);
        }
    };

    return (
        <>
            <Head>
                <title>{t('vacancies.title')}</title>
                <meta name="description" content={t('vacancies.metaDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">{t('vacancies.heading')}</h1>

                {loading ? (
                    <div className="text-center text-gray-600">{t('vacancies.loading')}</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : vacancies.length > 0 ? (
                    <div
                        ref={containerRef}
                        className="grid grid-cols-3 gap-8 w-full px-10 overflow-y-auto"
                    >
                        {vacancies.map((vacancy, index) => (
                            <div
                                key={vacancy.id}
                                className={`grid-item transition-all duration-500 cursor-pointer flex flex-col items-center justify-center shadow-lg rounded-lg border bg-white hover:shadow-2xl hover:scale-105 ${
                                    selected === index
                                        ? 'col-span-3 row-span-2 h-[500px] z-10'
                                        : 'h-64'
                                }`}
                                onClick={() =>
                                    setSelected((prev) => (prev === index ? null : index))
                                }
                            >
                                <div className="mb-4">
                                    <Image
                                        src="/images/S.png"
                                        alt={t('vacancies.companyLogo')}
                                        width={50}
                                        height={50}
                                        className="rounded-full shadow-md"
                                    />
                                </div>
                                <h2 className="text-blue-500 font-semibold text-lg mb-4">
                                    {vacancy.title}
                                </h2>
                                <p className="text-gray-600">{vacancy.companyName}</p>
                                <p className="text-gray-500">{vacancy.location}</p>
                                <p className="text-gray-500">{vacancy.salaryRange}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApplyClick(vacancy.title, vacancy.id);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    {t('vacancies.applyNow')}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">{t('vacancies.noVacancies')}</div>
                )}

                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <p className="text-lg mb-4">
                                {t('vacancies.confirmApplication', {
                                    vacancy: popupData.vacancyName,
                                })}
                            </p>
                            <button
                                onClick={confirmApplication}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600 transition duration-300"
                            >
                                {t('vacancies.yes')}
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                            >
                                {t('vacancies.no')}
                            </button>
                        </div>
                    </div>
                )}

                {confirmationMessage && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
                        {confirmationMessage}
                    </div>
                )}
            </main>
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

export default Vacancies;
