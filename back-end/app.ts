// ... bestaande imports
import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import { userRouter } from './controller/user.routes';
import { profileRouter } from './controller/profile.routes';
import { companyRouter } from './controller/company.routes';
import { jobRouter } from './controller/job.routes';
import { applicationRouter } from './controller/application.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:3000"],
        frameAncestors: ["'none'"]
    }
}));

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Back-end',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
        requestProperty: 'auth',
        getToken: (req) => {
            if (req.cookies?.token) return req.cookies.token;
            if (req.headers.authorization?.startsWith('Bearer '))
                return req.headers.authorization.split(' ')[1];
            return null;
        },
    }).unless({
        path: ['/api-docs', '/users/login', '/users/signup', '/status'],
    })
);

app.use('/users', userRouter);
app.use('/profiles', profileRouter);
app.use('/companies', companyRouter);
app.use('/jobs', jobRouter);
app.use('/applications', applicationRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        status: 'error',
        message: err.message || 'An unexpected error occurred',
    });
});

app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});
