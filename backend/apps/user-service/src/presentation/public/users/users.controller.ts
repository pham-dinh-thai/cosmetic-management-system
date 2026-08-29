import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { FindUsersUseCase } from '../../../application/use-cases/find-users/find-users.use-case';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { UserReadModel } from 'apps/user-service/src/application/use-cases/find-users/read-model/user.read-model';
import { UpdateUserRoleRequest } from './requests/update-user-role.request';
import { UpdateUserRoleUseCase } from 'apps/user-service/src/application/use-cases/update-user-role/update-user-role.use-case';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  public constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<UserReadModel[]> {
    return await this.findUsersUseCase.execute();
  }

  @Patch(':id/role')
  public async updateRole(
    @Param('id') id: string,
    @Body() request: UpdateUserRoleRequest,
  ): Promise<void> {
    await this.updateUserRoleUseCase.execute(id, request);
  }
}
