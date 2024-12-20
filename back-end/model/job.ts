import { Job as JobPrisma } from '@prisma/client';

export class Job {
    private id?: number;
    private title: string;
    private description: string;
    private requirements: string[];
    private location: string;
    private salaryRange?: string;
    private companyId: number;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(job: {
        id?: number;
        title: string;
        description: string;
        requirements: string[];
        location: string;
        salaryRange?: string;
        companyId: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(job);

        this.id = job.id;
        this.title = job.title;
        this.description = job.description;
        this.requirements = job.requirements;

        this.location = job.location;
        this.salaryRange = job.salaryRange;
        this.companyId = job.companyId;
        this.createdAt = job.createdAt || new Date();
        this.updatedAt = job.updatedAt || new Date();
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

    getLocation(): string {
        return this.location;
    }

    getSalaryRange(): string | undefined {
        return this.salaryRange;
    }

    getCompanyId(): number {
        return this.companyId;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setRequirements(requirements: string[]): void {
        this.requirements = requirements;
    }

    setSalaryRange(salaryRange: string): void {
        this.salaryRange = salaryRange;
    }

    validate(job: {
        title: string;
        description: string;
        requirements: string[];
        location: string;
        companyId: number;
    }): void {
        if (!job.title?.trim()) throw new Error('Job title is required');
        if (!job.description?.trim()) throw new Error('Job description is required');
        if (!job.requirements?.length) throw new Error('Job requirements are required');
        if (!job.location?.trim()) throw new Error('Job location is required');
        if (!job.companyId) throw new Error('Company ID is required');
    }

    static from(prismaJob: JobPrisma): Job {
        return new Job({
            id: prismaJob.id,
            title: prismaJob.title,
            description: prismaJob.description,
            requirements: prismaJob.requirements,
            location: prismaJob.location,
            salaryRange: prismaJob.salaryRange || undefined,
            companyId: prismaJob.companyId,
            createdAt: prismaJob.createdAt,
            updatedAt: prismaJob.updatedAt,
        });
    }
}
