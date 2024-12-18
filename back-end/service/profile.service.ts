import { Profile } from '../model/profile';
import profileDb from '../repository/profile.db';

const getAllProfiles = async (): Promise<Profile[]> => profileDb.getAllProfiles();

export default { getAllProfiles };
