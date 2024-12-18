import { Company as CompanyPrisma, User as UserPrisma, Job as JobPrisma } from '@prisma/client';
import { User } from './user';
import { Job } from './job';

export class Company {
    private id?: number;
    private name: string;
    private description?: string;
    private websiteUrl?: string;
    private creator: User;
    private jobs: Job[];

    constructor(company: {
        id?: number;
        name: string;
        description?: string;
        websiteUrl?: string;
        creator: User;
        jobs: Job[];
    }) {
        this.validate(company);

        this.id = company.id;
        this.name = company.name;
        this.description = company.description;
        this.websiteUrl = company.websiteUrl;
        this.creator = company.creator;
        this.jobs = company.jobs;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getWebsiteUrl(): string | undefined {
        return this.websiteUrl;
    }

    getCreator(): User {
        return this.creator;
    }

    getJobs(): Job[] {
        return this.jobs;
    }

    validate(company: {
        name: string;
        description?: string;
        websiteUrl?: string;
        creator: User;
        jobs: Job[];
    }) {
        if (typeof company.name !== 'string') throw new Error('Invalid company name');
        if (company.description && typeof company.description !== 'string')
            throw new Error('Invalid company description');
        if (company.websiteUrl && typeof company.websiteUrl !== 'string')
            throw new Error('Invalid company websiteUrl');
        if (!(company.creator instanceof User)) throw new Error('Invalid company creator');
        if (!Array.isArray(company.jobs) || company.jobs.some((job) => !(job instanceof Job)))
            throw new Error('Invalid company jobs');
    }

    equals({ id, name, description, websiteUrl, creator, jobs }): boolean {
        return (
            this.id === id &&
            this.name === name &&
            this.description === description &&
            this.websiteUrl === websiteUrl &&
            this.creator.equals(creator) &&
            this.jobs.every((job, index) => job.equals(jobs[index]))
        );
    }

    static from({
        id,
        name,
        description,
        websiteUrl,
        creator,
        jobs,
    }: CompanyPrisma & { creator: UserPrisma; jobs: JobPrisma[] }) {
        return new Company({
            id,
            name,
            description,
            websiteUrl,
            creator: User.from(creator),
            jobs: jobs.map(Job.from),
        });
    }
}
