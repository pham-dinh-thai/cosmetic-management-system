import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { CreateUserRequest } from './requests/create-user.request';

@Controller('users')
export class UsersController {
  public constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<UserReadModel | null> {
    const user = await this.findUserByIdUseCase.execute(id);

    return user;
  }

  @Post()
  public async create(@Body() request: CreateUserRequest): Promise<void> {
    await this.createUserUseCase.execute(request);
  }
}
