import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, Permissions, PermissionsGuard } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { UpdateUserRoleRequest } from './requests/update-user-role.request';
import { UpdateUserRoleUseCase } from 'apps/user-service/src/application/use-cases/update-user-role/update-user-role.use-case';
import { FindAllUserUseCase } from 'apps/user-service/src/application/use-cases/find-user/find-all/find-users.use-case';
import { FindAllUserReadModel } from 'apps/user-service/src/application/use-cases/find-user/find-all/read-models/find-all-user.read-model';
import { ActivateUserUseCase } from 'apps/user-service/src/application/use-cases/activate-user/activate-user.use-case';
import { DeactivateUserUseCase } from 'apps/user-service/src/application/use-cases/deactivate-user/deactivate-user.use-case';
import { FindUserByIdUseCase } from 'apps/user-service/src/application/use-cases/find-user/find-by-id/find-user-by-id.use-case';
import { FindUserByIdReadModel } from 'apps/user-service/src/application/use-cases/find-user/find-by-id/read-models/find-user-by-id.read-model';
import { UpdateUserInformationUseCase } from 'apps/user-service/src/application/use-cases/update-user-information/update-user-information.use-case';
import { UpdateUserInformationRequest } from '../../internal/users/requests/update-user-information.request';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('users:read')
@Controller('users')
export class UsersController {
  public constructor(
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserInformationUseCase: UpdateUserInformationUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllUserReadModel[]> {
    return await this.findAllUserUseCase.execute();
  }

  /**
   * Hồ sơ của người đang đăng nhập. Không phụ thuộc vào việc người đó có
   * customer record hay không, nên áp dụng được cho admin và mọi nhân viên.
   */
  @Permissions()
  @Get('me')
  public async findMe(
    @Req() request: Request,
  ): Promise<FindUserByIdReadModel | null> {
    const userId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    return userId ? await this.findUserByIdUseCase.execute(userId) : null;
  }

  @Permissions()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('me')
  public async updateMe(
    @Req() request: Request,
    @Body() body: UpdateUserInformationRequest,
  ): Promise<void> {
    const userId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    await this.updateUserInformationUseCase.execute(userId, body);
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
