/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Profile ID.
 *         bio:
 *           type: string
 *           description: Biography of the user.
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Skills of the user.
 *         resumeUrl:
 *           type: string
 *           description: URL to the user's resume.
 *         userId:
 *           type: number
 *           format: int64
 *           description: ID of the user associated with the profile.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the profile was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the profile was last updated.
 *     ProfileInput:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *           description: Biography of the user.
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Skills of the user.
 *         resumeUrl:
 *           type: string
 *           description: URL to the user's resume.
 *         userId:
 *           type: number
 *           format: int64
 *           description: ID of the user associated with the profile.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message.
 */

import express, { NextFunction, Request, Response } from 'express';
import jwtUtil from '../util/jwt';
import profileService from '../service/profile.service';
import { UserInput } from '../types';

const profileRouter = express.Router();

/**
 * @swagger
 * /profiles:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the profile of the currently authenticated user
 *     tags:
 *       - Profiles
 *     responses:
 *       200:
 *         description: The profile of the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized. User must provide a valid JWT.
 *       500:
 *         description: Internal server error.
 */
profileRouter.get(
    '/',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const userProfile = await profileService.getProfileByUserId(userId);
            res.status(200).json(userProfile);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a profile by ID
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: The profile data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
profileRouter.get(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profileId = Number(req.params.id);
            const profile = await profileService.getProfileById(profileId);

            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /profiles:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new profile
 *     tags:
 *       - Profiles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       201:
 *         description: Profile created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
profileRouter.post(
    '/',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const profileData = { ...req.body, userId };
            const newProfile = await profileService.createProfile(profileData);
            res.status(201).json(newProfile);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /profiles:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update the profile of the authenticated user
 *     tags:
 *       - Profiles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
profileRouter.put(
    '/',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            let profile = await profileService.getProfileByUserId(userId);
            profile = await profileService.updateProfile(profile.getId(), req.body);

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a profile
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Profile ID
 *     responses:
 *       204:
 *         description: Profile deleted successfully.
 *       404:
 *         description: Profile not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 */
profileRouter.delete(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profileId = Number(req.params.id);
            await profileService.deleteProfile(profileId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

export { profileRouter };
