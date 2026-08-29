import { ApiProperty } from '@nestjs/swagger';
import { IUpdateUserInformationRequest } from 'apps/user-service/src/application/use-cases/update-user-information/update-user-information.request';
import { Gender } from 'apps/user-service/src/domain/enums/gender.enum';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserInformationRequest implements IUpdateUserInformationRequest {
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
}
