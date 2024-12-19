import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Vacancies: React.FC = () => {
    const { t } = useTranslation('common');
    const [selected, setSelected] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({ vacancyName: '', index: 0 });
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
    };

    const handleClick = (index: number) => {
        setSelected((prev) => (prev === index ? null : index));
    };

    const handleApplyClick = (vacancyName: string, index: number) => {
        setPopupData({ vacancyName, index });
        setShowPopup(true);
    };

    const confirmApplication = () => {
        setConfirmationMessage('Application confirmed!');
        setShowPopup(false);
        setTimeout(() => setConfirmationMessage(null), 3000);
    };

    useEffect(() => {
        if (containerRef.current) {
            const allGridItems = containerRef.current.querySelectorAll('.grid-item');
            if (selected !== null && allGridItems[selected]) {
                const selectedElement = allGridItems[selected] as HTMLElement;
                const offsetTop =
                    selectedElement.offsetTop -
                    window.innerHeight / 2 +
                    selectedElement.offsetHeight / 2;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [selected]);

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
                <div
                    ref={containerRef}
                    className="grid grid-cols-3 gap-8 w-full px-10 overflow-y-auto"
                >
                    {Array.from({ length: 12 }, (_, index) => (
                        <div
                            key={index}
                            className={`grid-item transition-all duration-500 cursor-pointer flex flex-col items-center justify-center shadow-lg rounded-lg border bg-white hover:shadow-2xl hover:scale-105 ${
                                selected === index ? 'col-span-3 row-span-2 h-[500px] z-10' : 'h-64'
                            }`}
                            onClick={() => handleClick(index)}
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
                            <p className="text-blue-500 font-semibold text-lg mb-4">
                                {t('vacancies.item', { number: index + 1 })}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const vacancyName = `${t('vacancies.item', {
                                        number: index + 1,
                                    })}`;
                                    handleApplyClick(vacancyName, index);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                {t('vacancies.applyNow')}
                            </button>
                        </div>
                    ))}
                </div>

                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <p className="text-lg mb-4">{t('vacancies.confirmationMessage')}</p>
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
