import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard, Permissions, PermissionsGuard } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { UpdateUserRoleRequest } from './requests/update-user-role.request';
import { UpdateUserRoleUseCase } from 'apps/user-service/src/application/use-cases/update-user-role/update-user-role.use-case';
import { FindAllUserUseCase } from 'apps/user-service/src/application/use-cases/find-user/find-all/find-users.use-case';
import { FindAllUserReadModel } from 'apps/user-service/src/application/use-cases/find-user/find-all/read-models/find-all-user.read-model';
import { ActivateUserUseCase } from 'apps/user-service/src/application/use-cases/activate-user/activate-user.use-case';
import { DeactivateUserUseCase } from 'apps/user-service/src/application/use-cases/deactivate-user/deactivate-user.use-case';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('users:read')
@Controller('users')
export class UsersController {
  public constructor(
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllUserReadModel[]> {
    return await this.findAllUserUseCase.execute();
  }

  @Permissions('users:write')
  @Patch(':id/role')
  @Audit({
    entityType: 'user',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async updateRole(
    @Param('id') id: string,
    @Body() request: UpdateUserRoleRequest,
  ): Promise<void> {
    await this.updateUserRoleUseCase.execute(id, request);
  }

  @Permissions('users:write')
  @Patch(':id/activate')
  @Audit({
    entityType: 'user',
    action: AuditAction.ACTIVATE,
    entityId: paramId(),
  })
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateUserUseCase.execute(id);
  }

  @Permissions('users:write')
  @Patch(':id/deactivate')
  @Audit({
    entityType: 'user',
    action: AuditAction.DEACTIVATE,
    entityId: paramId(),
  })
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateUserUseCase.execute(id);
  }
}
