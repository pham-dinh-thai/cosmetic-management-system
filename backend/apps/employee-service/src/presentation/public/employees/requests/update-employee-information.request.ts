import { ApiProperty } from '@nestjs/swagger';
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
}

export class UpdateEmployeeInformationRequest implements IUpdateEmployeeInformationRequest {
  @ApiProperty({ type: UpdateUserDto })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user!: UpdateUserDto;

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
