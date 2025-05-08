import React, { useState } from 'react';
import Header from '@components/header';
import { uploadVacancy } from '@services/vacancyUploadService';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const VacancyUpload: React.FC = () => {
    const { t } = useTranslation('common');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!title || title.length > 100) {
            setError(t('vacancyUploadPage.invalidTitle'));
            setLoading(false);
            return;
        }

        if (!description || description.length < 10) {
            setError(t('vacancyUploadPage.invalidDescription'));
            setLoading(false);
            return;
        }

        if (requirements.split(',').some((req) => req.length > 100)) {
            setError(t('vacancyUploadPage.invalidRequirements'));
            setLoading(false);
            return;
        }

        if (!location || location.length > 100) {
            setError(t('vacancyUploadPage.invalidLocation'));
            setLoading(false);
            return;
        }

        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const token = JSON.parse(loggedInUser).token;

                const requirementsArray = requirements.split(', ').map((req) => req.trim());

                await uploadVacancy(
                    token,
                    title,
                    description,
                    requirementsArray,
                    location,
                    salaryRange
                );
                setSuccess(true);
                setTitle('');
                setDescription('');
                setRequirements('');
                setLocation('');
                setSalaryRange('');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex flex-col items-center py-10">
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
                        {t('vacancyUploadPage.uploadVacancyTitle')}
                    </h1>
                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {t('vacancyUploadPage.errorMessage', { error })}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-500 text-sm mb-4">
                            {t('vacancyUploadPage.successMessage')}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                {t('vacancyUploadPage.vacancyTitleLabel')}
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('vacancyUploadPage.vacancyTitlePlaceholder')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                {t('vacancyUploadPage.descriptionLabel')}
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('vacancyUploadPage.descriptionPlaceholder')}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                                {t('vacancyUploadPage.requirementsLabel')}
                            </label>
                            <textarea
                                id="requirements"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                placeholder={t('vacancyUploadPage.requirementsPlaceholder')}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">
                                {t('vacancyUploadPage.salaryRangeLabel')}
                            </label>
                            <input
                                type="text"
                                id="salaryRange"
                                value={salaryRange}
                                onChange={(e) => setSalaryRange(e.target.value)}
                                placeholder={t('vacancyUploadPage.salaryRangePlaceholder')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                {t('vacancyUploadPage.locationLabel')}
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={t('vacancyUploadPage.locationPlaceholder')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading
                                ? t('vacancyUploadPage.loadingButton')
                                : t('vacancyUploadPage.submitButton')}
                        </button>
                    </form>
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

export default VacancyUpload;
