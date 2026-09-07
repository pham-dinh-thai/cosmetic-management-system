import { ApiProperty } from '@nestjs/swagger';
import { IUpdateEmployeePositionRequest } from 'apps/employee-service/src/application/use-cases/update-employee-position/update-employee-position.request';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmployeePositionRequest implements IUpdateEmployeePositionRequest {
  @ApiProperty({ enum: ['staff', 'manager'] })
  @IsIn(['staff', 'manager'])
  @IsString()
  @IsNotEmpty()
  position!: string;
}