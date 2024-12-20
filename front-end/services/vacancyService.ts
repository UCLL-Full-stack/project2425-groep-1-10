import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Fetch vacancies created by the logged-in employer
export const fetchVacancies = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/jobs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch vacancies');
    }
};

// Delete a vacancy by ID
export const deleteVacancy = async (token: string, vacancyId: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/jobs/${vacancyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to delete vacancy');
    }
};

export const fetchVacanciesForUser = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/jobs/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch vacancies');
    }
};
