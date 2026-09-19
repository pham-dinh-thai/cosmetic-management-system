import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FindDepartmentByIdUseCase } from 'apps/department-service/src/application/use-cases/find-department/find-by-id/find-department-by-id.use-case';
import { FindDepartmentByIdReadModel } from 'apps/department-service/src/application/use-cases/find-department/find-by-id/read-models/find-department-by-id.read-model';
import { ClearDepartmentManagerUseCase } from 'apps/department-service/src/application/use-cases/clear-department-manager/clear-department-manager.use-case';
import { UnassignManagerRequest } from './requests/unassign-manager.request';

@Controller('internal/departments')
export class InternalDepartmentsController {
  public constructor(
    private readonly findDepartmentByIdUseCase: FindDepartmentByIdUseCase,
    private readonly clearDepartmentManagerUseCase: ClearDepartmentManagerUseCase,
  ) {}

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindDepartmentByIdReadModel | null> {
    return await this.findDepartmentByIdUseCase.execute(id);
  }

  /**
   * Xóa trưởng phòng ở mọi phòng ban do employeeId làm trưởng phòng.
   * Được gọi bởi employee-service khi nhân viên đổi phòng ban / chức vụ,
   * bị vô hiệu hóa hoặc bị xóa.
   */
  @HttpCode(HttpStatus.OK)
  @Post('unassign-manager')
  public async unassignManager(
    @Body() request: UnassignManagerRequest,
  ): Promise<{ cleared: boolean }> {
    await this.clearDepartmentManagerUseCase.execute(request.employeeId);
    return { cleared: true };
  }
}