import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const generateJWTtoken = (id: number, email: string, fullname: string, role: string): string => {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const expiresIn = `${process.env.JWT_EXPIRES_HOURS || 8}h`;

    return jwt.sign({ id, email, fullname, role }, secret, { expiresIn });
};

const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request & { auth?: { role?: string } }, res: Response, next: NextFunction) => {
        console.log(`authorizeRoles middleware triggered for: ${req.path}`);

        if (!req.auth?.role) {
            console.warn(`No userRole found for request to ${req.path}. Allowing access.`);
            return next();
        }

        const userRole = req.auth.role;
        console.log(`User role: ${userRole}`);

        if (allowedRoles.includes(userRole)) return next();

        return res
            .status(403)
            .json({ status: 'error', message: 'Access denied. Insufficient permissions.' });
    };
};

export default {
    generateJWTtoken,
    authorizeRoles,
};
