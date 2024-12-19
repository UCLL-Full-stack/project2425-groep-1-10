import { Profile } from '../model/profile';
import profileDb from '../repository/profile.db';

const getAllProfiles = async (): Promise<Profile[]> => profileDb.getAllProfiles();

const getProfileByUserId = async ({ userId }: { userId: number }): Promise<Profile> => {
    if (!userId) throw new Error('User ID is required.');
    const profile = await profileDb.getProfileByUserId({ userId });
    if (!profile) throw new Error('Profile not found.');
    return profile;
};

export default { getAllProfiles, getProfileByUserId };
