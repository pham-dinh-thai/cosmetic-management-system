import { ApiProperty } from '@nestjs/swagger';
import { IUpdateCosmeticImageRequest } from 'apps/cosmetic-service/src/application/use-cases/update-cosmetic-image/update-cosmetic-image.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCosmeticImageRequest implements IUpdateCosmeticImageRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  imageUrl!: string;
}
