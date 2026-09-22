import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IChangePasswordRequest } from 'apps/authentication-service/src/application/use-cases/change-password/change-password.request';

export class ChangePasswordRequest implements IChangePasswordRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  @MaxLength(255)
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(8, { message: 'Mật khẩu mới phải dài tối thiểu 8 ký tự' })
  @MaxLength(255)
  newPassword!: string;

  // userId lấy từ token JWT, không nằm trong body request
  userId!: string;
}
