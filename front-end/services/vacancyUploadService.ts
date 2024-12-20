import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const uploadVacancy = async (
    token: string,
    title: string,
    description: string,
    requirements: string[],
    location: string,
    salaryRange?: string
) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/jobs`,
            {
                title,
                description,
                requirements,
                location,
                salaryRange,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Upload vacancy failed');
    }
};
