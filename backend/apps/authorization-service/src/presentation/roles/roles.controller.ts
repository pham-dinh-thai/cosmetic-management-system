import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleUseCase } from '../../application/use-cases/create-role/create-role.use-case';
import { CreateRoleRequest } from './requests/create-role.request';

@Controller('roles')
export class RolesController {
  public constructor(private readonly createRoleUseCase: CreateRoleUseCase) {}

  @Post()
  public async create(@Body() request: CreateRoleRequest): Promise<void> {
    await this.createRoleUseCase.execute(request);
  }
}
