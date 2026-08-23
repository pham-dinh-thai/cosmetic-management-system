import { Controller, Get, Param } from '@nestjs/common';
import { UserReadModel } from '../../../domain/read-models/user.read-model';
import { FindUserIdByEmailUseCase } from '../../../application/use-cases/find-user-id-by-email/find-user-id-by-email.use-case';
import { FindUserByIdUseCase } from '../../../application/use-cases/find-user-by-id/find-user-by-id.use-case';

@Controller('users/internal')
export class InternalUsersController {
  public constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserIdByEmailUseCase: FindUserIdByEmailUseCase,
  ) {}

  @Get('by-email/:email')
  public async findByEmail(
    @Param('email') email: string,
  ): Promise<{ id?: string }> {
    return await this.findUserIdByEmailUseCase.execute(email);
  }

  @Get('by-id/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<UserReadModel | null> {
    return await this.findUserByIdUseCase.execute(id);
  }
}
