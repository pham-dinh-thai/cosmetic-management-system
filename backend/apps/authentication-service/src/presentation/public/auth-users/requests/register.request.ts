import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IRegisterRequest,
  type RegisterGender,
} from 'apps/authentication-service/src/application/use-cases/register/register.request';

export class RegisterRequest implements IRegisterRequest {
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

  @ApiProperty({ enum: ['male', 'female', 'other'] })
  @IsIn(['male', 'female', 'other'])
  @IsNotEmpty()
  gender!: RegisterGender;

  @ApiProperty()
  @IsEmail({}, { message: 'Email phải đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @MaxLength(255, { message: 'Email dài quá ký tự cho phép' })
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
  @MinLength(8, { message: 'Mật khẩu phải dài tối thiểu 8 ký tự' })
  @MaxLength(255)
  passwordConfirmation!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(03|05|07|08|09)[0-9]{8}$/, {
    message:
      'Số điện thoại không hợp lệ (phải là 10 số, bắt đầu 03/05/07/08/09)',
  })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @MaxLength(255)
  address?: string;
}
