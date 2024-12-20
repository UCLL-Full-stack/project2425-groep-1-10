import { Profile } from '../model/profile';
import profileDB from '../repository/profile.db';

const getAllProfiles = async (): Promise<Profile[]> => {
    return profileDB.getAllProfiles();
};

const getProfileById = async (id: number): Promise<Profile> => {
    const profile = await profileDB.getProfileById(id);
    if (!profile) throw new Error('Profile not found.');
    return profile;
};

const getProfileByUserId = async (userId: number): Promise<Profile> => {
    const profile = await profileDB.getProfileByUserId(userId);
    if (!profile) throw new Error('Profile not found for the given user.');
    return profile;
};

const createProfile = async ({
    bio,
    skills,
    resumeUrl,
    userId,
}: {
    bio?: string;
    skills: string[];
    resumeUrl?: string;
    userId: number;
}): Promise<Profile> => {
    const newProfile = new Profile({ bio, skills, resumeUrl, userId });
    return profileDB.createProfile(newProfile);
};

const updateProfile = async (
    id: number,
    data: Partial<{
        bio?: string;
        skills?: string[];
        resumeUrl?: string;
    }>
): Promise<Profile> => {
    return profileDB.updateProfile(id, data);
};

const deleteProfile = async (id: number): Promise<void> => {
    await profileDB.deleteProfile(id);
};

export default {
    getAllProfiles,
    getProfileById,
    getProfileByUserId,
    createProfile,
    updateProfile,
    deleteProfile,
};
