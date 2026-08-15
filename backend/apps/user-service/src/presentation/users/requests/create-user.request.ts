import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ICreateUserRequest } from '../../../application/use-cases/create-user/create-user.request';

export class CreateUserRequest implements ICreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(255)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(255)
  password!: string;
}
