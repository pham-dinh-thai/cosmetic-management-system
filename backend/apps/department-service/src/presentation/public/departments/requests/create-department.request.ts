import { ApiProperty } from '@nestjs/swagger';
import { ICreateDepartmentRequest } from 'apps/department-service/src/application/use-cases/create-department/create-department.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartmentRequest implements ICreateDepartmentRequest {
  @ApiProperty()
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
