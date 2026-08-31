import { Controller, Get, Param } from '@nestjs/common';
import { FindDepartmentByIdUseCase } from 'apps/department-service/src/application/use-cases/find-department/find-by-id/find-department-by-id.use-case';
import { FindDepartmentByIdReadModel } from 'apps/department-service/src/application/use-cases/find-department/find-by-id/read-models/find-department-by-id.read-model';

@Controller('internal/departments')
export class InternalDepartmentsController {
  public constructor(
    private readonly findDepartmentByIdUseCase: FindDepartmentByIdUseCase,
  ) {}

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindDepartmentByIdReadModel | null> {
    return await this.findDepartmentByIdUseCase.execute(id);
  }
}
