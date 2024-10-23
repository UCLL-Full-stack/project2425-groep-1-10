import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Handle Prisma and other errors here
    if (err.code && err.meta && err.message) {
        return res.status(400).json({
            error: 'Database error occurred',
            details: err.message,
        });
    }

    // For any other errors, return a generic error response
    res.status(err.status || 500).json({
        error: err.message || 'An unknown error occurred',
    });
};

export default errorHandler;
