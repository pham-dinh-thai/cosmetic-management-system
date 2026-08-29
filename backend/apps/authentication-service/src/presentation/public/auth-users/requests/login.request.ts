import { ApiProperty } from '@nestjs/swagger';
import { ILoginRequest } from 'apps/authentication-service/src/application/use-cases/login/login.request';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginRequest implements ILoginRequest {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
