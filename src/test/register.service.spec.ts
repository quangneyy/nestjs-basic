import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/create-user.dto';

describe('UsersService', () => {
  let service;
  const userModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
  };
  const roleModelMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UserModel', useValue: userModelMock },
        { provide: 'RoleModel', useValue: roleModelMock },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw BadRequestException if email already exists', async () => {
    const registerUserDto = new RegisterUserDto();
    registerUserDto.name = 'Test User';
    registerUserDto.email = 'test@example.com';
    registerUserDto.password = 'password';
    registerUserDto.age = 25;
    registerUserDto.gender = 'male';
    registerUserDto.address = '123 Test St';

    userModelMock.findOne.mockResolvedValue({ email: 'test@example.com' });

    await expect(service.register(registerUserDto)).rejects.toThrow(BadRequestException);
    expect(userModelMock.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('should create new user if email does not exist', async () => {
    const registerUserDto = new RegisterUserDto();
    registerUserDto.name = 'Test User';
    registerUserDto.email = 'test@example.com';
    registerUserDto.password = 'password';
    registerUserDto.age = 25;
    registerUserDto.gender = 'male';
    registerUserDto.address = '123 Test St';

    userModelMock.findOne.mockResolvedValue(null);
    roleModelMock.findOne.mockResolvedValue({ _id: 'role_id' });
    userModelMock.create.mockResolvedValue(registerUserDto);

    const result = await service.register(registerUserDto);

    expect(result).toEqual(registerUserDto);
    expect(userModelMock.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: expect.any(String),
      age: 25,
      gender: 'male',
      address: '123 Test St',
      role: 'role_id'
    });
    expect(roleModelMock.findOne).toHaveBeenCalledWith({ name: expect.any(String) });
  });

  it('should handle invalid user data', async () => {
    const invalidRegisterUserDto = new RegisterUserDto();
    invalidRegisterUserDto.name = null; 
    invalidRegisterUserDto.email = 'test@example.com';
    invalidRegisterUserDto.password = 'password';
    invalidRegisterUserDto.age = 25;
    invalidRegisterUserDto.gender = 'male';
    invalidRegisterUserDto.address = '123 Test St';
  
    await expect(service.register(invalidRegisterUserDto)).rejects.toThrow(BadRequestException);
  });
});
