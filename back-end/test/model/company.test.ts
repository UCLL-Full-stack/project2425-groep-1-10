import { Company } from '../../model/company';

describe('Company Model', () => {
    it('should create a Company object with default values', () => {
        const companyData = {
            name: 'TechCorp',
            createdBy: 1,
        };

        const company = new Company(companyData);

        expect(company.getId()).toBeUndefined();
        expect(company.getName()).toBe(companyData.name);
        expect(company.getDescription()).toBeUndefined();
        expect(company.getWebsiteUrl()).toBeUndefined();
        expect(company.getCreatedBy()).toBe(companyData.createdBy);
        expect(company.getCreatedAt()).toBeInstanceOf(Date);
        expect(company.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should create a Company object with provided values', () => {
        const companyData = {
            id: 1,
            name: 'TechCorp',
            description: 'A leading tech company',
            websiteUrl: 'https://techcorp.com',
            createdBy: 1,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const company = new Company(companyData);

        expect(company.getId()).toBe(companyData.id);
        expect(company.getName()).toBe(companyData.name);
        expect(company.getDescription()).toBe(companyData.description);
        expect(company.getWebsiteUrl()).toBe(companyData.websiteUrl);
        expect(company.getCreatedBy()).toBe(companyData.createdBy);
        expect(company.getCreatedAt()).toEqual(companyData.createdAt);
        expect(company.getUpdatedAt()).toEqual(companyData.updatedAt);
    });

    it('should update the name, description, and websiteUrl of the company', () => {
        const companyData = {
            name: 'TechCorp',
            createdBy: 1,
        };
        const company = new Company(companyData);

        company.setName('NewTechCorp');
        company.setDescription('An innovative tech company');
        company.setWebsiteUrl('https://newtechcorp.com');

        expect(company.getName()).toBe('NewTechCorp');
        expect(company.getDescription()).toBe('An innovative tech company');
        expect(company.getWebsiteUrl()).toBe('https://newtechcorp.com');
    });

    it('should validate required fields and throw errors for missing data', () => {
        expect(() => new Company({ name: '', createdBy: 1 })).toThrow('Company name is required');
        expect(() => new Company({ name: 'TechCorp', createdBy: 0 })).toThrow('Creator ID is required');
    });

    it('should create a Company object from a Prisma object', () => {
        const prismaCompany = {
            id: 1,
            name: 'TechCorp',
            description: 'A leading tech company',
            websiteUrl: 'https://techcorp.com',
            createdBy: 1,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
        };

        const company = Company.from(prismaCompany);

        expect(company.getId()).toBe(prismaCompany.id);
        expect(company.getName()).toBe(prismaCompany.name);
        expect(company.getDescription()).toBe(prismaCompany.description);
        expect(company.getWebsiteUrl()).toBe(prismaCompany.websiteUrl);
        expect(company.getCreatedBy()).toBe(prismaCompany.createdBy);
        expect(company.getCreatedAt()).toEqual(prismaCompany.createdAt);
        expect(company.getUpdatedAt()).toEqual(prismaCompany.updatedAt);
    });
});
