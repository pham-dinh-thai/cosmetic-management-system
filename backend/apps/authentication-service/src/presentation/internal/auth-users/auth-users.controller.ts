import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateAuthUserUseCase } from 'apps/authentication-service/src/application/use-cases/create-auth-user/create-auth-user.use-case';
import { DeleteAuthUserUseCase } from 'apps/authentication-service/src/application/use-cases/delete-auth-user/delete-auth-user.use-case';
import { CreateAuthUserRequest } from './requests/create-auth-user.request';

@Controller('internal/auth-users')
export class InternalAuthUsersController {
  public constructor(
    private readonly createAuthUserUseCase: CreateAuthUserUseCase,
    private readonly deleteAuthUserUseCase: DeleteAuthUserUseCase,
  ) {}

  @Post()
  public async create(@Body() request: CreateAuthUserRequest): Promise<void> {
    await this.createAuthUserUseCase.execute(request);
  }

  @Delete('by-user-id/:userId')
  public async deleteByUserId(@Param('userId') userId: string): Promise<void> {
    await this.deleteAuthUserUseCase.execute(userId);
  }
}
