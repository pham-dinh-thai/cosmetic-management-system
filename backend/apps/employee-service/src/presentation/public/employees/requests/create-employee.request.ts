import { ApiProperty } from '@nestjs/swagger';
import { ICreateEmployeeRequest } from 'apps/employee-service/src/application/use-cases/create-employee/create-employee.request';
import { Position } from 'apps/employee-service/src/domain/enums/position.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roleId!: string;
}

export class CreateEmployeeRequest implements ICreateEmployeeRequest {
  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user!: CreateUserDto;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departmentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hiredAt!: string;

  @ApiProperty({ enum: Position })
  @IsNotEmpty()
  @IsEnum(Position)
  position!: Position;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
