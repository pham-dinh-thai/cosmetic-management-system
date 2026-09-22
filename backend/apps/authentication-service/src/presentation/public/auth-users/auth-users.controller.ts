import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@app/security';
import { LoginUseCase } from 'apps/authentication-service/src/application/use-cases/login/login.use-case';
import { LoginResponse } from 'apps/authentication-service/src/application/use-cases/login/login.response';
import { RefreshTokenUseCase } from 'apps/authentication-service/src/application/use-cases/refresh-token/refresh-token.use-case';
import { RegisterUseCase } from 'apps/authentication-service/src/application/use-cases/register/register.use-case';
import { RegisterResponse } from 'apps/authentication-service/src/application/use-cases/register/register.response';
import { ChangePasswordUseCase } from 'apps/authentication-service/src/application/use-cases/change-password/change-password.use-case';
import { InvalidRefreshTokenException } from 'apps/authentication-service/src/domain/exceptions/invalid-refresh-token.exception';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';
import { ChangePasswordRequest } from './requests/change-password.request';

@Controller('auth-users')
export class AuthUsersController {
  public constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post('/register')
  public async register(
    @Body() request: RegisterRequest,
  ): Promise<RegisterResponse> {
    return await this.registerUseCase.execute(request);
  }

  @Post('/login')
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.loginUseCase.execute(request);
  }

  @Post('/refresh-token')
  public async refreshToken(
    @Headers('authorization') authorization?: string,
  ): Promise<LoginResponse> {
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new InvalidRefreshTokenException();
    }

    return await this.refreshTokenUseCase.execute(token);
  }

  @UseGuards(AuthGuard)
  @Post('/change-password')
  public async changePassword(
    @Body() request: ChangePasswordRequest,
    @Req() req: Request,
  ): Promise<void> {
    const userId =
      (req as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    await this.changePasswordUseCase.execute({
      userId,
      currentPassword: request.currentPassword,
      newPassword: request.newPassword,
    });
  }
}
