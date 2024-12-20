import { Application as ApplicationPrisma, ApplicationStatus } from '@prisma/client';

export class Application {
    private id?: number;
    private status: ApplicationStatus;
    private userId: number;
    private jobId: number;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(application: {
        id?: number;
        status?: ApplicationStatus;
        userId: number;
        jobId: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = application.id;
        this.status = application.status || ApplicationStatus.pending;
        this.userId = application.userId;
        this.jobId = application.jobId;
        this.createdAt = application.createdAt || new Date();
        this.updatedAt = application.updatedAt || new Date();
    }

    getId(): number | undefined {
        return this.id;
    }

    getStatus(): ApplicationStatus {
        return this.status;
    }

    getUserId(): number {
        return this.userId;
    }

    getJobId(): number {
        return this.jobId;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setStatus(status: ApplicationStatus): void {
        this.status = status;
    }

    static from(prismaApplication: ApplicationPrisma): Application {
        return new Application({
            id: prismaApplication.id,
            status: prismaApplication.status,
            userId: prismaApplication.userId,
            jobId: prismaApplication.jobId,
            createdAt: prismaApplication.createdAt,
            updatedAt: prismaApplication.updatedAt,
        });
    }
}
