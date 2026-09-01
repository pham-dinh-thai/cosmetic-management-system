import { ApiProperty } from '@nestjs/swagger';
import { ICreateAuthUserRequest } from '../../../../application/use-cases/create-auth-user/create-auth-user.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAuthUserRequest implements ICreateAuthUserRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
