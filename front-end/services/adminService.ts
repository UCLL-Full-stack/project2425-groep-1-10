import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchAllVacancies = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/jobs/all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const deleteVacancy = async (token: string, vacancyId: string) => {
    await axios.delete(`${BASE_URL}/jobs/${vacancyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
};

export const fetchApplicationsForVacancy = async (token: string, vacancyId: string) => {
    const response = await axios.get(`${BASE_URL}/applications/job/${vacancyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const fetchAllCompanies = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const deleteCompany = async (token: string, companyId: string) => {
    await axios.delete(`${BASE_URL}/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
};
