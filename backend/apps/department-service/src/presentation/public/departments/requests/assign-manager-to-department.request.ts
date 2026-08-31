import { ApiProperty } from '@nestjs/swagger';
import { IAssignManagerToDepartmentRequest } from 'apps/department-service/src/application/use-cases/assign-manager-to-department/assign-manager-to-department.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AssignManagerToDepartmentRequest implements IAssignManagerToDepartmentRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  employeeId: string;
}
