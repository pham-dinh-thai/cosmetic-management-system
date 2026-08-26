import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserReadModel } from '../../../domain/read-models/user.read-model';
import { FindUserIdByEmailUseCase } from '../../../application/use-cases/find-user-id-by-email/find-user-id-by-email.use-case';
import { FindUserByIdUseCase } from '../../../application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { CreateUserRequest } from '../../public/users/requests/create-user.request';
import { CreateUserUseCase } from 'apps/user-service/src/application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from 'apps/user-service/src/application/use-cases/delete-user/delete-user.use-case';

@Controller('api/internal/users')
export class InternalUsersController {
  public constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserIdByEmailUseCase: FindUserIdByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('by-email/:email')
  public async findByEmail(
    @Param('email') email: string,
  ): Promise<{ id?: string; roleId?: string }> {
    return await this.findUserIdByEmailUseCase.execute(email);
  }

  @Get('by-id/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<UserReadModel | null> {
    return await this.findUserByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateUserRequest,
  ): Promise<{ id: string }> {
    return await this.createUserUseCase.execute(request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
