import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const validateToken = (token: string) => {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token');
    }
};

const validateProfileData = (profile: any) => {
    if (!Array.isArray(profile.skills)) throw new Error('Skills must be an array');
    if (profile.resumeUrl && typeof profile.resumeUrl !== 'string') {
        throw new Error('Invalid resume URL');
    }
};

export const fetchProfile = async (token: string) => {
    try {
        validateToken(token);
        const response = await axios.get(`${BASE_URL}/profiles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to fetch profile');
    }
};

export const updateProfile = async (token: string, profile: any) => {
    try {
        validateToken(token);
        validateProfileData(profile);
        const response = await axios.put(`${BASE_URL}/profiles`, profile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to update profile');
    }
};

export const createProfile = async (token: string, profile: any) => {
    try {
        validateToken(token);
        validateProfileData(profile);
        const response = await axios.post(`${BASE_URL}/profiles`, profile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Failed to create profile');
    }
};
