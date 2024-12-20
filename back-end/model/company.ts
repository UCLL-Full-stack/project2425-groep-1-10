import { Company as CompanyPrisma } from '@prisma/client';

export class Company {
    private id?: number;
    private name: string;
    private description?: string;
    private websiteUrl?: string;
    private createdBy: number;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(company: {
        id?: number;
        name: string;
        description?: string;
        websiteUrl?: string;
        createdBy: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(company);

        this.id = company.id;
        this.name = company.name;
        this.description = company.description;
        this.websiteUrl = company.websiteUrl;
        this.createdBy = company.createdBy;
        this.createdAt = company.createdAt || new Date();
        this.updatedAt = company.updatedAt || new Date();
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getWebsiteUrl(): string | undefined {
        return this.websiteUrl;
    }

    getCreatedBy(): number {
        return this.createdBy;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setName(name: string): void {
        this.name = name;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setWebsiteUrl(websiteUrl: string): void {
        this.websiteUrl = websiteUrl;
    }

    validate(company: { name: string; createdBy: number }): void {
        if (!company.name?.trim()) throw new Error('Company name is required');
        if (!company.createdBy) throw new Error('Creator ID is required');
    }

    static from(prismaCompany: CompanyPrisma): Company {
        return new Company({
            id: prismaCompany.id,
            name: prismaCompany.name,
            description: prismaCompany.description || undefined,
            websiteUrl: prismaCompany.websiteUrl || undefined,
            createdBy: prismaCompany.createdBy,
            createdAt: prismaCompany.createdAt,
            updatedAt: prismaCompany.updatedAt,
        });
    }
}
