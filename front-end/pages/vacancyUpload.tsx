import React, { useState } from 'react';
import Header from '@components/header';
import { uploadVacancy } from '@services/vacancyUploadService'; // Adjust the path to match your project structure

const VacancyUpload: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('requirements', requirements);
        if (file) {
            formData.append('file', file);
        }

        try {
            await uploadVacancy(formData);
            setSuccess(true);
            setTitle('');
            setDescription('');
            setRequirements('');
            setFile(null);
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
                        Upload a Vacancy
                    </h1>
                    {error && <div className="text-red-500 text-sm mb-4">Error: {error}</div>}
                    {success && (
                        <div className="text-green-500 text-sm mb-4">
                            Vacancy uploaded successfully!
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Vacancy Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the title of the vacancy"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the vacancy"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="requirements"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Requirements
                            </label>
                            <textarea
                                id="requirements"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                placeholder="List the requirements for this vacancy"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="file"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Upload Supporting Document (Optional)
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-600
                                    hover:file:bg-blue-100"
                            />
                            {file && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Selected File: {file.name}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Submit Vacancy'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VacancyUpload;
