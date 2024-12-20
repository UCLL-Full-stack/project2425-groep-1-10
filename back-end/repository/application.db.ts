import { ApplicationStatus } from '@prisma/client';
import { Application } from '../model/application';
import database from '../util/database';

const getAllApplications = async (): Promise<Application[]> => {
    const prismaApplications = await database.application.findMany();
    return prismaApplications.map((app) => Application.from(app));
};

const getApplicationById = async (id: number): Promise<Application | null> => {
    const prismaApplication = await database.application.findUnique({ where: { id } });
    return prismaApplication ? Application.from(prismaApplication) : null;
};

const getApplicationsByUserId = async (userId: number): Promise<Application[] | null> => {
    const prismaApplications = await database.application.findMany({ where: { userId } });
    return prismaApplications.map((application) => Application.from(application));
};

const getApplicationsByCompanyId = async (companyId: number) => {
    return await database.application.findMany({
        where: {
            job: {
                companyId,
            },
            status: 'pending' as ApplicationStatus,
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            job: {
                select: {
                    title: true,
                },
            },
        },
    });
};

const getApplicationsByJobId = async (jobId: number) => {
    return await database.application.findMany({
        where: {
            jobId,
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
};

const createApplication = async (application: Application): Promise<Application> => {
    const prismaApplication = await database.application.create({
        data: {
            status: application.getStatus(),
            userId: application.getUserId(),
            jobId: application.getJobId(),
        },
    });
    return Application.from(prismaApplication);
};

const updateApplication = async (
    id: number,
    data: Partial<{ status: ApplicationStatus }>
): Promise<Application> => {
    const prismaApplication = await database.application.update({
        where: { id },
        data,
    });
    return Application.from(prismaApplication);
};

const deleteApplication = async (id: number): Promise<void> => {
    await database.application.delete({ where: { id } });
};

const deleteApplicationsByJobId = async (jobId: number): Promise<void> => {
    await database.application.deleteMany({ where: { jobId } });
};

export default {
    getAllApplications,
    getApplicationById,
    getApplicationsByUserId,
    getApplicationsByCompanyId,
    getApplicationsByJobId,
    createApplication,
    updateApplication,
    deleteApplication,
    deleteApplicationsByJobId,
};
