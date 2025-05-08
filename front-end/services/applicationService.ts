import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchApplications = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const fetchJobTitleById = async (token: string, jobId: string) => {
    const response = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data.title;
};

export const fetchApplicationsForEmployer = async (token: string) => {
    const response = await axios.get(`${BASE_URL}/applications/employer`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};

export const updateApplicationStatus = async (
    token: string,
    applicationId: string,
    status: string
) => {
    const response = await axios.put(
        `${BASE_URL}/applications/${applicationId}`,
        { status },
        {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }
    );
    return response.data;
};
