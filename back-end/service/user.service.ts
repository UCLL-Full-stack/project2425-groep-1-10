import { User } from '../model/user';
import userDB from '../repository/user.db';
import { Role } from '../types';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwt';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserByEmail = async ({ email }: { email: string }): Promise<User> => {
    if (!email || !emailRegex.test(email)) throw new Error('Invalid email format.'); // Validate email
    const user = await userDB.getUserByEmail({ email });
    if (!user) throw new Error(`User not found.`);
    return user;
};

const validateUserInput = ({
    email,
    password,
    dob,
}: {
    email: string;
    password: string;
    dob: string;
}): { parsedDob: Date } => {
    // Validate email
    if (!email || !emailRegex.test(email)) throw new Error('Invalid email format.');

    // Validate password
    if (!password || !passwordRegex.test(password))
        throw new Error(
            'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
        );

    // Validate date of birth
    if (!dob || !dateRegex.test(dob)) throw new Error('Invalid date format. Use yyyy-mm-dd.');
    const parsedDob = new Date(dob);
    if (isNaN(parsedDob.getTime())) throw new Error('Invalid date of birth (dob).');

    return { parsedDob };
};

const createUser = async ({
    email,
    password,
    firstName,
    lastName,
    dob,
}: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
}): Promise<User> => {
    // Validate input fields
    const { parsedDob } = validateUserInput({ email, password, dob });

    const existingUser = await userDB.getUserByEmail({ email });
    if (existingUser) throw new Error(`User already exists.`);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dob: parsedDob,
        role: 'user' as Role,
    });

    return userDB.createUser(newUser);
};

const authenticate = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<{ token: string; id: number; email: string; role: string }> => {
    const user = await userDB.getUserByEmail({ email });

    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const token = jwtUtil.generateJWTtoken(user.getId(), user.getEmail(), user.getRole());
    return { token, id: user.getId(), email: user.getEmail(), role: user.getRole() };
};

export default { getAllUsers, getUserByEmail, createUser, authenticate };
