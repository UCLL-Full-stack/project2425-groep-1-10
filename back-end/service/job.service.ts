import { Job } from '../model/job';
import jobDB from '../repository/job.db';

const getAllJobs = async (): Promise<Job[]> => {
    return jobDB.getAllJobs();
};

const getJobsByCompanyId = async (id: number): Promise<Job[]> => {
    return jobDB.getJobsByCompanyId(id);
};

const getJobById = async (id: number): Promise<Job> => {
    const job = await jobDB.getJobById(id);
    if (!job) throw new Error('Job not found');
    return job;
};

const getJobsThatMatchUserSkills = async (userSkills: string[]): Promise<Job[]> => {
    return jobDB.getJobsThatMatchUserSkills(userSkills);
};

const getUnappliedVacanciesForUser = async (userId: number): Promise<Job[]> => {
    return jobDB.getUnappliedVacanciesForUser(userId);
};

const createJob = async ({
    title,
    description,
    requirements,
    location,
    salaryRange,
    companyId,
}: {
    title: string;
    description: string;
    requirements: string[];
    location: string;
    salaryRange?: string;
    companyId: number;
}): Promise<Job> => {
    const newJob = new Job({
        title,
        description,
        salaryRange,
        requirements,
        location,
        companyId,
    });

    return jobDB.createJob(newJob);
};

const updateJob = async (
    id: number,
    data: Partial<{
        title: string;
        description: string;
        requirements: string[];
        location: string;
        salaryRange?: string;
    }>
): Promise<Job> => {
    return jobDB.updateJob(id, data);
};

const deleteJob = async (id: number): Promise<void> => {
    await jobDB.deleteJob(id);
};

export default {
    getAllJobs,
    getJobsByCompanyId,
    getJobById,
    getJobsThatMatchUserSkills,
    getUnappliedVacanciesForUser,
    createJob,
    updateJob,
    deleteJob,
};
