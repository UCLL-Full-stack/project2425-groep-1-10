import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import jwtUtil from '../util/jwt';
import companyService from '../service/company.service';
import { UserInput } from '../types';
import jobService from '../service/job.service';
import applicationService from '../service/application.service';

const companyRouter = express.Router();

const companyInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    websiteUrl: z.string().url(),
});

function validateId(id: any): number | null {
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

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
 *       500:
 *         description: Internal server error.
 */
companyRouter.get('/', jwtUtil.authorizeRoles(['admin', 'user']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        next(error);
    }
});

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
 *       500:
 *         description: Internal server error.
 */
companyRouter.get('/:id', jwtUtil.authorizeRoles(['admin', 'user']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = validateId(req.params.id);
        if (!companyId) return res.status(400).json({ error: 'Invalid company ID' });

        const company = await companyService.getCompanyById(companyId);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.status(200).json(company);
    } catch (error) {
        next(error);
    }
});

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
 *       500:
 *         description: Internal server error.
 */
companyRouter.post('/', jwtUtil.authorizeRoles(['company']), async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.auth.id);
        if (isNaN(userId)) throw new Error('Invalid user ID.');

        const parsed = companyInputSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(parsed.error);

        if (!parsed.data.name) return res.status(400).json({ error: 'Name is required' });

        const companyData = {
            name: parsed.data.name,
            description: parsed.data.description,
            websiteUrl: parsed.data.websiteUrl,
            createdBy: userId,
        };

        const newCompany = await companyService.createCompany(companyData);
        res.status(201).json(newCompany);
    } catch (error) {
        next(error);
    }
});

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
 *       500:
 *         description: Internal server error.
 */
companyRouter.put('/:id', jwtUtil.authorizeRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = validateId(req.params.id);
        if (!companyId) return res.status(400).json({ error: 'Invalid company ID' });

        const parsed = companyInputSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(parsed.error);

        const updatedCompany = await companyService.updateCompany(companyId, parsed.data);
        res.status(200).json(updatedCompany);
    } catch (error) {
        next(error);
    }
});

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
 *       500:
 *         description: Internal server error.
 */
companyRouter.delete('/:id', jwtUtil.authorizeRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = validateId(req.params.id);
        if (!companyId) return res.status(400).json({ error: 'Invalid company ID' });

        const jobs = await jobService.getJobsByCompanyId(companyId);
        for (const job of jobs) {
            await applicationService.deleteApplicationsByJobId(job.getId());
        }

        await jobService.deleteJobsByCompanyId(companyId);
        await companyService.deleteCompany(companyId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export { companyRouter };