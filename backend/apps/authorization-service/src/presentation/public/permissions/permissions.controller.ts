import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PermissionsGuard, Permissions } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { CreatePermissionUseCase } from 'apps/authorization-service/src/application/use-cases/create-permission/create-permission.use-case';
import { CreatePermissionRequest } from './requests/create-permission.request';
import { ActivatePermissionUseCase } from 'apps/authorization-service/src/application/use-cases/activate-permission/activate-permission.use-case';
import { DeactivatePermissionUseCase } from 'apps/authorization-service/src/application/use-cases/deactivate-permission/deactivate-permission.use-case';
import { FindAllPermissionsUseCase } from 'apps/authorization-service/src/application/use-cases/find-all-permissions/find-all-permissions.use-case';
import { FindAllPermissionsReadModel } from 'apps/authorization-service/src/application/use-cases/find-all-permissions/find-all-permissions.read-model';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('permissions:read')
@Controller('permissions')
export class PermissionsController {
  public constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly activatePermissionUseCase: ActivatePermissionUseCase,
    private readonly deactivatePermissionUseCase: DeactivatePermissionUseCase,
    private readonly findAllPermissionsUseCase: FindAllPermissionsUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllPermissionsReadModel[]> {
    return await this.findAllPermissionsUseCase.execute();
  }

  @Post()
  @Permissions('permissions:write')
  @Audit({ entityType: 'permission', action: AuditAction.CREATE })
  public async create(@Body() request: CreatePermissionRequest): Promise<void> {
    await this.createPermissionUseCase.execute(request);
  }

  @Patch(':id/activate')
  @Permissions('permissions:write')
  @Audit({
    entityType: 'permission',
    action: AuditAction.ACTIVATE,
    entityId: paramId(),
  })
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activatePermissionUseCase.execute(id);
  }

  @Patch(':id/deactivate')
  @Permissions('permissions:write')
  @Audit({
    entityType: 'permission',
    action: AuditAction.DEACTIVATE,
    entityId: paramId(),
  })
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivatePermissionUseCase.execute(id);
  }
}
