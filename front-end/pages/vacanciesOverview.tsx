import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import { fetchVacancies, deleteVacancy } from '@services/vacancyService';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Vacancy {
    id: string;
    title: string;
    description: string;
    location: string;
    salaryRange: string;
}

const VacanciesOverview: React.FC = () => {
    const { t } = useTranslation('common');
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState<{ vacancyId: string; vacancyTitle: string }>({
        vacancyId: '',
        vacancyTitle: '',
    });

    useEffect(() => {
        const fetchEmployerVacancies = async () => {
            setLoading(true);
            setError(null);

            try {
                const loggedInUser = localStorage.getItem('loggedInUser');
                if (loggedInUser) {
                    const token = JSON.parse(loggedInUser).token;
                    const data: Vacancy[] = await fetchVacancies(token);
                    setVacancies(data);
                }
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployerVacancies();
    }, []);

    const handleDeleteClick = (vacancyId: string, vacancyTitle: string) => {
        setPopupData({ vacancyId, vacancyTitle });
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const token = JSON.parse(loggedInUser).token;
                await deleteVacancy(token, popupData.vacancyId);

                // Optimistically update state
                setVacancies((prevVacancies) =>
                    prevVacancies.filter((vacancy) => vacancy.id !== popupData.vacancyId)
                );
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete vacancy');
        } finally {
            setShowPopup(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex flex-col items-center py-10">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
                        {t('vacanciesOverviewPage.title')}
                    </h1>

                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {t('vacanciesOverviewPage.errorMessage', { error })}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center text-gray-600">
                            {t('vacanciesOverviewPage.loadingMessage')}
                        </div>
                    ) : vacancies.length > 0 ? (
                        <ul className="space-y-4">
                            {vacancies.map((vacancy) => (
                                <li
                                    key={vacancy.id}
                                    className="flex justify-between items-center border p-4 rounded-md shadow-sm"
                                >
                                    <div>
                                        <h2 className="font-bold text-lg text-gray-800">
                                            {vacancy.title}
                                        </h2>
                                        <p className="text-gray-600">
                                            {vacancy.location} - {vacancy.salaryRange}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {vacancy.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(vacancy.id, vacancy.title)}
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
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg mb-4">
                            {t('vacanciesOverviewPage.confirmDelete', {
                                vacancy: popupData.vacancyTitle,
                            })}
                        </p>
                        <button
                            onClick={confirmDelete}
                            className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600"
                        >
                            {t('vacanciesOverviewPage.yes')}
                        </button>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            {t('vacanciesOverviewPage.no')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default VacanciesOverview;
