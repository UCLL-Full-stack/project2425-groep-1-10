import { Application } from '../model/application';
import applicationDB from '../repository/application.db';
import { ApplicationStatus } from '@prisma/client';

const getAllApplications = async (): Promise<Application[]> => {
    return applicationDB.getAllApplications();
};

const getApplicationById = async (id: number): Promise<Application> => {
    const application = await applicationDB.getApplicationById(id);
    if (!application) throw new Error('Application not found');
    return application;
};

const getApplicationsByUserId = async (userId: number): Promise<Application[]> => {
    return applicationDB.getApplicationsByUserId(userId);
};

const getApplicationsByCompanyId = async (companyId: number) => {
    return applicationDB.getApplicationsByCompanyId(companyId);
};

const createApplication = async ({
    userId,
    jobId,
}: {
    userId: number;
    jobId: number;
}): Promise<Application> => {
    const newApplication = new Application({ userId, jobId });
    return applicationDB.createApplication(newApplication);
};

const updateApplicationStatus = async (
    id: number,
    status: ApplicationStatus
): Promise<Application> => {
    return applicationDB.updateApplication(id, { status });
};

const deleteApplication = async (id: number): Promise<void> => {
    await applicationDB.deleteApplication(id);
};

export default {
    getAllApplications,
    getApplicationById,
    getApplicationsByUserId,
    getApplicationsByCompanyId,
    createApplication,
    updateApplicationStatus,
    deleteApplication,
};
