import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ICreateAuthUserRequest } from '../../../application/use-cases/create-auth-user/create-auth-user.request';

export class CreateAuthUserRequest implements ICreateAuthUserRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
