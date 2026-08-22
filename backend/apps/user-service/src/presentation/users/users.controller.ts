import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { CreateUserRequest } from './requests/create-user.request';
import { FindUsersUseCase } from '../../application/use-cases/find-users/find-users.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { CreateUserResponse } from '../../application/use-cases/create-user/create-user.response';
import { FindUserIdByEmailUseCase } from '../../application/use-cases/find-user-id-by-email/find-user-id-by-email.use-case';
import { FindUserIdByEmailResponse } from '../../application/use-cases/find-user-id-by-email/find-user-id-by-email.response';
import { AuthGuard } from '../../infrastructure/security/auth.guard';

@Controller('users')
export class UsersController {
  public constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserIdByEmailUseCase: FindUserIdByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  public async findAll(): Promise<UserReadModel[]> {
    return await this.findUsersUseCase.execute();
  }

  @Get('by-email/:email')
  public async findByEmail(
    @Param('email') email: string,
  ): Promise<FindUserIdByEmailResponse> {
    return await this.findUserIdByEmailUseCase.execute(email);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<UserReadModel | null> {
    return await this.findUserByIdUseCase.execute(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  public async create(
    @Body() request: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return await this.createUserUseCase.execute(request);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
