import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../companies/companies.service';
import { getModelToken } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { BadRequestException } from '@nestjs/common';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyModel: SoftDeleteModel<CompanyDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyModel = module.get<SoftDeleteModel<CompanyDocument>>(getModelToken(Company.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a company by ID', async () => {
    const companyId = '6063c2063cbbfc0011e534a7';
    const companyDocumentMock = { /* mock company document */ };

    (companyModel.findById as jest.Mock).mockResolvedValueOnce(companyDocumentMock);

    const result = await service.findOne(companyId);

    expect(companyModel.findById).toHaveBeenCalledWith(companyId);
    expect(result).toEqual(companyDocumentMock);
  });

  it('should throw BadRequestException when finding a company with invalid ID', async () => {
    const invalidId = 'invalid_id';

    await expect(service.findOne(invalidId)).rejects.toThrowError(BadRequestException);
  });
});
