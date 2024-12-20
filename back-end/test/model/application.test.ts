import { Application } from '../../model/application';
import { ApplicationStatus } from '@prisma/client';

describe('Application Model', () => {
    it('should create an Application object with default values', () => {
        const applicationData = {
            userId: 1,
            jobId: 2,
        };

        const application = new Application(applicationData);

        expect(application.getId()).toBeUndefined();
        expect(application.getStatus()).toBe(ApplicationStatus.pending);
        expect(application.getUserId()).toBe(applicationData.userId);
        expect(application.getJobId()).toBe(applicationData.jobId);
        expect(application.getCreatedAt()).toBeInstanceOf(Date);
        expect(application.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should create an Application object with provided values', () => {
        const applicationData = {
            id: 1,
            status: ApplicationStatus.accepted,
            userId: 1,
            jobId: 2,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const application = new Application(applicationData);

        expect(application.getId()).toBe(applicationData.id);
        expect(application.getStatus()).toBe(applicationData.status);
        expect(application.getUserId()).toBe(applicationData.userId);
        expect(application.getJobId()).toBe(applicationData.jobId);
        expect(application.getCreatedAt()).toEqual(applicationData.createdAt);
        expect(application.getUpdatedAt()).toEqual(applicationData.updatedAt);
    });

    it('should update the status of the application', () => {
        const applicationData = {
            id: 1,
            userId: 1,
            jobId: 2,
        };
        const application = new Application(applicationData);

        application.setStatus(ApplicationStatus.rejected);

        expect(application.getStatus()).toBe(ApplicationStatus.rejected);
    });

    it('should create an Application object from a Prisma object', () => {
        const prismaApplication = {
            id: 1,
            status: ApplicationStatus.accepted,
            userId: 1,
            jobId: 2,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const application = Application.from(prismaApplication);

        expect(application.getId()).toBe(prismaApplication.id);
        expect(application.getStatus()).toBe(prismaApplication.status);
        expect(application.getUserId()).toBe(prismaApplication.userId);
        expect(application.getJobId()).toBe(prismaApplication.jobId);
        expect(application.getCreatedAt()).toEqual(prismaApplication.createdAt);
        expect(application.getUpdatedAt()).toEqual(prismaApplication.updatedAt);
    });
});
