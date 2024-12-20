/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Company ID.
 *         name:
 *           type: string
 *           description: Name of the company.
 *         description:
 *           type: string
 *           description: Description of the company.
 *         websiteUrl:
 *           type: string
 *           description: URL of the company's website.
 *         createdBy:
 *           type: number
 *           format: int64
 *           description: User ID who created the company.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the company was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the company was last updated.
 *     CompanyInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the company.
 *         description:
 *           type: string
 *           description: Description of the company.
 *         websiteUrl:
 *           type: string
 *           description: URL of the company's website.
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
import jobService from '../service/job.service';
import applicationService from '../service/application.service';

const companyRouter = express.Router();

/**
 * @swagger
 * /companies:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of all companies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.get(
    '/',
    jwtUtil.authorizeRoles(['admin', 'user']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companies = await companyService.getAllCompanies();
            res.status(200).json(companies);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Company ID
 *     responses:
 *       200:
 *         description: The company data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.get(
    '/:id',
    jwtUtil.authorizeRoles(['admin', 'user']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = Number(req.params.id);
            const company = await companyService.getCompanyById(companyId);

            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            res.status(200).json(company);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /companies:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new company
 *     tags:
 *       - Companies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       201:
 *         description: Company created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.post(
    '/',
    jwtUtil.authorizeRoles(['company']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const companyData = {
                ...req.body,
                createdBy: userId,
            };

            const newCompany = await companyService.createCompany(companyData);
            res.status(201).json(newCompany);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a company
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       200:
 *         description: Company updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.put(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = Number(req.params.id);
            const updatedCompany = await companyService.updateCompany(companyId, req.body);
            res.status(200).json(updatedCompany);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a company
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Company ID
 *     responses:
 *       204:
 *         description: Company deleted successfully.
 *       404:
 *         description: Company not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
companyRouter.delete(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = Number(req.params.id);
            if (isNaN(companyId)) throw new Error('Invalid company ID.');

            // Delete all applications related to jobs posted by this company
            const jobs = await jobService.getJobsByCompanyId(companyId);
            for (const job of jobs) {
                await applicationService.deleteApplicationsByJobId(job.getId());
            }

            // Delete all jobs posted by this company
            await jobService.deleteJobsByCompanyId(companyId);

            // Finally, delete the company
            await companyService.deleteCompany(companyId);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

export { companyRouter };
