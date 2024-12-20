import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchApplications, fetchJobTitleById } from '@services/applicationService';

interface Application {
    jobId: string;
    title?: string; // Title will be fetched dynamically
    createdAt: string;
    status: string;
}

const Progress: React.FC = () => {
    const { t } = useTranslation('common');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplicationData = async () => {
            setLoading(true);
            setError(null);

            try {
                const loggedInUser = localStorage.getItem('loggedInUser');
                if (loggedInUser) {
                    const token = JSON.parse(loggedInUser).token;

                    // Fetch applications
                    const data: Application[] = await fetchApplications(token);

                    // Fetch job titles for each application
                    const applicationsWithTitles = await Promise.all(
                        data.map(async (app) => {
                            const title = await fetchJobTitleById(token, app.jobId);
                            return {
                                ...app,
                                title, // Add the title to the application
                                createdAt: new Date(app.createdAt).toLocaleDateString(),
                            };
                        })
                    );

                    setApplications(applicationsWithTitles);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load application progress.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
    }, []);

    return (
        <>
            <Head>
                <title>{t('progressPage.title')}</title>
                <meta name="description" content={t('progressPage.metaDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">
                    {t('progressPage.heading')}
                </h1>
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-3 border-b text-center font-semibold text-blue-600 py-4">
                        <div>{t('JobTitle')}</div>
                        <div>{t('ApplicationDate')}</div>
                        <div>{t('ApplicationStatus')}</div>
                    </div>
                    {loading ? (
                        <div className="text-center py-8">{t('progressPage.loading')}</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : applications.length > 0 ? (
                        applications.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-3 border-b text-center py-4 text-gray-700 hover:bg-blue-50 transition duration-300"
                            >
                                <div>{item.title || t('loading')}</div>
                                <div>{item.createdAt}</div>
                                <div>{item.status}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {t('progressPage.noApplications')}
                        </div>
                    )}
                </div>
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

export default Progress;
