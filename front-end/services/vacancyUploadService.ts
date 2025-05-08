import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const uploadVacancy = async (
    token: string,
    title: string,
    description: string,
    requirements: string[],
    location: string,
    salaryRange?: string
) => {
    const response = await axios.post(
        `${BASE_URL}/jobs`,
        { title, description, requirements, location, salaryRange },
        {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }
    );
    return response.data;
};
