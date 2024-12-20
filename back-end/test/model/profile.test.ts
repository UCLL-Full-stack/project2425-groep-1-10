import { Profile } from '../../model/profile';

describe('Profile Model', () => {
    it('should create a Profile object with default values', () => {
        const profileData = {
            skills: ['JavaScript', 'React', 'Node.js'],
            userId: 1,
        };

        const profile = new Profile(profileData);

        expect(profile.getId()).toBeUndefined();
        expect(profile.getBio()).toBeUndefined();
        expect(profile.getSkills()).toEqual(profileData.skills);
        expect(profile.getResumeUrl()).toBeUndefined();
        expect(profile.getUserId()).toBe(profileData.userId);
        expect(profile.getCreatedAt()).toBeInstanceOf(Date);
        expect(profile.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should create a Profile object with provided values', () => {
        const profileData = {
            id: 1,
            bio: 'A passionate developer',
            skills: ['JavaScript', 'React', 'Node.js'],
            resumeUrl: 'https://resume.example.com',
            userId: 1,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const profile = new Profile(profileData);

        expect(profile.getId()).toBe(profileData.id);
        expect(profile.getBio()).toBe(profileData.bio);
        expect(profile.getSkills()).toEqual(profileData.skills);
        expect(profile.getResumeUrl()).toBe(profileData.resumeUrl);
        expect(profile.getUserId()).toBe(profileData.userId);
        expect(profile.getCreatedAt()).toEqual(profileData.createdAt);
        expect(profile.getUpdatedAt()).toEqual(profileData.updatedAt);
    });

    it('should update the bio, skills, and resumeUrl of the profile', () => {
        const profileData = {
            skills: ['JavaScript', 'React', 'Node.js'],
            userId: 1,
        };
        const profile = new Profile(profileData);

        profile.setBio('Updated bio');
        profile.setSkills(['TypeScript', 'GraphQL']);
        profile.setResumeUrl('https://updated-resume.example.com');

        expect(profile.getBio()).toBe('Updated bio');
        expect(profile.getSkills()).toEqual(['TypeScript', 'GraphQL']);
        expect(profile.getResumeUrl()).toBe('https://updated-resume.example.com');
    });

    it('should validate required fields and throw errors for missing data', () => {
        expect(() =>
            new Profile({
                skills: [],
                userId: 1,
            })
        ).toThrow('Skills are required and must be an array.');

        expect(() =>
            new Profile({
                skills: ['JavaScript'],
                userId: 0,
            })
        ).toThrow('User ID is required.');
    });

    it('should create a Profile object from a Prisma object', () => {
        const prismaProfile = {
            id: 1,
            bio: 'A passionate developer',
            skills: ['JavaScript', 'React', 'Node.js'],
            resumeUrl: 'https://resume.example.com',
            userId: 1,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const profile = Profile.from(prismaProfile);

        expect(profile.getId()).toBe(prismaProfile.id);
        expect(profile.getBio()).toBe(prismaProfile.bio);
        expect(profile.getSkills()).toEqual(prismaProfile.skills);
        expect(profile.getResumeUrl()).toBe(prismaProfile.resumeUrl);
        expect(profile.getUserId()).toBe(prismaProfile.userId);
        expect(profile.getCreatedAt()).toEqual(prismaProfile.createdAt);
        expect(profile.getUpdatedAt()).toEqual(prismaProfile.updatedAt);
    });
});
