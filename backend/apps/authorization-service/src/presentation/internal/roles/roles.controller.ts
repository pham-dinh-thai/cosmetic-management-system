import { Controller, Get, Param } from '@nestjs/common';
import { FindRoleByIdReadModel } from 'apps/authorization-service/src/application/use-cases/find-role/find-by-id/find-role-by-id.read-model';
import { FindRoleByIdUseCase } from 'apps/authorization-service/src/application/use-cases/find-role/find-by-id/find-role-by-id.use-case';

@Controller('internal/roles')
export class InternalRolesController {
  public constructor(
    private readonly findRoleByIdUseCase: FindRoleByIdUseCase,
  ) {}

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindRoleByIdReadModel | null> {
    return await this.findRoleByIdUseCase.execute(id);
  }
}
