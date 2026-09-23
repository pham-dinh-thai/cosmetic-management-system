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
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { CreateRoleUseCase } from 'apps/authorization-service/src/application/use-cases/create-role/create-role.use-case';
import { DeleteRoleUseCase } from 'apps/authorization-service/src/application/use-cases/delete-role/delete-role.use-case';
import { CreateRoleRequest } from './requests/create-role.request';
import { FindAllRoleUseCase } from 'apps/authorization-service/src/application/use-cases/find-role/find-all/find-all-role.use-case';
import { FindAllRoleReadModel } from 'apps/authorization-service/src/application/use-cases/find-role/find-all/find-all-role.read-model';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('roles')
export class RolesController {
  public constructor(
    private readonly findAllRoleUseCase: FindAllRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllRoleReadModel[]> {
    return await this.findAllRoleUseCase.execute();
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
}
