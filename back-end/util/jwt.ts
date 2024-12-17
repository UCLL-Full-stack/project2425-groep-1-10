import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const generateJWTtoken = (email: string, role: string): string => {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const expiresIn = `${process.env.JWT_EXPIRES_HOURS || 8}h`;

    return jwt.sign({ email, role }, secret, { expiresIn });
};

const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request & { auth?: { role?: string } }, res: Response, next: NextFunction) => {
        const userRole = req.auth?.role;
        if (userRole && allowedRoles.includes(userRole)) {
            return next();
        }
        return res
            .status(403)
            .json({ status: 'error', message: 'Access denied. Insufficient permissions.' });
    };
};

export default {
    generateJWTtoken,
    authorizeRoles,
};
