import {
    User as UserPrisma,
    Job as JobPrisma,
    Company as CompanyPrisma,
    Application as ApplicationPrisma,
} from '@prisma/client';
import { Company } from './company';
import { Application } from './application';

export class Job {
    private id?: number;
    private title: string;
    private description: string;
    private requirements: string[];
    private salaryRange?: string;
    private location: string;
    private company: Company;
    private applications: Application[];

    constructor(job: {
        id?: number;
        title: string;
        description: string;
        requirements: string[];
        salaryRange?: string;
        location: string;
        company: Company;
        applications: Application[];
    }) {
        this.validate(job);

        this.id = job.id;
        this.title = job.title;
        this.description = job.description;
        this.requirements = job.requirements;
        this.salaryRange = job.salaryRange;
        this.location = job.location;
        this.company = job.company;
        this.applications = job.applications;
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getRequirements(): string[] {
        return this.requirements;
    }

    getSalaryRange(): string | undefined {
        return this.salaryRange;
    }

    getLocation(): string {
        return this.location;
    }

    getCompany(): Company {
        return this.company;
    }

    getApplications(): Application[] {
        return this.applications;
    }

    validate(job: {
        title: string;
        description: string;
        requirements: string[];
        salaryRange?: string;
        location: string;
        company: Company;
        applications: Application[];
    }) {
        if (typeof job.title !== 'string') throw new Error('Invalid job title');
        if (typeof job.description !== 'string') throw new Error('Invalid job description');
        if (
            !Array.isArray(job.requirements) ||
            job.requirements.some((req) => typeof req !== 'string')
        )
            throw new Error('Invalid job requirements');
        if (job.salaryRange && typeof job.salaryRange !== 'string')
            throw new Error('Invalid job salaryRange');
        if (typeof job.location !== 'string') throw new Error('Invalid job location');
        if (!(job.company instanceof Company)) throw new Error('Invalid job company');
        if (
            !Array.isArray(job.applications) ||
            job.applications.some((application) => !(application instanceof Application))
        )
            throw new Error('Invalid job applications');
    }

    equals({
        id,
        title,
        description,
        requirements,
        salaryRange,
        location,
        company,
        applications,
    }): boolean {
        return (
            this.id === id &&
            this.title === title &&
            this.description === description &&
            this.requirements === requirements &&
            this.salaryRange === salaryRange &&
            this.location === location &&
            this.company.equals(company) &&
            this.applications.every((application, index) => application.equals(applications[index]))
        );
    }

    static from({
        id,
        title,
        description,
        requirements,
        salaryRange,
        location,
        company,
        applications,
    }: JobPrisma & {
        company: CompanyPrisma & { creator: UserPrisma; jobs: JobPrisma[] };
        applications: ApplicationPrisma[];
    }) {
        return new Job({
            id,
            title,
            description,
            requirements,
            salaryRange,
            location,
            company: Company.from(company),
            applications: applications.map(Application.from),
        });
    }
}
