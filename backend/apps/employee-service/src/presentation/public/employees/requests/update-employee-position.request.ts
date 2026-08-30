import { ApiProperty } from '@nestjs/swagger';
import { IUpdateEmployeePositionRequest } from 'apps/employee-service/src/application/use-cases/update-employee-position/update-employee-position.request';
import { Position } from 'apps/employee-service/src/domain/enums/position.enum';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateEmployeePositionRequest implements IUpdateEmployeePositionRequest {
  @ApiProperty()
  @IsEnum(Position)
  @IsNotEmpty()
  @MaxLength(255)
  position!: Position;
}
