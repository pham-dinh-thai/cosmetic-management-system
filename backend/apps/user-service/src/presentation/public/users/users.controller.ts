import { Controller, Get, UseGuards } from '@nestjs/common';
import { FindUsersUseCase } from '../../../application/use-cases/find-users/find-users.use-case';
import { UserReadModel } from '../../../domain/read-models/user.read-model';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  public constructor(private readonly findUsersUseCase: FindUsersUseCase) {}

  @Get()
  public async findAll(): Promise<UserReadModel[]> {
    return await this.findUsersUseCase.execute();
  }
}
