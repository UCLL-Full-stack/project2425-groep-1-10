import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchAllVacancies = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/jobs/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch profile');
    }
};

export const deleteVacancy = async (token: string, vacancyId: string) => {
    try {
        await axios.delete(`${BASE_URL}/jobs/${vacancyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to delete vacancy');
    }
};
