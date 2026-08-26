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
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roleId!: string;
}

export class CreateEmployeeRequest implements ICreateEmployeeRequest {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user!: CreateUserDto;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  departmentId!: string;

  @IsString()
  @IsNotEmpty()
  hiredAt!: string;

  @IsNotEmpty()
  @IsEnum(Position)
  position!: Position;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
