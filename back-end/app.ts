import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import { userRouter } from './controller/user.routes';
import { profileRouter } from './controller/profile.routes';
import { companyRouter } from './controller/company.routes';

const app = express();

dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

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
    }).unless({
        path: ['/api-docs', '/users/login', '/users/signup', '/status'],
    })
);

app.use('/users', userRouter);
app.use('/profiles', profileRouter);
app.use('/companies', companyRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        status: 'error',
        message: err.message || 'An unexpected error occurred',
    });
});

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
