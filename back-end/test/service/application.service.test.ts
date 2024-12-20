import { Application } from '../../model/application';
import applicationDB from '../../repository/application.db';
import applicationService from '../../service/application.service';
import { ApplicationStatus } from '@prisma/client';

jest.mock('../../repository/application.db');

let mockGetAllApplications: jest.Mock;
let mockGetApplicationById: jest.Mock;
let mockGetApplicationsByUserId: jest.Mock;
let mockGetApplicationsByCompanyId: jest.Mock;
let mockCreateApplication: jest.Mock;
let mockUpdateApplicationStatus: jest.Mock;
let mockDeleteApplication: jest.Mock;

beforeEach(() => {
    mockGetAllApplications = jest.fn();
    mockGetApplicationById = jest.fn();
    mockGetApplicationsByUserId = jest.fn();
    mockGetApplicationsByCompanyId = jest.fn();
    mockCreateApplication = jest.fn();
    mockUpdateApplicationStatus = jest.fn();
    mockDeleteApplication = jest.fn();

    applicationDB.getAllApplications = mockGetAllApplications;
    applicationDB.getApplicationById = mockGetApplicationById;
    applicationDB.getApplicationsByUserId = mockGetApplicationsByUserId;
    applicationDB.getApplicationsByCompanyId = mockGetApplicationsByCompanyId;
    applicationDB.createApplication = mockCreateApplication;
    applicationDB.updateApplication = mockUpdateApplicationStatus;
    applicationDB.deleteApplication = mockDeleteApplication;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('applicationService', () => {
    describe('getAllApplications', () => {
        it('should fetch all applications', async () => {
            const mockApplications = [
                new Application({ id: 1, userId: 1, jobId: 1 }),
            ];
            mockGetAllApplications.mockResolvedValue(mockApplications);

            const applications = await applicationService.getAllApplications();

            expect(mockGetAllApplications).toHaveBeenCalledTimes(1);
            expect(applications).toEqual(mockApplications);
        });
    });

    describe('getApplicationById', () => {
        it('should fetch an application by ID', async () => {
            const mockApplication = new Application({ id: 1, userId: 1, jobId: 1 });
            mockGetApplicationById.mockResolvedValue(mockApplication);

            const application = await applicationService.getApplicationById(1);

            expect(mockGetApplicationById).toHaveBeenCalledWith(1);
            expect(application).toEqual(mockApplication);
        });

        it('should throw an error if the application is not found', async () => {
            mockGetApplicationById.mockResolvedValue(null);

            await expect(applicationService.getApplicationById(1)).rejects.toThrow(
                'Application not found'
            );
        });
    });

    describe('getApplicationsByUserId', () => {
        it('should fetch applications for a specific user', async () => {
            const mockApplications = [
                new Application({ id: 1, userId: 1, jobId: 1 }),
            ];
            mockGetApplicationsByUserId.mockResolvedValue(mockApplications);

            const applications = await applicationService.getApplicationsByUserId(1);

            expect(mockGetApplicationsByUserId).toHaveBeenCalledWith(1);
            expect(applications).toEqual(mockApplications);
        });
    });

    describe('getApplicationsByCompanyId', () => {
        it('should fetch applications for a specific company', async () => {
            const mockApplications = [
                new Application({ id: 1, userId: 1, jobId: 1 }),
            ];
            mockGetApplicationsByCompanyId.mockResolvedValue(mockApplications);

            const applications = await applicationService.getApplicationsByCompanyId(1);

            expect(mockGetApplicationsByCompanyId).toHaveBeenCalledWith(1);
            expect(applications).toEqual(mockApplications);
        });
    });

    describe('createApplication', () => {
        it('should create a new application', async () => {
            const input = { userId: 1, jobId: 1 };
            const mockApplication = new Application({ id: 1, userId: 1, jobId: 1 });
            mockCreateApplication.mockResolvedValue(mockApplication);

            const application = await applicationService.createApplication(input);

            expect(mockCreateApplication).toHaveBeenCalledWith(expect.any(Application));
            expect(application).toEqual(mockApplication);
        });
    });

    describe('updateApplicationStatus', () => {
        it('should update the status of an application', async () => {
            const mockApplication = new Application({
                id: 1,
                userId: 1,
                jobId: 1,
                status: ApplicationStatus.accepted,
            });
            mockUpdateApplicationStatus.mockResolvedValue(mockApplication);

            const application = await applicationService.updateApplicationStatus(
                1,
                ApplicationStatus.accepted
            );

            expect(mockUpdateApplicationStatus).toHaveBeenCalledWith(1, { status: ApplicationStatus.accepted });
            expect(application).toEqual(mockApplication);
        });
    });

    describe('deleteApplication', () => {
        it('should delete an application by ID', async () => {
            mockDeleteApplication.mockResolvedValue(undefined);

            await applicationService.deleteApplication(1);

            expect(mockDeleteApplication).toHaveBeenCalledWith(1);
        });
    });
});
