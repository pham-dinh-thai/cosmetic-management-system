import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { LoginUseCase } from 'apps/authentication-service/src/application/use-cases/login/login.use-case';
import { RegisterUseCase } from 'apps/authentication-service/src/application/use-cases/register/register.use-case';
import { RefreshTokenUseCase } from 'apps/authentication-service/src/application/use-cases/refresh-token/refresh-token.use-case';
import { ChangePasswordUseCase } from 'apps/authentication-service/src/application/use-cases/change-password/change-password.use-case';
import { AuthUsersController } from './auth-users.controller';

describe('AuthUsersController', () => {
  let controller: AuthUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthUsersController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RegisterUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RefreshTokenUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ChangePasswordUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthUsersController>(AuthUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
