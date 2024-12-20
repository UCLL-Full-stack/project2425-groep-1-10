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
 *           description: Job ID.
 *         title:
 *           type: string
 *           description: Title of the job.
 *         description:
 *           type: string
 *           description: Description of the job.
 *         companyId:
 *           type: number
 *           format: int64
 *           description: ID of the company posting the job.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the job was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the job was last updated.
 *     JobInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the job.
 *         description:
 *           type: string
 *           description: Description of the job.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message.
 */

import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import jobService from '../service/job.service';
import { UserInput } from '../types';
import companyService from '../service/company.service';
import profileService from '../service/profile.service';

const jobRouter = express.Router();

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
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
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
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error.
 */
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
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
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
 *         description: Job ID
 *     responses:
 *       204:
 *         description: Job deleted successfully.
 *       403:
 *         description: Unauthorized to delete this job.
 *       500:
 *         description: Internal server error.
 */
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

            const job = await jobService.getJobById(jobId);
            if (!job || job.getCompanyId() !== company.getId()) {
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
