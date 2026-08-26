import { Controller, Get, Param } from '@nestjs/common';
import { FindDepartmentByIdUseCase } from '../../../application/use-cases/find-department-by-id/find-department-by-id.use-case';

@Controller('internal/departments')
export class InternalDepartmentsController {
  public constructor(
    private readonly findDepartmentByIdUseCase: FindDepartmentByIdUseCase,
  ) {}

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<{ id: string } | null> {
    const result = await this.findDepartmentByIdUseCase.execute(id);
    return result ? { id: result.id } : null;
  }
}
