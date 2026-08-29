import { ApiProperty } from '@nestjs/swagger';
import { IAssignDepartmentToEmployeeRequest } from 'apps/employee-service/src/application/use-cases/assign-department-to-employee/assign-department-to-employee.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AssignDepartmentToEmployeeRequest implements IAssignDepartmentToEmployeeRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  departmentId: string;
}
