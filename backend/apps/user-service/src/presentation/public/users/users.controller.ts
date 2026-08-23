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
import { FindUsersUseCase } from '../../../application/use-cases/find-users/find-users.use-case';
import { CreateUserUseCase } from '../../../application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user/delete-user.use-case';
import { UserReadModel } from '../../../domain/read-models/user.read-model';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateUserResponse } from '../../../application/use-cases/create-user/create-user.response';
import { AuthGuard } from '../../../infrastructure/security/auth.guard';

@Controller('users')
export class UsersController {
  public constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  public async findAll(): Promise<UserReadModel[]> {
    return await this.findUsersUseCase.execute();
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
