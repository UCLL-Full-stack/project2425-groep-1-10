import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import jwtUtil from '../util/jwt';
import profileService from '../service/profile.service';
import { UserInput } from '../types';

const profileRouter = express.Router();

const profileInputSchema = z.object({
    bio: z.string().min(1),
    skills: z.array(z.string().min(1)),
    resumeUrl: z.string().url(),
});

function validateId(id: any): number | null {
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

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
 *       500:
 *         description: Internal server error.
 */
profileRouter.get(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profileId = validateId(req.params.id);
            if (!profileId) return res.status(400).json({ error: 'Invalid profile ID' });

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
 *       500:
 *         description: Internal server error.
 */
profileRouter.post(
    '/',
    jwtUtil.authorizeRoles(['user', 'company', 'admin']),
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.auth.id);
            if (isNaN(userId)) throw new Error('Invalid user ID.');

            const parsed = profileInputSchema.safeParse(req.body);
            if (!parsed.success) return res.status(400).json(parsed.error);

            const profileData = { ...parsed.data, userId, skills: parsed.data.skills || [] };
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

            const parsed = profileInputSchema.safeParse(req.body);
            if (!parsed.success) return res.status(400).json(parsed.error);

            let profile = await profileService.getProfileByUserId(userId);
            profile = await profileService.updateProfile(profile.getId(), parsed.data);

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
 *       500:
 *         description: Internal server error.
 */
profileRouter.delete(
    '/:id',
    jwtUtil.authorizeRoles(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profileId = validateId(req.params.id);
            if (!profileId) return res.status(400).json({ error: 'Invalid profile ID' });

            await profileService.deleteProfile(profileId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

export { profileRouter };
