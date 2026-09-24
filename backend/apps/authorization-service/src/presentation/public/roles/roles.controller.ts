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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { CreateRoleUseCase } from 'apps/authorization-service/src/application/use-cases/create-role/create-role.use-case';
import { DeleteRoleUseCase } from 'apps/authorization-service/src/application/use-cases/delete-role/delete-role.use-case';
import { CreateRoleRequest } from './requests/create-role.request';
import { FindAllRolesUseCase } from 'apps/authorization-service/src/application/use-cases/find-all-roles/find-all-roles.use-case';
import { FindAllRolesReadModel } from 'apps/authorization-service/src/application/use-cases/find-all-roles/find-all-roles.read-model';
import { ActivateRoleUseCase } from 'apps/authorization-service/src/application/use-cases/activate-role/activate-role.use-case';
import { DeactivateRoleUseCase } from 'apps/authorization-service/src/application/use-cases/deactivate-role/deactivate-role.use-case';
import { GrantPermissionToRoleUseCase } from 'apps/authorization-service/src/application/use-cases/grant-permission-to-role/grant-permission-to-role.use-case';
import { GrantPermissionsRequest } from './requests/grant-permissions.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('roles')
export class RolesController {
  public constructor(
    private readonly findAllRolesUseCase: FindAllRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly activateRoleUseCase: ActivateRoleUseCase,
    private readonly deactivateRoleUseCase: DeactivateRoleUseCase,
    private readonly grantPermissionToRoleUseCase: GrantPermissionToRoleUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllRolesReadModel[]> {
    return await this.findAllRolesUseCase.execute();
  }

  @Post()
  @Audit({ entityType: 'role', action: AuditAction.CREATE })
  public async create(@Body() request: CreateRoleRequest): Promise<void> {
    await this.createRoleUseCase.execute(request);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Audit({
    entityType: 'role',
    action: AuditAction.DELETE,
    entityId: paramId(),
  })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteRoleUseCase.execute(id);
  }

  @Patch(':id/activate')
  @Audit({
    entityType: 'role',
    action: AuditAction.ACTIVATE,
    entityId: paramId(),
  })
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateRoleUseCase.execute(id);
  }

  @Patch(':id/deactivate')
  @Audit({
    entityType: 'role',
    action: AuditAction.DEACTIVATE,
    entityId: paramId(),
  })
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateRoleUseCase.execute(id);
  }

  @Post(':id/permissions')
  @Audit({
    entityType: 'role',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async grantPermissions(
    @Param('id') id: string,
    @Body() request: GrantPermissionsRequest,
  ): Promise<void> {
    await this.grantPermissionToRoleUseCase.execute(id, request);
  }
}
