import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FindUserIdByEmailUseCase } from '../../../application/use-cases/find-user-id-by-email/find-user-id-by-email.use-case';
import { FindUserByIdUseCase } from '../../../application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateUserUseCase } from 'apps/user-service/src/application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from 'apps/user-service/src/application/use-cases/delete-user/delete-user.use-case';
import { FindUserByIdResponse } from 'apps/user-service/src/application/use-cases/find-user-by-id/find-user-by-id.response';
import { UpdateUserInformationUseCase } from 'apps/user-service/src/application/use-cases/update-user-information/update-user-information.use-case';
import { UpdateUserInformationRequest } from './requests/update-user-information.request';
import { FindUserIdByEmailResponse } from 'apps/user-service/src/application/use-cases/find-user-id-by-email/find-user-id-by-email.response';

@Controller('internal/users')
export class InternalUsersController {
  public constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserIdByEmailUseCase: FindUserIdByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserInformationUseCase: UpdateUserInformationUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('by-email/:email')
  public async findByEmail(
    @Param('email') email: string,
  ): Promise<FindUserIdByEmailResponse | null> {
    return await this.findUserIdByEmailUseCase.execute(email);
  }

  @Get('by-id/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindUserByIdResponse | null> {
    return await this.findUserByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateUserRequest,
  ): Promise<{ id: string }> {
    return await this.createUserUseCase.execute(request);
  }

  @Patch(`:id`)
  public async updateInformation(
    @Param('id') id: string,
    @Body() request: UpdateUserInformationRequest,
  ): Promise<void> {
    await this.updateUserInformationUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
