import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

const Home: React.FC = () => {
    const { t } = useTranslation('common');

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.description')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="flex flex-col items-center justify-center min-h-screen bg-blue-100 mt-0 pt-0 -mt-5">
                <div className="bg-white p-8 pt-0 rounded-lg shadow-lg w-full max-w-2xl text-center">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/S.png"
                            alt={t('app.logoAlt')}
                            width={100}
                            height={100}
                            priority
                            style={{ width: 'auto', height: 'auto' }}
                            className="rounded-full shadow-md"
                        />
                    </div>
                    <h1 className="text-blue-600 text-5xl font-bold mb-4">{t('welcome')}</h1>
                    <p className="text-gray-700 text-lg mb-6">{t('descriptionExtended')}</p>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                        <Link href="/vacancies">{t('getStartedButton')}</Link>
                    </button>
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

export default Home;
