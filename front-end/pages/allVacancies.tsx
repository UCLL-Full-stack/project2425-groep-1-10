import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
    fetchAllVacancies,
    deleteVacancy,
    fetchApplicationsForVacancy,
} from '@services/adminService';

interface Vacancy {
    id: string;
    title: string;
    companyName: string;
    location: string;
    salaryRange: string;
    description: string;
}

interface Application {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    status: string;
}

const AdminVacancies: React.FC = () => {
    const { t } = useTranslation('common');
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({ vacancyName: '', vacancyId: '' });

    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = JSON.parse(localStorage.getItem('loggedInUser')!).token;
                const vacancies: Vacancy[] = await fetchAllVacancies(token);
                setVacancies(vacancies);
            } catch (err: any) {
                setError(err.message || 'Failed to load vacancies.');
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, []);

    const handleDeleteClick = (vacancyName: string, vacancyId: string) => {
        setPopupData({ vacancyName, vacancyId });
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('loggedInUser')!).token;
            await deleteVacancy(token, popupData.vacancyId);

            setVacancies((prev) => prev.filter((v) => v.id !== popupData.vacancyId));

            setShowPopup(false);
        } catch (err: any) {
            setError(err.message || 'Failed to delete vacancy.');
        }
    };

    const handleVacancyClick = async (vacancy: Vacancy) => {
        setSelectedVacancy(vacancy);
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('loggedInUser')!).token;
            const applications: Application[] = await fetchApplicationsForVacancy(
                token,
                vacancy.id
            );
            setApplications(applications);
        } catch (err: any) {
            setError(err.message || 'Failed to load applications for this vacancy.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>{t('vacanciesOverviewPage.title')}</title>
                <meta name="description" content={t('vacanciesOverviewPage.metaDescription')} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">
                    {t('vacanciesOverviewPage.title')}
                </h1>

                {loading ? (
                    <div className="text-center text-gray-600">
                        {t('vacanciesOverviewPage.loadingMessage')}
                    </div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        {vacancies.length > 0 ? (
                            <ul className="space-y-4 w-full max-w-4xl">
                                {vacancies.map((vacancy) => (
                                    <li
                                        key={vacancy.id}
                                        className="flex justify-between items-center border p-4 rounded-md shadow-sm bg-white cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleVacancyClick(vacancy)}
                                    >
                                        <div>
                                            <h2 className="font-bold text-lg text-gray-800">
                                                {vacancy.title}
                                            </h2>
                                            <p className="text-gray-600">
                                                {vacancy.companyName} - {vacancy.location} -{' '}
                                                {vacancy.salaryRange}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {vacancy.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(vacancy.title, vacancy.id);
                                            }}
                                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                                        >
                                            {t('vacanciesOverviewPage.deleteButton')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-gray-600">
                                {t('vacanciesOverviewPage.noVacanciesMessage')}
                            </div>
                        )}
                    </>
                )}

                {selectedVacancy && (
                    <div className="mt-8 w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-blue-600">
                            {t('applications.title')} - {selectedVacancy.title}
                        </h2>
                        {applications.length > 0 ? (
                            <ul className="mt-4 space-y-2">
                                {applications.map((app) => (
                                    <li
                                        key={app.id}
                                        className="p-4 border rounded-md shadow-sm bg-gray-50"
                                    >
                                        <div className="text-lg font-semibold text-gray-800">
                                            {app.user.firstName} {app.user.lastName} (
                                            {app.user.email})
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            {t('applications.date')}:{' '}
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {t('applications.status')}: {app.status}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-600 mt-4">
                                {t('applications.noApplications')}
                            </div>
                        )}
                    </div>
                )}

                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <p className="text-lg mb-4">
                                {t('vacanciesOverviewPage.confirmDelete', {
                                    vacancy: popupData.vacancyName,
                                })}
                            </p>
                            <button
                                onClick={confirmDelete}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600 transition duration-300"
                            >
                                {t('vacanciesOverviewPage.yes')}
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                            >
                                {t('vacanciesOverviewPage.no')}
                            </button>
                        </div>
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

export default AdminVacancies;
