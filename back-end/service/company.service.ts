import { Company } from '../model/company';
import companyDB from '../repository/company.db';
import { z } from 'zod';

const companyInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    createdBy: z.number().int().positive()
});

const getAllCompanies = async (): Promise<Company[]> => {
    return companyDB.getAllCompanies();
};

const getCompanyById = async (id: number): Promise<Company> => {
    const company = await companyDB.getCompanyById(id);
    if (!company) throw new Error('Company not found');
    return company;
};

const getCompanyByUserId = async (userId: number): Promise<Company> => {
    return companyDB.getCompanyByUserId(userId);
};

const createCompany = async (input: any): Promise<Company> => {
    const parsed = companyInputSchema.safeParse(input);
    if (!parsed.success) throw new Error(parsed.error.message);

    const { name, description, websiteUrl, createdBy } = parsed.data;
    const newCompany = new Company({ name, description, websiteUrl, createdBy });
    return companyDB.createCompany(newCompany);
};

const updateCompany = async (
    id: number,
    data: Partial<{ name: string; description?: string; websiteUrl?: string }>
): Promise<Company> => {
    return companyDB.updateCompany(id, data);
};

const deleteCompany = async (id: number): Promise<void> => {
    await companyDB.deleteCompany(id);
};

export default {
    getAllCompanies,
    getCompanyById,
    getCompanyByUserId,
    createCompany,
    updateCompany,
    deleteCompany,
};
