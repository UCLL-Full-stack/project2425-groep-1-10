import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
    fetchApplicationsForEmployer,
    updateApplicationStatus,
} from '@services/applicationService';

interface Application {
    id: string;
    job: {
        title: string;
    };
    user: {
        fullname: string;
        email: string;
    };
    status: string;
    createdAt: string;
}

const EmployerApplications: React.FC = () => {
    const { t } = useTranslation('common');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch applications
    const fetchApplications = async () => {
        setLoading(true);
        setError(null);

        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const token = JSON.parse(loggedInUser).token;
                const data: Application[] = await fetchApplicationsForEmployer(token);
                setApplications(data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load applications.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch applications on component mount
    useEffect(() => {
        fetchApplications();
    }, []);

    // Handle application status change
    const handleStatusChange = async (applicationId: string, status: string) => {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const token = JSON.parse(loggedInUser).token;
                await updateApplicationStatus(token, applicationId, status);

                // Refetch the updated list after status change
                await fetchApplications();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update application status.');
        }
    };

    return (
        <>
            <Head>
                <title>{t('applications.title')}</title>
                <meta name="description" content={t('applications.metaDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">
                    {t('applications.heading')}
                </h1>

                {loading ? (
                    <div className="text-center py-8">{t('applications.loading')}</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : applications.length > 0 ? (
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md">
                        <div className="grid grid-cols-4 font-semibold text-blue-600 py-4 border-b text-center">
                            <div>{t('applications.jobTitle')}</div>
                            <div>{t('applications.candidate')}</div>
                            <div>{t('applications.date')}</div>
                            <div>{t('applications.actions')}</div>
                        </div>
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="grid grid-cols-4 py-4 text-center border-b text-gray-700 hover:bg-blue-50"
                            >
                                <div>{app.job.title}</div>
                                <div>
                                    {app.user.fullname} <br />
                                    <span className="text-sm text-gray-500">{app.user.email}</span>
                                </div>
                                <div>{new Date(app.createdAt).toLocaleDateString()}</div>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => handleStatusChange(app.id, 'accepted')}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        {t('applications.accept')}
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(app.id, 'rejected')}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        {t('applications.deny')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        {t('applications.noApplications')}
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

export default EmployerApplications;
