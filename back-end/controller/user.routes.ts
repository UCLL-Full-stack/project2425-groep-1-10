/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       AuthenticationResponse:
 *         type: object
 *         properties:
 *           message:
 *             type: string
 *             description: Authentication response.
 *           token:
 *             type: string
 *             description: JWT access token.
 *           fullname:
 *             type: string
 *             description: Full name of the user.
 *           role:
 *             type: string
 *             description: Role of the user.
 *       AuthenticationRequest:
 *         type: object
 *         properties:
 *           email:
 *             type: string
 *             description: User email.
 *           password:
 *             type: string
 *             description: User password.
 *       User:
 *         type: object
 *         properties:
 *           id:
 *             type: number
 *             format: int64
 *           email:
 *             type: string
 *             description: E-mail of the user.
 *           password:
 *             type: string
 *             description: User password.
 *           firstName:
 *             type: string
 *             description: First name.
 *           lastName:
 *             type: string
 *             description: Last name.
 *           dob:
 *             type: string
 *             format: date
 *             description: Date of birth.
 *       UserInput:
 *         type: object
 *         properties:
 *           email:
 *             type: string
 *             description: E-mail of the user.
 *           password:
 *             type: string
 *             description: User password.
 *           firstName:
 *             type: string
 *             description: First name.
 *           lastName:
 *             type: string
 *             description: Last name.
 *           dob:
 *             type: string
 *             format: date
 *             description: Date of birth.
 *       Role:
 *         type: string
 *         enum:
 *           - admin
 *           - company
 *           - user
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types/index';
import jwtUtil from '../util/jwt';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get(
    '/',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by their email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to fetch
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get(
    '/:email',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const { email } = req.params;

            const user = await userService.getUserByEmail({ email });

            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message }); // Set more errors
        }
    }
);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, dob } = req.body;

        const newUser = await userService.createUser({
            email,
            password,
            firstName,
            lastName,
            dob,
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await userService.authenticate({ email, password });
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

export { userRouter };
