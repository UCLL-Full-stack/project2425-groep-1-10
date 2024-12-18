import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header';

interface JobApplication {
    jobTitle: string;
    company: string;
    applicant: { name: string; email: string };
}

const Employer: React.FC = () => {
    const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);

    useEffect(() => {
        // Fetch applied jobs from localStorage
        const storedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        setAppliedJobs(storedJobs);
    }, []);

    return (
        <>
            <Head>
                <title>Employer Page</title>
                <meta name="description" content="Employer Dashboard" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">Job Applications</h1>
                <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map((job, index) => (
                            <div
                                key={index}
                                className="p-4 border-b border-gray-200"
                            >
                                <p className="text-lg font-semibold">{job.jobTitle}</p>
                                <p className="text-gray-600">
                                    <strong>Company:</strong> {job.company}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Applicant Name:</strong> {job.applicant.name}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Applicant Email:</strong> {job.applicant.email}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No job applications yet.</p>
                    )}
                </div>
            </main>
        </>
    );
};

export default Employer;
