import { Company } from '../../model/company';
import companyDB from '../../repository/company.db';
import companyService from '../../service/company.service';

jest.mock('../../repository/company.db');

let mockGetAllCompanies: jest.Mock;
let mockGetCompanyById: jest.Mock;
let mockGetCompanyByUserId: jest.Mock;
let mockCreateCompany: jest.Mock;
let mockUpdateCompany: jest.Mock;
let mockDeleteCompany: jest.Mock;

beforeEach(() => {
    mockGetAllCompanies = jest.fn();
    mockGetCompanyById = jest.fn();
    mockGetCompanyByUserId = jest.fn();
    mockCreateCompany = jest.fn();
    mockUpdateCompany = jest.fn();
    mockDeleteCompany = jest.fn();

    companyDB.getAllCompanies = mockGetAllCompanies;
    companyDB.getCompanyById = mockGetCompanyById;
    companyDB.getCompanyByUserId = mockGetCompanyByUserId;
    companyDB.createCompany = mockCreateCompany;
    companyDB.updateCompany = mockUpdateCompany;
    companyDB.deleteCompany = mockDeleteCompany;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('companyService', () => {
    describe('getAllCompanies', () => {
        it('should fetch all companies', async () => {
            const mockCompanies = [
                new Company({ id: 1, name: 'Tech Corp', createdBy: 1 }),
            ];
            mockGetAllCompanies.mockResolvedValue(mockCompanies);

            const companies = await companyService.getAllCompanies();

            expect(mockGetAllCompanies).toHaveBeenCalledTimes(1);
            expect(companies).toEqual(mockCompanies);
        });
    });

    describe('getCompanyById', () => {
        it('should fetch a company by ID', async () => {
            const mockCompany = new Company({ id: 1, name: 'Tech Corp', createdBy: 1 });
            mockGetCompanyById.mockResolvedValue(mockCompany);

            const company = await companyService.getCompanyById(1);

            expect(mockGetCompanyById).toHaveBeenCalledWith(1);
            expect(company).toEqual(mockCompany);
        });

        it('should throw an error if the company is not found', async () => {
            mockGetCompanyById.mockResolvedValue(null);

            await expect(companyService.getCompanyById(1)).rejects.toThrow('Company not found');
        });
    });

    describe('getCompanyByUserId', () => {
        it('should fetch a company by user ID', async () => {
            const mockCompany = new Company({ id: 1, name: 'Tech Corp', createdBy: 1 });
            mockGetCompanyByUserId.mockResolvedValue(mockCompany);

            const company = await companyService.getCompanyByUserId(1);

            expect(mockGetCompanyByUserId).toHaveBeenCalledWith(1);
            expect(company).toEqual(mockCompany);
        });
    });

    describe('createCompany', () => {
        it('should create a new company', async () => {
            const input = {
                name: 'Tech Corp',
                description: 'A tech company',
                websiteUrl: 'https://techcorp.com',
                createdBy: 1,
            };
            const mockCompany = new Company({ id: 1, ...input });
            mockCreateCompany.mockResolvedValue(mockCompany);

            const company = await companyService.createCompany(input);

            expect(mockCreateCompany).toHaveBeenCalledWith(expect.any(Company));
            expect(company).toEqual(mockCompany);
        });
    });

    describe('updateCompany', () => {
        it('should update a company', async () => {
            const mockCompany = new Company({
                id: 1,
                name: 'Updated Tech Corp',
                createdBy: 1,
            });
            const updateData = { name: 'Updated Tech Corp' };
            mockUpdateCompany.mockResolvedValue(mockCompany);

            const company = await companyService.updateCompany(1, updateData);

            expect(mockUpdateCompany).toHaveBeenCalledWith(1, updateData);
            expect(company).toEqual(mockCompany);
        });
    });

    describe('deleteCompany', () => {
        it('should delete a company by ID', async () => {
            mockDeleteCompany.mockResolvedValue(undefined);

            await companyService.deleteCompany(1);

            expect(mockDeleteCompany).toHaveBeenCalledWith(1);
        });
    });
});
