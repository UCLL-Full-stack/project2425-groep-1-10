import { Job } from '../model/job';
import database from '../util/database';

const getAllJobs = async (): Promise<Job[]> => {
    const prismaJobs = await database.job.findMany();
    return prismaJobs.map((job) => Job.from(job));
};

const getJobById = async (id: number): Promise<Job | null> => {
    const prismaJob = await database.job.findUnique({ where: { id } });
    return prismaJob ? Job.from(prismaJob) : null;
};

const createJob = async (job: Job): Promise<Job> => {
    const prismaJob = await database.job.create({
        data: {
            title: job.getTitle(),
            description: job.getDescription(),
            requirements: job.getRequirements(),
            location: job.getLocation(),
            salaryRange: job.getSalaryRange(),
            companyId: job.getCompanyId(),
        },
    });
    return Job.from(prismaJob);
};

const updateJob = async (
    id: number,
    data: Partial<{
        title: string;
        description: string;
        requirements: string[];
        location: string;
        salaryRange: string;
    }>
): Promise<Job> => {
    const prismaJob = await database.job.update({
        where: { id },
        data,
    });
    return Job.from(prismaJob);
};

const deleteJob = async (id: number): Promise<void> => {
    await database.job.delete({ where: { id } });
};

export default {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};
