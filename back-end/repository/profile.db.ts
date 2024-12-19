import { Profile } from '../model/profile';
import database from '../util/database';

const getAllProfiles = async (): Promise<Profile[]> => {
    try {
        const profilesPrisma = await database.profile.findMany({
            include: {
                user: true,
            },
        });
        return profilesPrisma.map((profilePrisma) => Profile.from(profilePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getProfileByUserId = async ({ userId }: { userId: number }): Promise<Profile> => {
    try {
        if (!userId) throw new Error('User ID is required.');

        const profilePrisma = await database.profile.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });

        if (!profilePrisma) throw new Error(`Profile not found for user ID: ${userId}`);

        return Profile.from(profilePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default { getAllProfiles, getProfileByUserId };
