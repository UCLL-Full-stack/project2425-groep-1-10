import { Job } from '../../model/job';

describe('Job Model', () => {
    it('should create a Job object with default values', () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Develop and maintain software applications',
            requirements: ['JavaScript', 'React', 'Node.js'],
            location: 'Remote',
            companyId: 1,
        };

        const job = new Job(jobData);

        expect(job.getId()).toBeUndefined();
        expect(job.getTitle()).toBe(jobData.title);
        expect(job.getDescription()).toBe(jobData.description);
        expect(job.getRequirements()).toEqual(jobData.requirements);
        expect(job.getLocation()).toBe(jobData.location);
        expect(job.getSalaryRange()).toBeUndefined();
        expect(job.getCompanyId()).toBe(jobData.companyId);
        expect(job.getCreatedAt()).toBeInstanceOf(Date);
        expect(job.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should create a Job object with provided values', () => {
        const jobData = {
            id: 1,
            title: 'Software Engineer',
            description: 'Develop and maintain software applications',
            requirements: ['JavaScript', 'React', 'Node.js'],
            location: 'Remote',
            salaryRange: '70k-90k',
            companyId: 1,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const job = new Job(jobData);

        expect(job.getId()).toBe(jobData.id);
        expect(job.getTitle()).toBe(jobData.title);
        expect(job.getDescription()).toBe(jobData.description);
        expect(job.getRequirements()).toEqual(jobData.requirements);
        expect(job.getLocation()).toBe(jobData.location);
        expect(job.getSalaryRange()).toBe(jobData.salaryRange);
        expect(job.getCompanyId()).toBe(jobData.companyId);
        expect(job.getCreatedAt()).toEqual(jobData.createdAt);
        expect(job.getUpdatedAt()).toEqual(jobData.updatedAt);
    });

    it('should update the title, description, requirements, and salary range of the job', () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Develop and maintain software applications',
            requirements: ['JavaScript', 'React', 'Node.js'],
            location: 'Remote',
            companyId: 1,
        };
        const job = new Job(jobData);

        job.setTitle('Senior Software Engineer');
        job.setDescription('Lead the development of software applications');
        job.setRequirements(['TypeScript', 'React', 'Node.js']);
        job.setSalaryRange('90k-120k');

        expect(job.getTitle()).toBe('Senior Software Engineer');
        expect(job.getDescription()).toBe('Lead the development of software applications');
        expect(job.getRequirements()).toEqual(['TypeScript', 'React', 'Node.js']);
        expect(job.getSalaryRange()).toBe('90k-120k');
    });

    it('should validate required fields and throw errors for missing data', () => {
        expect(() =>
            new Job({
                description: 'Job description',
                requirements: ['Skill'],
                location: 'Remote',
                companyId: 1,
            } as any)
        ).toThrow('Job title is required');

        expect(() =>
            new Job({
                title: 'Job Title',
                requirements: ['Skill'],
                location: 'Remote',
                companyId: 1,
            } as any)
        ).toThrow('Job description is required');

        expect(() =>
            new Job({
                title: 'Job Title',
                description: 'Job description',
                location: 'Remote',
                companyId: 1,
            } as any)
        ).toThrow('Job requirements are required');

        expect(() =>
            new Job({
                title: 'Job Title',
                description: 'Job description',
                requirements: ['Skill'],
                companyId: 1,
            } as any)
        ).toThrow('Job location is required');

        expect(() =>
            new Job({
                title: 'Job Title',
                description: 'Job description',
                requirements: ['Skill'],
                location: 'Remote',
            } as any)
        ).toThrow('Company ID is required');
    });

    it('should create a Job object from a Prisma object', () => {
        const prismaJob = {
            id: 1,
            title: 'Software Engineer',
            description: 'Develop and maintain software applications',
            requirements: ['JavaScript', 'React', 'Node.js'],
            location: 'Remote',
            salaryRange: '70k-90k',
            companyId: 1,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const job = Job.from(prismaJob);

        expect(job.getId()).toBe(prismaJob.id);
        expect(job.getTitle()).toBe(prismaJob.title);
        expect(job.getDescription()).toBe(prismaJob.description);
        expect(job.getRequirements()).toEqual(prismaJob.requirements);
        expect(job.getLocation()).toBe(prismaJob.location);
        expect(job.getSalaryRange()).toBe(prismaJob.salaryRange);
        expect(job.getCompanyId()).toBe(prismaJob.companyId);
        expect(job.getCreatedAt()).toEqual(prismaJob.createdAt);
        expect(job.getUpdatedAt()).toEqual(prismaJob.updatedAt);
    });
});
