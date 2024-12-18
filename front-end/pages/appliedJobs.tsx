import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';

const AppliedJobs: React.FC = () => {
    const router = useRouter();
    const { firstName, name, age, employer, extraInfo } = router.query;

    return (
        <>
            <Head>
                <title>Applied Job</title>
                <meta name="description" content="Job details" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6 text-blue-600">Job Application Details</h1>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-gray-700 font-semibold">First Name:</div>
                        <div className="text-gray-600">{firstName || 'N/A'}</div>

                        <div className="text-gray-700 font-semibold">Name:</div>
                        <div className="text-gray-600">{name || 'N/A'}</div>

                        <div className="text-gray-700 font-semibold">Age:</div>
                        <div className="text-gray-600">{age || 'N/A'}</div>

                        <div className="text-gray-700 font-semibold">Previous Employer:</div>
                        <div className="text-gray-600">{employer || 'N/A'}</div>

                        <div className="text-gray-700 font-semibold col-span-2">Extra Information:</div>
                        <div className="text-gray-600 col-span-2">{extraInfo || 'N/A'}</div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AppliedJobs;
