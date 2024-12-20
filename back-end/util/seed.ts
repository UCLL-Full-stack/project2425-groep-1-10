// Execute: npx ts-node util/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    // Delete all existing companies, users, and profiles to avoid foreign key constraints
    await prisma.company.deleteMany();
    await prisma.profile.deleteMany();
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
    const companyUser = await prisma.user.create({
        data: {
            email: 'company.one@example.com',
            password: await bcrypt.hash('company123', 12),
            firstName: 'Company',
            lastName: 'One',
            dob: new Date(),
            role: 'company' as Role,
        },
    });

    // Create a company for the company user
    await prisma.company.create({
        data: {
            name: 'Company One',
            description: 'This is the first company.',
            websiteUrl: 'http://company.one.com',
            createdBy: companyUser.id,
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

    const createdUsers = [];
    for (const user of users) {
        const createdUser = await prisma.user.create({ data: user });
        createdUsers.push(createdUser);
    }

    // Create a profile for user1
    const user1 = createdUsers.find((user) => user.email === 'user.one@example.com');
    if (user1) {
        await prisma.profile.create({
            data: {
                bio: "This is user one's profile bio.",
                skills: ['JavaScript', 'TypeScript', 'Prisma'],
                resumeUrl: 'http://example.com/resume.pdf',
                userId: user1.id,
            },
        });
    } else {
        console.error('User one not found, profile creation skipped.');
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
