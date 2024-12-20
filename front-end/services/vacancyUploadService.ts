const API_URL = 'http://localhost:3000/jobs';

/**
 * Upload a vacancy to the database.
 * @param vacancyData - An object containing vacancy details.
 * @returns A Promise with the server response.
 */
export const uploadVacancy = async (vacancyData: FormData): Promise<Response> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: vacancyData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload vacancy: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Error uploading vacancy:', error);
        throw error;
    }
};
