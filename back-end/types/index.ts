type Role = 'admin' | 'company' | 'user';

type UserInput = {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    role: Role;
};

type AuthenticationResponse = {
    token: string;
    fullname: string;
    role: string;
};

export { Role, UserInput, AuthenticationResponse };
