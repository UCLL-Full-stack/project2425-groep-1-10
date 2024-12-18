import React from 'react';
import Head from 'next/head';
import Header from '@components/header';

const Progress: React.FC = () => {
    const vacancies = [
        { vacancy: 'Vacancy 1', date: 'date', status: 'status' },
        { vacancy: 'Vacancy 2', date: 'date', status: 'status' },
        { vacancy: 'Vacancy 3', date: 'date', status: 'status' },
        { vacancy: 'Vacancy 4', date: 'date', status: 'status' },
        { vacancy: 'Vacancy 5', date: 'date', status: 'status' },
    ];

    return (
        <>
            <Head>
                <title>Progress</title>
                <meta name="description" content="Track your application progress" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">Application Progress</h1>
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-3 border-b text-center font-semibold text-blue-600 py-4">
                        <div>Vacancies</div>
                        <div>Apply Date</div>
                        <div>Status</div>
                    </div>
                    {vacancies.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-3 border-b text-center py-4 text-gray-700 hover:bg-blue-50 transition duration-300"
                        >
                            <div>{item.vacancy}</div>
                            <div>{item.date}</div>
                            <div>{item.status}</div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Progress;
