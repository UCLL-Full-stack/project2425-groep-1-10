import React from 'react';
import Head from 'next/head';
import Header from '@components/header';

const Vacancies: React.FC = () => {
    return (
        <>
            <Head>
                <title>Vacancies</title>
                <meta name="description" content="Browse available vacancies" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">Available Vacancies</h1>
                <div className="grid grid-cols-3 gap-8 w-full px-10">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div
                            key={index}
                            className="h-64 bg-white border rounded-lg shadow-lg hover:shadow-2xl flex items-center justify-center transition duration-300"
                        >
                            <p className="text-blue-500 font-semibold text-lg">Vacancy {index + 1}</p>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Vacancies;
