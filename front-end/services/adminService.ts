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

export const fetchApplicationsForVacancy = async (token: string, vacancyId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/applications/job/${vacancyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch applications');
    }
};

export const fetchAllCompanies = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/companies`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch companies');
    }
};

export const deleteCompany = async (token: string, companyId: string) => {
    try {
        await axios.delete(`${BASE_URL}/companies/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to delete company');
    }
};
