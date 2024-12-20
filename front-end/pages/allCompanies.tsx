import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchAllCompanies, deleteCompany } from '@services/adminService';

interface Company {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
}

const AllCompanies: React.FC = () => {
    const { t } = useTranslation('common');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({ companyName: '', companyId: '' });

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = JSON.parse(localStorage.getItem('loggedInUser')!).token;
                const companies: Company[] = await fetchAllCompanies(token);
                setCompanies(companies);
            } catch (err: any) {
                setError(err.message || 'Failed to load companies.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleDeleteClick = (companyName: string, companyId: string) => {
        setPopupData({ companyName, companyId });
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('loggedInUser')!).token;
            await deleteCompany(token, popupData.companyId);

            // Update state to remove the deleted company
            setCompanies((prev) => prev.filter((company) => company.id !== popupData.companyId));

            setShowPopup(false);
        } catch (err: any) {
            setError(err.message || 'Failed to delete company.');
        }
    };

    return (
        <>
            <Head>
                <title>{t('allCompaniesPage.title')}</title>
                <meta name="description" content={t('allCompaniesPage.metaDescription')} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">
                    {t('allCompaniesPage.title')}
                </h1>

                {loading ? (
                    <div className="text-center text-gray-600">{t('loading')}</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : companies.length > 0 ? (
                    <ul className="space-y-4 w-full max-w-4xl">
                        {companies.map((company) => (
                            <li
                                key={company.id}
                                className="flex justify-between items-center border p-4 rounded-md shadow-sm bg-white"
                            >
                                <div>
                                    <h2 className="font-bold text-lg text-gray-800">
                                        {company.name}
                                    </h2>
                                    <p className="text-gray-600">{company.description}</p>
                                    <p className="text-gray-500 text-sm">
                                        {company.websiteUrl || t('allCompaniesPage.noWebsite')}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {t('allCompaniesPage.createdAt', {
                                            date: new Date(company.createdAt).toLocaleDateString(),
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteClick(company.name, company.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                                >
                                    {t('allCompaniesPage.deleteButton')}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-600">
                        {t('allCompaniesPage.noCompanies')}
                    </div>
                )}

                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <p className="text-lg mb-4">
                                {t('allCompaniesPage.confirmDelete', {
                                    company: popupData.companyName,
                                })}
                            </p>
                            <button
                                onClick={confirmDelete}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600 transition duration-300"
                            >
                                {t('yes')}
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                            >
                                {t('no')}
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

export default AllCompanies;
