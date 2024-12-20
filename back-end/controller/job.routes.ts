import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import jobService from '../service/job.service';
import { UserInput } from '../types';
import companyService from '../service/company.service';

const jobRouter = express.Router();

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

export { jobRouter };
