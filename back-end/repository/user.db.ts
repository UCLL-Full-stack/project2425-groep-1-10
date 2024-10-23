import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const getAllUsers = async (): Promise<User[]> => {
    try {
        return await prisma.user.findMany();
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Error retrieving users from the database.');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        return await prisma.user.findUnique({
            where: { id },
        });
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Error retrieving user from the database.');
    }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        return await prisma.user.findUnique({
            where: { email },
        });
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Error retrieving user by email from the database.');
    }
};

const createUser = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    role: string;
}): Promise<User> => {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Error creating user in the database.');
    }
};

const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: Date,
    role: string
): Promise<User> => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            dob,
            role,
        });

        return newUser;
    } catch (error: any) {
        throw new Error(`Registration failed: ${error.message}`);
    }
};

const loginUser = async (
    email: string,
    password: string
): Promise<{ token: string; user: User }> => {
    try {
        const user = await getUserByEmail(email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        return { token, user };
    } catch (error: any) {
        throw new Error(`Login failed: ${error.message}`);
    }
};

export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    registerUser,
    loginUser,
};
