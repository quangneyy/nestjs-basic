import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user object if username and password are valid', async () => {
      const username = 'testuser';
      const password = 'validPassword';

      (authService.validateUser as jest.Mock).mockResolvedValue({ username, password });

      const result = await authService.validateUser(username, password);

      expect(result).toEqual({ username, password });
    });

    it('should return null if user does not exist', async () => {
      const username = 'nonexistentuser';
      const password = 'anyPassword';

      (authService.validateUser as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(username, password);

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const username = 'testuser';
      const password = 'invalidPassword';

      (authService.validateUser as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(username, password);

      expect(result).toBeNull();
    });
  });
});
