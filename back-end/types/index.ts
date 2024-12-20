type Role = 'admin' | 'company' | 'user';

type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

type ApplicationInput = {
    id?: number;
    status: ApplicationStatus;
    userId?: number;
    jobId: number;
};

type JobInput = {
    id?: number;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    salaryRange?: string;
    companyId?: number;
};

type CompanyInput = {
    id?: number;
    name: string;
    description?: string;
    websiteUrl?: string;
    createdBy?: number;
};

type ProfileInput = {
    id?: number;
    bio?: string;
    skills: string[];
    resumeUrl?: string;
    userId?: number;
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
    email: string;
    fullname: string;
    role: Role;
};

export {
    Role,
    ApplicationStatus,
    ApplicationInput,
    JobInput,
    CompanyInput,
    ProfileInput,
    UserInput,
    AuthenticationResponse,
};
