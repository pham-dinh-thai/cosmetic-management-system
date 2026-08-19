import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ICreateUserRequest } from '../../../application/use-cases/create-user/create-user.request';
import { Gender } from '../../../domain/enums/gender.enum';

export class CreateUserRequest implements ICreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string;
}
