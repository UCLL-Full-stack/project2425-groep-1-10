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

export default {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
};