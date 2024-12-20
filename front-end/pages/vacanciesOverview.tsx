import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import { fetchVacancies } from '@services/vacancyService';
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
