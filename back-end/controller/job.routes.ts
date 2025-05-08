import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import jwtUtil from '../util/jwt';
import jobService from '../service/job.service';
import { UserInput } from '../types';
import companyService from '../service/company.service';
import profileService from '../service/profile.service';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         companyId:
 *           type: number
 *           format: int64
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     JobInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

const jobRouter = express.Router();

const jobInputSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    requirements: z.array(z.string()).optional(), // Add requirements as an optional array of strings
    location: z.string().optional() // Add location as an optional string
});

function validateId(id: any): number | null {
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * @swagger
 * /jobs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all jobs posted by the authenticated user's company
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: List of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
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

/**
 * @swagger
 * /jobs/all:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all jobs in the system (admin only)
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: List of all jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
jobRouter.get(
    '/all',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allJobs = await jobService.getAllJobs();
            res.status(200).json(allJobs);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /jobs/user:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get jobs that match the user's skills
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: List of matching jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
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

/**
 * @swagger
 * /jobs/user/unapplied:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get jobs that match the user's skills but have not been applied to
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: List of unapplied matching jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
jobRouter.get(
    '/user/unapplied',
    jwtUtil.authorizeRoles(['user']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const userSkills = (await profileService.getProfileByUserId(userId)).getSkills();
            const unappliedVacancies = await jobService.getUnappliedJobsThatMatchUserSkills(
                userId,
                userSkills
            );
            res.status(200).json(unappliedVacancies);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get job details by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Job details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 */
jobRouter.get(
    '/:id',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = validateId(req.params.id);
            if (!jobId) return res.status(400).json({ error: 'Invalid job ID' });

            const job = await jobService.getJobById(jobId);
            res.status(200).json(job);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /jobs:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Post a new job
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       201:
 *         description: Job created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 */
jobRouter.post(
    '/',
    jwtUtil.authorizeRoles(['company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const parsed = jobInputSchema.safeParse(req.body);
            if (!parsed.success) return res.status(400).json(parsed.error);

            const company = await companyService.getCompanyByUserId(userId);
            if (!company) throw new Error('Company not found.');

            const jobData = {
                title: parsed.data.title || 'Untitled', // Ensure title is always present
                description: parsed.data.description || 'No description provided', // Ensure description is always present
                companyId: company.getId(),
                requirements: parsed.data.requirements || [], // Add default or parsed requirements
                location: parsed.data.location || 'Unknown', // Add default or parsed location
            };

            const newJob = await jobService.createJob(jobData);
            res.status(201).json(newJob);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a job
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Job deleted successfully.
 */
jobRouter.delete(
    '/:id',
    jwtUtil.authorizeRoles(['company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const jobId = validateId(req.params.id);
            if (!jobId) return res.status(400).json({ error: 'Invalid job ID' });

            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const job = await jobService.getJobById(jobId);
            if (!job) {
                return res.status(404).json({ message: 'Job not found.' });
            }

            if (req.auth.role === 'admin') {
                await jobService.deleteApplicationsByJobId(jobId);
                await jobService.deleteJob(jobId);
                return res.status(204).send();
            }

            const company = await companyService.getCompanyByUserId(userId);
            if (!company || job.getCompanyId() !== company.getId()) {
                return res.status(403).json({ message: 'Unauthorized to delete this job.' });
            }

            await jobService.deleteApplicationsByJobId(jobId);
            await jobService.deleteJob(jobId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

export { jobRouter };