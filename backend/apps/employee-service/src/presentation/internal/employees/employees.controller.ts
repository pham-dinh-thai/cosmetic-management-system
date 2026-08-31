import { Controller, Delete, Get, Param } from '@nestjs/common';
import { DeleteEmployeeUseCase } from 'apps/employee-service/src/application/use-cases/delete-employee/delete-employee.use-case';
import { FindEmployeeByIdUseCase } from 'apps/employee-service/src/application/use-cases/find-employee/find-by-id/find-employee-by-id.use-case';
import { FindEmployeeByIdReadModel } from 'apps/employee-service/src/application/use-cases/find-employee/find-by-id/read-models/find-employee-by-id.read-model';

@Controller('internal/employees')
export class InternalEmployeesController {
  public constructor(
    private readonly findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
  ) {}

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindEmployeeByIdReadModel | null> {
    return await this.findEmployeeByIdUseCase.execute(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteEmployeeUseCase.execute(id);
  }
}
