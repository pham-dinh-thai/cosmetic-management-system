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
import { CreateRoleUseCase } from '../../application/use-cases/create-role/create-role.use-case';
import { CreateRoleRequest } from './requests/create-role.request';
import { FindRolesUseCase } from '../../application/use-cases/find-roles/find-roles.use-case';
import { RoleReadModel } from '../../domain/read-models/role.read-model';
import { DeleteRoleUseCase } from '../../application/use-cases/delete-role/delete-role.use-case';
import { AuthGuard } from '../../infrastructure/security/auth.guard';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  public constructor(
    private readonly findRolesUseCase: FindRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<RoleReadModel[]> {
    return await this.findRolesUseCase.execute();
  }

  @Post()
  public async create(@Body() request: CreateRoleRequest): Promise<void> {
    await this.createRoleUseCase.execute(request);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteRoleUseCase.execute(id);
  }
}
