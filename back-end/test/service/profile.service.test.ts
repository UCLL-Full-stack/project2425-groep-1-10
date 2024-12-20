import { Profile } from '../../model/profile';
import profileDB from '../../repository/profile.db';
import profileService from '../../service/profile.service';

jest.mock('../../repository/profile.db');

let mockGetAllProfiles: jest.Mock;
let mockGetProfileById: jest.Mock;
let mockGetProfileByUserId: jest.Mock;
let mockCreateProfile: jest.Mock;
let mockUpdateProfile: jest.Mock;
let mockDeleteProfile: jest.Mock;

beforeEach(() => {
    mockGetAllProfiles = jest.fn();
    mockGetProfileById = jest.fn();
    mockGetProfileByUserId = jest.fn();
    mockCreateProfile = jest.fn();
    mockUpdateProfile = jest.fn();
    mockDeleteProfile = jest.fn();

    profileDB.getAllProfiles = mockGetAllProfiles;
    profileDB.getProfileById = mockGetProfileById;
    profileDB.getProfileByUserId = mockGetProfileByUserId;
    profileDB.createProfile = mockCreateProfile;
    profileDB.updateProfile = mockUpdateProfile;
    profileDB.deleteProfile = mockDeleteProfile;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('profileService', () => {
    describe('getAllProfiles', () => {
        it('should fetch all profiles', async () => {
            const mockProfiles = [
                new Profile({ id: 1, userId: 1, bio: 'Software Developer', skills: ['JavaScript'] }),
            ];
            mockGetAllProfiles.mockResolvedValue(mockProfiles);

            const profiles = await profileService.getAllProfiles();

            expect(mockGetAllProfiles).toHaveBeenCalledTimes(1);
            expect(profiles).toEqual(mockProfiles);
        });
    });

    describe('getProfileById', () => {
        it('should fetch a profile by ID', async () => {
            const mockProfile = new Profile({
                id: 1,
                userId: 1,
                bio: 'Software Developer',
                skills: ['JavaScript'],
            });
            mockGetProfileById.mockResolvedValue(mockProfile);

            const profile = await profileService.getProfileById(1);

            expect(mockGetProfileById).toHaveBeenCalledWith(1);
            expect(profile).toEqual(mockProfile);
        });

        it('should throw an error if the profile is not found', async () => {
            mockGetProfileById.mockResolvedValue(null);

            await expect(profileService.getProfileById(1)).rejects.toThrow('Profile not found.');
        });
    });

    describe('getProfileByUserId', () => {
        it('should fetch a profile by user ID', async () => {
            const mockProfile = new Profile({
                id: 1,
                userId: 1,
                bio: 'Software Developer',
                skills: ['JavaScript'],
            });
            mockGetProfileByUserId.mockResolvedValue(mockProfile);

            const profile = await profileService.getProfileByUserId(1);

            expect(mockGetProfileByUserId).toHaveBeenCalledWith(1);
            expect(profile).toEqual(mockProfile);
        });

        it('should throw an error if the profile is not found for the given user', async () => {
            mockGetProfileByUserId.mockResolvedValue(null);

            await expect(profileService.getProfileByUserId(1)).rejects.toThrow(
                'Profile not found for the given user.'
            );
        });
    });

    describe('createProfile', () => {
        it('should create a new profile', async () => {
            const input = {
                bio: 'Software Developer',
                skills: ['JavaScript'],
                resumeUrl: 'https://resume.com/john-doe',
                userId: 1,
            };
            const mockProfile = new Profile({ id: 1, ...input });
            mockCreateProfile.mockResolvedValue(mockProfile);

            const profile = await profileService.createProfile(input);

            expect(mockCreateProfile).toHaveBeenCalledWith(expect.any(Profile));
            expect(profile).toEqual(mockProfile);
        });
    });

    describe('updateProfile', () => {
        it('should update a profile', async () => {
            const updateData = { bio: 'Updated Bio' };
            const mockProfile = new Profile({
                id: 1,
                userId: 1,
                bio: 'Updated Bio',
                skills: ['JavaScript'],
            });
            mockUpdateProfile.mockResolvedValue(mockProfile);

            const profile = await profileService.updateProfile(1, updateData);

            expect(mockUpdateProfile).toHaveBeenCalledWith(1, updateData);
            expect(profile).toEqual(mockProfile);
        });
    });

    describe('deleteProfile', () => {
        it('should delete a profile by ID', async () => {
            mockDeleteProfile.mockResolvedValue(undefined);

            await profileService.deleteProfile(1);

            expect(mockDeleteProfile).toHaveBeenCalledWith(1);
        });
    });
});
