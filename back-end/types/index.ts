type Role = 'admin' | 'company' | 'user';

type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

type Application = {
    id: number;
    status: ApplicationStatus;
    userId: number;
    jobId: number;
    createdAt: Date;
    updatedAt: Date;
};

type Job = {
    id: number;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    salaryRange?: string;
    companyId: number;
    createdAt: Date;
    updatedAt: Date;
};

type Company = {
    id: number;
    name: string;
    description?: string;
    websiteUrl?: string;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
};

type Profile = {
    id: number;
    bio?: string;
    skills: string[];
    resumeUrl?: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
};

type User = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
};

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
    role: Role;
};

export { Role, ApplicationStatus, Application, Job, Company, Profile, User, UserInput, AuthenticationResponse };


