import { Job } from '../model/job';
import jobDB from '../repository/job.db';

const getAllJobs = async (): Promise<Job[]> => {
    return jobDB.getAllJobs();
};

const getJobById = async (id: number): Promise<Job> => {
    const job = await jobDB.getJobById(id);
    if (!job) throw new Error('Job not found');
    return job;
};

const createJob = async ({
    title,
    description,
    requirements,
    salaryRange,
    location,
    companyId,
}: {
    title: string;
    description: string;
    requirements: string[];
    salaryRange?: string;
    location: string;
    companyId: number;
}): Promise<Job> => {
    const newJob = new Job({
        title,
        description,
        requirements,
        salaryRange,
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
        salaryRange?: string;
        location: string;
    }>
): Promise<Job> => {
    return jobDB.updateJob(id, data);
};

const deleteJob = async (id: number): Promise<void> => {
    await jobDB.deleteJob(id);
};

export default {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};
