import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ILoginRequest } from '../../../application/use-cases/login/login.request';

export class LoginRequest implements ILoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
