import { IUpdateDepartmentRequest } from 'apps/department-service/src/application/use-cases/update-department/update-department.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateDepartmentRequest implements IUpdateDepartmentRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
