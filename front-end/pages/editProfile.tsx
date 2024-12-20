import React, { useState, useEffect } from 'react';
import jwtDecode from 'jsonwebtoken';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchProfile, updateProfile, createProfile } from '../services/profileService';
import Language from '@components/language/language';

const EditProfile: React.FC = () => {
    const { t } = useTranslation('common');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
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
                        router.push('/login');
                        return;
                    }

                    // Fetch profile
                    try {
                        const profile = await fetchProfile(token);
                        setBio(profile.bio || '');
                        setSkills(profile.skills.join(', ') || '');
                        setResumeUrl(profile.resumeUrl || '');
                    } catch (error) {
                        console.warn('No profile found. Creating a new one...');
                        await createProfile(token, {
                            bio: '',
                            skills: [''],
                            resumeUrl: null,
                        });
                    }

                    setAuthenticated(true);
                } catch (error) {
                    console.error('Error fetching or creating profile:', error);
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
        };

        checkAuthentication();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const token = JSON.parse(loggedInUser).token;
                await updateProfile(token, {
                    bio,
                    skills: skills.split(',').map((skill) => skill.trim()),
                    resumeUrl,
                });

                alert(t('editProfilePage.successMessage'));
                router.push('/');
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || error.message || t('editProfilePage.failed');
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
                <title>{t('editProfilePage.title')}</title>
                <meta name="description" content={t('editProfilePage.metaDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-blue-100 relative">
                <div className="absolute top-5 left-5">
                    <Language textColor="text-blue-500" />
                </div>
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
                        {t('editProfilePage.heading')}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-gray-700">
                                {t('editProfilePage.bioLabel')}
                            </label>
                            <textarea
                                id="bio"
                                className="w-full px-3 py-2 border rounded"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="skills" className="block text-gray-700">
                                {t('editProfilePage.skillsLabel')}
                            </label>
                            <input
                                type="text"
                                id="skills"
                                className="w-full px-3 py-2 border rounded"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder={t('editProfilePage.skillsPlaceholder')}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="resumeUrl" className="block text-gray-700">
                                {t('editProfilePage.resumeUrlLabel')}
                            </label>
                            <input
                                type="url"
                                id="resumeUrl"
                                className="w-full px-3 py-2 border rounded"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            {t('editProfilePage.buttonText')}
                        </button>
                    </form>
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

export default EditProfile;
