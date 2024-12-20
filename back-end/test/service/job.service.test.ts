import { Job } from '../../model/job';
import jobDB from '../../repository/job.db';
import jobService from '../../service/job.service';

jest.mock('../../repository/job.db');

let mockGetAllJobs: jest.Mock;
let mockGetJobsByCompanyId: jest.Mock;
let mockGetJobById: jest.Mock;
let mockGetJobsThatMatchUserSkills: jest.Mock;
let mockGetUnappliedVacanciesForUser: jest.Mock;
let mockGetUnappliedJobsThatMatchUserSkills: jest.Mock;
let mockCreateJob: jest.Mock;
let mockUpdateJob: jest.Mock;
let mockDeleteJob: jest.Mock;
let mockDeleteApplicationsByJobId: jest.Mock;

beforeEach(() => {
    mockGetAllJobs = jest.fn();
    mockGetJobsByCompanyId = jest.fn();
    mockGetJobById = jest.fn();
    mockGetJobsThatMatchUserSkills = jest.fn();
    mockGetUnappliedVacanciesForUser = jest.fn();
    mockGetUnappliedJobsThatMatchUserSkills = jest.fn();
    mockCreateJob = jest.fn();
    mockUpdateJob = jest.fn();
    mockDeleteJob = jest.fn();
    mockDeleteApplicationsByJobId = jest.fn();

    jobDB.getAllJobs = mockGetAllJobs;
    jobDB.getJobsByCompanyId = mockGetJobsByCompanyId;
    jobDB.getJobById = mockGetJobById;
    jobDB.getJobsThatMatchUserSkills = mockGetJobsThatMatchUserSkills;
    jobDB.getUnappliedVacanciesForUser = mockGetUnappliedVacanciesForUser;
    jobDB.getUnappliedJobsThatMatchUserSkills = mockGetUnappliedJobsThatMatchUserSkills;
    jobDB.createJob = mockCreateJob;
    jobDB.updateJob = mockUpdateJob;
    jobDB.deleteJob = mockDeleteJob;
    jobDB.deleteApplicationsByJobId = mockDeleteApplicationsByJobId;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('jobService', () => {
    describe('getAllJobs', () => {
        it('should fetch all jobs', async () => {
            const mockJobs = [
                new Job({
                    id: 1,
                    title: 'Developer',
                    description: 'Build applications',
                    requirements: ['JavaScript', 'React'],
                    location: 'Remote',
                    salaryRange: '70k-90k',
                    companyId: 1,
                }),
            ];
            mockGetAllJobs.mockResolvedValue(mockJobs);

            const jobs = await jobService.getAllJobs();

            expect(mockGetAllJobs).toHaveBeenCalledTimes(1);
            expect(jobs).toEqual(mockJobs);
        });
    });

    describe('getJobsByCompanyId', () => {
        it('should fetch jobs by company ID', async () => {
            const mockJobs = [
                new Job({
                    id: 1,
                    title: 'Developer',
                    description: 'Build applications',
                    requirements: ['JavaScript', 'React'],
                    location: 'Remote',
                    salaryRange: '70k-90k',
                    companyId: 1,
                }),
            ];
            mockGetJobsByCompanyId.mockResolvedValue(mockJobs);

            const jobs = await jobService.getJobsByCompanyId(1);

            expect(mockGetJobsByCompanyId).toHaveBeenCalledWith(1);
            expect(jobs).toEqual(mockJobs);
        });
    });

    describe('getJobById', () => {
        it('should fetch a job by ID', async () => {
            const mockJob = new Job({
                id: 1,
                title: 'Developer',
                description: 'Build applications',
                requirements: ['JavaScript', 'React'],
                location: 'Remote',
                salaryRange: '70k-90k',
                companyId: 1,
            });
            mockGetJobById.mockResolvedValue(mockJob);

            const job = await jobService.getJobById(1);

            expect(mockGetJobById).toHaveBeenCalledWith(1);
            expect(job).toEqual(mockJob);
        });

        it('should throw an error if the job is not found', async () => {
            mockGetJobById.mockResolvedValue(null);

            await expect(jobService.getJobById(1)).rejects.toThrow('Job not found');
        });
    });

    describe('createJob', () => {
        it('should create a new job', async () => {
            const input = {
                title: 'DevOps Engineer',
                description: 'Manage infrastructure',
                requirements: ['AWS', 'Docker'],
                location: 'Remote',
                salaryRange: '80k-100k',
                companyId: 1,
            };
            const mockJob = new Job({ id: 1, ...input });
            mockCreateJob.mockResolvedValue(mockJob);

            const job = await jobService.createJob(input);

            expect(mockCreateJob).toHaveBeenCalledWith(expect.any(Job));
            expect(job).toEqual(mockJob);
        });
    });

    describe('deleteJob', () => {
        it('should delete a job by ID', async () => {
            mockDeleteJob.mockResolvedValue(undefined);

            await jobService.deleteJob(1);

            expect(mockDeleteJob).toHaveBeenCalledWith(1);
        });
    });
});
