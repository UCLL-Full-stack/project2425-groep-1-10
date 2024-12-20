import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchProfile = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/profiles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch profile');
    }
};

export const updateProfile = async (token: string, profile: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/profiles`, profile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to update profile');
    }
};

export const createProfile = async (token: string, profile: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/profiles`, profile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to create profile');
    }
};
