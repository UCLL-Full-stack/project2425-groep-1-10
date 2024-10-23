export class User {
    private id?: number;
    private email: string;
    private password: string;
    private firstName: string;
    private lastName: string;
    private dob: Date;
    private role: string;

    constructor(user: {
        id?: number;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        dob: Date;
        role: string;
    }) {
        this.validate(user);

        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.dob = user.dob;
        this.role = user.role;
    }

    getId(): number | undefined {
        return this.id;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getDob(): Date {
        return this.dob;
    }

    getRole(): string {
        return this.role;
    }

    validate(user: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        dob: Date;
        role: string;
    }) {
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (!user.firstName?.trim()) {
            throw new Error('First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new Error('Last name is required');
        }
        if (!user.dob) {
            throw new Error('Date of birth is required');
        }
        if (!user.role) {
            throw new Error('Role is required');
        }
    }

    equals(user: User): boolean {
        return (
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.dob === user.getDob() &&
            this.role === user.getRole()
        );
    }
}
