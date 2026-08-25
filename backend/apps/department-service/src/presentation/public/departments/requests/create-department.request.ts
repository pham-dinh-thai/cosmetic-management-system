import { ICreateDepartmentRequest } from 'apps/department-service/src/application/use-cases/create-department/create-department.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartmentRequest implements ICreateDepartmentRequest {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
