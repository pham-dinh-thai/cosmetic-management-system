import { IUpdateEmployeeInformationRequest } from 'apps/employee-service/src/application/use-cases/update-employee-information/update-employee-information.request';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateUserDto {
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
}

export class UpdateEmployeeInformationRequest
  implements IUpdateEmployeeInformationRequest
{
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user!: UpdateUserDto;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
