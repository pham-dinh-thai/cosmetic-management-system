import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { UpdateUserRoleRequest } from './requests/update-user-role.request';
import { UpdateUserRoleUseCase } from 'apps/user-service/src/application/use-cases/update-user-role/update-user-role.use-case';
import { FindAllUserUseCase } from 'apps/user-service/src/application/use-cases/find-user/find-all/find-users.use-case';
import { FindAllUserReadModel } from 'apps/user-service/src/application/use-cases/find-user/find-all/read-models/find-all-user.read-model';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  public constructor(
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllUserReadModel[]> {
    return await this.findAllUserUseCase.execute();
  }

  @Patch(':id/role')
  public async updateRole(
    @Param('id') id: string,
    @Body() request: UpdateUserRoleRequest,
  ): Promise<void> {
    await this.updateUserRoleUseCase.execute(id, request);
  }
}
