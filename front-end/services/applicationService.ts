import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchApplications = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch applications');
    }
};

export const fetchJobTitleById = async (token: string, jobId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.title;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch job title');
    }
};
