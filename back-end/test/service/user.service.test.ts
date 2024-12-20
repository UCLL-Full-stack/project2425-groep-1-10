import { User } from '../../model/user';
import userDB from '../../repository/user.db';
import userService from '../../service/user.service';
import bcrypt from 'bcrypt';
import jwtUtil from '../../util/jwt';
import { Role } from '../../types';

jest.mock('../../repository/user.db');
jest.mock('bcrypt');
jest.mock('../../util/jwt');

let mockGetAllUsers: jest.Mock;
let mockGetUserByEmail: jest.Mock;
let mockCreateUser: jest.Mock;
let mockHash: jest.Mock;
let mockCompare: jest.Mock;
let mockGenerateJWTtoken: jest.Mock;

beforeEach(() => {
    mockGetAllUsers = jest.fn();
    mockGetUserByEmail = jest.fn();
    mockCreateUser = jest.fn();
    mockHash = jest.fn();
    mockCompare = jest.fn();
    mockGenerateJWTtoken = jest.fn();

    userDB.getAllUsers = mockGetAllUsers;
    userDB.getUserByEmail = mockGetUserByEmail;
    userDB.createUser = mockCreateUser;
    bcrypt.hash = mockHash;
    bcrypt.compare = mockCompare;
    jwtUtil.generateJWTtoken = mockGenerateJWTtoken;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('userService', () => {
    describe('getAllUsers', () => {
        it('should fetch all users', async () => {
            const mockUsers = [
                new User({
                    id: 1,
                    email: 'test@example.com',
                    password: 'hashedPassword123',
                    firstName: 'John',
                    lastName: 'Doe',
                    dob: new Date('1990-01-01'),
                    role: 'user' as Role,
                }),
            ];
            mockGetAllUsers.mockResolvedValue(mockUsers);

            const users = await userService.getAllUsers();

            expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
            expect(users).toEqual(mockUsers);
        });
    });

    describe('getUserByEmail', () => {
        it('should fetch a user by email', async () => {
            const mockUser = new User({
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword123',
                firstName: 'John',
                lastName: 'Doe',
                dob: new Date('1990-01-01'),
                role: 'user' as Role,
            });
            mockGetUserByEmail.mockResolvedValue(mockUser);

            const user = await userService.getUserByEmail({ email: 'test@example.com' });

            expect(mockGetUserByEmail).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(user).toEqual(mockUser);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const input = {
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe',
                dob: '1990-01-01',
                role: 'user' as Role,
            };
            const hashedPassword = 'hashedPassword123';
            const mockUser = new User({
                id: 1,
                email: input.email,
                password: hashedPassword,
                firstName: input.firstName,
                lastName: input.lastName,
                dob: new Date(input.dob),
                role: input.role,
            });

            mockHash.mockResolvedValue(hashedPassword);
            mockGetUserByEmail.mockResolvedValue(null);
            mockCreateUser.mockResolvedValue(mockUser);

            const user = await userService.createUser(input);

            expect(mockHash).toHaveBeenCalledWith(input.password, 12);
            expect(mockGetUserByEmail).toHaveBeenCalledWith({ email: input.email });
            expect(mockCreateUser).toHaveBeenCalledWith(expect.any(User));
            expect(user).toEqual(mockUser);
        });
    });

    describe('authenticate', () => {
        it('should authenticate a user and return a token', async () => {
            const input = { email: 'test@example.com', password: 'Password123!' };
            const mockUser = new User({
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword123',
                firstName: 'John',
                lastName: 'Doe',
                dob: new Date('1990-01-01'),
                role: 'user' as Role,
            });
            const mockToken = 'jwtToken123';

            mockGetUserByEmail.mockResolvedValue(mockUser);
            mockCompare.mockResolvedValue(true);
            mockGenerateJWTtoken.mockReturnValue(mockToken);

            const result = await userService.authenticate(input);

            expect(mockGetUserByEmail).toHaveBeenCalledWith({ email: input.email });
            expect(mockCompare).toHaveBeenCalledWith(input.password, mockUser.getPassword());
            expect(mockGenerateJWTtoken).toHaveBeenCalledWith(
                mockUser.getId(),
                mockUser.getEmail(),
                `${mockUser.getFirstName()} ${mockUser.getLastName()}`,
                mockUser.getRole()
            );
            expect(result).toEqual({
                token: mockToken,
                id: mockUser.getId(),
                email: mockUser.getEmail(),
                fullname: `${mockUser.getFirstName()} ${mockUser.getLastName()}`,
                role: mockUser.getRole(),
            });
        });
    });
});
