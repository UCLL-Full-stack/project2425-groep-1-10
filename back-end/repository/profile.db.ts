import { Profile } from '../model/profile';
import database from '../util/database';

const getAllProfiles = async (): Promise<Profile[]> => {
    const prismaProfiles = await database.profile.findMany();
    return prismaProfiles.map((profile) => Profile.from(profile));
};

const getProfileById = async (id: number): Promise<Profile | null> => {
    const prismaProfile = await database.profile.findUnique({ where: { id } });
    return prismaProfile ? Profile.from(prismaProfile) : null;
};

const getProfileByUserId = async (userId: number): Promise<Profile | null> => {
    const prismaProfile = await database.profile.findUnique({ where: { userId } });
    return prismaProfile ? Profile.from(prismaProfile) : null;
};

const createProfile = async (profile: Profile): Promise<Profile> => {
    const prismaProfile = await database.profile.create({
        data: {
            bio: profile.getBio(),
            skills: profile.getSkills(),
            resumeUrl: profile.getResumeUrl(),
            userId: profile.getUserId(),
        },
    });
    return Profile.from(prismaProfile);
};

const updateProfile = async (
    id: number,
    data: Partial<{
        bio?: string;
        skills?: string[];
        resumeUrl?: string;
    }>
): Promise<Profile> => {
    const prismaProfile = await database.profile.update({
        where: { id },
        data,
    });
    return Profile.from(prismaProfile);
};

const deleteProfile = async (id: number): Promise<void> => {
    await database.profile.delete({ where: { id } });
};

export default {
    getAllProfiles,
    getProfileById,
    getProfileByUserId,
    createProfile,
    updateProfile,
    deleteProfile,
};
