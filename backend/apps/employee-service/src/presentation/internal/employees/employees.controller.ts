import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteEmployeeUseCase } from 'apps/employee-service/src/application/use-cases/delete-employee/delete-employee.use-case';

@Controller('internal/employees')
export class InternalEmployeesController {
  public constructor(
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
  ) {}

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteEmployeeUseCase.execute(id);
  }
}
