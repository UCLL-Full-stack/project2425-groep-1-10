import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Login failed');
    }
};

export const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    role: string
) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/signup`, {
            email,
            password,
            firstName,
            lastName,
            dob,
            role,
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Registration failed');
    }
};

export const createCompany = async (
    token: string,
    name: string,
    description?: string,
    websiteUrl?: string
) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/companies`,
            {
                name,
                description,
                websiteUrl,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error(error.message || 'Company creation failed');
    }
};
