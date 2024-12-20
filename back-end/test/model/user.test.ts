import { User } from '../../model/user';
import { Role } from '../../types';

describe('User Model', () => {
    it('should create a User object with provided values', () => {
        const userData = {
            id: 1,
            email: 'test@example.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe',
            dob: new Date('1990-01-01'),
            role: 'user' as Role,
        };

        const user = new User(userData);

        expect(user.getId()).toBe(userData.id);
        expect(user.getEmail()).toBe(userData.email);
        expect(user.getPassword()).toBe(userData.password);
        expect(user.getFirstName()).toBe(userData.firstName);
        expect(user.getLastName()).toBe(userData.lastName);
        expect(user.getDob()).toEqual(userData.dob);
        expect(user.getRole()).toBe(userData.role);
    });

    it('should validate required fields and throw errors for missing data', () => {
        expect(() =>
            new User({
                email: '',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe',
                dob: new Date('1990-01-01'),
                role: 'user' as Role,
            })
        ).toThrow('Email is required');

        expect(() =>
            new User({
                email: 'test@example.com',
                password: '',
                firstName: 'John',
                lastName: 'Doe',
                dob: new Date('1990-01-01'),
                role: 'user' as Role,
            })
        ).toThrow('Password is required');

        expect(() =>
            new User({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: '',
                lastName: 'Doe',
                dob: new Date('1990-01-01'),
                role: 'user' as Role,
            })
        ).toThrow('First name is required');

        expect(() =>
            new User({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: '',
                dob: new Date('1990-01-01'),
                role: 'user' as Role,
            })
        ).toThrow('Last name is required');

        expect(() =>
            new User({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe',
                dob: undefined as any,
                role: 'user' as Role,
            })
        ).toThrow('Date of birth is required');

        expect(() =>
            new User({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe',
                dob: new Date('1990-01-01'),
                role: undefined as any,
            })
        ).toThrow('Role is required');
    });

    it('should compare two User objects for equality', () => {
        const userData = {
            id: 1,
            email: 'test@example.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe',
            dob: new Date('1990-01-01'),
            role: 'user' as Role,
        };

        const user1 = new User(userData);
        const user2 = new User(userData);

        expect(user1.equals(user2)).toBe(true);

        const user3 = new User({ ...userData, email: 'different@example.com' });
        expect(user1.equals(user3)).toBe(false);
    });

    it('should create a User object from a Prisma object', () => {
        const prismaUser = {
            id: 1,
            email: 'test@example.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe',
            dob: new Date('1990-01-01'),
            role: 'user' as Role,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const user = User.from(prismaUser);

        expect(user.getId()).toBe(prismaUser.id);
        expect(user.getEmail()).toBe(prismaUser.email);
        expect(user.getPassword()).toBe(prismaUser.password);
        expect(user.getFirstName()).toBe(prismaUser.firstName);
        expect(user.getLastName()).toBe(prismaUser.lastName);
        expect(user.getDob()).toEqual(prismaUser.dob);
        expect(user.getRole()).toBe(prismaUser.role);
    });


});
