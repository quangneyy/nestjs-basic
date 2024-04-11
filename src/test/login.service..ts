import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        RolesService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
            isValidPassword: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user object without permissions if the role is not found', async () => {
    const username = 'test@example.com';
    const password = 'validPassword';
    const user = {
      username,
      password,
      role: { _id: 'roleId', name: 'roleName' },
      toObject: () => ({
        username,
        password,
        role: { _id: 'roleId', name: 'roleName' },
      }),
    };

    (usersService.findOneByUsername as jest.Mock).mockResolvedValueOnce(user);
    (usersService.isValidPassword as jest.Mock).mockResolvedValueOnce(true);
    (rolesService.findOne as jest.Mock).mockResolvedValueOnce(null);

    const result = await authService.validateUser(username, password);

    expect(result).toEqual({ ...user.toObject(), permissions: [] });
  });

  it('should return null if the user does not exist', async () => {
    const username = 'nonexistent@example.com';
    const password = 'anyPassword';

    (usersService.findOneByUsername as jest.Mock).mockResolvedValueOnce(null);

    const result = await authService.validateUser(username, password);

    expect(result).toBeNull();
  });

  it('should return null if the password is invalid', async () => {
    const username = 'test@example.com';
    const password = 'invalidPassword';
    const user = {
      username,
      password: 'validPassword',
      role: { _id: 'roleId', name: 'roleName' },
      toObject: () => ({
        username,
        password: 'validPassword',
        role: { _id: 'roleId', name: 'roleName' },
      }),
    };

    (usersService.findOneByUsername as jest.Mock).mockResolvedValueOnce(user);
    (usersService.isValidPassword as jest.Mock).mockResolvedValueOnce(false);

    const result = await authService.validateUser(username, password);

    expect(result).toBeNull();
  });
});



