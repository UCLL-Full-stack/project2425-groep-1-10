import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Apply: React.FC = () => {
    const router = useRouter();
    const { vacancy, name, email } = router.query;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        criteria1: '',
        criteria2: '',
    });

    useEffect(() => {
        // Pre-fill the form data with query parameters if available
        setFormData((prev) => ({
            ...prev,
            name: (name as string) || '',
            email: (email as string) || '',
        }));
    }, [name, email]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        alert('Form submitted successfully!');
    };

    return (
        <>
            <Head>
                <title>Apply</title>
                <meta name="description" content="Apply for the vacancy" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen bg-blue-100 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-8 mb-8">
                            {/* Company logo and vacancy */}
                            <div className="col-span-1 flex flex-col items-center">
                                <div className="bg-gray-200 w-full h-32 flex items-center justify-center mb-4 rounded-lg shadow-md">
                                    <Image
                                        src="/images/S.png" // Temporary logo path
                                        alt="Company Logo"
                                        width={100}
                                        height={100}
                                        className="rounded-full"
                                    />
                                </div>
                                <div className="bg-gray-200 w-full h-16 flex items-center justify-center rounded-lg shadow-md">
                                    <p className="text-gray-700 font-semibold">{vacancy || 'Vacancy'}</p>
                                </div>
                            </div>

                            {/* Form inputs */}
                            <div className="col-span-2 grid grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 shadow-sm"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 shadow-sm"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 shadow-sm"
                                    required
                                />
                                <input
                                    type="text"
                                    name="criteria1"
                                    placeholder="Criteria 1"
                                    value={formData.criteria1}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 shadow-sm"
                                />
                                <input
                                    type="text"
                                    name="criteria2"
                                    placeholder="Criteria 2"
                                    value={formData.criteria2}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 shadow-sm"
                                />
                                <textarea
                                    name="coverLetter"
                                    placeholder="Cover Letter"
                                    value={formData.coverLetter}
                                    onChange={handleChange}
                                    className="col-span-2 border rounded-lg p-2 shadow-sm h-32"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Apply;
