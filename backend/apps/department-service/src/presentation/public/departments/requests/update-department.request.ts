import { ApiProperty } from '@nestjs/swagger';
import { IUpdateDepartmentRequest } from 'apps/department-service/src/application/use-cases/update-department/update-department.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateDepartmentRequest implements IUpdateDepartmentRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
