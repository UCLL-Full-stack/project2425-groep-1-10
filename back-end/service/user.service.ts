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
    role,
}: {
    email: string;
    password: string;
    dob: string;
    role: Role;
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

    // Validate role
    if (role !== 'user' && role !== 'company')
        throw new Error("Invalid role. Role must be 'user' or 'company'.");

    return { parsedDob };
};

const createUser = async ({
    email,
    password,
    firstName,
    lastName,
    dob,
    role,
}: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
    role: Role;
}): Promise<User> => {
    // Validate input fields
    const { parsedDob } = validateUserInput({ email, password, dob, role });

    const existingUser = await userDB.getUserByEmail({ email });
    if (existingUser) throw new Error(`User already exists.`);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dob: parsedDob,
        role,
    });

    return userDB.createUser(newUser);
};

const authenticate = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<{ token: string; id: number; email: string; fullname: string; role: string }> => {
    const user = await userDB.getUserByEmail({ email });

    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const token = jwtUtil.generateJWTtoken(
        user.getId(),
        user.getEmail(),
        `${user.getFirstName()} ${user.getLastName()}`,
        user.getRole()
    );
    return {
        token,
        id: user.getId(),
        email: user.getEmail(),
        fullname: `${user.getFirstName()} ${user.getLastName()}`,
        role: user.getRole(),
    };
};

export default { getAllUsers, getUserByEmail, createUser, authenticate };
