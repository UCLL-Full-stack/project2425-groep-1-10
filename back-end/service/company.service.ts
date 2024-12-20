import { Company } from '../model/company';
import companyDB from '../repository/company.db';

const getAllCompanies = async (): Promise<Company[]> => {
    return companyDB.getAllCompanies();
};

const getCompanyById = async (id: number): Promise<Company> => {
    const company = await companyDB.getCompanyById(id);
    if (!company) throw new Error('Company not found');
    return company;
};

const getCompanyByUserId = async (userId: number): Promise<Company[]> => {
    return companyDB.getCompanyByUserId(userId);
};

const createCompany = async ({
    name,
    description,
    websiteUrl,
    createdBy,
}: {
    name: string;
    description?: string;
    websiteUrl?: string;
    createdBy: number;
}): Promise<Company> => {
    const newCompany = new Company({
        name,
        description,
        websiteUrl,
        createdBy,
    });

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
