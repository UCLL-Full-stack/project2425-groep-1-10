import { Profile as ProfilePrisma, User as UserPrisma } from '@prisma/client';
import { User } from './user';

export class Profile {
    private id?: number;
    private bio?: string;
    private skills: string[];
    private resumeUrl?: string;
    private user: User;

    constructor(profile: {
        id?: number;
        bio?: string;
        skills: string[];
        resumeUrl?: string;
        user: User;
    }) {
        this.validate(profile);

        this.id = profile.id;
        this.bio = profile.bio;
        this.skills = profile.skills;
        this.resumeUrl = profile.resumeUrl;
        this.user = profile.user;
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

    getUser(): User {
        return this.user;
    }

    validate(profile: { bio?: string; skills: string[]; resumeUrl?: string; user: User }) {
        if (profile.bio && typeof profile.bio !== 'string') throw new Error('Invalid profile bio');
        if (
            !Array.isArray(profile.skills) ||
            profile.skills.some((skill) => typeof skill !== 'string')
        )
            throw new Error('Invalid profile skills');
        if (profile.resumeUrl && typeof profile.resumeUrl !== 'string')
            throw new Error('Invalid profile resumeUrl');
        if (!(profile.user instanceof User)) throw new Error('Invalid profile user');
    }

    equals({ id, bio, skills, resumeUrl, user }): boolean {
        return (
            this.id === id &&
            this.bio === bio &&
            this.skills === skills &&
            this.resumeUrl === resumeUrl &&
            this.user.equals(user)
        );
    }

    static from({ id, bio, skills, resumeUrl, user }: ProfilePrisma & { user: UserPrisma }) {
        return new Profile({
            id,
            bio,
            skills,
            resumeUrl,
            user: User.from(user),
        });
    }
}
