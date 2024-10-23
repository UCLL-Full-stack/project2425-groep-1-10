import { User } from '@prisma/client';
import userDb from '../repository/user.db';

const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string
): Promise<User> => {
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) throw new Error('Invalid date of birth provided.');

    const role = 'user';

    return await userDb.registerUser(email, password, firstName, lastName, dateOfBirth, role);
};

const loginUser = async (
    email: string,
    password: string
): Promise<{ token: string; user: User }> => {
    return await userDb.loginUser(email, password);
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        return await userDb.getAllUsers();
    } catch (error: any) {
        throw new Error(`Failed to retrieve users: ${error.message}`);
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const user = await userDb.getUserById({ id });

        if (!user) throw new Error(`User with id ${id} does not exist.`);
        return user;
    } catch (error: any) {
        throw new Error(`Failed to retrieve user: ${error.message}`);
    }
};

export default { registerUser, loginUser, getAllUsers, getUserById };
