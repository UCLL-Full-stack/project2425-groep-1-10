// Execute: npx ts-node util/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    // Delete all existing users
    await prisma.user.deleteMany();

    // Create an admin user
    await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 12),
            firstName: 'Admin',
            lastName: 'User',
            dob: new Date(),
            role: 'admin' as Role,
        },
    });

    // Create a company user
    await prisma.user.create({
        data: {
            email: 'company.one@example.com',
            password: await bcrypt.hash('company123', 12),
            firstName: 'Company',
            lastName: 'One',
            dob: new Date(),
            role: 'company' as Role,
        },
    });

    // Create multiple regular users
    const users = [
        {
            email: 'user.one@example.com',
            password: await bcrypt.hash('user123', 12),
            firstName: 'User',
            lastName: 'One',
            dob: new Date(),
            role: 'user' as Role,
        },
        {
            email: 'user.two@example.com',
            password: await bcrypt.hash('user123', 12),
            firstName: 'User',
            lastName: 'Two',
            dob: new Date(),
            role: 'user' as Role,
        },
        {
            email: 'user.three@example.com',
            password: await bcrypt.hash('user123', 12),
            firstName: 'User',
            lastName: 'Three',
            dob: new Date(),
            role: 'user' as Role,
        },
    ];

    for (const user of users) {
        await prisma.user.create({ data: user });
    }
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
