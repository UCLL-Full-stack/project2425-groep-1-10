import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchVacancies = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const deleteVacancy = async (token: string, vacancyId: string) => {
    const response = await axios.delete(`${BASE_URL}/jobs/${vacancyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const fetchVacanciesForUser = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/jobs/user`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const fetchUnappliedVacanciesForUser = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/jobs/user/unapplied`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const applyForVacancy = async (token: string, jobId: string) => {
    const response = await axios.post(
        `${BASE_URL}/applications/apply`,
        { jobId },
        {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }
    );
    return response.data;
};
