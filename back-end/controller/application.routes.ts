/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Application ID.
 *         userId:
 *           type: number
 *           format: int64
 *           description: ID of the user who applied.
 *         jobId:
 *           type: number
 *           format: int64
 *           description: ID of the job applied for.
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - accepted
 *             - rejected
 *           description: Status of the application.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the application was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the application was last updated.
 *     ApplicationInput:
 *       type: object
 *       properties:
 *         jobId:
 *           type: number
 *           description: ID of the job to apply for.
 *     ApplicationStatusUpdate:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - accepted
 *             - rejected
 *           description: New status for the application.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message.
 */

import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import companyService from '../service/company.service';
import { UserInput } from '../types';
import applicationService from '../service/application.service';

const applicationRouter = express.Router();

/**
 * @swagger
 * /applications:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all applications for the authenticated user
 *     tags:
 *       - Applications
 *     responses:
 *       200:
 *         description: List of applications for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
applicationRouter.get(
    '/',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const userApplications = await applicationService.getApplicationsByUserId(userId);
            res.status(200).json(userApplications);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /applications/job/{jobId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all applications for a specific job ID (admin only)
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: number
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of applications for the specified job.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error.
 */
applicationRouter.get(
    '/job/:jobId',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            if (isNaN(jobId)) throw new Error('Invalid job ID.');

            const applications = await applicationService.getApplicationsByJobId(jobId);
            if (!applications) {
                return res.status(404).json({ error: 'No applications found for this job.' });
            }

            res.status(200).json(applications);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /applications/employer:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all applications for jobs posted by the authenticated employer
 *     tags:
 *       - Applications
 *     responses:
 *       200:
 *         description: List of applications for the employer's jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
applicationRouter.get(
    '/employer',
    jwtUtil.authorizeRoles(['company']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid company ID.');

            const company = await companyService.getCompanyByUserId(userId);

            const companyApplications = await applicationService.getApplicationsByCompanyId(
                company.getId()
            );
            res.status(200).json(companyApplications);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /applications/apply:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Apply for a job
 *     tags:
 *       - Applications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       201:
 *         description: Application created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
applicationRouter.post(
    '/apply',
    jwtUtil.authorizeRoles(['user']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const { jobId } = req.body;

            const newApplication = await applicationService.createApplication({
                userId,
                jobId,
            });

            res.status(201).json(newApplication);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update the status of an application
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationStatusUpdate'
 *     responses:
 *       200:
 *         description: Application status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
applicationRouter.put(
    '/:id',
    jwtUtil.authorizeRoles(['company']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const companyId = Number(req.auth.id);
            if (isNaN(companyId)) throw new Error('Invalid company ID.');

            const { id } = req.params;
            const { status } = req.body;

            const updatedApplication = await applicationService.updateApplicationStatus(
                Number(id),
                status
            );

            res.status(200).json(updatedApplication);
        } catch (error) {
            next(error);
        }
    }
);

export { applicationRouter };
