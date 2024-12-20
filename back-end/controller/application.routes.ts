import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import companyService from '../service/company.service';
import { UserInput } from '../types';
import applicationService from '../service/application.service';

const applicationRouter = express.Router();

applicationRouter.post(
    '/apply',
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

export { applicationRouter };
