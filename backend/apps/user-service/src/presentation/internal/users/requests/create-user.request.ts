import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ICreateUserRequest } from '../../../../application/use-cases/create-user/create-user.request';
import { Gender } from '../../../../domain/enums/gender.enum';

export class CreateUserRequest implements ICreateUserRequest {
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

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Mật khẩu phải dài tối thiểu 8 ký tự' })
  @MaxLength(255)
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roleId!: string;
}
