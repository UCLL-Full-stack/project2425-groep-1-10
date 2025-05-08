import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/users/login`,
            { email, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error('Login failed. Please try again.');
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
        const response = await axios.post(
            `${BASE_URL}/users/signup`,
            { email, password, firstName, lastName, dob, role },
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error('Registration failed. Please try again.');
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
            { name, description, websiteUrl },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error('Company creation failed.');
    }
};
