import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import companyService from '../service/company.service';

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
 *       500:
 *         description: Internal server error.
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
 *       500:
 *         description: Internal server error.
 */
companyRouter.get(
    '/:id',
    jwtUtil.authorizeRoles(['admin', 'user']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = Number(req.params.id);
            const company = await companyService.getCompanyById(companyId);
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the company.
 *               description:
 *                 type: string
 *                 description: Description of the company.
 *               websiteUrl:
 *                 type: string
 *                 description: Website URL of the company.
 *               createdBy:
 *                 type: number
 *                 description: ID of the user creating the company.
 *     responses:
 *       201:
 *         description: Company created successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
companyRouter.post(
    '/',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyData = req.body;
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
 *   patch:
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully.
 *       404:
 *         description: Company not found.
 *       500:
 *         description: Internal server error.
 */
companyRouter.patch(
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
 *       500:
 *         description: Internal server error.
 */
companyRouter.delete(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = Number(req.params.id);
            await companyService.deleteCompany(companyId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

export { companyRouter };
