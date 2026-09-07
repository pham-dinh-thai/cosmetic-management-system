import { ApiProperty } from '@nestjs/swagger';
import { IUpdateEmployeePositionRequest } from 'apps/employee-service/src/application/use-cases/update-employee-position/update-employee-position.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateEmployeePositionRequest implements IUpdateEmployeePositionRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  position!: string;
}
