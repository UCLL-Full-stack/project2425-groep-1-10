// Execute: npx prisma generate && npx prisma migrate dev --name init && npx ts-node util/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    // Delete all existing data to avoid foreign key constraints
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
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
            dob: new Date('1980-01-01'),
            role: 'admin' as Role,
        },
    });

    // Create multiple company users
    const companyUsers = [
        {
            email: 'company.one@example.com',
            password: await bcrypt.hash('company123', 12),
            firstName: 'Company',
            lastName: 'One',
            dob: new Date('1985-05-15'),
            role: 'company' as Role,
        },
        {
            email: 'company.two@example.com',
            password: await bcrypt.hash('company123', 12),
            firstName: 'Company',
            lastName: 'Two',
            dob: new Date('1987-07-20'),
            role: 'company' as Role,
        },
    ];

    const createdCompanyUsers = [];
    for (const companyUser of companyUsers) {
        const createdUser = await prisma.user.create({ data: companyUser });
        createdCompanyUsers.push(createdUser);
    }

    // Create companies for the company users
    const companies = [
        {
            name: 'Company One',
            description: 'This is the first company.',
            websiteUrl: 'http://company.one.com',
            createdBy: createdCompanyUsers[0].id,
        },
        {
            name: 'Company Two',
            description: 'This is the second company.',
            websiteUrl: 'http://company.two.com',
            createdBy: createdCompanyUsers[1].id,
        },
    ];

    const createdCompanies = [];
    for (const company of companies) {
        const createdCompany = await prisma.company.create({ data: company });
        createdCompanies.push(createdCompany);
    }

    // Create multiple regular users
    const users = [
        {
            email: 'user.one@example.com',
            password: await bcrypt.hash('user123', 12),
            firstName: 'User',
            lastName: 'One',
            dob: new Date('1990-10-01'),
            role: 'user' as Role,
        },
        {
            email: 'user.two@example.com',
            password: await bcrypt.hash('user123', 12),
            firstName: 'User',
            lastName: 'Two',
            dob: new Date('1992-03-15'),
            role: 'user' as Role,
        },
        {
            email: 'user.three@example.com',
            password: await bcrypt.hash('user123', 12),
            firstName: 'User',
            lastName: 'Three',
            dob: new Date('1995-07-10'),
            role: 'user' as Role,
        },
    ];

    const createdUsers = [];
    for (const user of users) {
        const createdUser = await prisma.user.create({ data: user });
        createdUsers.push(createdUser);
    }

    // Create profiles for the users
    const profiles = [
        {
            bio: "This is user one's profile bio.",
            skills: ['JavaScript', 'TypeScript', 'Prisma'],
            resumeUrl: 'http://example.com/user1_resume.pdf',
            userId: createdUsers[0].id,
        },
        {
            bio: "This is user two's profile bio.",
            skills: ['Python', 'Django', 'Data Analysis'],
            resumeUrl: 'http://example.com/user2_resume.pdf',
            userId: createdUsers[1].id,
        },
        {
            bio: "This is user three's profile bio.",
            skills: ['Java', 'Spring Boot', 'Kotlin'],
            resumeUrl: 'http://example.com/user3_resume.pdf',
            userId: createdUsers[2].id,
        },
    ];

    for (const profile of profiles) {
        await prisma.profile.create({ data: profile });
    }

    // Create jobs for the companies
    const jobs = [
        {
            title: 'Software Engineer',
            description: 'We are looking for a software engineer.',
            requirements: ['JavaScript', 'TypeScript', 'Node.js'],
            location: 'Leuven, Belgium',
            salaryRange: '€40,000 - €60,000',
            companyId: createdCompanies[0].id,
        },
        {
            title: 'Data Scientist',
            description: 'Looking for a data scientist with experience in Python.',
            requirements: ['Python', 'Machine Learning', 'Data Analysis'],
            location: 'Amsterdam, Netherlands',
            salaryRange: '€50,000 - €70,000',
            companyId: createdCompanies[1].id,
        },
    ];

    const createdJobs = [];
    for (const job of jobs) {
        const createdJob = await prisma.job.create({ data: job });
        createdJobs.push(createdJob);
    }

    // Create applications for the jobs
    const applications = [
        {
            userId: createdUsers[0].id,
            jobId: createdJobs[0].id,
        },
        {
            userId: createdUsers[1].id,
            jobId: createdJobs[1].id,
        },
        {
            userId: createdUsers[2].id,
            jobId: createdJobs[0].id,
        },
    ];

    for (const application of applications) {
        await prisma.application.create({ data: application });
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
