import axios from "axios";

const BASE_URL = 'http://localhost:3000';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, {
            email,
            password,
        });

        return response.data; // Response bevat de token en gebruikersinformatie
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('An unexpected error occurred during login.');
        }
    }
};

export const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string
) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/signup`, {
            email,
            password,
            firstName,
            lastName,
            dob,
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('An unexpected error occurred during registration.');
        }
    }
};
