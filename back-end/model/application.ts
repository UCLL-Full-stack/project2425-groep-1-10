import {
    Application as ApplicationPrisma,
    User as UserPrisma,
    Job as JobPrisma,
    Company as CompanyPrisma,
} from '@prisma/client';
import { User } from './user';
import { Job } from './job';

export class Application {
    private id?: number;
    private status: string;
    private user: User;
    private job: Job;

    constructor(application: { id?: number; status: string; user: User; job: Job }) {
        this.validate(application);

        this.id = application.id;
        this.status = application.status;
        this.user = application.user;
        this.job = application.job;
    }

    getId(): number | undefined {
        return this.id;
    }

    getStatus(): string {
        return this.status;
    }

    getUser(): User {
        return this.user;
    }

    getJob(): Job {
        return this.job;
    }

    validate(application: { status: string; user: User; job: Job }) {
        if (typeof application.status !== 'string') throw new Error('Invalid application status');
        if (!(application.user instanceof User)) throw new Error('Invalid application user');
        if (!(application.job instanceof Job)) throw new Error('Invalid application job');
    }

    equals({ id, status, user, job }): boolean {
        return (
            this.id === id &&
            this.status === status &&
            this.user.equals(user) &&
            this.job.equals(job)
        );
    }

    static from({
        id,
        status,
        user,
        job,
    }: ApplicationPrisma & {
        user: UserPrisma;
        job: JobPrisma & {
            company: CompanyPrisma & { creator: UserPrisma; jobs: JobPrisma[] };
            applications: ApplicationPrisma[];
        };
    }) {
        return new Application({
            id,
            status,
            user: User.from(user),
            job: Job.from(job),
        });
    }
}
