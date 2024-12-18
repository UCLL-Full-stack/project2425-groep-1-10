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

export default { getAllProfiles };
