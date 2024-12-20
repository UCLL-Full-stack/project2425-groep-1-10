import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import jobService from '../service/job.service';
import { UserInput } from '../types';
import companyService from '../service/company.service';
import userService from '../service/user.service';
import profileService from '../service/profile.service';

const jobRouter = express.Router();

jobRouter.get(
    '/',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const company = await companyService.getCompanyByUserId(userId);

            const userJobs = await jobService.getJobsByCompanyId(company.getId());
            res.status(200).json(userJobs);
        } catch (error) {
            next(error);
        }
    }
);

jobRouter.get(
    '/user',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const userSkills = (await profileService.getProfileByUserId(userId)).getSkills();

            const userJobs = await jobService.getJobsThatMatchUserSkills(userSkills);
            res.status(200).json(userJobs);
        } catch (error) {
            next(error);
        }
    }
);

jobRouter.get(
    '/user/unapplied',
    jwtUtil.authorizeRoles(['user']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const unappliedVacancies = await jobService.getUnappliedVacanciesForUser(userId);
            res.status(200).json(unappliedVacancies);
        } catch (error) {
            next(error);
        }
    }
);

jobRouter.get(
    '/:id',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.id);
            if (isNaN(jobId)) throw new Error('Invalid job ID.');

            const job = await jobService.getJobById(jobId);
            res.status(200).json(job);
        } catch (error) {
            next(error);
        }
    }
);

jobRouter.post(
    '/',
    jwtUtil.authorizeRoles(['company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const company = await companyService.getCompanyByUserId(userId);
            if (!company) throw new Error('Company not found.');

            const jobData = {
                ...req.body,
                companyId: company.getId(),
            };

            const newJob = await jobService.createJob(jobData);
            res.status(201).json(newJob);
        } catch (error) {
            next(error);
        }
    }
);

jobRouter.delete(
    '/:id',
    jwtUtil.authorizeRoles(['company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.id);
            if (isNaN(jobId)) throw new Error('Invalid job ID.');

            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const company = await companyService.getCompanyByUserId(userId);
            if (!company) throw new Error('Company not found.');

            // Ensure the job belongs to the company
            const job = await jobService.getJobById(jobId);
            if (!job || job.getCompanyId() !== company.getId()) {
                return res.status(403).json({ message: 'Unauthorized to delete this job.' });
            }

            // Delete the job
            await jobService.deleteJob(jobId);
            res.status(204).send(); // No Content
        } catch (error) {
            next(error);
        }
    }
);

export { jobRouter };
