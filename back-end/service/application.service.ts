// Updated application.service.ts with validation logic and input hygiene
import { Application } from '../model/application';
import applicationDB from '../repository/application.db';
import { ApplicationStatus } from '@prisma/client';

const getAllApplications = async (): Promise<Application[]> => {
    return applicationDB.getAllApplications();
};

const getApplicationById = async (id: number): Promise<Application> => {
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid application ID');
    const application = await applicationDB.getApplicationById(id);
    if (!application) throw new Error('Application not found');
    return application;
};

const getApplicationsByUserId = async (userId: number): Promise<Application[]> => {
    if (!Number.isInteger(userId) || userId <= 0) throw new Error('Invalid user ID');
    return applicationDB.getApplicationsByUserId(userId);
};

const getApplicationsByCompanyId = async (companyId: number) => {
    if (!Number.isInteger(companyId) || companyId <= 0) throw new Error('Invalid company ID');
    return applicationDB.getApplicationsByCompanyId(companyId);
};

const getApplicationsByJobId = async (jobId: number) => {
    if (!Number.isInteger(jobId) || jobId <= 0) throw new Error('Invalid job ID');
    return applicationDB.getApplicationsByJobId(jobId);
};

const createApplication = async ({
    userId,
    jobId,
}: {
    userId: number;
    jobId: number;
}): Promise<Application> => {
    if (!Number.isInteger(userId) || !Number.isInteger(jobId)) {
        throw new Error('Invalid user or job ID');
    }
    const newApplication = new Application({ userId, jobId });
    return applicationDB.createApplication(newApplication);
};

const updateApplicationStatus = async (
    id: number,
    status: ApplicationStatus
): Promise<Application> => {
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid application ID');
    if (!['pending', 'accepted', 'rejected'].includes(status)) throw new Error('Invalid status');
    return applicationDB.updateApplication(id, { status });
};

const deleteApplication = async (id: number): Promise<void> => {
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid application ID');
    await applicationDB.deleteApplication(id);
};

const deleteApplicationsByJobId = async (jobId: number): Promise<void> => {
    if (!Number.isInteger(jobId) || jobId <= 0) throw new Error('Invalid job ID');
    await applicationDB.deleteApplicationsByJobId(jobId);
};

export default {
    getAllApplications,
    getApplicationById,
    getApplicationsByUserId,
    getApplicationsByCompanyId,
    getApplicationsByJobId,
    createApplication,
    updateApplicationStatus,
    deleteApplication,
    deleteApplicationsByJobId,
};
