import { Profile as ProfilePrisma } from '@prisma/client';

export class Profile {
    private id?: number;
    private bio?: string;
    private skills: string[];
    private resumeUrl?: string;
    private userId: number;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(profile: {
        id?: number;
        bio?: string;
        skills: string[];
        resumeUrl?: string;
        userId: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(profile);

        this.id = profile.id;
        this.bio = profile.bio;
        this.skills = profile.skills;
        this.resumeUrl = profile.resumeUrl;
        this.userId = profile.userId;
        this.createdAt = profile.createdAt || new Date();
        this.updatedAt = profile.updatedAt || new Date();
    }

    getId(): number | undefined {
        return this.id;
    }

    getBio(): string | undefined {
        return this.bio;
    }

    getSkills(): string[] {
        return this.skills;
    }

    getResumeUrl(): string | undefined {
        return this.resumeUrl;
    }

    getUserId(): number {
        return this.userId;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setBio(bio: string): void {
        this.bio = bio;
    }

    setSkills(skills: string[]): void {
        this.skills = skills;
    }

    setResumeUrl(resumeUrl: string): void {
        this.resumeUrl = resumeUrl;
    }

    validate(profile: { skills: string[]; userId: number }): void {
        if (!profile.skills || !Array.isArray(profile.skills) || profile.skills.length === 0) {
            throw new Error('Skills are required and must be an array.');
        }
        if (!profile.userId) {
            throw new Error('User ID is required.');
        }
    }

    static from(prismaProfile: ProfilePrisma): Profile {
        return new Profile({
            id: prismaProfile.id,
            bio: prismaProfile.bio || undefined,
            skills: prismaProfile.skills,
            resumeUrl: prismaProfile.resumeUrl || undefined,
            userId: prismaProfile.userId,
            createdAt: prismaProfile.createdAt,
            updatedAt: prismaProfile.updatedAt,
        });
    }
}
