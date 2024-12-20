import { Company } from '../model/company';
import database from '../util/database';

const getAllCompanies = async (): Promise<Company[]> => {
    const prismaCompanies = await database.company.findMany();
    return prismaCompanies.map((company) => Company.from(company));
};

const getCompanyById = async (id: number): Promise<Company | null> => {
    const prismaCompany = await database.company.findUnique({ where: { id } });
    return prismaCompany ? Company.from(prismaCompany) : null;
};

const createCompany = async (company: Company): Promise<Company> => {
    const prismaCompany = await database.company.create({
        data: {
            name: company.getName(),
            description: company.getDescription(),
            websiteUrl: company.getWebsiteUrl(),
            createdBy: company.getCreatedBy(),
        },
    });
    return Company.from(prismaCompany);
};

const updateCompany = async (
    id: number,
    data: Partial<{ name: string; description?: string; websiteUrl?: string }>
): Promise<Company> => {
    const prismaCompany = await database.company.update({
        where: { id },
        data,
    });
    return Company.from(prismaCompany);
};

const deleteCompany = async (id: number): Promise<void> => {
    await database.company.delete({ where: { id } });
};

export default {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
};
