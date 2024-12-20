import { Job } from '../model/job';
import database from '../util/database';

const getAllJobs = async (): Promise<Job[]> => {
    const prismaJobs = await database.job.findMany();
    return prismaJobs.map((job) => Job.from(job));
};

const getJobsByCompanyId = async (companyId: number): Promise<Job[] | null> => {
    const prismaJobs = await database.job.findMany({ where: { companyId } });
    return prismaJobs.map((job) => Job.from(job));
};

const getJobById = async (id: number): Promise<Job | null> => {
    const prismaJob = await database.job.findUnique({ where: { id } });
    return prismaJob ? Job.from(prismaJob) : null;
};

const getJobsThatMatchUserSkills = async (userSkills: string[]): Promise<Job[]> => {
    // Fetch jobs that match at least one of the user's skills
    const prismaJobs = await database.job.findMany({
        where: {
            requirements: {
                hasSome: userSkills, // Matches any job where requirements contain any of the user's skills
            },
        },
    });

    // Convert the raw database jobs into the application's Job model
    return prismaJobs.map((job) => Job.from(job));
};

const getUnappliedVacanciesForUser = async (userId: number): Promise<Job[]> => {
    // Fetch jobs that the user has not applied to
    const prismaJobs = await database.job.findMany({
        where: {
            applications: {
                none: {
                    userId,
                },
            },
        },
    });

    // Convert the raw database jobs into the application's Job model
    return prismaJobs.map((job) => Job.from(job));
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
    getJobsByCompanyId,
    getJobById,
    getJobsThatMatchUserSkills,
    getUnappliedVacanciesForUser,
    createJob,
    updateJob,
    deleteJob,
};
