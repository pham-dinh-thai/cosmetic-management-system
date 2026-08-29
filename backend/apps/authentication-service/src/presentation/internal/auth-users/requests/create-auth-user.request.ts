import { ApiProperty } from '@nestjs/swagger';
import { ICreateAuthUserRequest } from 'apps/user-service/src/application/ports/create-auth-user.port';
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
