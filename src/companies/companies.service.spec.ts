import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { IUser } from 'src/users/users.interface';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let mockCompanyModel: any;

  beforeEach(async () => {
    mockCompanyModel = {
      create: jest.fn(),
      // Thêm mock cho các phương thức khác của model nếu cần
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a company', async () => {
      const createCompanyDto = {
        name: 'Company A',
        address: '123 Test St',
        description: 'This is a test company',
        logo: 'test-logo.png',
      };
      const user: IUser = {
        _id: 'user-id',
        email: 'user@test.com',
        name: 'Test User',
        balance: 1000,
        role: {
          _id: 'role-id',
          name: 'User Role',
        },
        // Cung cấp thêm thông tin cho IUser nếu cần
      };
      mockCompanyModel.create.mockResolvedValue(createCompanyDto);

      const result = await service.create(createCompanyDto, user);

      expect(mockCompanyModel.create).toHaveBeenCalledWith({
        ...createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email,
          // Thêm thông tin từ user nếu logic của bạn yêu cầu
        },
      });
      expect(result).toEqual(createCompanyDto);
    });
    

    // Thêm các ca kiểm thử khác cho phương thức create ở đây nếu cần
    it('should throw an error when create fails', async () => {
      const createCompanyDto = {
        name: 'Test Company',
        address: '123 Test St',
        description: 'This is a test company',
        logo: 'test-logo.png',
      };
      const user: IUser = {
        _id: 'user-id',
        email: 'user@test.com',
        name: 'Test User',
        balance: 1000,
        role: {
          _id: 'role-id',
          name: 'User Role',
        },
        // Cung cấp thêm thông tin cho IUser nếu cần
      };
      const error = new Error('Database create error');
  
      mockCompanyModel.create.mockRejectedValue(error);
  
      await expect(service.create(createCompanyDto, user)).rejects.toThrow(error);
    });
  });

  // Thêm các ca kiểm thử cho các phương thức khác của CompaniesService ở đây
});
